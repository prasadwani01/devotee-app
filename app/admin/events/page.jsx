"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    event_date: "",
    event_time: "",
    location: "",
    category: "Utsav",
    description: "",
    contact_number: "",
  });

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const fetchEvents = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (!error && data) setEvents(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date) {
      alert("Please provide at least an event title and date.");
      return;
    }

    try {
      setSaving(true);
      const { error } = await supabase.from("events").insert([formData]);

      if (error) throw error;

      showToast("Event published successfully!");
      setFormData({
        title: "",
        event_date: "",
        event_time: "",
        location: "",
        category: "Utsav",
        description: "",
        contact_number: "",
      });
      fetchEvents();
    } catch (err) {
      alert("Error adding event: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (!error) {
      showToast("Event removed.");
      setEvents((prev) => prev.filter((item) => item.id !== id));
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 80px" }}>
      <h1 style={{ fontSize: "18px", fontWeight: "800", color: "#1F2937", marginBottom: "16px" }}>
        📅 Utsav &amp; Event Management
      </h1>

      {notice && (
        <div style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981", color: "#065F46", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textAlign: "center", marginBottom: "16px" }}>
          ✓ {notice}
        </div>
      )}

      {/* Add Form */}
      <form
        onSubmit={handleAddEvent}
        style={{
          backgroundColor: "#FFFBEB",
          border: "1.5px dashed #F59E0B",
          borderRadius: "14px",
          padding: "16px",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          marginBottom: "24px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: 0 }}>
          + Add New Utsav / Event
        </h3>

        <input
          type="text"
          placeholder="Event Title (e.g., Ram Navami Utsav / Bhajan Sandhya)"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
        />

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#6B7280" }}>Date</label>
            <input
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#6B7280" }}>Time (e.g. 6:00 PM)</label>
            <input
              type="text"
              placeholder="e.g., 6:00 PM onwards"
              value={formData.event_time}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", boxSizing: "border-box" }}
            />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          >
            <option value="Utsav">Utsav / Festival</option>
            <option value="Bhajan Sandhya">Bhajan Sandhya</option>
            <option value="Katha">Katha / Pravachan</option>
            <option value="Bhandara">Maha Prasad / Bhandara</option>
            <option value="Pooja">Vishesh Pooja</option>
          </select>

          <input
            type="text"
            placeholder="Coordinator Phone"
            value={formData.contact_number}
            onChange={(e) => setFormData({ ...formData, contact_number: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />
        </div>

        <input
          type="text"
          placeholder="Location / Mandir Venue"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
        />

        <textarea
          placeholder="Short description or instructions for devotees..."
          rows={3}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", fontFamily: "inherit" }}
        />

        <button
          type="submit"
          disabled={saving}
          style={{
            backgroundColor: saving ? "#9CA3AF" : "#D97706",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            padding: "10px",
            fontWeight: "700",
            fontSize: "13px",
            cursor: saving ? "not-allowed" : "pointer",
          }}
        >
          {saving ? "Publishing Event..." : "Publish Event"}
        </button>
      </form>

      {/* List */}
      <div>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "10px" }}>
          Published Events {loading ? "(Loading...)" : `(${events.length})`}
        </h2>

        {events.length === 0 && !loading && (
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>No events added yet.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {events.map((ev) => (
            <div
              key={ev.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "10px",
                border: "1px solid #E5E7EB",
                padding: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <span style={{ fontSize: "11px", fontWeight: "700", color: "#B45309", backgroundColor: "#FEF3C7", padding: "2px 6px", borderRadius: "4px" }}>
                  {ev.category} • {ev.event_date} {ev.event_time ? `(${ev.event_time})` : ""}
                </span>
                <h4 style={{ margin: "6px 0 2px", fontSize: "14px", fontWeight: "700", color: "#1F2937" }}>
                  {ev.title}
                </h4>
                <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>
                  📍 {ev.location || "Ashram / Mandir"}
                </p>
              </div>
              <button
                onClick={() => handleDelete(ev.id)}
                style={{ background: "none", border: "none", color: "#DC2626", fontSize: "11px", fontWeight: "600", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}