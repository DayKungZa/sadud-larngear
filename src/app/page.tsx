"use client";

import { useState } from "react";
import Grid from "@/components/Grid";
import ChatPanel from "@/components/ChatPanel"; // Mini chat per cell
import ChatBot from "@/components/ChatBot"; // Full chatbot

export default function Home() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ [key: string]: { sender: string; text: string }[] }>({});
  const [fetchedCells, setFetchedCells] = useState<Set<string>>(new Set()); // ✅ Store cells that have already been fetched

  const handleCellClick = async (cell: string) => {
    setSelectedCell(cell);
    setChatOpen(false); // ✅ Close chatbot when clicking a cell

    // ✅ If chat history for this cell is already fetched, do not fetch again
    if (!fetchedCells.has(cell)) {
      try {
        const [row, col] = cell.split(/(\d+)/).filter(Boolean); // Extract row and column
        const response = await fetch(`/api/chat?row=${row}&col=${col}`);
        const data = await response.json();

        if (data.success) {
          setChatHistory((prev) => ({
            ...prev,
            [cell]: data.chats.map((chat: any) => ({ sender: "bot", text: chat.message })), // ✅ Mark fetched messages as bot messages
          }));
          setFetchedCells((prev) => new Set(prev).add(cell)); // ✅ Mark this cell as fetched
        }
      } catch (error) {
        console.error("Chat Fetch Error:", error);
      }
    }
  };

  const handleSendMessage = async (message: string) => {
    if (selectedCell) {
      setChatHistory((prev) => ({
        ...prev,
        [selectedCell]: [...(prev[selectedCell] || []), { sender: "user", text: message }],
      }));

      try {
        const [row, col] = selectedCell.split(/(\d+)/).filter(Boolean);
        await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ row, col, message }),
        });
      } catch (error) {
        console.error("Chat Save Error:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <div className="flex w-full h-full border shadow-lg rounded-lg bg-white">
        {/* Left Side - Grid */}
        <div className="w-2/3 h-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Grid Table (6 × 13)</h1>
          <div className="w-full h-full">
            <Grid onCellSelect={handleCellClick} />
          </div>
        </div>

        {/* Right Side - Detail Panel */}
        <div className="w-1/3 h-full p-4 flex flex-col border-l relative bg-white">
          {/* ✅ If Chatbot is Open, Show Chatbot (Full Screen) */}
          {chatOpen ? (
            <ChatBot onClose={() => setChatOpen(false)} />
          ) : (
            <>
              {/* ✅ Show Mini Chat for Selected Cell */}
              {selectedCell ? (
                <div className="flex-grow h-[75%] overflow-hidden">
                  <ChatPanel
                    cell={selectedCell}
                    messages={chatHistory[selectedCell] || []}
                    onSendMessage={handleSendMessage}
                    onClose={() => setSelectedCell(null)}
                  />
                </div>
              ) : (
                <div className="flex flex-col justify-center items-center flex-grow">
                  <h2 className="text-2xl font-semibold text-gray-800">Detail Panel</h2>
                  <p className="mt-2 text-gray-400 text-lg">Click a cell to open chat.</p>
                </div>
              )}

              {/* ✅ Always Show Chatbot Button */}
              <div className="absolute bottom-4 left-4 right-4 flex justify-center">
                <button
                  className="w-full max-w-[90%] px-6 py-4 bg-white text-blue-500 font-semibold rounded-xl shadow-md border hover:bg-gray-100 transition-all"
                  onClick={() => setChatOpen(true)}
                >
                  💬 Open Chatbot
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
