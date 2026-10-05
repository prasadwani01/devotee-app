"use client";

import { useState, useRef } from "react";

const trackList = [
  {
    id: 1,
    title: "Achyutam Keshavam",
    singer: "Sacred Chants",
    duration: "4:32",
    tag: "Morning Aarti",
    // Free high-quality sample audio
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    id: 2,
    title: "Shri Krishna Govind Hare Murari",
    singer: "Devotional Dhun",
    duration: "5:18",
    tag: "Dhun & Japa",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    id: 3,
    title: "Madhurashtakam - Adharam Madhuram",
    singer: "Classical Stotram",
    duration: "3:45",
    tag: "Stotram",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    id: 4,
    title: "Hanuman Chalisa",
    singer: "Peaceful Chant",
    duration: "6:10",
    tag: "Daily Recitation",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
];

export default function BhajansPage() {
  const [currentTrack, setCurrentTrack] = useState(trackList[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const togglePlay = (track) => {
    if (currentTrack.id === track.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        if (audioRef.current) {
          audioRef.current.play();
        }
      }, 50);
    }
  };

  return (
    <main
      style={{
        padding: "20px 16px 40px",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#B45309", margin: "0 0 6px" }}>
          🎶 Devotional Bhajans
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Daily aartis, japa dhun, and sacred stotrams.
        </p>
      </header>

      {/* Persistent Active Player Widget */}
      <div
        style={{
          background: "linear-gradient(135deg, #F59E0B, #D97706)",
          borderRadius: "16px",
          padding: "16px 20px",
          color: "#FFFFFF",
          boxShadow: "0 4px 14px rgba(217, 119, 6, 0.25)",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: "12px" }}>
            <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.85, letterSpacing: "0.5px" }}>
              NOW PLAYING
            </span>
            <h2
              style={{
                fontSize: "16px",
                fontWeight: "700",
                margin: "4px 0 2px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTrack.title}
            </h2>
            <p style={{ fontSize: "12px", opacity: 0.9, margin: 0 }}>
              {currentTrack.singer} • {currentTrack.duration}
            </p>
          </div>

          <button
            onClick={() => togglePlay(currentTrack)}
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#FFFFFF",
              color: "#D97706",
              border: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              flexShrink: 0,
            }}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>
        </div>

        {/* Hidden Native Audio Element */}
        <audio
          ref={audioRef}
          src={currentTrack.url}
          onEnded={() => setIsPlaying(false)}
        />
      </div>

      {/* Playlist Section */}
      <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "12px" }}>
        Sacred Playlist ({trackList.length})
      </h3>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {trackList.map((track, index) => {
          const isSelected = currentTrack.id === track.id;

          return (
            <div
              key={track.id}
              onClick={() => togglePlay(track)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px",
                backgroundColor: isSelected ? "#FEF3C7" : "#FFFFFF",
                borderRadius: "12px",
                border: isSelected ? "1.5px solid #F59E0B" : "1px solid #E5E7EB",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "700",
                    color: isSelected ? "#D97706" : "#9CA3AF",
                    width: "18px",
                    textAlign: "center",
                  }}
                >
                  {index + 1}
                </span>

                <div style={{ minWidth: 0 }}>
                  <h4
                    style={{
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#1F2937",
                      margin: "0 0 3px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {track.title}
                  </h4>
                  <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <span
                      style={{
                        fontSize: "10px",
                        backgroundColor: isSelected ? "#FDE68A" : "#F3F4F6",
                        color: isSelected ? "#B45309" : "#6B7280",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        fontWeight: "600",
                      }}
                    >
                      {track.tag}
                    </span>
                    <span style={{ fontSize: "11px", color: "#6B7280" }}>
                      {track.duration}
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  backgroundColor: isSelected && isPlaying ? "#D97706" : "#F3F4F6",
                  color: isSelected && isPlaying ? "#FFFFFF" : "#4B5563",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "12px",
                  flexShrink: 0,
                  marginLeft: "10px",
                }}
              >
                {isSelected && isPlaying ? "⏸" : "▶"}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}