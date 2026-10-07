import Link from "next/link";

const modules = [
  {
    title: "Yatra Tours & Prices",
    desc: "Update pilgrimage schedules, fares, and toggle housefull badges.",
    href: "/admin/yatras",
    icon: "🚩",
  },
  {
    title: "Bhajans & Kirtans",
    desc: "Add or remove devotional audio tracks, aartis, and durations.",
    href: "/admin/bhajans",
    icon: "🎶",
  },
  {
    title: "Daily Darshan Wallpapers",
    desc: "Upload and manage high-definition wallpapers for devotees.",
    href: "/admin/darshan",
    icon: "🌸",
  },
  {
    title: "WhatsApp & Announcements",
    desc: "Update coordinator contact number and daily greeting banner.",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminOverview() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: "0 0 4px" }}>
        Dashboard Modules
      </h2>
      {modules.map((mod) => (
        <Link
          key={mod.href}
          href={mod.href}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#FFFFFF",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            padding: "16px",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
          }}
        >
          <span style={{ fontSize: "24px" }}>{mod.icon}</span>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937", margin: "0 0 2px" }}>
              {mod.title}
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              {mod.desc}
            </p>
          </div>
          <span style={{ color: "#9CA3AF", fontSize: "18px" }}>›</span>
        </Link>
      ))}
    </section>
  );
}