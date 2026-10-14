"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function AdminBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    language: "Hindi",
    category: "Granth",
    cover_url: "",
    pdf_url: "",
    content: "",
  });

  const showToast = (msg) => {
    setNotice(msg);
    setTimeout(() => setNotice(""), 3500);
  };

  const fetchBooks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("id", { ascending: false });

    if (!error && data) setBooks(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddBook = async () => {
    if (!newBook.title.trim()) {
      alert("Book Title is required");
      return;
    }
    if (!newBook.content.trim() && !newBook.pdf_url.trim()) {
      alert("Please provide either Online Reading Text or a PDF URL");
      return;
    }

    const payload = {
      title: newBook.title.trim(),
      author: newBook.author.trim() || "Sanatan Parampara",
      language: newBook.language.trim() || "Hindi",
      category: newBook.category.trim() || "Granth",
      cover_url: newBook.cover_url.trim() || null,
      pdf_url: newBook.pdf_url.trim() || null,
      content: newBook.content.trim() || null,
    };

    const { data, error } = await supabase.from("books").insert([payload]).select();

    if (error) {
      alert("Failed to add book: " + error.message);
    } else {
      setBooks([data[0], ...books]);
      setNewBook({
        title: "",
        author: "",
        language: "Hindi",
        category: "Granth",
        cover_url: "",
        pdf_url: "",
        content: "",
      });
      showToast("Book added successfully!");
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    const { error } = await supabase.from("books").delete().eq("id", id);
    if (!error) {
      setBooks(books.filter((b) => String(b.id) !== String(id)));
      showToast(`Deleted "${title}"`);
    } else {
      alert("Delete failed: " + error.message);
    }
  };

  return (
    <section style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {notice && (
        <div style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981", color: "#065F46", padding: "10px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", textAlign: "center" }}>
          ✓ {notice}
        </div>
      )}

      {/* Add Scripture Box */}
      <div style={{ backgroundColor: "#FFFBEB", border: "1.5px dashed #F59E0B", borderRadius: "14px", padding: "16px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#92400E", margin: "0 0 10px" }}>
          + Add Scripture / Granth / Chalisa
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Book Title (e.g. Shrimad Bhagavad Gita, Hanuman Chalisa)"
            value={newBook.title}
            onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <input
              type="text"
              placeholder="Author / Parampara (e.g. Maharishi Vyas)"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
            <input
              type="text"
              placeholder="Language (e.g. Sanskrit, Hindi, Marathi)"
              value={newBook.language}
              onChange={(e) => setNewBook({ ...newBook, language: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <input
              type="text"
              placeholder="Category (Granth, Chalisa, Stotram, Katha)"
              value={newBook.category}
              onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
            <input
              type="url"
              placeholder="Cover Image URL (Optional)"
              value={newBook.cover_url}
              onChange={(e) => setNewBook({ ...newBook, cover_url: e.target.value })}
              style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
            />
          </div>

          <input
            type="url"
            placeholder="Direct PDF URL (Optional, for downloading whole granth)"
            value={newBook.pdf_url}
            onChange={(e) => setNewBook({ ...newBook, pdf_url: e.target.value })}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px" }}
          />

          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#6B7280", display: "block", marginBottom: "4px" }}>
              In-App Reading Text / Shlokas (Optional if PDF provided):
            </label>
            <textarea
              rows={6}
              placeholder="Paste shlokas, chaupai, or chapter text here for devotees to read directly on screen..."
              value={newBook.content}
              onChange={(e) => setNewBook({ ...newBook, content: e.target.value })}
              style={{ width: "100%", boxSizing: "border-box", padding: "8px", borderRadius: "6px", border: "1px solid #D1D5DB", fontSize: "13px", fontFamily: "monospace" }}
            />
          </div>

          <button
            onClick={handleAddBook}
            style={{
              backgroundColor: "#D97706",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "6px",
              padding: "10px",
              fontWeight: "700",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Publish Book to Library
          </button>
        </div>
      </div>

      {/* Book Catalog List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: "700", color: "#374151", margin: 0 }}>
          Published Books {loading ? "(Loading...)" : `(${books.length})`}
        </h2>

        {books.map((b) => (
          <div
            key={b.id}
            style={{
              backgroundColor: "#FFFFFF",
              border: "1px solid #E5E7EB",
              borderRadius: "10px",
              padding: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ fontSize: "14px", color: "#1F2937", display: "block" }}>{b.title}</strong>
              <span style={{ fontSize: "12px", color: "#6B7280" }}>
                {b.category} • {b.language} {b.pdf_url ? "• [PDF Available]" : ""} {b.content ? "• [Text Available]" : ""}
              </span>
            </div>
            <button
              onClick={() => handleDelete(b.id, b.title)}
              style={{ background: "none", border: "none", color: "#DC2626", fontSize: "12px", cursor: "pointer", fontWeight: "600" }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}