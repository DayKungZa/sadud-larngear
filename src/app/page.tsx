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

type FilterType = "All" | "Money" | "Love" | "Health";

export default function Home() {
  const { user, isLoggedIn } = useAuth();

  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ [key: string]: msgProp[] }>({});
  const [fetchedCells, setFetchedCells] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<FilterType>("All");

  const handleCellClick = async (cell: string) => {
    setSelectedCell(cell);
    setChatOpen(false);

    if (!fetchedCells.has(cell)) {
      try {
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

    const [row, col] = selectedCell.match(/^([A-Za-z]+)(\d+)$/)!.slice(1);

    setChatHistory((prev) => ({
      ...prev,
      [selectedCell]: [
        ...(prev[selectedCell] || []),
        { isUser: true, username, title, message, love, money, health },
      ],
    }));

    try {
      await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ row, col, username, title, message, love, money, health }),
      });
    } catch (error) {
      console.error("Chat Save Error:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen bg-gray-800 p-2 md:p-4">
      <div className="flex flex-col md:flex-row w-full h-full max-w-screen-xl border shadow-lg rounded-lg bg-red-900 p-2 md:p-4">
        <div className="md:w-2/3 w-full flex flex-col">
          <h1 className="text-2xl md:text-3xl font-bold mb-4 text-white">Sadud Larngear</h1>

          <div className="flex flex-wrap gap-2 mb-2 text-gray-800">
            {["All", "Money", "Love", "Health"].map((item) => (
              <button
                key={item}
                className={`px-2 md:px-3 py-1 rounded-lg border text-sm md:text-base ${
                  filter === item ? "bg-gray-500 text-white" : "bg-white text-gray-800"
                }`}
                onClick={() => setFilter(item as FilterType)}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-auto">
            <Grid onCellSelect={handleCellClick} filter={filter} />
          </div>
        </div>

        <div className="md:w-1/3 w-full md:mt-0 mt-4 p-2 md:p-4 flex flex-col border-l relative bg-gray-800 border-white rounded-lg">
          {chatOpen ? (
            <ChatBot onClose={() => setChatOpen(false)} />
          ) : selectedCell ? (
            <ChatPanel
              cell={selectedCell}
              messages={chatHistory[selectedCell] || []}
              onSendMessage={handleSendMessage}
              onClose={() => setSelectedCell(null)}
            />
          ) : (
            <div className="flex flex-col justify-center items-center flex-grow">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-300">Detail Panel</h2>
              <p className="mt-2 text-gray-400 text-center">Click a cell to open chat.</p>
            </div>
          )}

          <button
            className="mt-4 md:mt-auto px-4 py-2 md:px-6 md:py-4 bg-white text-blue-500 font-semibold rounded-xl shadow-md border hover:bg-gray-100 transition-all"
            onClick={() => setChatOpen(true)}
          >
            💬 Open Chatbot
          </button>
        </div>
      </div>
    </div>
  );
}