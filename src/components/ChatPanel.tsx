import React, { useState, useEffect, useRef } from "react";
import { X, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import Slider from "./Slider";

interface msgProp{
  isUser: boolean;
  username: string;
  title: string;
  text: string;
  love: number;
  money: number;
  health: number;
}
interface ChatPanelProps {
  cell: string;
  messages: msgProp[];
  onSendMessage: (message: string, title: string, love: number, money: number, health: number) => void;
  onClose: () => void;
}



const ChatPanel: React.FC<ChatPanelProps> = ({ cell, messages, onSendMessage, onClose }) => {
  const { user, isLoggedIn } = useAuth();
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [love, setLove] = useState(0);
  const [money, setMoney] = useState(0);
  const [health, setHealth] = useState(0);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const [isSending, setIsSending] = useState(false);

  const sendMessage = async () => {
    if (!title.trim() || !message.trim()) {
      console.error("Title and message are required.");
      return;
    }

    if (isSending) return; 
    setIsSending(true);

    const newMessage = {
      row: cell.charAt(0), 
      col: cell.slice(1), 
      title,
      username: user?.username || "Anonymous",
      message,
      love: Number(love),
      money: Number(money),
      health: Number(health),
    };

    try {
      onSendMessage(message, title, love, money, health); 
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-[90%] w-full bg-white rounded-lg shadow-lg border"
    >
      {/*Header*/}
      <div className="p-4 bg-gray-100 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Saduds of {cell}</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-red-500 transition">
          <X size={24} />
        </button>
      </div>

      {/*message boxes*/}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-gray-50">
        {messages.length === 0 ? (
          <p className="text-gray-400 text-center">Start typing to chat...</p>
        ) : (
          messages.map((msg, index) => {
            const isCurrentUser = isLoggedIn && user?.username === msg.username && msg.username !== "Anonymous";

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: isCurrentUser ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 w-fit max-w-[75%] rounded-2xl shadow-md text-gray ${
                  isCurrentUser ? "ml-auto bg-blue-100 " : "mr-auto bg-gray-100"
                }`}
              >
                {/* Title */}
                <p className="text-lg font-semibold mb-1">{msg.title || "New Message"}</p>

                {/* Username */}
                <p className="text-xs font-medium mb-2 text-gray-500">
                  by {msg.username || "Anonymous"}
                </p>

                {/* Stats (Love, Money, Health) */}
                <div className="flex items-center gap-2 text-xs mb-2">
                  <span
                    className={`px-2 py-1 rounded-lg font-medium bg-gray-500/20 text-gray-700 border-2 border-solid border-gray-500`}
                  >
                    ❤️ {(msg.love > 0)? `+${msg.love}` : msg.love }
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg font-medium bg-gray-500/20 text-gray-700 border-2 border-solid border-gray-500`}
                  >
                    💰 {(msg.money > 0)? `+${msg.money}` : msg.money }
                  </span>
                  <span
                    className={`px-2 py-1 rounded-lg font-medium bg-gray-500/20 text-gray-700 border-2 border-solid border-gray-500`}
                  >
                    💖 {(msg.health > 0)? `+${msg.health}` : msg.health }
                  </span>
                </div>


                {/* Message */}
                <p className="text-sm leading-relaxed break-words">{msg.text}</p>
              </motion.div>

            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/*Send Button*/}
      <div className="p-4 border-t bg-white flex justify-center">
        <button
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <MessageCircle size={20} />
          Add Your New Sadud
        </button>
      </div>

      {/*Pop Up Input Section*/}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md"
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Enter Your Details</h2>

            <input
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-300 outline-none mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title..."
            />

            <textarea
              className="w-full p-3 border rounded-lg bg-gray-100 focus:ring focus:ring-blue-300 outline-none mb-4"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={4}
            />

            <Slider label="Love" value={love} onChange={setLove} />

            <Slider label="Money" value={money} onChange={setMoney} />

            <Slider label="Health" value={health} onChange={setHealth} />

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-gray-300 rounded-lg" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-lg transition-all ${
                  isSending ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
                onClick={sendMessage}
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
};

export default ChatPanel;
