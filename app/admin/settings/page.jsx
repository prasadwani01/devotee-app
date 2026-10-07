"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    whatsapp_number: "919876543210",
    greeting: "Jai Shri Krishna",
    subtitle: "Welcome to your daily spiritual satsang & yatra companion.",
  });
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      const { data, error } = await supabase
        .from("app_settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (!error && data) {
        setSettings({
          whatsapp_number: data.whatsapp_number || "919876543210",
          greeting: data.greeting || "Jai Shri Krishna",
          subtitle: data.subtitle || "",
        });
      }
      setLoading(false);
    }
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    const { error } = await supabase
      .from("app_settings")
      .upsert({
        id: 1,
        whatsapp_number: settings.whatsapp_number.trim(),
        greeting: settings.greeting.trim(),
        subtitle: settings.subtitle.trim(),
      });

    if (error) {
      alert("Save failed: " + error.message);
    } else {
      setNotice("Settings saved permanently!");
      setTimeout(() => setNotice(""), 3000);
    }
  };

  return (
    <form onSubmit={handleSave} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "14px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#1F2937", margin: 0 }}>
        General App Settings {loading && "(Loading...)"}
      </h2>

      {notice && (
        <div style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981", color: "#065F46", padding: "8px", borderRadius: "6px", fontSize: "12px", fontWeight: "600", textAlign: "center" }}>
          ✓ {notice}
        </div>
      )}

      <div>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4B5563", display: "block", marginBottom: "4px" }}>
          Satsang Coordinator WhatsApp Number
        </label>
        <input
          type="text"
          value={settings.whatsapp_number}
          onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
          placeholder="e.g. 919876543210"
          style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          required
        />
        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>Format: 91 followed by 10-digit number.</span>
      </div>

      <div>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4B5563", display: "block", marginBottom: "4px" }}>
          Banner Heading
        </label>
        <input
          type="text"
          value={settings.greeting}
          onChange={(e) => setSettings({ ...settings, greeting: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
        />
      </div>

      <div>
        <label style={{ fontSize: "12px", fontWeight: "600", color: "#4B5563", display: "block", marginBottom: "4px" }}>
          Daily Subtitle / Quote
        </label>
        <textarea
          rows={2}
          value={settings.subtitle}
          onChange={(e) => setSettings({ ...settings, subtitle: e.target.value })}
          style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
        />
      </div>

      <button
        type="submit"
        style={{ backgroundColor: "#D97706", color: "#FFFFFF", border: "none", borderRadius: "6px", padding: "10px", fontWeight: "700", fontSize: "13px", cursor: "pointer" }}
      >
        Save Settings
      </button>
    </form>
  );
}