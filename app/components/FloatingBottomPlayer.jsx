// app/components/FloatingBottomPlayer.jsx
'use client';

import React, { useState } from 'react';
import { useAudioPlayer } from '../../context/AudioPlayerContext';

function formatDuration(seconds) {
  if (isNaN(seconds) || seconds <= 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export default function FloatingBottomPlayer() {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    liveDuration,
    playbackRate,
    repeatMode,
    sleepTimerMinutes,
    sleepTimerRemaining,
    togglePlayPause,
    playNext,
    playPrevious,
    seek,
    cycleRepeatMode,
    cyclePlaybackRate,
    toggleSleepTimer,
  } = useAudioPlayer();

  const [showTimerMenu, setShowTimerMenu] = useState(false);

  if (!currentTrack) return null;

  return (
    <aside
      aria-label="Bhajan Audio Player"
      style={{
        position: 'fixed',
        bottom: '64px', // Docks cleanly right on top of BottomNav
        left: 0,
        right: 0,
        backgroundColor: '#1C1917',
        color: '#FFFFFF',
        borderTop: '2px solid #D97706',
        padding: '8px 14px',
        zIndex: 9999,
        boxShadow: '0 -4px 14px rgba(0,0,0,0.4)',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      {/* Sleep Timer Popup */}
      {showTimerMenu && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            right: '16px',
            marginBottom: '8px',
            backgroundColor: '#292524',
            border: '1px solid #D97706',
            borderRadius: '10px',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            zIndex: 10000,
          }}
        >
          <span style={{ fontSize: '11px', color: '#D6D3D1', fontWeight: 600, padding: '0 4px' }}>
            Sleep Timer
          </span>
          {[15, 30, 60].map((mins) => (
            <button
              key={mins}
              onClick={() => {
                toggleSleepTimer(mins);
                setShowTimerMenu(false);
              }}
              style={{
                backgroundColor: sleepTimerMinutes === mins ? '#D97706' : '#1C1917',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {mins} Minutes {sleepTimerMinutes === mins ? '✓' : ''}
            </button>
          ))}
          {sleepTimerMinutes && (
            <button
              onClick={() => {
                toggleSleepTimer(null);
                setShowTimerMenu(false);
              }}
              style={{
                backgroundColor: '#7f1d1d',
                color: '#FECACA',
                border: 'none',
                borderRadius: '6px',
                padding: '5px 12px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Turn Off
            </button>
          )}
        </div>
      )}

      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
        }}
      >
        {/* Top: Metadata & Center Buttons & New Extra Controls */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          {/* Bhajan Title & Singer */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#FEF3C7',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: '11px',
                color: '#A8A29E',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {currentTrack.singer || 'Devotional Singer'}
              {currentTrack.tag ? ` • ${currentTrack.tag}` : ''}
            </div>
          </div>

          {/* Core Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={playPrevious}
              aria-label="Previous Bhajan"
              style={{
                background: 'none',
                border: 'none',
                color: '#D6D3D1',
                padding: '4px',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
              </svg>
            </button>

            <button
              onClick={togglePlayPause}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={playNext}
              aria-label="Next Bhajan"
              style={{
                background: 'none',
                border: 'none',
                color: '#D6D3D1',
                padding: '4px',
                cursor: 'pointer',
              }}
            >
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
              </svg>
            </button>
          </div>

          {/* Quick Tools: Speed, Repeat, Sleep Timer */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Speed Toggle */}
            <button
              onClick={cyclePlaybackRate}
              aria-label="Playback Speed"
              style={{
                background: '#292524',
                color: '#F59E0B',
                border: '1px solid #44403C',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {playbackRate}x
            </button>

            {/* Repeat Mode Toggle */}
            <button
              onClick={cycleRepeatMode}
              aria-label="Repeat Mode"
              style={{
                background: repeatMode !== 'off' ? '#451A03' : '#292524',
                color: repeatMode !== 'off' ? '#F59E0B' : '#78716C',
                border: '1px solid #44403C',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {repeatMode === 'all' ? '🔁 All' : repeatMode === 'one' ? '🔂 1' : '➡️ Off'}
            </button>

            {/* Sleep Timer Toggle */}
            <button
              onClick={() => setShowTimerMenu((prev) => !prev)}
              aria-label="Sleep Timer"
              style={{
                background: sleepTimerMinutes ? '#451A03' : '#292524',
                color: sleepTimerMinutes ? '#F59E0B' : '#78716C',
                border: '1px solid #44403C',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '10px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ⏱ {sleepTimerRemaining ? formatDuration(sleepTimerRemaining) : 'Timer'}
            </button>
          </div>
        </div>

        {/* Bottom: Scrubber Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '10px',
            color: '#A8A29E',
          }}
        >
          <span style={{ width: '28px', textAlign: 'right' }}>
            {formatDuration(currentTime)}
          </span>
          <input
            type="range"
            min={0}
            max={liveDuration || 0}
            step="0.5"
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            aria-label="Seek track"
            style={{
              flex: 1,
              accentColor: '#D97706',
              height: '3px',
              cursor: 'pointer',
            }}
          />
          <span style={{ width: '28px', textAlign: 'left' }}>
            {formatDuration(liveDuration)}
          </span>
        </div>
      </div>
    </aside>
  );
}