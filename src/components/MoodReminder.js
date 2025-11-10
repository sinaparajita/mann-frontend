import React, { useEffect, useState } from "react";

export default function MoodReminder() {
  const [showReminder, setShowReminder] = useState(false);

  useEffect(() => {
    // Notify every 2 hours (7200000 milliseconds); for demo, reduce to 1 min (60000)
    const reminderInterval = setInterval(() => {
      setShowReminder(true);
      // Browser notification (optional)
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Mood Tracker Reminder", {
          body: "Don't forget to log your mood today!",
        });
      }
    }, 7200000); // 2 hours

    // Request permission on mount if not granted
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }

    return () => clearInterval(reminderInterval);
  }, []);

  const closeReminder = () => setShowReminder(false);

  return (
    <>
      {showReminder && (
        <div style={{
          position: "fixed",
          bottom: 20,
          right: 20,
          backgroundColor: "#007bff",
          color: "white",
          padding: 16,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          cursor: "pointer",
          zIndex: 1000,
          maxWidth: 300,
        }} onClick={closeReminder}>
          <strong>Reminder:</strong> Don't forget to log your mood today! (Click to dismiss)
        </div>
      )}
    </>
  );
}
