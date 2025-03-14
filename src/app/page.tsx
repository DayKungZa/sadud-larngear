// app/page.tsx
"use client";

import React, { useState } from "react";
import HeatmapGrid from "@/components/HeatmapGrid";

interface Event {
  date: string;
  time: string;
  description: string;
}

const generateGridData = () => {
  return Array.from({ length: 13 * 6 }, (_, index) => ({
    x: index % 13,
    y: Math.floor(index / 13),
    events: Math.random() > 0.7
      ? [{ date: "2025-03-10", time: "14:00", description: "Incident" }]
      : [],
  }));
};

export default function Home() {
  const [gridData, setGridData] = useState(generateGridData());

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-200 p-4">
      <h1 className="text-2xl font-bold mb-4">Heatmap Grid</h1>
      <HeatmapGrid gridData={gridData} />
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => setGridData(generateGridData())}
      >
        Refresh Data
      </button>
    </main>
  );
}
