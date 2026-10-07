"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterYatra, setFilterYatra] = useState("all");

  const fetchBookings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .order("id", { ascending: false });

    if (error) console.error("Error loading bookings:", error);
    else setBookings(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: newStatus })
      .eq("id", id);

    if (!error) {
      setBookings(bookings.map((b) => (b.id === id ? { ...b, status: newStatus } : b)));
    }
  };

  const exportCSV = () => {
    if (bookings.length === 0) return alert("No bookings to export");

    const headers = ["ID", "Devotee Name", "Phone", "Seats", "Yatra", "Status", "Date"];
    const rows = bookings.map((b) => [
      b.id,
      `"${b.devotee_name}"`,
      `"${b.phone}"`,
      b.seats,
      `"${b.yatra_title}"`,
      `"${b.status}"`,
      `"${new Date(b.created_at).toLocaleDateString()}"`,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Yatra_Passenger_Roster_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filtered = filterYatra === "all" ? bookings : bookings.filter((b) => b.yatra_title === filterYatra);
  const totalSeats = filtered.reduce((sum, item) => sum + (Number(item.seats) || 1), 0);
  const uniqueYatras = Array.from(new Set(bookings.map((b) => b.yatra_title)));

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {/* Header & Export */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1F2937", margin: 0 }}>
            Passenger Roster ({filtered.length} Bookings)
          </h2>
          <span style={{ fontSize: "12px", color: "#D97706", fontWeight: "600" }}>
            Total Registered Seats: {totalSeats}
          </span>
        </div>
        <button
          onClick={exportCSV}
          style={{
            backgroundColor: "#059669",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "6px",
            padding: "8px 12px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
          }}
        >
          📥 Export Excel/CSV
        </button>
      </div>

      {/* Filter by Trip */}
      {uniqueYatras.length > 0 && (
        <div>
          <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "4px" }}>Filter by Yatra:</label>
          <select
            value={filterYatra}
            onChange={(e) => setFilterYatra(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          >
            <option value="all">All Yatras ({bookings.length})</option>
            {uniqueYatras.map((title) => (
              <option key={title} value={title}>{title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Roster Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#6B7280", fontSize: "13px" }}>Loading passenger list...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#9CA3AF", fontSize: "13px" }}>No registrations recorded yet.</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((item) => (
            <div key={item.id} style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB", borderRadius: "10px", padding: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                <div>
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937", margin: 0 }}>{item.devotee_name}</h3>
                  <span style={{ fontSize: "12px", color: "#4B5563" }}>📞 {item.phone}</span>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", backgroundColor: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: "6px" }}>
                  {item.seats} {item.seats > 1 ? "Seats" : "Seat"}
                </span>
              </div>

              <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>
                🚩 {item.yatra_title} • {new Date(item.created_at).toLocaleDateString()}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <select
                  value={item.status || "Pending Verification"}
                  onChange={(e) => updateStatus(item.id, e.target.value)}
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #D1D5DB",
                    backgroundColor: item.status === "Confirmed" ? "#D1FAE5" : "#FFFBEB",
                    color: item.status === "Confirmed" ? "#065F46" : "#92400E",
                  }}
                >
                  <option value="Pending Verification">Pending Verification</option>
                  <option value="Confirmed">Confirmed / Paid</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <a
                  href={`https://wa.me/${item.phone.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: "11px", color: "#059669", fontWeight: "600", textDecoration: "none" }}
                >
                  💬 Chat Devotee
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}