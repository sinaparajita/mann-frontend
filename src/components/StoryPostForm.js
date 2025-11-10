import React, { useState } from "react";

export default function StoryPostForm({ user, onStoryPosted }) {
  const [storyText, setStoryText] = useState("");
  const [emotion, setEmotion] = useState("happy");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emotions = ["happy", "sad", "depressing", "traumatizing", "inspiring"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!storyText.trim()) {
      setError("Story cannot be empty.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // Replace below URL with your backend URL and API endpoint
      const response = await fetch("http://localhost:4000/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, storyText, emotion }),
      });

      if (!response.ok) {
        throw new Error("Failed to post story");
      }
      
      setStoryText("");
      onStoryPosted(); // callback to refresh stories list
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h3>Share Your Emotional Story</h3>
      <textarea
        placeholder="Write your story here..."
        value={storyText}
        onChange={(e) => setStoryText(e.target.value)}
        rows={6}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}
      />
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="emotion">Select Emotion: </label>
        <select id="emotion" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
          {emotions.map((em) => (
            <option key={em} value={em}>
              {em.charAt(0).toUpperCase() + em.slice(1)}
            </option>
          ))}
        </select>
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button type="submit" disabled={loading}>
        {loading ? "Posting..." : "Post Story"}
      </button>
    </form>
  );
}
