import Link from "next/link";

const modules = [
  {
    title: "Yatra Tours & Prices",
    desc: "Update pilgrimage dates, fares, and toggle 'Housefull' or 'Booking Open' badges.",
    href: "/admin/yatras",
    icon: "🚩",
    badge: "Active Trips",
  },
  {
    title: "Bhajans & Kirtans",
    desc: "Add or delete devotional audio tracks, aartis, singer details, and durations.",
    href: "/admin/bhajans",
    icon: "🎶",
    badge: "Audio Playlist",
  },
  {
    title: "Daily Darshan Wallpapers",
    desc: "Publish and remove high-definition deity darshan wallpapers for devotees to download.",
    href: "/admin/darshan",
    icon: "🌸",
    badge: "Media Gallery",
  },
  {
    title: "WhatsApp & Announcements",
    desc: "Update the satsang coordinator phone number and the home screen spiritual greeting banner.",
    href: "/admin/settings",
    icon: "⚙️",
    badge: "General Config",
  },
];

export default function AdminOverviewPage() {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
      <div>
        <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#1F2937", margin: "0 0 2px" }}>
          Welcome, Satsang Committee Member
        </h2>
        <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
          Select a category below to update content live for all devotees.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "6px" }}>
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
              borderRadius: "14px",
              padding: "16px",
              textDecoration: "none",
              color: "inherit",
              boxShadow: "0 2px 4px rgba(0,0,0,0.03)",
              transition: "transform 0.1s ease",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                backgroundColor: "#FFFBEB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
                flexShrink: 0,
              }}
            >
              {mod.icon}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#1F2937", margin: 0 }}>
                  {mod.title}
                </h3>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "600",
                    backgroundColor: "#FEF3C7",
                    color: "#92400E",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {mod.badge}
                </span>
              </div>
              <p style={{ fontSize: "12px", color: "#6B7280", margin: 0, lineHeight: "1.4" }}>
                {mod.desc}
              </p>
            </div>

            <span style={{ color: "#9CA3AF", fontSize: "20px", fontWeight: "300" }}>›</span>
          </Link>
        ))}
      </div>
    </section>
  );
}