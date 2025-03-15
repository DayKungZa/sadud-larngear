"use client";

import { useState } from "react";
import Grid from "@/components/Grid";
import ChatBot from "@/components/ChatBot";
import { motion } from "framer-motion";

export default function Home() {
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [chatOpen, setChatOpen] = useState(false);

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100 p-4">
      <div className="flex w-full h-full border shadow-lg rounded-lg bg-white">
        {/* Left Side - Grid */}
        <div className="w-2/3 h-full flex flex-col justify-center items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Larnger Position</h1>
          <div className="w-full h-full">
            <Grid onCellSelect={setSelectedCell} />
          </div>
        </div>

        {/* Right Side - Detail Panel */}
        <div className="w-1/3 h-full p-4 flex flex-col border-l relative bg-white">
          {/* Chatbot Fullscreen Mode */}
          {chatOpen ? (
            <ChatBot onClose={() => setChatOpen(false)} />
          ) : (
            <>
              {/* Detail Panel */}
              <div className="flex flex-col justify-center items-center flex-grow">
                <h2 className="text-2xl font-semibold text-gray-800">Detail Panel</h2>
                {selectedCell ? (
                  <p className="mt-2 text-xl font-bold text-gray-700">{selectedCell}</p>
                ) : (
                  <p className="mt-2 text-gray-400 text-lg">Click a cell to see details.</p>
                )}
              </div>

              {/* Chatbot Button Block */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-4 right-4 flex justify-center"
              >
                <button
                  className="w-full max-w-[90%] px-6 py-4 bg-white text-blue-500 font-semibold rounded-lg shadow-md border hover:bg-gray-100 transition-all"
                  onClick={() => setChatOpen(true)}
                >
                  💬 Open Chat
                </button>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
