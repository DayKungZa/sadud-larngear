import React, { useRef, useEffect, useState } from "react";

// If you've declared this type somewhere else, import it instead:
type FilterType = "All" | "Money" | "Love" | "Health";

// Make sure GridProps includes `filter`
interface GridProps {
  onCellSelect: (cell: string) => void;
  filter: FilterType; 
}

interface RGBColor {
  r: number;
  g: number;
  b: number;
}

const Grid: React.FC<GridProps> = ({ onCellSelect, filter }) => {
  const rows = "ABCDEF".split(""); // 6 rows (A-F)
  const cols = Array.from({ length: 13 }, (_, i) => i + 1); // 13 columns (1-13)

  // Map of cell => { r, g, b } color
  const colors = useRef<Map<string, RGBColor>>(new Map());
  // State to manage re-fetch
  const [update, setUpdate] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      // We'll fetch for each row and col
      for (const row of rows) {
        for (const col of cols) {
          const cellKey = `${row}:${col}`;

          try {
            const response = await fetch(`/api/chat?row=${row}&col=${col}`);
            const data = await response.json();

            let totalLove = 0;
            let totalMoney = 0;
            let totalHealth = 0;
            let count = 0;

            // 1) If data or data.chats is falsy => no data
            if (!data || !data.chats) {
              // count = 0 => we do nothing
            }
            // 2) If data.chats is an array => multiple records
            else if (Array.isArray(data.chats)) {
              data.chats.forEach((item: any) => {
                const l = typeof item.love === "number" ? item.love : 0;
                const m = typeof item.money === "number" ? item.money : 0;
                const h = typeof item.health === "number" ? item.health : 0;
                totalLove += l;
                totalMoney += m;
                totalHealth += h;
              });
              count = data.chats.length;
            }
            // 3) Otherwise, data.chats is a single object => one record
            else {
              const single = data.chats; // e.g. { love, money, health }
              const l = typeof single.love === "number" ? single.love : 0;
              const m = typeof single.money === "number" ? single.money : 0;
              const h = typeof single.health === "number" ? single.health : 0;
              totalLove = l;
              totalMoney = m;
              totalHealth = h;
              count = 1;
            }

            // Compute the average **based on the selected filter**
            let average = 0;
            if (count > 0) {
              if (filter === "All") {
                // Average of all three attributes
                average = (totalLove + totalMoney + totalHealth) / (3 * count);
              } else if (filter === "Love") {
                average = totalLove / count;
              } else if (filter === "Money") {
                average = totalMoney / count;
              } else if (filter === "Health") {
                average = totalHealth / count;
              }
            }

            // Decide the color
            let r = 0, g = 0, b = 0;

            // No data or average=0 => gray
            if (count === 0 || average === 0 || !Number.isFinite(average)) {
              r = g = b = 128;
            } else if (average < 0) {
              // Negative => red
              r = Math.min(255, Math.round(255 * (Math.abs(average) / 100)));
            } else {
              // Positive => green
              g = Math.min(255, Math.round(255 * (average / 100)));
            }

            // Save to the map
            colors.current.set(cellKey, { r, g, b });
          } catch (error) {
            console.error("Error fetching data for cell:", cellKey, error);
            // If there's an error, let's mark it as gray
            colors.current.set(cellKey, { r: 128, g: 128, b: 128 });
          }
        }
      }
      // Done fetching
      setUpdate(false);
    };

    // If we haven't fetched (or user clicked the button again), let's fetch
    fetchData();
  }, [filter, update]); // <-- Re-fetch when filter changes

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
            onClick={() => setUpdate(true)}
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
                // get color from the map
                const { r = 0, g = 0, b = 0 } =
                  colors.current.get(cellKey) || {};

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
