import React, { useEffect, useState } from "react";

export default function StoryList() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStories() {
      try {
       const res = await fetch("https://mann-backend.onrender.com/api/stories");

        if (!res.ok) throw new Error(`Error fetching stories: ${res.status}`);
        const data = await res.json();
        setStories(data.stories);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, []);

  if (loading) return <p>Loading stories...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!stories.length) return <p>No stories posted yet.</p>;

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 10 }}>
      <h3>All Posted Stories</h3>
      <ul>
        {stories.map(({ id, user, storyText, emotion, timestamp }) => (
          <li key={id} style={{ marginBottom: 12, borderBottom: "1px solid #ccc", paddingBottom: 10 }}>
            <p><b>User:</b> {user}</p>
            <p><b>Emotion:</b> {emotion}</p>
            <p>{storyText}</p>
            <small>{new Date(timestamp).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
