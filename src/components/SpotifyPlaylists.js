import React, { useState, useEffect } from "react";

export default function SpotifyPlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    fetch("http://localhost:4000/spotify-token")
      .then((res) => res.json())
      .then((data) => setToken(data.access_token))
      .catch(() => setError("Failed to fetch Spotify token"));
  }, []);

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    const query = encodeURIComponent("happy");

    fetch(`https://api.spotify.com/v1/search?q=${query}&type=playlist&limit=5`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Spotify API error: ${res.status}`);
        return res.json();
      })
      .then((data) => setPlaylists(data.playlists.items || []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [token]);

  if (error) return <p>{error}</p>;
  if (loading) return <p>Loading playlists...</p>;
  if (!playlists.length) return <p>No playlists found.</p>;

  return (
    <div>
      <h3>Spotify Playlists for "happy" mood</h3>
      <ul>
        {playlists
        .filter(p => p && p.external_urls && p.external_urls.spotify)
        .map(p => (
      <li key={p.id}>
      <a href={p.external_urls.spotify} target="_blank" rel="noopener noreferrer">
        {p.name}
      </a>
    </li>
  ))}
      </ul>
    </div>
  );
}
