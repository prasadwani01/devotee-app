"use client";

import { useState } from "react";

// Replace with your Satsang coordinator's actual WhatsApp number (include country code, without '+' or spaces)
const SATSANG_WHATSAPP_NUMBER = "917020135562";

const yatraList = [
  {
    id: 1,
    title: "Char Dham Yatra",
    badge: "Most Popular",
    duration: "12 Days / 11 Nights",
    date: "May 10 – May 21, 2026",
    price: "₹32,500",
    route: "Haridwar • Yamunotri • Gangotri • Kedarnath • Badrinath",
    includes: "Deluxe Bus, Satvik Meals, Hotel Stay, VIP Darshan Support",
  },
  {
    id: 2,
    title: "Vrindavan & Mathura Braj Darshan",
    badge: "Weekend Special",
    duration: "4 Days / 3 Nights",
    date: "June 05 – June 08, 2026",
    price: "₹7,800",
    route: "Mathura • Vrindavan • Gokul • Govardhan Parikrama",
    includes: "AC Travel, Temple Guide, Hotel, Morning & Evening Aarti",
  },
  {
    id: 3,
    title: "Kashi, Ayodhya & Prayagraj Sangam",
    badge: "Upcoming",
    duration: "6 Days / 5 Nights",
    date: "July 15 – July 20, 2026",
    price: "₹14,200",
    route: "Varanasi (Kashi Vishwanath) • Ayodhya Ram Mandir • Prayagraj",
    includes: "Boat Ride at Ganga Aarti, 3-Star Stay, All Meals Included",
  },
];

export default function TripsPage() {
  const [selectedYatra, setSelectedYatra] = useState(null);
  const [formData, setFormData] = useState({ name: "", phone: "", seats: 1 });

  const handleWhatsAppBooking = (e) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.phone.trim()) {
      alert("Please enter both Name and WhatsApp number");
      return;
    }

    // Build the devotional WhatsApp message
    const message = 
`🙏 *Jai Shri Krishna / Pranam!*
I would like to register for the upcoming Yatra.

🚩 *Yatra Tour:* ${selectedYatra.title}
🗓️ *Dates:* ${selectedYatra.date}
💰 *Fare:* ${selectedYatra.price} per person

👤 *Devotee Name:* ${formData.name.trim()}
📞 *Contact Number:* ${formData.phone.trim()}
👥 *Total Devotees:* ${formData.seats}

Please confirm seat availability and sharing payment details.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${SATSANG_WHATSAPP_NUMBER}?text=${encodedMessage}`;

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");
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
          style={{
            backgroundColor: "#FFFBEB",
            border: "1.5px solid #F59E0B",
            borderRadius: "14px",
            padding: "16px",
            marginBottom: "24px",
          }}
        >
          <form onSubmit={handleWhatsAppBooking}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div>
                <span style={{ fontSize: "11px", color: "#B45309", fontWeight: "700", textTransform: "uppercase" }}>
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
              <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>
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
              <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>
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
              <label style={{ display: "block", fontSize: "12px", color: "#4B5563", marginBottom: "4px" }}>
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
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#25D366",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "700",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 2px 6px rgba(37, 211, 102, 0.3)",
              }}
            >
              <span>💬</span> Send Registration on WhatsApp
            </button>
          </form>
        </div>
      )}

      {/* Yatra Cards List */}
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
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
                {yatra.badge}
              </span>
              <span style={{ fontSize: "15px", fontWeight: "700", color: "#D97706" }}>
                {yatra.price}
              </span>
            </div>

            <h2 style={{ fontSize: "17px", fontWeight: "700", color: "#1F2937", margin: "0 0 6px" }}>
              {yatra.title}
            </h2>

            <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px" }}>
              🗓️ {yatra.date} ({yatra.duration})
            </p>

            <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 8px", lineHeight: "1.4" }}>
              📍 <strong>Route:</strong> {yatra.route}
            </p>

            <p style={{ fontSize: "12px", color: "#4B5563", margin: "0 0 14px", backgroundColor: "#F9FAFB", padding: "8px 10px", borderRadius: "6px" }}>
              ✨ <strong>Included:</strong> {yatra.includes}
            </p>

            <button
              onClick={() => {
                setSelectedYatra(yatra);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
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
              }}
            >
              Register for this Yatra
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}