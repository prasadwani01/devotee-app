"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const DEFAULT_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || "1088";

export default function AdminLayout({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [checkingAuth, setCheckingAuth] = useState(true);

  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "🚩 Yatras", href: "/admin/yatras" },
    { label: "🎶 Bhajans", href: "/admin/bhajans" },
    { label: "🌸 Darshan", href: "/admin/darshan" },
    { label: "📋 Bookings", href: "/admin/bookings" },
    { label: "⚙️ Settings", href: "/admin/settings" },
  ];

  // Check if coordinator is already unlocked in this browser session
  useEffect(() => {
    const authStatus = sessionStorage.getItem("satsang_admin_auth");
    if (authStatus === "granted") {
      setIsAuthenticated(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleUnlock = (e) => {
    e.preventDefault();
    if (pinInput.trim() === DEFAULT_PIN) {
      sessionStorage.setItem("satsang_admin_auth", "granted");
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect Coordinator PIN. Please try again.");
      setPinInput("");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("satsang_admin_auth");
    setIsAuthenticated(false);
    setPinInput("");
  };

  // Brief spinner while verifying session state (prevents UI flicker)
  if (checkingAuth) {
    return (
      <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: "14px", color: "#B45309", fontWeight: "600" }}>Verifying security access...</p>
      </div>
    );
  }

  // 1. PIN Lock Screen (Shown if not unlocked)
  if (!isAuthenticated) {
    return (
      <main
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "20px 16px",
        }}
      >
        <div
          style={{
            maxWidth: "360px",
            width: "100%",
            backgroundColor: "#FFFFFF",
            borderRadius: "16px",
            padding: "28px 20px",
            boxShadow: "0 4px 18px rgba(180, 83, 9, 0.12)",
            border: "1.5px solid #FDE68A",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🔒</div>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#1F2937", margin: "0 0 6px" }}>
            Coordinator Portal
          </h2>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 20px" }}>
            Enter the authorized admin passkey to manage devotional content.
          </p>

          <form onSubmit={handleUnlock}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={8}
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                fontSize: "20px",
                textAlign: "center",
                letterSpacing: "6px",
                borderRadius: "10px",
                border: errorMsg ? "1.5px solid #DC2626" : "1.5px solid #D1D5DB",
                outline: "none",
                marginBottom: "12px",
              }}
              autoFocus
            />

            {errorMsg && (
              <p style={{ fontSize: "11px", color: "#DC2626", fontWeight: "600", margin: "0 0 12px" }}>
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#D97706",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(217, 119, 6, 0.3)",
              }}
            >
              Unlock Dashboard
            </button>
          </form>

          <div style={{ marginTop: "18px" }}>
            <Link
              href="/"
              style={{ fontSize: "12px", color: "#9CA3AF", textDecoration: "none" }}
            >
              ← Back to Devotee View
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2. Unlocked Admin Layout
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 80px" }}>
      {/* Header */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "14px",
        }}
      >
        <div>
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#D97706", textTransform: "uppercase" }}>
            Admin Portal
          </span>
          <h1 style={{ fontSize: "20px", fontWeight: "700", color: "#1F2937", margin: "2px 0 0" }}>
            Satsang Management
          </h1>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={handleLogout}
            style={{
              fontSize: "12px",
              color: "#DC2626",
              backgroundColor: "#FEE2E2",
              border: "none",
              padding: "6px 10px",
              borderRadius: "6px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            Lock
          </button>
          <Link
            href="/"
            style={{
              fontSize: "12px",
              color: "#6B7280",
              textDecoration: "none",
              backgroundColor: "#F3F4F6",
              padding: "6px 10px",
              borderRadius: "6px",
              fontWeight: "600",
            }}
          >
            Devotee View
          </Link>
        </div>
      </header>

      {/* Tabs */}
      <nav
        style={{
          display: "flex",
          gap: "6px",
          overflowX: "auto",
          marginBottom: "20px",
          paddingBottom: "4px",
        }}
      >
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