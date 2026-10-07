"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDarshanPage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [notice, setNotice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [newWall, setNewWall] = useState({
    title: "",
    location: "",
    tag: "Daily Darshan",
    url: "",
  });

  const fileInputRef = useRef(null);

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const fetchWallpapers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("wallpapers")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error fetching wallpapers:", error);
    else setWallpapers(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchWallpapers();
  }, []);

  const handleAddWallpaper = async () => {
    if (!newWall.title.trim()) {
      alert("Please provide a title for the Darshan");
      return;
    }

    let finalImageUrl = newWall.url.trim();

    // 1. If a local file is picked, upload to Supabase Storage first
    if (selectedFile) {
      setUploading(true);
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("darshan-wallpapers")
        .upload(filePath, selectedFile, { cacheControl: "3600", upsert: false });

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("darshan-wallpapers")
        .getPublicUrl(filePath);

      finalImageUrl = publicUrlData.publicUrl;
      setUploading(false);
    }

    if (!finalImageUrl) {
      alert("Please either choose an image file or provide an Image URL");
      return;
    }

    // 2. Insert into PostgreSQL wallpapers table
    const payload = {
      title: newWall.title.trim(),
      location: newWall.location.trim() || "Sacred Shrine",
      tag: newWall.tag,
      url: finalImageUrl,
    };

    const { data, error } = await supabase
      .from("wallpapers")
      .insert([payload])
      .select();

    if (error) {
      alert("Publish failed: " + error.message);
    } else {
      setWallpapers([data[0], ...wallpapers]);
      setNewWall({ title: "", location: "", tag: "Daily Darshan", url: "" });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      showToast("Wallpaper published successfully!");
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Are you sure you want to delete "${item.title}"?`)) {
      return;
    }

    // Cleanup storage file if hosted in darshan-wallpapers bucket
    if (item.url && item.url.includes("/darshan-wallpapers/")) {
      try {
        const parts = item.url.split("/darshan-wallpapers/");
        if (parts[1]) {
          const filePath = decodeURIComponent(parts[1].split("?")[0]);
          await supabase.storage.from("darshan-wallpapers").remove([filePath]);
        }
      } catch (err) {
        console.warn("Storage cleanup note:", err);
      }
    }

    const { error } = await supabase.from("wallpapers").delete().eq("id", item.id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setWallpapers(wallpapers.filter((w) => String(w.id) !== String(item.id)));
      showToast(`Deleted "${item.title}"`);
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

      {/* Add Wallpaper Box */}
      <div
        style={{
          backgroundColor: "#FFFBEB",
          border: "1.5px dashed #F59E0B",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: "0 0 10px" }}>
          + Add New Darshan Wallpaper
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Temple / Deity Title (e.g. Mahakaleshwar Jyotirlinga)"
            value={newWall.title}
            onChange={(e) => setNewWall({ ...newWall, title: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <input
              type="text"
              placeholder="Location (e.g. Ujjain, MP)"
              value={newWall.location}
              onChange={(e) => setNewWall({ ...newWall, location: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
            <input
              type="text"
              placeholder="Tag (e.g. Daily Darshan)"
              value={newWall.tag}
              onChange={(e) => setNewWall({ ...newWall, tag: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
          </div>

          {/* Native File Upload Input */}
          <div style={{ backgroundColor: "#FFFFFF", padding: "10px", borderRadius: "8px", border: "1px solid #E5E7EB" }}>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#4B5563", display: "block", marginBottom: "4px" }}>
              Upload Image Directly (Phone Gallery or PC):
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
              style={{ fontSize: "12px", color: "#374151" }}
            />
          </div>

          <div style={{ textAlign: "center", fontSize: "11px", color: "#9CA3AF" }}>— OR PASTE IMAGE LINK —</div>

          <input
            type="url"
            placeholder="Direct Web Image URL (Optional if file uploaded)"
            value={newWall.url}
            onChange={(e) => setNewWall({ ...newWall, url: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <button
            onClick={handleAddWallpaper}
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
            {uploading ? "Uploading File..." : "Publish Wallpaper"}
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: 0 }}>
          Wallpapers {loading ? "(Loading...)" : `(${wallpapers.length})`}
        </h2>
        {wallpapers.map((item) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "10px",
            }}
          >
            <img
              src={item.url}
              alt={item.title}
              style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", backgroundColor: "#F3F4F6" }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
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
                {item.title}
              </span>
              <span style={{ fontSize: "11px", color: "#6B7280" }}>
                {item.location} • {item.tag}
              </span>
            </div>
            <button
              onClick={() => handleDelete(item)}
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