"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function WallpapersPage() {
  const [darshanList, setDarshanList] = useState([]);
  const [downloadingId, setDownloadingId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWallpapers() {
      setLoading(true);
      const { data, error } = await supabase
        .from("wallpapers")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) {
        setDarshanList(data);
      }
      setLoading(false);
    }
    loadWallpapers();
  }, []);

  const handleDownload = async (item) => {
    setDownloadingId(item.id);
    const cleanTitle = (item.title || "Darshan").replace(/[^a-zA-Z0-9_-]/g, "_");
    const fileName = `${cleanTitle}_HD.jpg`;

    try {
      const response = await fetch(item.url, { mode: "cors" });
      if (!response.ok) throw new Error("Network response not ok");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      // Direct navigation fallback if CORS blocks client fetch
      const directLink = document.createElement("a");
      directLink.href = item.url;
      directLink.target = "_blank";
      directLink.rel = "noopener noreferrer";
      directLink.download = fileName;
      document.body.appendChild(directLink);
      directLink.click();
      document.body.removeChild(directLink);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <main style={{ padding: "20px 16px 40px", maxWidth: "480px", margin: "0 auto" }}>
      <header style={{ marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "700", color: "#B45309", margin: "0 0 6px" }}>
          🌸 Daily Darshan &amp; Wallpapers
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          High-definition sacred darshan for your mobile screen.
        </p>
      </header>

      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
          Loading divine wallpapers...
        </div>
      ) : darshanList.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
          No wallpapers published yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
          {darshanList.map((item) => {
            const isDownloading = String(downloadingId) === String(item.id);

            return (
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
                <div style={{ position: "relative", width: "100%", height: "170px", backgroundColor: "#FEF3C7" }}>
                  <img
                    src={item.url}
                    alt={item.title || "Darshan"}
                    loading="lazy"
                    style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
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
                    {item.tag || "Darshan"}
                  </span>
                </div>

                <div style={{ padding: "10px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                  <div>
                    <h3 style={{ fontSize: "13px", fontWeight: "700", color: "#1F2937", margin: "0 0 2px", lineHeight: "1.3" }}>
                      {item.title}
                    </h3>
                    {item.location && (
                      <p style={{ fontSize: "11px", color: "#6B7280", margin: "0 0 10px" }}>
                        📍 {item.location}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => handleDownload(item)}
                    disabled={isDownloading}
                    style={{
                      width: "100%",
                      padding: "8px",
                      backgroundColor: isDownloading ? "#9CA3AF" : "#D97706",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "600",
                      cursor: isDownloading ? "default" : "pointer",
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    {isDownloading ? "Saving..." : "📥 Save HD"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}