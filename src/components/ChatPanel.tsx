import React, { useState, useEffect, useRef } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";

interface ChatPanelProps {
  cell: string;
  messages: { isUser: boolean; username: string; text: string }[];
  onSendMessage: (message: string) => void;
  onClose: () => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ cell, messages, onSendMessage, onClose }) => {
  const { user, isLoggedIn } = useAuth();
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput("");
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-[90%] w-full bg-white rounded-lg shadow-lg border"
    >
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Chat for {cell}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">Start typing to chat...</p>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = isLoggedIn && user?.username === msg.username && msg.username != "Anonymous";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isCurrentUser ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-lg w-fit max-w-[80%] shadow-sm ${
                  isCurrentUser ? "ml-auto bg-blue-500 text-white" : "mr-auto bg-gray-200 text-gray-800"
                }`}
              >
                <p className="text-sm font-bold mb-1">{msg.username || "Anonymous"}</p>
                <p>{msg.text}</p>
              </motion.div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white flex items-center">
        <input
          className="flex-1 p-3 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-300 outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button
          className="ml-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          onClick={sendMessage}
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatPanel;