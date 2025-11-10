import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";

function convertArrayOfObjectsToCSV(data) {
  if (!data || !data.length) return null;

  const keys = Object.keys(data[0]);
  const csvRows = [];

  // Header row
  csvRows.push(keys.join(","));

  // Data rows
  data.forEach(row => {
    const values = keys.map(key => {
      let escaped = ("" + (row[key] || "")).replace(/"/g, '""');
      if (escaped.search(/("|,|\n)/g) >= 0) escaped = `"${escaped}"`;
      return escaped;
    });
    csvRows.push(values.join(","));
  });

  return csvRows.join("\n");
}

export default function MoodDataExport() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      const q = query(collection(db, "moods"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);

      const moods = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          mood: data.mood || "",
          note: data.note || "",
          createdAt: data.createdAt ? data.createdAt.toDate().toISOString() : "",
        };
      });

      const csvData = convertArrayOfObjectsToCSV(moods);
      if (!csvData) {
        setError("No data available to export.");
        setLoading(false);
        return;
      }

      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "mood_history.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      setError("Failed to export data.");
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "1rem auto" }}>
      <button
        onClick={handleExport}
        disabled={loading}
        style={{ padding: "10px 20px", cursor: "pointer" }}
      >
        {loading ? "Exporting..." : "Export Mood History as CSV"}
      </button>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
}
