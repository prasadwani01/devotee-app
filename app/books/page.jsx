"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [readerTheme, setReaderTheme] = useState("sepia"); // "sepia" | "light" | "dark"
  const [filterCat, setFilterCat] = useState("all");

  useEffect(() => {
    async function loadBooks() {
      setLoading(true);
      const { data, error } = await supabase
        .from("books")
        .select("*")
        .order("id", { ascending: false });

      if (!error && data) setBooks(data);
      setLoading(false);
    }
    loadBooks();
  }, []);

  const categories = ["all", ...Array.from(new Set(books.map((b) => b.category).filter(Boolean)))];

  const filteredBooks =
    filterCat === "all" ? books : books.filter((b) => b.category === filterCat);

  // Reading Theme styles
  const themeStyles = {
    sepia: { bg: "#FEF9C3", text: "#451A03", bar: "#FDE68A" },
    light: { bg: "#FFFFFF", text: "#1F2937", bar: "#F3F4F6" },
    dark: { bg: "#1F2937", text: "#F9FAFB", bar: "#111827" },
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "16px 16px 90px" }}>
      {/* Top Header */}
      <header style={{ marginBottom: "16px" }}>
        <span style={{ fontSize: "11px", fontWeight: "700", color: "#D97706", textTransform: "uppercase" }}>
          धार्मिक ग्रंथालय • Sacred Scriptures
        </span>
        <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#1F2937", margin: "4px 0 0" }}>
          Devotional Books & Granth
        </h1>
      </header>

      {/* Category Pills */}
      {categories.length > 1 && (
        <div style={{ display: "flex", gap: "8px", overflowX: "auto", marginBottom: "18px", paddingBottom: "4px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                border: "none",
                borderRadius: "20px",
                padding: "6px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                whiteSpace: "nowrap",
                backgroundColor: filterCat === cat ? "#D97706" : "#F3F4F6",
                color: filterCat === cat ? "#FFFFFF" : "#4B5563",
              }}
            >
              {cat === "all" ? "All Scriptures" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Book List Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#6B7280", fontSize: "13px" }}>
          Opening sacred library...
        </div>
      ) : filteredBooks.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#9CA3AF", fontSize: "13px" }}>
          No scriptures available yet.
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "12px" }}>
          {filteredBooks.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                padding: "12px",
                border: "1px solid #E5E7EB",
                boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                display: "flex",
                gap: "12px",
                alignItems: "center",
              }}
            >
              {/* Thumbnail / Book Icon */}
              {item.cover_url ? (
                <img
                  src={item.cover_url}
                  alt={item.title}
                  style={{ width: "60px", height: "80px", borderRadius: "8px", objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "80px",
                    borderRadius: "8px",
                    backgroundColor: "#FEF3C7",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "28px",
                    flexShrink: 0,
                  }}
                >
                  📖
                </div>
              )}

              <div style={{ flex: 1, minWidth: 0 }}>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: "700",
                    color: "#B45309",
                    backgroundColor: "#FEF3C7",
                    padding: "2px 6px",
                    borderRadius: "4px",
                  }}
                >
                  {item.category || "Granth"} • {item.language || "Hindi"}
                </span>
                <h3
                  style={{
                    fontSize: "15px",
                    fontWeight: "700",
                    color: "#1F2937",
                    margin: "4px 0 2px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </h3>
                <p style={{ fontSize: "12px", color: "#6B7280", margin: "0 0 8px" }}>
                  {item.author || "Sanatan Parampara"}
                </p>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {item.content && (
                    <button
                      onClick={() => setSelectedBook(item)}
                      style={{
                        backgroundColor: "#D97706",
                        color: "#FFFFFF",
                        border: "none",
                        borderRadius: "6px",
                        padding: "5px 12px",
                        fontSize: "12px",
                        fontWeight: "600",
                        cursor: "pointer",
                      }}
                    >
                      📖 Read Online
                    </button>
                  )}

                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        backgroundColor: "#F3F4F6",
                        color: "#374151",
                        borderRadius: "6px",
                        padding: "5px 10px",
                        fontSize: "12px",
                        fontWeight: "600",
                        textDecoration: "none",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      📥 PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* In-App Mobile Reader Modal */}
      {selectedBook && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: themeStyles[readerTheme].bg,
            color: themeStyles[readerTheme].text,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Reader Top Controls */}
          <div
            style={{
              padding: "10px 16px",
              backgroundColor: themeStyles[readerTheme].bar,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid rgba(0,0,0,0.08)",
            }}
          >
            <button
              onClick={() => setSelectedBook(null)}
              style={{
                background: "none",
                border: "none",
                fontSize: "14px",
                fontWeight: "700",
                color: themeStyles[readerTheme].text,
                cursor: "pointer",
              }}
            >
              ✕ Close
            </button>

            {/* Font Size & Theme Selectors */}
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setFontSize((s) => Math.max(12, s - 2))}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #D1D5DB", cursor: "pointer" }}
              >
                A-
              </button>
              <button
                onClick={() => setFontSize((s) => Math.min(26, s + 2))}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #D1D5DB", cursor: "pointer" }}
              >
                A+
              </button>

              <button
                onClick={() => setReaderTheme(readerTheme === "sepia" ? "dark" : readerTheme === "dark" ? "light" : "sepia")}
                style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #D1D5DB", cursor: "pointer", fontSize: "12px" }}
              >
                🎨 Theme
              </button>
            </div>
          </div>

          {/* Reader Content Body */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 20px 80px",
              maxWidth: "680px",
              margin: "0 auto",
              width: "100%",
              boxSizing: "border-box",
            }}
          >
            <h2 style={{ fontSize: `${fontSize + 6}px`, textAlign: "center", margin: "0 0 8px" }}>
              {selectedBook.title}
            </h2>
            <div style={{ textAlign: "center", fontSize: "12px", opacity: 0.8, marginBottom: "24px" }}>
              {selectedBook.author} • {selectedBook.language}
            </div>

            <div
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: "1.8",
                whiteSpace: "pre-wrap",
                fontFamily: "serif, system-ui",
              }}
            >
              {selectedBook.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}