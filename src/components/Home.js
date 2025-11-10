import React, { useState } from "react";
import MoodEntry from "./MoodEntry";

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);

  return (
    <div>
      <MoodEntry selectedMood={selectedMood} setSelectedMood={setSelectedMood} />
      <p>Current Mood in Home: {selectedMood || "No mood selected"}</p>
    </div>
  );
}
