import React, { useEffect, useState } from "react";

type FilterType = "All" | "Money" | "Love" | "Health";

interface GridProps {
  onCellSelect: (cell: string) => void;
  filter: FilterType;
}

interface msgProp {
  isUser: boolean;
  username: string;
  title: string;
  text: string;
  love: number;
  money: number;
  health: number;
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const Grid: React.FC<GridProps> = ({ onCellSelect, filter }) => {
  const rows = "ABCDEF".split(""); // 6 rows (A-F)
  const cols = Array.from({ length: 13 }, (_, i) => i + 1); // 13 columns (1-13)

  // Store colors for each cell in React state
  const [cellColors, setCellColors] = useState<Record<string, RGBColor>>({});
  // This state toggles to trigger a refetch
  const [shouldRefetch, setShouldRefetch] = useState(true);

  // Helper that fetches a single cell’s data and updates color immediately
  const fetchCellColor = async (row: string, col: number) => {
    const cellKey = `${row}:${col}`;
    try {
      const response = await fetch(`/api/chat?row=${row}&col=${col}`);
      const data = await response.json();

      let totalLove = 0;
      let totalMoney = 0;
      let totalHealth = 0;
      let count = 0;

      if (!data || !data.chats) {
        // No data
      } else if (Array.isArray(data.chats)) {
        data.chats.forEach((item: msgProp) => {
          totalLove += typeof item.love === "number" ? item.love : 0;
          totalMoney += typeof item.money === "number" ? item.money : 0;
          totalHealth += typeof item.health === "number" ? item.health : 0;
        });
        count = data.chats.length;
      } else {
        // Single chat object
        const single = data.chats;
        totalLove = typeof single.love === "number" ? single.love : 0;
        totalMoney = typeof single.money === "number" ? single.money : 0;
        totalHealth = typeof single.health === "number" ? single.health : 0;
        count = 1;
      }

      // Compute average based on the filter
      let average = 0;
      if (count > 0) {
        if (filter === "All") {
          average = (totalLove + totalMoney + totalHealth) / (3 * count);
        } else if (filter === "Love") {
          average = totalLove / count;
        } else if (filter === "Money") {
          average = totalMoney / count;
        } else if (filter === "Health") {
          average = totalHealth / count;
        }
      }

      // Decide color
      let r = 0, g = 0, b = 0;
      if (count === 0 || average === 0 || !Number.isFinite(average)) {
        // Gray
        r = g = b = 128;
      } else if (average < 0) {
        // Red
        r = Math.min(255, Math.round(255 * (Math.abs(average) / 100)));
      } else {
        // Green
        g = Math.min(255, Math.round(255 * (average / 100)));
      }

      // Update that cell’s color in state
      setCellColors((prev) => ({
        ...prev,
        [cellKey]: { r, g, b },
      }));
    } catch (error) {
      console.error("Error fetching data for cell:", cellKey, error);
      // Mark error as gray
      setCellColors((prev) => ({
        ...prev,
        [cellKey]: { r: 128, g: 128, b: 128 },
      }));
    }
  };

  // 1. Whenever `filter` or `shouldRefetch` changes, fetch all cells in parallel
  useEffect(() => {
    if (!shouldRefetch) return;
    rows.forEach((row) => {
      cols.forEach((col) => {
        fetchCellColor(row, col);
      });
    });
    // done fetching
    setShouldRefetch(false);
  }, [filter, shouldRefetch]); 

  // 2. Whenever `filter` changes, set `shouldRefetch(true)`, 
  //    triggering the useEffect above
  useEffect(() => {
    setShouldRefetch(true);
  }, [filter]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative bg-[url('/Larngear_crop.png')] bg-contain p-2 rounded-lg shadow-lg w-full h-full">
        {/* Full Grid Container */}
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: "auto repeat(13, 1fr)",
            gridTemplateRows: "auto repeat(6, 1fr)",
          }}
        >
          {/* Top-left button to trigger re-fetch */}
          <button
            className="w-16 h-16 rounded-xl border bg-gray-600 hover:bg-gray-700 text-sm text-white"
            onClick={() => setShouldRefetch(true)}
          >
            Sadud Fortune
          </button>

          {/* Column Headers (1-13) */}
          {cols.map((col) => (
            <div
              key={`col-${col}`}
              className="w-full h-16 flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50"
            >
              {col}
            </div>
          ))}

          {/* Rows */}
          {rows.map((row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row Header (A-F) */}
              <div className="w-16 h-full flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50">
                {row}
              </div>

              {/* Cells */}
              {cols.map((col) => {
                const cellLabel = `${row}${col}`;
                const cellKey = `${row}:${col}`;
                const color = cellColors[cellKey] || { r: 0, g: 0, b: 0 };
                const { r, g, b } = color;

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
