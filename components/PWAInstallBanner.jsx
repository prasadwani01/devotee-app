"use client";

import { useState, useEffect } from "react";

export default function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 1. Check if already installed & running in standalone mode
    const isStandalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // 2. Check if user dismissed the banner recently
    const isDismissed = sessionStorage.getItem("pwa_banner_dismissed");
    if (isDismissed) return;

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isAppleDevice = /iphone|ipad|ipod/.test(userAgent);
    const isSafari =
      /safari/.test(userAgent) &&
      !/chrome|crios|crmo|firefox|fxios/.test(userAgent);

    if (isAppleDevice && isSafari) {
      setIsIOS(true);
      setShowBanner(true);
      return;
    }

    // 4. Android / Chromium native install prompt handler
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    if (choiceResult.outcome === "accepted") {
      setShowBanner(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    sessionStorage.setItem("pwa_banner_dismissed", "true");
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <aside
      aria-label="Install Satsang App"
      style={{
        position: "fixed",
        bottom: "74px", // Placed right above the bottom tab navigation bar
        left: "12px",
        right: "12px",
        maxWidth: "456px",
        margin: "0 auto",
        backgroundColor: "#92400E",
        color: "#FFFFFF",
        borderRadius: "14px",
        padding: "12px 14px",
        boxShadow: "0 8px 24px rgba(146, 64, 14, 0.35)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "10px",
        border: "1px solid #F59E0B",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <span style={{ fontSize: "24px", flexShrink: 0 }}>🪔</span>
        <div style={{ minWidth: 0 }}>
          <strong style={{ fontSize: "13px", display: "block", lineHeight: "1.2" }}>
            Install Satsang App
          </strong>
          <span style={{ fontSize: "11px", opacity: 0.9, display: "block", marginTop: "2px" }}>
            {isIOS
              ? "Tap Share ⎋ then 'Add to Home Screen'"
              : "1-Tap access for daily Darshan & Bhajans"}
          </span>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
        {!isIOS && deferredPrompt && (
          <button
            onClick={handleInstallClick}
            style={{
              backgroundColor: "#F59E0B",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "8px",
              padding: "7px 12px",
              fontSize: "12px",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            Install
          </button>
        )}
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          style={{
            background: "none",
            border: "none",
            color: "#FFFFFF",
            opacity: 0.75,
            fontSize: "16px",
            cursor: "pointer",
            padding: "4px",
            lineHeight: 1,
          }}
        >
          ✕
        </button>
      </div>
    </aside>
  );
}