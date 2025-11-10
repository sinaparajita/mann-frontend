import React, { useState } from "react";
import DummyAuth from "./components/DummyAuth";
import MoodEntry from "./components/MoodEntry";
import MoodHistory from "./components/MoodHistory";
import Chat from "./components/Chat";
import MoodRecommendations from "./components/MoodRecommendations";
import MoodReminder from "./components/MoodReminder";
import MoodAnalytics from "./components/MoodAnalytics";
import SpotifyPlaylists from "./components/SpotifyPlaylists";
import StoryPostForm from "./components/StoryPostForm";
import StoryList from "./components/StoryList";

const activeTabButtonStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  border: "1px solid #007bff",
  backgroundColor: "white",
  color: "#007bff",
  fontWeight: "600",
  fontSize: "1rem",
  borderRadius: "4px",
  margin: "0 4px",
  transition: "all 0.2s ease",
};

const tabButtonStyle = {
  padding: "10px 20px",
  cursor: "pointer",
  border: "none",
  backgroundColor: "#007bff",
  color: "white",
  fontWeight: "600",
  fontSize: "1rem",
  borderRadius: "4px",
  margin: "0 4px",
  transition: "all 0.2s ease",
};

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("entry");
  const [refreshStories, setRefreshStories] = useState(false);
  const currentMood = "HAPPY"; // fallback mood

  if (!user) {
    return <DummyAuth onLogin={setUser} />;
  }

  return (
    <div style={{ maxWidth: 800, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <p style={{ textAlign: "center" }}>
        Welcome, {user}!{" "}
        <button onClick={() => setUser(null)} style={{ marginLeft: 10 }}>
          Logout
        </button>
      </p>

      <nav style={{ display: "flex", justifyContent: "center", padding: 20, borderBottom: "1px solid #ccc" }}>
        <button onClick={() => setActiveTab("entry")} style={activeTab === "entry" ? activeTabButtonStyle : tabButtonStyle}>
          Mood Entry
        </button>
        <button onClick={() => setActiveTab("postStory")} style={activeTab === "postStory" ? activeTabButtonStyle : tabButtonStyle}>
          Post Story
        </button>
        <button onClick={() => setActiveTab("stories")} style={activeTab === "stories" ? activeTabButtonStyle : tabButtonStyle}>
          View Stories
        </button>
        <button onClick={() => setActiveTab("history")} style={activeTab === "history" ? activeTabButtonStyle : tabButtonStyle}>
          Mood History
        </button>
        <button onClick={() => setActiveTab("chat")} style={activeTab === "chat" ? activeTabButtonStyle : tabButtonStyle}>
          Chat
        </button>
        <button onClick={() => setActiveTab("recommendations")} style={activeTab === "recommendations" ? activeTabButtonStyle : tabButtonStyle}>
          Recommendations
        </button>
        <button onClick={() => setActiveTab("analytics")} style={activeTab === "analytics" ? activeTabButtonStyle : tabButtonStyle}>
          Analytics
        </button>
      </nav>

      <main style={{ padding: 20 }}>
        {activeTab === "entry" && <MoodEntry user={user} />}
        {activeTab === "postStory" && <StoryPostForm user={user} onStoryPosted={() => setRefreshStories(!refreshStories)} />}
        {activeTab === "stories" && <StoryList />}
        {activeTab === "history" && <MoodHistory user={user} />}
        {activeTab === "chat" && <Chat user={user} />}
        {activeTab === "recommendations" && (
          <>
            <MoodRecommendations mood={currentMood} user={user} />
            <SpotifyPlaylists mood={currentMood} user={user} />
          </>
        )}
        {activeTab === "analytics" && <MoodAnalytics user={user} />}
      </main>

      <MoodReminder />
    </div>
  );
}
