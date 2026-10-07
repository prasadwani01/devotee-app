"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "🚩 Yatras", href: "/admin/yatras" },
    { label: "🎶 Bhajans", href: "/admin/bhajans" },
    { label: "🌸 Darshan", href: "/admin/darshan" },
    { label: "⚙️ Settings", href: "/admin/settings" },
  ];

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 80px" }}>
      {/* Admin Header */}
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#D97706", textTransform: "uppercase" }}>
            Admin Portal
          </span>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937", margin: "2px 0 0" }}>
            Satsang Management
          </h1>
        </div>
        <Link
          href="/"
          style={{
            fontSize: "12px",
            color: "#6B7280",
            textDecoration: "none",
            backgroundColor: "#F3F4F6",
            padding: "6px 12px",
            borderRadius: "6px",
            fontWeight: "600",
          }}
        >
          Exit to App
        </Link>
      </header>

      {/* Persistent Horizontal Navigation Bar */}
      <nav style={{ display: "flex", gap: "6px", overflowX: "auto", marginBottom: "20px", paddingBottom: "4px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "8px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "600",
                textDecoration: "none",
                whiteSpace: "nowrap",
                backgroundColor: isActive ? "#D97706" : "#E5E7EB",
                color: isActive ? "#FFFFFF" : "#374151",
              }}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {children}
    </div>
  );
}