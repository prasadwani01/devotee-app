"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [hasCheckedAuth, setHasCheckedAuth] = useState(false);

  // Check session storage on mount so admin doesn't re-enter PIN on every tab click
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem("admin_authenticated");
    if (sessionAuth === "true") {
      setIsAuthenticated(true);
    }
    setHasCheckedAuth(true);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (pinInput.trim() === "1008") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin_authenticated", "true");
    } else {
      alert("Invalid PIN. Please enter 1008.");
      setPinInput("");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("admin_authenticated");
  };

  const navItems = [
    { label: "Overview", href: "/admin" },
    { label: "🚩 Yatras", href: "/admin/yatras" },
    { label: "🎶 Bhajans", href: "/admin/bhajans" },
    { label: "🌸 Darshan", href: "/admin/darshan" },
    { label: "⚙️ Settings", href: "/admin/settings" },
  ];

  // Prevent flash while checking session storage
  if (!hasCheckedAuth) {
    return (
      <div style={{ maxWidth: "480px", margin: "40px auto", textAlign: "center", color: "#6B7280" }}>
        Loading dashboard...
      </div>
    );
  }

  // --- Lock Screen ---
  if (!isAuthenticated) {
    return (
      <main style={{ padding: "40px 16px", maxWidth: "400px", margin: "0 auto", textAlign: "center" }}>
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "24px",
            borderRadius: "16px",
            border: "1px solid #FDE68A",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          }}
        >
          <span style={{ fontSize: "36px" }}>🔐</span>
          <h1 style={{ fontSize: "18px", fontWeight: "700", color: "#B45309", margin: "12px 0 6px" }}>
            Satsang Committee Admin
          </h1>
          <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 20px" }}>
            Enter your 4-digit security PIN to access management tools.
          </p>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              placeholder="Enter PIN (Default: 1008)"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px",
                fontSize: "18px",
                textAlign: "center",
                letterSpacing: "4px",
                borderRadius: "8px",
                border: "1px solid #D1D5DB",
                marginBottom: "16px",
              }}
              required
            />
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#D97706",
                color: "#FFFFFF",
                border: "none",
                borderRadius: "8px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Unlock Dashboard
            </button>
          </form>
          <div style={{ marginTop: "16px" }}>
            <Link href="/" style={{ fontSize: "12px", color: "#6B7280", textDecoration: "none" }}>
              ← Return to Devotee App
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- Authenticated Layout ---
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 80px" }}>
      {/* Top Header */}
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
        <div style={{ display: "flex", gap: "8px" }}>
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
              display: "flex",
              alignItems: "center",
            }}
          >
            Devotee View
          </Link>
        </div>
      </header>

      {/* Navigation Sub-Tabs */}
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