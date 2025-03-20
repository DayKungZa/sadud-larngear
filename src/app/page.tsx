"use client";

import { useState } from "react";
import Grid from "@/components/Grid";
import ChatPanel from "@/components/ChatPanel";
import ChatBot from "@/components/ChatBot";
import { useAuth } from "@/app/context/AuthContext";

export interface msgProp {
  isUser: boolean;
  username: string;
  title: string;
  message: string;
  love: number;
  money: number;
  health: number;
}

// Define your possible filter types:
type FilterType = "All" | "Money" | "Love" | "Health";

export default function Home() {
  const { user, isLoggedIn } = useAuth();

  // State for which cell is selected in the grid
  const [selectedCell, setSelectedCell] = useState<string | null>(null);

  // State for opening the large ChatBot
  const [chatOpen, setChatOpen] = useState(false);

  // Chat history for each cell
  const [chatHistory, setChatHistory] = useState<{ [key: string]: msgProp[] }>({});

  // Keep track of which cells we've fetched
  const [fetchedCells, setFetchedCells] = useState<Set<string>>(new Set());

  // Our new filter state
  const [filter, setFilter] = useState<FilterType>("All");

  // Handle selecting a cell in the grid => fetch its chat data if needed
  const handleCellClick = async (cell: string) => {
    setSelectedCell(cell);
    setChatOpen(false);

    // If we haven't fetched this cell’s chat data yet
    if (!fetchedCells.has(cell)) {
      try {
        // The row is letters (A-F), the col is numbers (1-13)
        const [row, col] = cell.split(/(\d+)/).filter(Boolean);
        const response = await fetch(`/api/chat?row=${row}&col=${col}`);
        const data = await response.json();

        if (data.success) {
          setChatHistory((prev) => ({
            ...prev,
            [cell]: data.chats.map((chat: msgProp) => ({
              isUser: isLoggedIn,
              username: chat.username,
              message: chat.message,
              title: chat.title,
              love: chat.love,
              money: chat.money,
              health: chat.health,
            })),
          }));
          setFetchedCells((prev) => new Set(prev).add(cell));
        }
      } catch (error) {
        console.error("Chat Fetch Error:", error);
      }
    }
  };

  // Handle sending a new message for the selected cell
  const handleSendMessage = async (
    message: string,
    title: string,
    love: number,
    money: number,
    health: number
  ) => {
    if (!selectedCell) return;
    if (isLoggedIn && !user) return;

    const username = isLoggedIn && user?.username ? user.username : "Anonymous";
    title = title || "New Sadud";
    message = message || " ";

    // Separate row & column from the cell label
    const [row, col] = selectedCell.match(/^([A-Za-z]+)(\d+)$/)!.slice(1);

    // Update local state first (for instant feedback)
    setChatHistory((prev) => ({
      ...prev,
      [selectedCell]: [
        ...(prev[selectedCell] || []),
        { isUser: true, username, title, message, love, money, health },
      ],
    }));

    try {
      console.log(`POSTING MESSAGE BY: ${username}`);
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col, username, title, message, love, money, health }),
      });

      const data = await response.json();
      if (!response.ok) {
        console.error("Failed to save message:", data.error);
      }
    } catch (error) {
      console.error("Chat Save Error:", error);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen w-full bg-gray-800 p-4">
      <div className="flex w-full h-full border shadow-lg rounded-lg bg-red-900 p-4">
        {/* Left Side - Grid + Filter Buttons */}
        <div className="w-2/3 h-full flex flex-col">
          <h1 className="text-3xl font-bold mb-4 text-white">Sadud Larngear</h1>

          {/* Filter Buttons */}
          <div className="flex items-center space-x-2 mb-2 text-gray-800">
            <button
              className={`px-3 py-1 rounded-lg border ${
                filter === "All" ? "bg-gray-500 text-white" : "bg-white"
              }`}
              onClick={() => setFilter("All")}
            >
              All
            </button>
            <button
              className={`px-3 py-1 rounded-lg border ${
                filter === "Money" ? "bg-gray-500 text-white" : "bg-white"
              }`}
              onClick={() => setFilter("Money")}
            >
              Money
            </button>
            <button
              className={`px-3 py-1 rounded-lg border ${
                filter === "Love" ? "bg-gray-500 text-white" : "bg-white"
              }`}
              onClick={() => setFilter("Love")}
            >
              Love
            </button>
            <button
              className={`px-3 py-1 rounded-lg border ${
                filter === "Health" ? "bg-gray-500 text-white" : "bg-white"
              }`}
              onClick={() => setFilter("Health")}
            >
              Health
            </button>
          </div>

          {/* The Grid itself */}
          <div className="w-full h-full">
            {/* We pass our chosen filter down to Grid as a prop */}
            <Grid onCellSelect={handleCellClick} filter={filter} />
          </div>
        </div>

        {/* Right Side - Detail Panel / Chat */}
        <div className="w-1/3 h-full p-4 m-4 flex flex-col border-l relative bg-gray-800 border border-white rounded-lg">
          {/* If Chatbot is open, show the big ChatBot */}
          {chatOpen ? (
            <ChatBot onClose={() => setChatOpen(false)} />
          ) : (
            <>
              {/* Show the mini Chat for selected cell */}
              {selectedCell ? (
                <div className="flex-grow h-[75%] overflow-hidden text-black">
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

              {/* Button to open full ChatBot */}
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
