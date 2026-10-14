"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const EVENTS_CACHE_KEY = "satsang_cached_events_v1";

export default function EventsUserPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const handleStatus = () => setIsOffline(!navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    setIsOffline(!navigator.onLine);

    async function loadEvents() {
      // 1. Check local cache first
      try {
        const cached = localStorage.getItem(EVENTS_CACHE_KEY);
        if (cached) {
          setEvents(JSON.parse(cached));
          setLoading(false);
        }
      } catch (e) {
        console.warn("Local cache read error", e);
      }

      // 2. Fetch fresh data from Supabase if online
      if (navigator.onLine) {
        try {
          const { data, error } = await supabase
            .from("events")
            .select("*")
            .order("event_date", { ascending: true });

          if (!error && data) {
            setEvents(data);
            try {
              localStorage.setItem(EVENTS_CACHE_KEY, JSON.stringify(data));
            } catch (err) {
              console.warn("Cache write error", err);
            }
          }
        } catch (fetchErr) {
          console.warn("Fetch error, using cache", fetchErr);
        }
      }
      setLoading(false);
    }

    loadEvents();

    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 90px" }}>
      <header style={{ marginBottom: "18px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "11px", fontWeight: "700", color: "#D97706", textTransform: "uppercase" }}>
            उत्सव व सत्संग कॅलेंडर • Event Calendar
          </span>
          {isOffline && (
            <span style={{ fontSize: "10px", fontWeight: "700", backgroundColor: "#FEE2E2", color: "#991B1B", padding: "2px 8px", borderRadius: "12px" }}>
              ⚡ Offline
            </span>
          )}
        </div>
        <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#1F2937", margin: "4px 0 0" }}>
          Upcoming Utsav &amp; Satsang
        </h1>
      </header>

      {loading && events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280", fontSize: "13px" }}>
          Loading upcoming spiritual programs...
        </div>
      ) : events.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "13px" }}>
          No upcoming programs scheduled at the moment.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {events.map((ev) => {
            const shareText = `🚩 *${ev.title}*\n📅 Date: ${ev.event_date} (${ev.event_time || "All Day"})\n📍 Venue: ${ev.location || "Mandir"}\n\nJoin us for this sacred satsang!`;
            const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

            return (
              <div
                key={ev.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "14px",
                  border: "1px solid #E5E7EB",
                  padding: "16px",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "700", color: "#B45309", backgroundColor: "#FEF3C7", padding: "3px 8px", borderRadius: "6px" }}>
                    {ev.category}
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "700", color: "#D97706" }}>
                    🗓️ {ev.event_date}
                  </span>
                </div>

                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1F2937", margin: "0 0 6px" }}>
                  {ev.title}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "3px", fontSize: "12px", color: "#4B5563", marginBottom: "10px" }}>
                  {ev.event_time && <div>⏰ <strong>Time:</strong> {ev.event_time}</div>}
                  {ev.location && <div>📍 <strong>Venue:</strong> {ev.location}</div>}
                </div>

                {ev.description && (
                  <p style={{ fontSize: "12px", color: "#6B7280", lineHeight: "1.5", margin: "0 0 12px" }}>
                    {ev.description}
                  </p>
                )}

                {/* Devotee Actions: Call Coordinator & WhatsApp Share */}
                <div style={{ display: "flex", gap: "8px", paddingTop: "8px", borderTop: "1px solid #F3F4F6" }}>
                  {ev.contact_number && (
                    <a
                      href={`tel:${ev.contact_number}`}
                      style={{
                        flex: 1,
                        textAlign: "center",
                        backgroundColor: "#FEF3C7",
                        color: "#92400E",
                        padding: "8px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "700",
                        textDecoration: "none",
                      }}
                    >
                      📞 Call Info
                    </a>
                  )}

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      flex: 1,
                      textAlign: "center",
                      backgroundColor: "#DCFCE7",
                      color: "#166534",
                      padding: "8px",
                      borderRadius: "8px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textDecoration: "none",
                    }}
                  >
                    📲 Share Event
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}