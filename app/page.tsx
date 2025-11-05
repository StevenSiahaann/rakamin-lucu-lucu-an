"use client";

import { useState, useEffect } from "react";

interface Note {
  _id: string;
  text: string;
  createdAt: string;
}

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/notes");
      const result = await res.json();

      if (result.success) {
        setNotes(result.data);
      } else {
        setError(result.error || "Failed to fetch notes");
      }
    } catch (err) {
      setError("An error occurred while fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim() === "") return;

    try {
      const res = await fetch("/api/notes", {
        // Memanggil API route
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: newNote }),
      });

      const result = await res.json();

      if (result.success) {
        setNotes([result.data, ...notes]);
        setNewNote("");
      } else {
        setError(result.error || "Failed to add note");
      }
    } catch (err) {
      setError("An error occurred while submitting data");
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start bg-gray-50 p-8 md:p-24">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Buku Tamu (App Router)
        </h1>

        {/* Form untuk CREATE Data */}
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white rounded-lg shadow-md"
        >
          <label
            htmlFor="note"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Tinggalkan Pesan:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="note"
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Tulis pesan Anda di sini..."
              className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm text-gray-900"
            />
            <button
              type="submit"
              className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Kirim
            </button>
          </div>
        </form>

        {/* Menampilkan Error */}
        {error && (
          <div className="my-4 rounded-md bg-red-50 p-4">
            <p className="text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-700">Pesan:</h2>

          {loading ? (
            <p className="text-gray-500">Memuat pesan...</p>
          ) : notes.length === 0 ? (
            <p className="text-gray-500">Belum ada pesan.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {notes.map((note) => (
                <li
                  key={note._id}
                  className="py-4 px-2 bg-white shadow-sm my-2 rounded-md"
                >
                  <p className="text-gray-800">{note.text}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(note.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
