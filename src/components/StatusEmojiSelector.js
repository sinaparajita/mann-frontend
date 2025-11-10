import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

const emojiOptions = ["😊", "😔", "😠", "🤩", "😌", "🤔", "❤️", "🚀", "🌟"];

export default function StatusEmojiSelector({ userId }) {
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const userDocRef = doc(db, "users", userId);

  useEffect(() => {
    const fetchStatusEmoji = async () => {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        setSelectedEmoji(docSnap.data().statusEmoji || null);
      }
    };
    fetchStatusEmoji();
  }, [userDocRef]);

  const updateStatusEmoji = async (emoji) => {
    setSelectedEmoji(emoji);
    try {
      await updateDoc(userDocRef, {
        statusEmoji: emoji,
      });
    } catch (error) {
      console.error("Error updating status emoji:", error);
    }
  };

  return (
    <div>
      <h4>Set Your Status Emoji</h4>
      <div>
        {emojiOptions.map((emoji) => (
          <button
            key={emoji}
            style={{
              fontSize: 24,
              margin: 5,
              padding: 8,
              borderRadius: "50%",
              border: selectedEmoji === emoji ? "3px solid #007bff" : "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: selectedEmoji === emoji ? "#e6f0ff" : "white",
            }}
            onClick={() => updateStatusEmoji(emoji)}
            aria-label={`Select status ${emoji}`}
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
}
