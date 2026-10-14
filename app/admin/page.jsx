"use client";

import Link from "next/link";

const adminModules = [
  {
    title: "Yatra Management",
    desc: "Create and update upcoming pilgrimage tours, dates & routes",
    icon: "🧭",
    href: "/admin/yatras",
    badge: "Tours",
  },
  {
    title: "Bhajans & Audio",
    desc: "Add devotional tracks, aartis, kirtans & direct stream links",
    icon: "🎶",
    href: "/admin/bhajans",
    badge: "Audio",
  },
  {
    title: "Darshan Wallpapers",
    desc: "Upload and update daily deity wallpapers for devotees",
    icon: "🌸",
    href: "/admin/darshan",
    badge: "Photos",
  },
  {
    title: "Books & Granthalaya",
    desc: "Manage sacred texts, chalisas, stotras & PDF links",
    icon: "📖",
    href: "/admin/books",
    badge: "Scriptures",
  },
  {
    title: "Utsav & Events Calendar",
    desc: "Schedule festival dates, satsang programs & pooja venues",
    icon: "📅",
    href: "/admin/events",
    badge: "New",
  },
];

export default function AdminDashboardPage() {
  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "20px 16px 80px",
      }}
    >
      {/* Top Header */}
      <header style={{ marginBottom: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: "700",
              color: "#D97706",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Coordinator Portal
          </span>
          <Link
            href="/"
            style={{
              fontSize: "12px",
              color: "#4B5563",
              textDecoration: "none",
              fontWeight: "600",
              backgroundColor: "#F3F4F6",
              padding: "4px 10px",
              borderRadius: "6px",
            }}
          >
            ← View App
          </Link>
        </div>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#1F2937",
            margin: "6px 0 2px",
          }}
        >
          Satsang Admin Center
        </h1>
        <p style={{ fontSize: "13px", color: "#6B7280", margin: 0 }}>
          Manage all content, media, and schedules for devotee access
        </p>
      </header>

      {/* Module Navigation List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {adminModules.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "14px",
              padding: "16px",
              textDecoration: "none",
              boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
              transition: "transform 0.1s ease",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "14px", minWidth: 0 }}>
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  borderRadius: "12px",
                  backgroundColor: "#FFFBEB",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "22px",
                  flexShrink: 0,
                  border: "1px solid #FEF3C7",
                }}
              >
                {item.icon}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                  <h3
                    style={{
                      fontSize: "15px",
                      fontWeight: "700",
                      color: "#1F2937",
                      margin: 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </h3>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "700",
                      backgroundColor: item.badge === "New" ? "#DCFCE7" : "#F3F4F6",
                      color: item.badge === "New" ? "#166534" : "#4B5563",
                      padding: "1px 6px",
                      borderRadius: "6px",
                    }}
                  >
                    {item.badge}
                  </span>
                </div>
                <p
                  style={{
                    fontSize: "12px",
                    color: "#6B7280",
                    margin: 0,
                    lineHeight: "1.3",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            </div>

            <span style={{ fontSize: "16px", color: "#9CA3AF", paddingLeft: "8px" }}>→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}