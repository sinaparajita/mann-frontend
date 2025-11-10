import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";

const sentimentEmoji = {
  POSITIVE: "😊",
  NEGATIVE: "😔",
  UNKNOWN: "🤔",
  NO_NOTE: "📝",
  ERROR: "⚠️"
};

const sentimentColor = {
  POSITIVE: "green",
  NEGATIVE: "red",
  UNKNOWN: "gray",
  NO_NOTE: "blue",
  ERROR: "orange"
};

export default function MoodHistory({ setSelectedMood }) {
  const [moodHistory, setMoodHistory] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "moods"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let moods = [];
      querySnapshot.forEach((doc) => {
        moods.push({ id: doc.id, ...doc.data() });
      });
      setMoodHistory(moods);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, borderRadius: 8, border: "1px solid #ddd" }}>
      <h3>Your Mood History</h3>
      {moodHistory.length === 0 && <p>No mood entries found.</p>}
      {moodHistory.map(({ id, mood, note, sentiment, createdAt }) => (
        <div
          key={id}
          onClick={() => setSelectedMood && setSelectedMood(mood)}
          style={{ marginBottom: 16, padding: 12, borderRadius: 6, border: "1px solid #ccc", backgroundColor: "#f9f9f9", cursor: "pointer" }}
          title="Click to select this mood"
        >
          <div style={{ fontWeight: "bold", fontSize: 18, color: sentimentColor[sentiment] || "black" }}>
            {sentimentEmoji[sentiment] || "❓"} {mood}
          </div>
          <div>{note || <i>No notes</i>}</div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            {createdAt?.toDate ? createdAt.toDate().toLocaleString() : ""}
          </div>
        </div>
      ))}
    </div>
  );
}
