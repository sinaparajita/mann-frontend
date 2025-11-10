import React, { useEffect, useState } from "react";

const recommendationsMap = {
  HAPPY: [
    "Go for a walk outside 😊",
    "Listen to your favorite upbeat song 🎵",
    "Call a friend and share the good vibes 📞"
  ],
  SAD: [
    "Try some deep breathing exercises 🧘‍♂️",
    "Watch a funny video to lighten your mood 😂",
    "Write down what’s bothering you 📝"
  ],
  ANGRY: [
    "Try calming techniques like meditation 🌿",
    "Listen to relaxing music 🎶",
    "Take a break and practice deep breaths"
  ],
  EXCITED: [
    "Dance to your favorite tunes 💃",
    "Plan something fun with friends 🎉",
    "Try something adventurous"
  ],
  CALM: [
    "Enjoy some quiet reading 📚",
    "Take a peaceful walk in nature 🌳",
    "Practice mindfulness meditation"
  ],
  UNKNOWN: [
    "Take a moment to reflect 🤔",
    "Try a new hobby 🎨",
    "Read an inspiring book 📚"
  ],
  NO_NOTE: [
    "Write down how you're feeling 📝",
    "Talk to a friend or loved one ❤️",
    "Try some meditation 🌿"
  ],
  ERROR: [
    "Hmm, something's not right. Try again later ⚠️"
  ]
};

export default function MoodRecommendations({ mood }) {
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (!mood) {
      setRecommendations(recommendationsMap.UNKNOWN);
      return;
    }
    const upperMood = mood.toUpperCase();
    setRecommendations(recommendationsMap[upperMood] || recommendationsMap.UNKNOWN);
  }, [mood]);

  return (
    <div style={{ maxWidth: 600, margin: "20px auto", padding: 20, borderRadius: 8, border: "1px solid #ddd" }}>
      <h3>Recommended Activities</h3>
      {recommendations.length === 0 ? (
        <p>Loading recommendations...</p>
      ) : (
        <ul>
          {recommendations.map((rec, idx) => (
            <li key={idx} style={{ marginBottom: 10 }}>{rec}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
