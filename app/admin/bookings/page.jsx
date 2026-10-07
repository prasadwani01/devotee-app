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
      setBookings((prev) =>
        prev.map((b) => (String(b.id) === String(id) ? { ...b, status: newStatus } : b))
      );
    } else {
      alert("Status update failed: " + error.message);
    }
  };

  const filtered =
    filterYatra === "all" ? bookings : bookings.filter((b) => b.yatra_title === filterYatra);
  const totalSeats = filtered.reduce((sum, item) => sum + (Number(item.seats) || 1), 0);
  const uniqueYatras = Array.from(new Set(bookings.map((b) => b.yatra_title).filter(Boolean)));

  const exportCSV = () => {
    if (filtered.length === 0) return alert("No bookings available to export");

    const escapeCsv = (str) => `"${String(str ?? "").replace(/"/g, '""')}"`;

    const headers = ["ID", "Devotee Name", "Phone", "Seats", "Yatra", "Status", "Date"];
    const rows = filtered.map((b) => [
      b.id,
      escapeCsv(b.devotee_name),
      escapeCsv(b.phone),
      b.seats || 1,
      escapeCsv(b.yatra_title),
      escapeCsv(b.status || "Pending Verification"),
      escapeCsv(b.created_at ? new Date(b.created_at).toLocaleDateString() : "N/A"),
    ]);

    // Prepend UTF-8 BOM (\uFEFF) so Excel parses Hindi/Devanagari scripts correctly
    const csvString = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const safeFilterName = filterYatra === "all" ? "All_Yatras" : filterYatra.replace(/[^a-zA-Z0-9_-]/g, "_");
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Passenger_Roster_${safeFilterName}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatWhatsAppNumber = (phone) => {
    const rawDigits = (phone || "").replace(/[^0-9]/g, "");
    if (!rawDigits) return "";
    return rawDigits.length === 10 ? `91${rawDigits}` : rawDigits;
  };

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
          <label style={{ fontSize: "11px", color: "#6B7280", display: "block", marginBottom: "4px" }}>
            Filter by Yatra:
          </label>
          <select
            value={filterYatra}
            onChange={(e) => setFilterYatra(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          >
            <option value="all">All Yatras ({bookings.length})</option>
            {uniqueYatras.map((title) => (
              <option key={title} value={title}>
                {title}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Roster Cards */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "24px 0", color: "#6B7280", fontSize: "13px" }}>
          Loading passenger list...
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "30px 0", color: "#9CA3AF", fontSize: "13px" }}>
          No registrations recorded yet.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((item) => {
            const cleanPhone = formatWhatsAppNumber(item.phone);

            return (
              <div
                key={item.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E5E7EB",
                  borderRadius: "10px",
                  padding: "12px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "6px" }}>
                  <div>
                    <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937", margin: 0 }}>
                      {item.devotee_name}
                    </h3>
                    <span style={{ fontSize: "12px", color: "#4B5563" }}>📞 {item.phone}</span>
                  </div>
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: "700",
                      backgroundColor: "#FEF3C7",
                      color: "#B45309",
                      padding: "2px 8px",
                      borderRadius: "6px",
                    }}
                  >
                    {item.seats} {item.seats > 1 ? "Seats" : "Seat"}
                  </span>
                </div>

                <div style={{ fontSize: "11px", color: "#6B7280", marginBottom: "8px" }}>
                  🚩 {item.yatra_title} • {item.created_at ? new Date(item.created_at).toLocaleDateString() : "Recent"}
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
                      backgroundColor:
                        item.status === "Confirmed"
                          ? "#D1FAE5"
                          : item.status === "Cancelled"
                          ? "#FEE2E2"
                          : "#FFFBEB",
                      color:
                        item.status === "Confirmed"
                          ? "#065F46"
                          : item.status === "Cancelled"
                          ? "#991B1B"
                          : "#92400E",
                    }}
                  >
                    <option value="Pending Verification">Pending Verification</option>
                    <option value="Confirmed">Confirmed / Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {cleanPhone ? (
                    <a
                      href={`https://wa.me/${cleanPhone}`}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: "11px", color: "#059669", fontWeight: "600", textDecoration: "none" }}
                    >
                      💬 Chat Devotee
                    </a>
                  ) : (
                    <span style={{ fontSize: "11px", color: "#9CA3AF" }}>No Phone</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}