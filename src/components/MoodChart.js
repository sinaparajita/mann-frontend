import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function MoodChart({ mood }) {
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "moods"), orderBy("createdAt"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setMoods(items);
    });

    return () => unsubscribe();
  }, []);

  // Prepare data for chart
  const chartData = {
    labels: moods.map((m) =>
      m.createdAt?.toDate().toLocaleDateString() || ""
    ),
    datasets: [
      {
        label: "Mood Entries",
        data: moods.map((m) => moodToScore(m.mood)),
        borderColor: "rgba(75,192,192,1)",
        fill: false,
        tension: 0.1
      }
    ]
  };

  // Convert mood label to numeric score for chart
  function moodToScore(mood) {
    const normalized = mood.toLowerCase();
    switch (normalized) {
      case "happy":
        return 5;
      case "excited":
        return 4;
      case "neutral":
        return 3;
      case "sad":
        return 2;
      case "angry":
        return 1;
      default:
        return 3;
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Mood Trends Over Time" }
    },
    scales: {
      y: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
        title: { display: true, text: "Mood Score (1-5)" }
      }
    }
  };

  return <Line data={chartData} options={options} />;
}
