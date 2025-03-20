"use client"; // Important for client-side fetch and React state

import React, { useEffect, useState } from "react";

type FilterType = "All" | "Money" | "Love" | "Health";

interface GridProps {
  onCellSelect: (cell: string) => void;
  filter: FilterType;
}

interface CellAverages {
  love: number;
  money: number;
  health: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const ROWS = "ABCDEF".split(""); // stable references
const COLS = Array.from({ length: 13 }, (_, i) => i + 1);

const Grid: React.FC<GridProps> = ({ onCellSelect, filter }) => {
  // Store the aggregated average data from /api/chatAll
  const [allData, setAllData] = useState<Record<string, CellAverages>>({});
  // Store final color for each "row:col"
  const [cellColors, setCellColors] = useState<Record<string, RGBColor>>({});

  // 1) Fetch once whenever filter changes
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("/api/chatAll");
        const json = await res.json();
        if (json.success && json.data) {
          setAllData(json.data);
        } else {
          console.error("chatAll error:", json.error);
        }
      } catch (err) {
        console.error("Failed to fetch /api/chatAll:", err);
      }
    };
    fetchAll();
  }, [filter]); 
  // ^ If you want to re-fetch each time the user picks a new filter

  // 2) Recompute each cell’s color whenever allData or filter changes
  useEffect(() => {
    const newColors: Record<string, RGBColor> = {};

    ROWS.forEach((row) => {
      COLS.forEach((col) => {
        const key = `${row}:${col}`;
        const cellInfo = allData[key]; // e.g. { love, money, health }

        let average = 0;
        if (cellInfo) {
          const { love, money, health } = cellInfo;
          if (filter === "All") {
            average = (love + money + health) / 3;
          } else if (filter === "Love") {
            average = love;
          } else if (filter === "Money") {
            average = money;
          } else if (filter === "Health") {
            average = health;
          }
        }

        // Decide color
        let r = 0, g = 0, b = 0;
        if (!cellInfo || average === 0 || !Number.isFinite(average)) {
          // Gray
          r = g = b = 128;
        } else if (average < 0) {
          // Red
          r = Math.min(255, Math.round(255 * (Math.abs(average) / 100)));
        } else {
          // Green
          g = Math.min(255, Math.round(255 * (average / 100)));
        }
        newColors[key] = { r, g, b };
      });
    });

    setCellColors(newColors);
  }, [allData, filter]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative bg-[url('/Larngear_crop.png')] bg-no-repeat bg-cover p-2 rounded-lg shadow-lg w-full h-full">
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: "auto repeat(13, 1fr)",
            gridTemplateRows: "auto repeat(6, 1fr)",
          }}
        >
          {/* Optional: a button to manually refresh */}
          <button
            className="w-full h-full rounded-xl border bg-gray-200 text-sm text-white bg-opacity-0"
          >
          </button>

          {/* Column Headers (1-13) */}
          {COLS.map((col) => (
            <div
              key={`col-${col}`}
              className="w-full h-full flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50"
            >
              {col}
            </div>
          ))}

          {/* Rows */}
          {ROWS.map((row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row Header (A-F) */}
              <div className="w-full h-full flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50">
                {row}
              </div>

              {/* Cells */}
              {COLS.map((col) => {
                const cellLabel = `${row}${col}`; // "A1", "A2", etc.
                const cellKey = `${row}:${col}`;
                const { r, g, b } = cellColors[cellKey] || { r: 0, g: 0, b: 0 };

                return (
                  <button
                    key={cellLabel}
                    className="w-full h-full flex items-center justify-center border hover:bg-blue-400 rounded-md transition-all bg-opacity-70"
                    onClick={() => onCellSelect(cellLabel)}
                    style={{
                      backgroundColor: `rgba(${r}, ${g}, ${b}, 0.8)`,
                    }}
                  >
                    {cellLabel}
                  </button>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
