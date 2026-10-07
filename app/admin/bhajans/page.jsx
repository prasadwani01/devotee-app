"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBhajansPage() {
  const [bhajans, setBhajans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedAudioFile, setSelectedAudioFile] = useState(null);
  const [newBhajan, setNewBhajan] = useState({
    title: "",
    singer: "",
    duration: "",
    tag: "Morning Aarti",
    url: "",
  });

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const fetchBhajans = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bhajans")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error fetching bhajans:", error);
    else setBhajans(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBhajans();
  }, []);

  const handleAddBhajan = async () => {
    if (!newBhajan.title.trim()) {
      alert("Please provide at least a Track Title");
      return;
    }

    let finalAudioUrl = newBhajan.url.trim();

    // 1. If an audio file is selected, upload to Supabase Storage
    if (selectedAudioFile) {
      setUploading(true);
      const fileExt = selectedAudioFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `tracks/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("bhajans-audio")
        .upload(filePath, selectedAudioFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        alert("Audio upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("bhajans-audio")
        .getPublicUrl(filePath);

      finalAudioUrl = publicUrlData.publicUrl;
      setUploading(false);
    }

    if (!finalAudioUrl) {
      alert("Please choose an MP3 audio file or provide a direct stream URL");
      return;
    }

    // 2. Insert into PostgreSQL bhajans table
    const payload = {
      title: newBhajan.title.trim(),
      singer: newBhajan.singer.trim() || "Devotional Singer",
      duration: newBhajan.duration.trim() || "4:00",
      tag: newBhajan.tag,
      url: finalAudioUrl,
    };

    const { data, error } = await supabase
      .from("bhajans")
      .insert([payload])
      .select();

    if (error) {
      alert("Failed to add track: " + error.message);
    } else {
      setBhajans([data[0], ...bhajans]);
      setNewBhajan({ title: "", singer: "", duration: "", tag: "Morning Aarti", url: "" });
      setSelectedAudioFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Track published successfully!");
    }
  };

  const handleDelete = async (track) => {
    if (!window.confirm(`Are you sure you want to delete "${track.title}"?`)) {
      return;
    }

    // Optional: cleanup storage file if hosted in bhajans-audio bucket
    if (track.url && track.url.includes("/bhajans-audio/")) {
      try {
        const parts = track.url.split("/bhajans-audio/");
        if (parts[1]) {
          const filePath = decodeURIComponent(parts[1].split("?")[0]);
          await supabase.storage.from("bhajans-audio").remove([filePath]);
        }
      } catch (err) {
        console.warn("Storage cleanup note:", err);
      }
    }

    const { error } = await supabase.from("bhajans").delete().eq("id", track.id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setBhajans(bhajans.filter((item) => String(item.id) !== String(track.id)));
      showToast(`Deleted "${track.title}"`);
    }
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {notice && (
        <div
          style={{
            backgroundColor: "#D1FAE5",
            border: "1px solid #10B981",
            color: "#065F46",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "13px",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          ✓ {notice}
        </div>
      )}

      {/* Add Track */}
      <div
        style={{
          backgroundColor: "#FFFBEB",
          border: "1.5px dashed #F59E0B",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: "0 0 10px" }}>
          + Add New Bhajan / Aarti
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Track Title (e.g. Om Jai Jagdish Hare)"
            value={newBhajan.title}
            onChange={(e) => setNewBhajan({ ...newBhajan, title: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <input
              type="text"
              placeholder="Singer"
              value={newBhajan.singer}
              onChange={(e) => setNewBhajan({ ...newBhajan, singer: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 5:10)"
              value={newBhajan.duration}
              onChange={(e) => setNewBhajan({ ...newBhajan, duration: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
          </div>

          <select
            value={newBhajan.tag}
            onChange={(e) => setNewBhajan({ ...newBhajan, tag: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          >
            <option value="Morning Aarti">Morning Aarti</option>
            <option value="Dhun & Japa">Dhun &amp; Japa</option>
            <option value="Evening Aarti">Evening Aarti</option>
            <option value="Stotram">Stotram</option>
            <option value="Satsang Kirtan">Satsang Kirtan</option>
          </select>

          {/* Native Audio File Upload */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#4B5563", display: "block", marginBottom: "4px" }}>
              Upload Audio File (.mp3, .m4a, .wav):
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              onChange={(e) => setSelectedAudioFile(e.target.files?.[0] || null)}
              style={{ fontSize: "12px", color: "#374151" }}
            />
          </div>

          <div style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>— OR PASTE STREAM LINK —</div>

          <input
            type="url"
            placeholder="Direct MP3 Audio URL (Optional if file chosen above)"
            value={newBhajan.url}
            onChange={(e) => setNewBhajan({ ...newBhajan, url: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <button
            onClick={handleAddBhajan}
            disabled={uploading}
            style={{
              backgroundColor: uploading ? "#9CA3AF" : "#D97706",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "10px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Uploading Audio..." : "Publish Track"}
          </button>
        </div>
      </div>

      {/* Track List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: 0 }}>
          Audio Tracks {loading ? "(Loading...)" : `(${bhajans.length})`}
        </h2>

        {bhajans.map((track) => (
          <div
            key={track.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px",
            }}
          >
            <div style={{ minWidth: 0, paddingRight: "8px" }}>
              <span
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "#1F2937",
                  display: "block",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {track.title}
              </span>
              <span style={{ fontSize: "11px", color: "#6B7280" }}>
                {track.singer} • {track.tag} ({track.duration})
              </span>
            </div>
            <button
              onClick={() => handleDelete(track)}
              style={{
                background: "none",
                border: "none",
                color: "#DC2626",
                fontSize: "11px",
                cursor: "pointer",
                fontWeight: "600",
                flexShrink: 0,
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}