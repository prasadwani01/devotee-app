"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function HomePage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    // Check if the app is already running in standalone (installed) mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) {
      setShowInstallBanner(false);
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      // Prevent browser's automatic mini-infobar
      e.preventDefault();
      // Stash event so it can be triggered later
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // If installed during this session, hide banner
    window.addEventListener("appinstalled", () => {
      setShowInstallBanner(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To install on iOS Safari: tap the Share button below and select 'Add to Home Screen'.");
      return;
    }

    // Show native prompt
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowInstallBanner(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <main
      style={{
        padding: "16px 16px 40px",
        maxWidth: "480px",
        margin: "0 auto",
      }}
    >
      {/* Dynamic PWA Install Banner */}
      {showInstallBanner && (
        <aside
          aria-label="Install App"
          style={{
            backgroundColor: "#FFFBEB",
            border: "1.5px solid #F59E0B",
            borderRadius: "14px",
            padding: "14px 16px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1, marginRight: "8px" }}>
            <span style={{ fontSize: "24px" }}>📱</span>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: 0 }}>
                Install Devotee App
              </h2>
              <p style={{ fontSize: "11px", color: "#B45309", margin: "2px 0 0" }}>
                Fast 1-tap access on your phone screen
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              onClick={handleInstallClick}
              style={{
                backgroundColor: "#D97706",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                padding: "8px 12px",
                fontSize: "12px",
                fontWeight: "700",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              Install
            </button>
            <button
              onClick={() => setShowInstallBanner(false)}
              aria-label="Dismiss banner"
              style={{
                background: "none",
                border: "none",
                color: "#9CA3AF",
                fontSize: "14px",
                cursor: "pointer",
                padding: "4px",
              }}
            >
              ✕
            </button>
          </div>
        </aside>
      )}

      {/* Header Banner */}
      <header
        style={{
          background: "linear-gradient(135deg, #F59E0B, #D97706)",
          padding: "20px",
          borderRadius: "16px",
          color: "#FFFFFF",
          boxShadow: "0 4px 12px rgba(217, 119, 6, 0.2)",
          marginBottom: "20px",
        }}
      >
        <span style={{ fontSize: "28px" }}>🪔</span>
        <h1 style={{ fontSize: "20px", fontWeight: "700", margin: "8px 0 4px" }}>
          Jai Shri Krishna
        </h1>
        <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>
          Welcome to your daily spiritual satsang &amp; yatra companion.
        </p>
      </header>

      {/* Quick Action Cards */}
      <section style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Card 1: Featured Yatra */}
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            padding: "16px",
            border: "1px solid #FDE68A",
            boxShadow: "0 2px 6px rgba(0,0,0,0.04)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#D97706", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Upcoming Yatra
            </span>
            <span style={{ fontSize: "11px", backgroundColor: "#FEF3C7", color: "#B45309", padding: "2px 8px", borderRadius: "10px", fontWeight: "600" }}>
              Booking Open
            </span>
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: "600", margin: "10px 0 6px", color: "#1F2937" }}>
            Char Dham Yatra 2026
          </h2>
          <p style={{ fontSize: "13px", color: "#4B5563", margin: "0 0 14px", lineHeight: "1.4" }}>
            12 Days divine pilgrimage covering Yamunotri, Gangotri, Kedarnath &amp; Badrinath.
          </p>
          <Link
            href="/trips"
            style={{
              display: "block",
              textAlign: "center",
              backgroundColor: "#D97706",
              color: "#FFFFFF",
              padding: "10px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "600",
            }}
          >
            View Details &amp; Register
          </Link>
        </div>

        {/* Card 2: Today's Darshan & Wallpapers */}
        <Link
          href="/wallpapers"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            padding: "16px",
            border: "1px solid #E5E7EB",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#FFFBEB",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
            }}
          >
            🌸
          </div>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 2px", color: "#1F2937" }}>
              Daily Darshan &amp; Wallpapers
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              Download HD wallpapers for mobile screens
            </p>
          </div>
        </Link>

        {/* Card 3: Bhajans & Kirtan */}
        <Link
          href="/bhajans"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            backgroundColor: "#FFFFFF",
            borderRadius: "14px",
            padding: "16px",
            border: "1px solid #E5E7EB",
            textDecoration: "none",
            color: "inherit",
            boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#ECFDF5",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
            }}
          >
            🎶
          </div>
          <div>
            <h3 style={{ fontSize: "15px", fontWeight: "600", margin: "0 0 2px", color: "#1F2937" }}>
              Bhajans &amp; Kirtans
            </h3>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              Listen to devotional tracks and chants
            </p>
          </div>
        </Link>
      </section>
    </main>
  );
}