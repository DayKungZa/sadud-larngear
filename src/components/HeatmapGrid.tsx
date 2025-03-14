// HeatmapGrid.tsx
"use client"
import React from 'react';
import Tile from './tile';

interface Event {
  date: string;
  time: string;
  description: string;
}

interface HeatmapGridProps {
  gridData: { x: number; y: number; events: Event[] }[];
}

const HeatmapGrid: React.FC<HeatmapGridProps> = ({ gridData }) => {
  return (
    <div
      className="heatmap-grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(13, 1fr)',
        gridTemplateRows: 'repeat(6, 1fr)',
        gap: '2px',
      }}
    >
      {gridData.map((tileData) => (
        <Tile
          key={`${tileData.x}-${tileData.y}`}
          x={tileData.x}
          y={tileData.y}
          events={tileData.events}
        />
      ))}
    </div>
  );
};

export default HeatmapGrid;