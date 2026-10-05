"use client";

import { useState } from "react";

const darshanList = [
  {
    id: 1,
    title: "Shri Radha Krishna",
    location: "Vrindavan Dham",
    tag: "Daily Darshan",
    previewUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 2,
    title: "Kedarnath Jyotirlinga",
    location: "Himalayas, Uttarakhand",
    tag: "Sacred Shrine",
    previewUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 3,
    title: "Varanasi Ganga Aarti",
    location: "Dashashwamedh Ghat",
    tag: "Maha Aarti",
    previewUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=90",
  },
  {
    id: 4,
    title: "Golden Temple Harmandir",
    location: "Amritsar, Punjab",
    tag: "Morning Glow",
    previewUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=600&q=80",
    downloadUrl: "https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&w=1200&q=90",
  },
];

export default function WallpapersPage() {
  const [downloadingId, setDownloadingId] = useState(null);

  const handleDownload = async (item) => {
    setDownloadingId(item.id);
    try {
      const response = await fetch(item.downloadUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${item.title.replace(/\s+/g, "_")}_Darshan.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // Fallback: open image in new tab if cross-origin fetch is restricted
      window.open(item.downloadUrl, "_blank");
    } finally {
      setDownloadingId(null);
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
          🌸 Daily Darshan & Wallpapers
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          High-definition sacred darshan for your mobile home screen.
        </p>
      </header>

      {/* 2-Column Responsive Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "12px",
        }}
      >
        {darshanList.map((item) => (
          <div
            key={item.id}
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid #FDE68A",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Image Preview Container */}
            <div
              style={{
                position: "relative",
                width: "100%",
                height: "170px",
                backgroundColor: "#FEF3C7",
                overflow: "hidden",
              }}
            >
              <img
                src={item.previewUrl}
                alt={item.title}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  top: "8px",
                  left: "8px",
                  fontSize: "10px",
                  fontWeight: "700",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "#FFFFFF",
                  padding: "2px 6px",
                  borderRadius: "6px",
                  backdropFilter: "blur(4px)",
                }}
              >
                {item.tag}
              </span>
            </div>

            {/* Info & Download Action */}
            <div style={{ padding: "10px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
              <div>
                <h3
                  style={{
                    fontSize: "13px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "0 0 2px",
                    lineHeight: "1.3",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 10px" }}>
                  📍 {item.location}
                </p>
              </div>

              <button
                onClick={() => handleDownload(item)}
                disabled={downloadingId === item.id}
                style={{
                  width: "100%",
                  padding: "8px",
                  backgroundColor: downloadingId === item.id ? "#9CA3AF" : "#D97706",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: downloadingId === item.id ? "default" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "4px",
                }}
              >
                {downloadingId === item.id ? "Saving..." : "📥 Save HD"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}