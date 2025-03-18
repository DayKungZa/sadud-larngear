"use client";

import { useState } from "react";
import Grid from "@/components/Grid";
import ChatPanel from "@/components/ChatPanel"; // Mini chat per cell
import ChatBot from "@/components/ChatBot"; // Full chatbot
import { useAuth } from "@/app/context/AuthContext";

interface msgProp{
  isUser: boolean;
  username: string;
  title: string;
  text: string;
  love: number;
  money: number;
  health: number;
}

export default function Home() {
  const { user, isLoggedIn } = useAuth();
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState<{ [key: string]: msgProp[] }>({});
  const [fetchedCells, setFetchedCells] = useState<Set<string>>(new Set());

  const handleCellClick = async (cell: string) => {
    setSelectedCell(cell);
    setChatOpen(false); 

    {/* Fetch Chat Data */}
      if (!fetchedCells.has(cell)) {
        try {
          const [row, col] = cell.split(/(\d+)/).filter(Boolean);
          const response = await fetch(`/api/chat?row=${row}&col=${col}`);
          const data = await response.json();

          if (data.success) {
            setChatHistory((prev) => ({
              ...prev,
              [cell]: data.chats.map((chat: any) => ({
                isUser: isLoggedIn, 
                username: chat.username, 
                text: chat.message,
                title: chat.title, 
                love: chat.love, 
                money: chat.money, 
                health: chat.health
              })), 
            }));
            setFetchedCells((prev) => new Set(prev).add(cell));
          }
        } catch (error) {
          console.error("Chat Fetch Error:", error);
        }
    }
  }


  const handleSendMessage = async (message: string, title: string, love: number, money: number, health: number) => {
    if (!selectedCell) return;
    if (isLoggedIn && !user) return;

    const username = isLoggedIn && user?.username ? user.username : "Anonymous";
    title = title? title : "New Sadud";
    message = message? message : " ";

    const [row, col] = selectedCell.match(/^([A-Za-z]+)(\d+)$/)!.slice(1);
  
    // Update local state first for instant feedback
    setChatHistory((prev) => ({
      ...prev,
      [selectedCell]: [
        ...(prev[selectedCell] || []),
        { isUser: true, username, title, text: message, love, money, health },
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
    <div className="flex items-center justify-center h-screen w-full bg-gray-100 p-4">
      <div className="flex w-full h-full border shadow-lg rounded-lg bg-white p-4">
        {/* Left Side - Grid */}
        <div className="w-2/3 h-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Grid Table (6 × 13)</h1>
          <div className="w-full h-full">
            <Grid onCellSelect={handleCellClick} />
          </div>
        </div>

        {/* Right Side - Detail Panel */}
        <div className="w-1/3 h-full p-4 flex flex-col border-l relative bg-white">
          {/* If Chatbot is Open, Show Chatbot (Full Screen) */}
          {chatOpen ? (
            <ChatBot onClose={() => setChatOpen(false)} />
          ) : (
            <>
              {/* Mini Chat for Selected Cell */}
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

              {/*Chatbot Button */}
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
