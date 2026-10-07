// context/AudioPlayerContext.jsx
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';

const FALLBACK_ART =
  'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=512&q=80';

const AudioPlayerContext = createContext(null);

export function AudioPlayerProvider({ children }) {
  const audioRef = useRef(null);
  const sleepTimerRef = useRef(null);

  const [playlist, setPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [liveDuration, setLiveDuration] = useState(0);

  // New Features: Playback Rate, Repeat Mode, Sleep Timer
  const [playbackRate, setPlaybackRate] = useState(1);
  const [repeatMode, setRepeatMode] = useState('all'); // 'all' | 'one' | 'off'
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState(null); // null | 15 | 30 | 60
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState(null); // seconds left

  const currentTrack = currentIndex >= 0 ? playlist[currentIndex] || null : null;

  // 1. Initialize HTML5 Audio instance
  useEffect(() => {
    const audio = new Audio();
    audio.preload = 'metadata';
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setLiveDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('loadedmetadata', onMeta);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, []);

  // Sync playback rate to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  // 2. Queue navigation
  const playNext = useCallback(() => {
    setPlaylist((list) => {
      if (!list.length) return list;

      if (repeatMode === 'one' && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => setIsPlaying(false));
        return list;
      }

      setCurrentIndex((prev) => {
        if (prev + 1 < list.length) {
          return prev + 1;
        }
        return repeatMode === 'all' ? 0 : prev;
      });
      return list;
    });
  }, [repeatMode]);

  const playPrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }
    setPlaylist((list) => {
      if (!list.length) return list;
      setCurrentIndex((prev) => (prev > 0 ? prev - 1 : list.length - 1));
      return list;
    });
  }, []);

  // Handle track finished
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        playNext();
      }
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playNext, repeatMode]);

  // 3. Central audio pipeline: avoid double-play race conditions
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    if (audio.src !== currentTrack.url) {
      audio.src = currentTrack.url;
      audio.playbackRate = playbackRate;
      setCurrentTime(0);
      setLiveDuration(0);
    }

    if (isPlaying) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch(() => setIsPlaying(false));
      }
    } else {
      audio.pause();
    }
  }, [currentTrack, isPlaying, playbackRate]);

  // 4. Sleep Timer logic
  useEffect(() => {
    if (sleepTimerRef.current) {
      clearInterval(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (!sleepTimerMinutes) {
      setSleepTimerRemaining(null);
      return;
    }

    let secondsLeft = sleepTimerMinutes * 60;
    setSleepTimerRemaining(secondsLeft);

    sleepTimerRef.current = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) {
        clearInterval(sleepTimerRef.current);
        sleepTimerRef.current = null;
        setSleepTimerMinutes(null);
        setSleepTimerRemaining(null);
        setIsPlaying(false);
      } else {
        setSleepTimerRemaining(secondsLeft);
      }
    }, 1000);

    return () => {
      if (sleepTimerRef.current) {
        clearInterval(sleepTimerRef.current);
      }
    };
  }, [sleepTimerMinutes]);

  // 5. MediaSession API
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title || 'Sacred Bhajan',
      artist: currentTrack.singer || 'Devotional Singer',
      album: currentTrack.tag ? `${currentTrack.tag} Bhajans` : 'Divine Satsang',
      artwork: [
        { src: FALLBACK_ART, sizes: '96x96', type: 'image/jpeg' },
        { src: FALLBACK_ART, sizes: '256x256', type: 'image/jpeg' },
        { src: FALLBACK_ART, sizes: '512x512', type: 'image/jpeg' },
      ],
    });

    navigator.mediaSession.setActionHandler('play', () => setIsPlaying(true));
    navigator.mediaSession.setActionHandler('pause', () => setIsPlaying(false));
    navigator.mediaSession.setActionHandler('previoustrack', playPrevious);
    navigator.mediaSession.setActionHandler('nexttrack', playNext);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined && audioRef.current) {
        audioRef.current.currentTime = details.seekTime;
      }
    });

    return () => {
      navigator.mediaSession.setActionHandler('play', null);
      navigator.mediaSession.setActionHandler('pause', null);
      navigator.mediaSession.setActionHandler('previoustrack', null);
      navigator.mediaSession.setActionHandler('nexttrack', null);
      navigator.mediaSession.setActionHandler('seekto', null);
    };
  }, [currentTrack, playNext, playPrevious]);

  // Helper actions
  const playTrack = (track, queue = []) => {
    const activeQueue = queue.length > 0 ? queue : [track];
    const index = activeQueue.findIndex((t) => String(t.id) === String(track.id));

    setPlaylist(activeQueue);
    setCurrentIndex(index !== -1 ? index : 0);
    setIsPlaying(true);
  };

  const togglePlayPause = () => {
    if (!currentTrack && playlist.length > 0) {
      setCurrentIndex(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const seek = (seconds) => {
    if (audioRef.current) {
      audioRef.current.currentTime = seconds;
      setCurrentTime(seconds);
    }
  };

  const cycleRepeatMode = () => {
    setRepeatMode((prev) => (prev === 'all' ? 'one' : prev === 'one' ? 'off' : 'all'));
  };

  const cyclePlaybackRate = () => {
    const rates = [0.75, 1, 1.25];
    const nextIdx = (rates.indexOf(playbackRate) + 1) % rates.length;
    setPlaybackRate(rates[nextIdx]);
  };

  const toggleSleepTimer = (minutes) => {
    setSleepTimerMinutes((prev) => (prev === minutes ? null : minutes));
  };

  return (
    <AudioPlayerContext.Provider
      value={{
        currentTrack,
        isPlaying,
        currentTime,
        liveDuration,
        playbackRate,
        repeatMode,
        sleepTimerMinutes,
        sleepTimerRemaining,
        playTrack,
        togglePlayPause,
        playNext,
        playPrevious,
        seek,
        cycleRepeatMode,
        cyclePlaybackRate,
        toggleSleepTimer,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer() {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used inside AudioPlayerProvider');
  }
  return context;
}