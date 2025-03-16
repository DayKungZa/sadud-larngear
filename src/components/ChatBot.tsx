import React, { useState } from "react";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "Hello! How can I assist you?" }]);
    }, 1000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }} 
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg border"
    >
      {/* Header */}
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">ChatBot</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">Type a message to start chatting...</p>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: msg.sender === "user" ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 rounded-lg w-fit max-w-[80%] shadow-sm ${
                msg.sender === "user"
                  ? "ml-auto bg-blue-500 text-white"
                  : "mr-auto bg-gray-200 text-gray-800"
              }`}
            >
              {msg.text}
            </motion.div>
          ))
        )}
      </div>

      <div className="p-4 border-t bg-white flex items-center">
        <input
          className="flex-1 p-3 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-300 outline-none text-black"
          value={input}
          onKeyDown={(e) => {
            if (e.keyCode === 13) {
              sendMessage()
            }
          }}
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

export default ChatBot;
