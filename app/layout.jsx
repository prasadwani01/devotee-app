"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AudioPlayerProvider } from "../context/AudioPlayerContext";
import FloatingBottomPlayer from "./components/FloatingBottomPlayer";
import PWAInstallBanner from "@/components/PWAInstallBanner";

// Pure SVG icons - zero external libraries needed
function HomeIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  );
}

function MusicIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  );
}

const navItems = [
  { label: "Home", href: "/", icon: HomeIcon },
  { label: "Yatras", href: "/trips", icon: CompassIcon },
  { label: "Bhajans", href: "/bhajans", icon: MusicIcon },
  { label: "Darshan", href: "/wallpapers", icon: ImageIcon },
];

function BottomNav() {
  const pathname = usePathname();

  // Hide public bottom bar when admin portal is active
  if (pathname?.startsWith("/admin")) return null;

  return (
    <nav
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        height: "64px",
        boxSizing: "border-box",
        zIndex: 50,
        backgroundColor: "#FFFFFF",
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
              fontSize: "12px",
            }}
          >
            <Icon />
            <span style={{ marginTop: "4px" }}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function RootLayout({ children }) {
  // Register Service Worker for offline PWA & audio caching
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("Satsang SW registered:", reg.scope))
        .catch((err) => console.warn("SW registration error:", err));
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <title>Devotee Satsang &amp; Yatra</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
        />
        <meta name="theme-color" content="#D97706" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          paddingBottom: "160px",
          backgroundColor: "#FFFDF7",
          fontFamily: "system-ui, -apple-system, sans-serif",
          WebkitFontSmoothing: "antialiased",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <AudioPlayerProvider>
          {children}

          {/* Floating PWA Install Banner */}
          <PWAInstallBanner />

          {/* Mini Audio Player attached above bottom dock */}
          <FloatingBottomPlayer />

          {/* Primary Mobile Navigation Dock */}
          <BottomNav />
        </AudioPlayerProvider>
      </body>
    </html>
  );
}