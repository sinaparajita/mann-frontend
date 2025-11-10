import React, { useState } from "react";

export default function DummyAuth({ onLogin }) {
  const [username, setUsername] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      onLogin(username.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 300, margin: "auto", padding: 20 }}>
      <h3>Login (Dummy Auth)</h3>
      <input
        type="text"
        placeholder="Enter username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        style={{ width: "100%", padding: 8, marginBottom: 12 }}
      />
      <button type="submit" style={{ padding: "8px 16px" }}>
        Login
      </button>
    </form>
  );
}
