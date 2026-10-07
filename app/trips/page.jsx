"use client";

import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function TripsPage() {
  const [yatraList, setYatraList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [whatsappNumber, setWhatsappNumber] = useState("919876543210");
  const [selectedYatra, setSelectedYatra] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", seats: 1 });
  const [submitting, setSubmitting] = useState(false);

  const formRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);

      // 1. Fetch live yatras
      const { data: tripsData } = await supabase
        .from("yatras")
        .select("*")
        .order("id", { ascending: false });

      if (tripsData) setYatraList(tripsData);

      // 2. Fetch coordinator WhatsApp number (checking settings table)
      try {
        const { data: settingsData } = await supabase
          .from("settings")
          .select("whatsapp_number")
          .limit(1)
          .maybeSingle();

        if (settingsData?.whatsapp_number) {
          setWhatsappNumber(settingsData.whatsapp_number.trim());
        }
      } catch {
        // Fallback to default number if table or row is missing
      }

      setLoading(false);
    }

    loadData();
  }, []);

  const handleSelectYatra = (yatra) => {
    setSelectedYatra(yatra);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  };

  const handleWhatsAppBooking = async (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please enter both Name and WhatsApp number");
      return;
    }

    setSubmitting(true);

    // 1. Save to Supabase Bookings table
    try {
      await supabase.from("bookings").insert([
        {
          yatra_id: selectedYatra.id,
          yatra_title: selectedYatra.title,
          devotee_name: formData.name.trim(),
          phone: formData.phone.trim(),
          seats: Number(formData.seats) || 1,
          status: "Pending Verification",
        },
      ]);
    } catch (err) {
      console.warn("Booking record warning:", err);
    }

    // 2. Format WhatsApp Message
    const message = `🙏 *Jai Shri Krishna / Pranam!*
I would like to register for the upcoming Yatra.

🚩 *Yatra Tour:* ${selectedYatra.title}
🗓️ *Dates:* ${selectedYatra.date || "Upcoming"}
💰 *Fare:* ${selectedYatra.price || "Contact for pricing"} per person

👤 *Devotee Name:* ${formData.name.trim()}
📞 *Contact Number:* ${formData.phone.trim()}
👥 *Total Devotees:* ${formData.seats}

Please confirm seat availability and payment details.`;

    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;

    // 3. Reset state & redirect to WhatsApp safely on mobile
    setSubmitting(false);
    setSelectedYatra(null);
    setFormData({ name: "", phone: "", seats: 1 });

    window.location.href = whatsappUrl;
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
          🚩 Upcoming Yatra Tours
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Reserve your seat for sacred pilgrimages with satvik seva.
        </p>
      </header>

      {/* Booking Form Box */}
      {selectedYatra && (
        <div
          ref={formRef}
          style={{
            backgroundColor: "#FFFBEB",
            border: "1.5px solid #F59E0B",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <form onSubmit={handleWhatsAppBooking}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "12px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "11px",
                    color: "#B45309",
                    fontWeight: "700",
                    textTransform: "uppercase",
                  }}
                >
                  Fast Booking
                </span>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1F2937", margin: "2px 0 0" }}>
                  {selectedYatra.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedYatra(null)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: "16px",
                  cursor: "pointer",
                  color: "#6B7280",
                  padding: "4px 8px",
                }}
              >
                ✕
              </button>
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#4B5563",
                  marginBottom: "4px",
                }}
              >
                Devotee Full Name
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Bhai Patel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#4B5563",
                  marginBottom: "4px",
                }}
              >
                WhatsApp Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                }}
                required
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "#4B5563",
                  marginBottom: "4px",
                }}
              >
                Number of Devotees
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.seats}
                onChange={(e) => setFormData({ ...formData, seats: Number(e.target.value) })}
                style={{
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid #D1D5DB",
                  fontSize: "14px",
                }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: submitting ? "#9CA3AF" : "#25D366",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: submitting ? "default" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 6px rgba(37, 211, 102, 0.3)",
              }}
            >
              <span>💬</span> {submitting ? "Booking Seat..." : "Send Registration on WhatsApp"}
            </button>
          </form>
        </div>
      )}

      {/* Yatra Cards List */}
      {loading ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
          Loading active yatra listings...
        </div>
      ) : yatraList.length === 0 ? (
        <div style={{ padding: "40px 0", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
          No pilgrimages scheduled right now. Check back soon.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {yatraList.map((yatra) => (
            <div
              key={yatra.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                padding: "16px",
                border: "1px solid #FDE68A",
                boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    fontSize: "11px",
                    backgroundColor: "#FEF3C7",
                    color: "#B45309",
                    padding: "2px 8px",
                    borderRadius: "10px",
                    fontWeight: "600",
                  }}
                >
                  {yatra.badge || "Booking Open"}
                </span>
                <span style={{ fontSize: "15px", fontWeight: "700", color: "#D97706" }}>
                  {yatra.price}
                </span>
              </div>

              <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1F2937", margin: "0 0 6px" }}>
                {yatra.title}
              </h2>

              {yatra.date && (
                <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px" }}>
                  🗓️ {yatra.date} {yatra.duration ? `(${yatra.duration})` : ""}
                </p>
              )}

              {yatra.route && (
                <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 8px", lineHeight: "1.4" }}>
                  📍 <strong>Route:</strong> {yatra.route}
                </p>
              )}

              <button
                onClick={() => handleSelectYatra(yatra)}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#D97706",
                  color: "#FFFFFF",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  cursor: "pointer",
                  marginTop: "8px",
                }}
              >
                Register for this Yatra
              </button>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}