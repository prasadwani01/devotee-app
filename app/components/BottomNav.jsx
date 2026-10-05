"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Music, Image as ImageIcon } from "lucide-react";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Yatras", href: "/trips", icon: Compass },
  { label: "Bhajans", href: "/bhajans", icon: Music },
  { label: "Darshan", href: "/wallpapers", icon: ImageIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        borderTop: "1px solid #FDE68A",
        display: "flex",
        justifyContent: "space-around",
        alignItems: "center",
        padding: "8px 16px",
      }}
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textDecoration: "none",
              color: isActive ? "#D97706" : "#6B7280",
              fontWeight: isActive ? "600" : "400",
              fontSize: "11px",
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
            <span style={{ marginTop: "4px" }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}