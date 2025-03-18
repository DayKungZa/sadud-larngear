import React, { useRef, useEffect, useState } from "react";

interface GridProps {
  onCellSelect: (cell: string) => void;
}

const Grid: React.FC<GridProps> = ({ onCellSelect }) => {
  const rows = "ABCDEF".split(""); // 6 rows (A-F)
  const cols = Array.from({ length: 13 }, (_, i) => i + 1); // 13 columns (1-13)
  const colors = useRef(new Map<string, number>());
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      for (let a of rows) {
        for (let b of cols) {
          const cell = `${a}:${b}`;
          try {
            // Fetch the data for each grid cell from the new endpoint
            const response = await fetch(`/api/chat?row=${a}&col=${b}`);
            const data = await response.json();

            // Assuming the response contains `love`, `money`, and `health`
            const { love, money, health } = data;

            // Calculate the average of love, money, and health
            const average = (love + money + health) / 3;

            // Map the average to a color (you can adjust the scaling here)
            const color = Math.round(255 * (average / 100)); // Scaling average from -100 to 100 to range between 0-255

            // Update the colors map
            colors.current.set(cell, color);
          } catch (error) {
            console.error("Error fetching data for cell:", cell, error);
          }
        }
      }
      setUpdate(false); // Stop updating after fetching
    };

    fetchData();
  }, [update]);

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative bg-[url('/Larngear_crop.png')] bg-contain p-2 rounded-lg shadow-lg w-full h-full">
        {/* Full Grid Container */}
        <div className="grid w-full h-full" style={{ gridTemplateColumns: "auto repeat(13, 1fr)", gridTemplateRows: "auto repeat(6, 1fr)" }}>
          
          {/* Top-left button for fortune */}
          <button className="w-16 h-16 rounded-xl border bg-gray-600 hover:bg-gray-700 text-sm" onClick={() => setUpdate(!update)}>
            {"Sadud Fortune"}
          </button>

          {/* Column Headers (1-13) */}
          {cols.map((col) => (
            <div key={`col-${col}`} className="w-full h-16 flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50">
              {col}
            </div>
          ))}

          {/* Rows with row headers + grid cells */}
          {rows.map((row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row Header (A-F) */}
              <div className="w-16 h-full flex justify-center items-center font-bold text-lg bg-gray-200 border bg-opacity-50">
                {row}
              </div>

              {/* Grid Cells */}
              {cols.map((col) => {
                const cellLabel = `${row}${col}`;
                return (
                  <button
                    key={cellLabel}
                    className="w-full h-full flex items-center justify-center border hover:bg-blue-400 rounded-md transition-all bg-opacity-70"
                    onClick={() => onCellSelect(cellLabel)}
                    style={{ backgroundColor: `rgba(${colors.current.get(`${row}:${col}`) || 0}, 0, 0, 0.4)` }} // Default to 0 if color is not available
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
