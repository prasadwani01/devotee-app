"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminDarshanPage() {
  const [wallpapers, setWallpapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [newWall, setNewWall] = useState({ title: "", location: "", tag: "Daily Darshan", url: "" });

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3000);
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
    if (!newWall.title.trim() || !newWall.url.trim()) {
      alert("Title and Image URL are required");
      return;
    }

    const payload = {
      title: newWall.title.trim(),
      location: newWall.location.trim() || "Sacred Shrine",
      tag: newWall.tag,
      url: newWall.url.trim(),
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
      showToast("Wallpaper published successfully!");
    }
  };

  const handleDelete = async (id, title) => {
    const { error } = await supabase.from("wallpapers").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setWallpapers(wallpapers.filter((w) => w.id !== id));
      showToast(`Deleted "${title}"`);
    }
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {notice && (
        <div style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981", color: "#065F46", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>
          ✓ {notice}
        </div>
      )}

      {/* Add Wallpaper Box */}
      <div style={{ backgroundColor: "#FFFBEB", border: "1.5px dashed #F59E0B", borderRadius: "14px", padding: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: "0 0 10px" }}>
          + Add New Darshan Wallpaper
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
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
          <input
            type="url"
            placeholder="Direct Image URL"
            value={newWall.url}
            onChange={(e) => setNewWall({ ...newWall, url: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />
          <button
            onClick={handleAddWallpaper}
            style={{ backgroundColor: "#D97706", color: "#FFFFFF", border: "none", borderRadius: "6px", padding: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
          >
            Publish Wallpaper
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: 0 }}>
          Wallpapers {loading ? "(Loading...)" : `(${wallpapers.length})`}
        </h2>
        {wallpapers.map((item) => (
          <div key={item.id} style={{ display: "flex", gap: "12px", alignItems: "center", backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "10px" }}>
            <img src={item.url} alt={item.title} style={{ width: "42px", height: "42px", borderRadius: "6px", objectFit: "cover", backgroundColor: "#F3F4F6" }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: "13px", fontWeight: "700", color: "#1F2937", display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {item.title}
              </span>
              <span style={{ fontSize: "11px", color: "#6B7280" }}>{item.location} • {item.tag}</span>
            </div>
            <button
              onClick={() => handleDelete(item.id, item.title)}
              style={{ background: "none", border: "none", color: "#DC2626", fontSize: "11px", cursor: "pointer", fontWeight: "600" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}