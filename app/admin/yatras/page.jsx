"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminYatrasPage() {
  const [yatras, setYatras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [newYatra, setNewYatra] = useState({
    title: "",
    price: "",
    date: "",
    duration: "",
    route: "",
    badge: "Booking Open",
  });

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  // 1. Fetch live data from Supabase
  const fetchYatras = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("yatras")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Error fetching yatras:", error);
    } else {
      setYatras(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchYatras();
  }, []);

  // 2. Add new Yatra
  const handleAddYatra = async () => {
    if (!newYatra.title.trim() || !newYatra.price.trim()) {
      alert("Title and Price are required");
      return;
    }

    const payload = {
      title: newYatra.title.trim(),
      price: newYatra.price.trim(),
      date: newYatra.date.trim(),
      duration: newYatra.duration.trim(),
      route: newYatra.route.trim(),
      badge: newYatra.badge,
    };

    const { data, error } = await supabase
      .from("yatras")
      .insert([payload])
      .select();

    if (error) {
      alert("Failed to add yatra: " + error.message);
    } else {
      setYatras([data[0], ...yatras]);
      setNewYatra({
        title: "",
        price: "",
        date: "",
        duration: "",
        route: "",
        badge: "Booking Open",
      });
      showToast("Yatra published successfully!");
    }
  };

  // 3. Update existing Yatra
  const handleUpdate = async (id, updatedFields, title) => {
    const { error } = await supabase
      .from("yatras")
      .update(updatedFields)
      .eq("id", id);

    if (error) {
      alert("Update failed: " + error.message);
    } else {
      showToast(`Updated "${title}"`);
    }
  };

  // 4. Delete Yatra
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the pilgrimage "${title}"?`)) {
      return;
    }

    const { error } = await supabase.from("yatras").delete().eq("id", id);
    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      setYatras(yatras.filter((item) => String(item.id) !== String(id)));
      showToast(`Deleted "${title}"`);
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

      {/* Add New Yatra Box */}
      <div
        style={{
          backgroundColor: "#FFFBEB",
          border: "1.5px dashed #F59E0B",
          borderRadius: "14px",
          padding: "16px",
        }}
      >
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: "0 0 10px" }}>
          + Add New Yatra
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <input
            type="text"
            placeholder="Yatra Name (e.g. Rameshwaram & Madurai)"
            value={newYatra.title}
            onChange={(e) => setNewYatra({ ...newYatra, title: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <input
              type="text"
              placeholder="Price (e.g. ₹18,000)"
              value={newYatra.price}
              onChange={(e) => setNewYatra({ ...newYatra, price: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
            <input
              type="text"
              placeholder="Duration (e.g. 5 Days)"
              value={newYatra.duration}
              onChange={(e) => setNewYatra({ ...newYatra, duration: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
          </div>
          <input
            type="text"
            placeholder="Pilgrimage Dates (e.g. Nov 12 – Nov 17, 2026)"
            value={newYatra.date}
            onChange={(e) => setNewYatra({ ...newYatra, date: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />
          <input
            type="text"
            placeholder="Route stops (e.g. Madurai • Rameshwaram)"
            value={newYatra.route}
            onChange={(e) => setNewYatra({ ...newYatra, route: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />
          <button
            onClick={handleAddYatra}
            style={{
              backgroundColor: "#D97706",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "10px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Publish Yatra
          </button>
        </div>
      </div>

      {/* Active Listings */}
      <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: 0 }}>
          Active Yatras {loading ? "(Loading...)" : `(${yatras.length})`}
        </h2>

        {yatras.map((yatra) => (
          <div
            key={yatra.id}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "12px",
              padding: "14px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
              <span style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937" }}>{yatra.title}</span>
              <button
                onClick={() => handleDelete(yatra.id, yatra.title)}
                style={{ background: "none", border: "none", color: "#DC2626", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
              >
                Delete
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "8px" }}>
              <div>
                <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "2px" }}>Price / Fare</label>
                <input
                  type="text"
                  value={yatra.price || ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    setYatras(yatras.map((item) => (String(item.id) === String(yatra.id) ? { ...item, price: val } : item)));
                  }}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", fontWeight: "600" }}
                />
              </div>

              <div>
                <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "2px" }}>Status</label>
                <select
                  value={yatra.badge || "Booking Open"}
                  onChange={(e) => {
                    const val = e.target.value;
                    setYatras(yatras.map((item) => (String(item.id) === String(yatra.id) ? { ...item, badge: val } : item)));
                  }}
                  style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
                >
                  <option value="Booking Open">Booking Open</option>
                  <option value="Housefull">Housefull</option>
                  <option value="Limited Seats">Limited Seats</option>
                  <option value="Upcoming">Upcoming</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: "8px" }}>
              <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "2px" }}>Dates</label>
              <input
                type="text"
                value={yatra.date || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setYatras(yatras.map((item) => (String(item.id) === String(yatra.id) ? { ...item, date: val } : item)));
                }}
                style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
              />
            </div>

            <button
              onClick={() => handleUpdate(yatra.id, { price: yatra.price, badge: yatra.badge, date: yatra.date }, yatra.title)}
              style={{ width: "100%", padding: "7px", backgroundColor: "#F3F4F6", border: "1px solid #D1D5DB", borderRadius: "6px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}
            >
              Save Update
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}