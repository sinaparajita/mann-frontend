import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import MoodDataExport from "./MoodDataExport"; // Import your export component

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function formatDate(date) {
  const d = new Date(date);
  return d.toISOString().split("T")[0];
}

export default function MoodAnalytics() {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    async function fetchMoodData() {
      const q = query(collection(db, "moods"), orderBy("createdAt", "asc"));
      const snapshot = await getDocs(q);
      let moodCounts = {};
      snapshot.forEach(doc => {
        const data = doc.data();
        if (!data.createdAt) return;
        const dateStr = formatDate(data.createdAt.toDate());
        const mood = data.mood || "UNKNOWN";
        if (!moodCounts[dateStr]) moodCounts[dateStr] = {};
        if (!moodCounts[dateStr][mood]) moodCounts[dateStr][mood] = 0;
        moodCounts[dateStr][mood]++;
      });
      const labels = Object.keys(moodCounts).sort();
      const moodTypes = [
        ...new Set(labels.flatMap(d => Object.keys(moodCounts[d])))
      ];
      const datasets = moodTypes.map(mood => ({
        label: mood,
        data: labels.map(date => moodCounts[date][mood] || 0),
        borderColor: getMoodColor(mood),
        backgroundColor: getMoodColor(mood, 0.3),
        fill: false,
        tension: 0.3,
      }));
      setChartData({
        labels,
        datasets
      });
    }
    fetchMoodData();
  }, []);

  function getMoodColor(mood, alpha = 1) {
    const colors = {
      HAPPY: `rgba(0, 200, 83, ${alpha})`,
      SAD: `rgba(33, 150, 243, ${alpha})`,
      ANGRY: `rgba(244, 67, 54, ${alpha})`,
      EXCITED: `rgba(255, 193, 7, ${alpha})`,
      CALM: `rgba(0, 188, 212, ${alpha})`,
      UNKNOWN: `rgba(158, 158, 158, ${alpha})`,
    };
    return colors[mood] || `rgba(100,100,100,${alpha})`;
  }

  if (!chartData) return <div>Loading mood analytics...</div>;

  return (
    <div style={{ maxWidth: 800, margin: "2rem auto" }}>
      <h3>Mood Trends Over Time</h3>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: { position: "top" },
            title: { display: true, text: "Daily Mood Counts" }
          }
        }}
      />

      {/* Export button below the chart */}
      <div style={{ marginTop: 20 }}>
        <MoodDataExport />
      </div>
    </div>
  );
}
