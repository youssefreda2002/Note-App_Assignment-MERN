import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

type Note = { _id: string; title: string; content: string; createdAt: string };

export default function Dashboard() {
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(
    null
  );
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const resp = await api.get("/auth/me");
        setUser(resp.data.user);
      } catch {
        localStorage.removeItem("token");
        navigate("/auth");
      }
    })();
    fetchNotes();
  }, []);

  async function fetchNotes() {
    try {
      const resp = await api.get("/notes");
      setNotes(resp.data.notes);
    } catch {
      setError("Could not fetch notes");
    }
  }

  async function createNote(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const resp = await api.post("/notes", { title, content });
      setNotes((s) => [resp.data.note, ...s]);
      setTitle("");
      setContent("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Create failed");
    }
  }

  async function deleteNote(id: string) {
    try {
      await api.delete(`/notes/${id}`);
      setNotes((s) => s.filter((n) => n._id !== id));
    } catch {
      setError("Delete failed");
    }
  }

  async function saveEdit(id: string) {
    try {
      const resp = await api.put(`/notes/${id}`, {
        title: editTitle,
        content: editContent,
      });
      setNotes((s) => s.map((n) => (n._id === id ? resp.data.note : n)));
      setEditingId(null);
    } catch {
      setError("Update failed");
    }
  }

  function startEdit(note: Note) {
    setEditingId(note._id);
    setEditTitle(note.title);
    setEditContent(note.content);
  }

  function logout() {
    localStorage.removeItem("token");
    navigate("/auth");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800">
              Welcome, {user?.name || user?.email}
            </h1>
            <div className="text-sm text-gray-500">{user?.email}</div>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow transition"
          >
            Logout
          </button>
        </div>

        {/* Create Note */}
        <form
          onSubmit={createNote}
          className="bg-white/70 backdrop-blur-md p-6 rounded-2xl shadow-lg mb-10"
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            Create a Note
          </h2>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note..."
            className="w-full border rounded-lg px-3 py-2 mb-3 focus:ring-2 focus:ring-purple-400 outline-none"
          />
          <div className="flex gap-3">
            <button className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow hover:opacity-90 transition">
              Add Note
            </button>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setContent("");
              }}
              className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              Clear
            </button>
          </div>
        </form>

        {error && <div className="text-red-600 font-medium mb-4">{error}</div>}

        {/* Notes Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {notes.map((note) => (
            <div
              key={note._id}
              className="bg-white/80 backdrop-blur-md p-5 rounded-2xl shadow-lg transition hover:shadow-xl"
            >
              {editingId === note._id ? (
                <div>
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border rounded px-2 py-1 mb-2"
                  />
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full border rounded px-2 py-1 mb-2"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveEdit(note._id)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1 border rounded hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {note.title}
                      </h3>
                      <p className="text-gray-600 text-sm">{note.content}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-gray-400">
                        {new Date(note.createdAt).toLocaleString()}
                      </div>
                      <div className="flex gap-2 justify-end mt-2">
                        <button
                          className="text-blue-600 text-sm hover:underline"
                          onClick={() => startEdit(note)}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 text-sm hover:underline"
                          onClick={() => deleteNote(note._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {notes.length === 0 && (
            <div className="col-span-full text-gray-600 text-center text-lg">
              No notes yet — add one!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
