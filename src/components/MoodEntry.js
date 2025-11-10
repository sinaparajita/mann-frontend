import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const moodOptions = [
  { label: "Happy", emoji: "😊", value: "HAPPY" },
  { label: "Sad", emoji: "😔", value: "SAD" },
  { label: "Angry", emoji: "😠", value: "ANGRY" },
  { label: "Excited", emoji: "🤩", value: "EXCITED" },
  { label: "Calm", emoji: "😌", value: "CALM" },
];

export default function MoodEntry({ selectedMood, setSelectedMood }) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood) {
      setMsg("Please select a mood");
      return;
    }
    setLoading(true);
    setMsg(null);

    try {
      await addDoc(collection(db, "moods"), {
        mood: selectedMood,
        note: note.trim() || "",
        createdAt: serverTimestamp(),
      });
      setMsg("Mood logged successfully!");
      setSelectedMood(null);
      setNote("");
    } catch (error) {
      setMsg("Error logging mood. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h3>Log Your Mood</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          {moodOptions.map(({ label, emoji, value }) => (
            <button
              key={value}
              type="button"
              onClick={() => setSelectedMood(value)}
              style={{
                fontSize: 24,
                marginRight: 10,
                padding: 10,
                borderRadius: "50%",
                border: selectedMood === value ? "3px solid #007bff" : "1px solid #ccc",
                cursor: "pointer",
                backgroundColor: selectedMood === value ? "#e6f0ff" : "white",
              }}
              aria-label={label}
            >
              {emoji}
            </button>
          ))}
        </div>

        <textarea
          rows={4}
          placeholder="Add a note (optional)"
          style={{ width: "100%", padding: 8, borderRadius: 4, border: "1px solid #ccc", marginBottom: 12 }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <button type="submit" disabled={loading} style={{ padding: "8px 16px", cursor: "pointer" }}>
          {loading ? "Saving..." : "Save Mood"}
        </button>
      </form>
      {msg && <p style={{ marginTop: 16 }}>{msg}</p>}
    </div>
  );
}
