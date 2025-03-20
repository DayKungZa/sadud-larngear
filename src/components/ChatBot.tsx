"use client"
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Send, X } from "lucide-react";
import { motion } from "framer-motion";

interface ChatBotProps {
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axios.post("/api/gemini", { message: input });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      // Simulate streaming effect for AI response
      const botReply = { sender: "bot", text: "" };
      setMessages((prev) => [...prev, botReply]);

      for (const char of response.data.reply) {
        await new Promise((resolve) => setTimeout(resolve, 20)); // Typing speed effect
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            sender: "bot",
            text: prev[newMessages.length - 1].text + char,
          };
          return newMessages;
        });
      }
    } catch (error) {
      setMessages((prev) => [...prev, { sender: "bot", text: "Oops! Something went wrong." }]);
      console.error("ChatBot Error:", error);
    } finally {
      setLoading(false);
    }
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
      className="flex flex-col h-full w-full bg-white rounded-lg shadow-lg border"
    >
      {/* Header */}
      <div className="p-4 bg-red-800 border-b flex justify-between items-center rounded-lg">
        <h2 className="text-xl font-semibold text-white">🔮 Chat with Ajarn Gear</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
          <X size={24} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.map((msg, index) => (
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
        ))}

        {/* Loading Indicator */}
        {loading && <p className="text-gray-400 text-center">🔮 Thinking about your future...</p>}

        <div ref={chatEndRef} />
      </div>

      <div className="p-4 border-t bg-white flex items-center rounded-lg">
        <input
          className="flex-1 p-3 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-300 outline-none text-black"
          value={input}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your birth date or zodiac sign..."
        />
        <button
          className="ml-3 p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          onClick={sendMessage}
          disabled={loading}
        >
          <Send size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ChatBot;
