// Tile.tsx
import React, { useState } from "react";

interface Event {
  date: string;
  time: string;
  description: string;
}

interface TileProps {
  x: number;
  y: number;
  events: Event[];
}

const Tile: React.FC<TileProps> = ({ x, y, events }) => {
  const [showEvents, setShowEvents] = useState(false);

  const toggleEvents = () => setShowEvents(!showEvents);

  // Color intensity based on number of events
  const baseColor = "bg-blue-400";
  const eventColor =
    events.length > 3 ? "bg-red-500" : events.length > 0 ? "bg-yellow-400" : baseColor;

  return (
    <div
      className={`w-12 h-12 flex items-center justify-center text-white border border-gray-300 cursor-pointer ${eventColor}`}
      onClick={toggleEvents}
    >
      {events.length > 0 && <span className="text-xs font-bold">{events.length}</span>}

      {showEvents && (
        <div className="absolute bg-white text-black p-2 rounded shadow-lg w-40 z-10">
          <h4 className="text-sm font-semibold">Tile ({x}, {y})</h4>
          <ul className="text-xs">
            {events.map((event, index) => (
              <li key={index}>
                <strong>{event.date} {event.time}</strong>: {event.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Tile;
