import React from "react";

interface GridProps {
  onCellSelect: (cell: string) => void;
}

const Grid: React.FC<GridProps> = ({ onCellSelect }) => {
  const rows = "ABCDEF".split(""); // 6 rows (A-F)
  const cols = Array.from({ length: 13 }, (_, i) => i + 1); // 13 columns (1-13)

  return (
    <div className="flex justify-center items-center h-full w-full">
      <div className="relative bg-[url('/Larngear_crop.png')] bg-contain p-2 rounded-lg shadow-lg w-full h-full">
        {/* Full Grid Container */}
        <div className="grid w-full h-full" style={{ gridTemplateColumns: "auto repeat(13, 1fr)", gridTemplateRows: "auto repeat(6, 1fr)" }}>
          
          {/* Top-left empty space for alignment */}
          <div className="w-16 h-16"></div>

          {/* Column Headers (1-13) */}
          {cols.map((col) => (
            <div key={`col-${col}`} className="w-full h-16 flex justify-center items-center font-bold text-lg bg-gray-200 border text-black bg-opacity-50">
              {col}
            </div>
          ))}

          {/* Rows with row headers + grid cells */}
          {rows.map((row) => (
            <React.Fragment key={`row-${row}`}>
              {/* Row Header (A-F) */}
              <div className="w-16 h-full flex justify-center items-center font-bold text-lg bg-gray-200 border text-black bg-opacity-50">
                {row}
              </div>

              {/* Grid Cells */}
              {cols.map((col) => {
                const cellLabel = `${row}${col}`;
                return (
                  <button
                    key={cellLabel}
                    className="w-full h-full flex items-center justify-center border bg-gray-300 hover:bg-blue-400 rounded-md transition-all text-black bg-opacity-50"
                    onClick={() => onCellSelect(cellLabel)}
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
