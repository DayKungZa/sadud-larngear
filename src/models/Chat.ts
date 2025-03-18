import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  row: { type: String, required: true },
  col: { type: String, required: true }, 
  username: { type: String, required: true },
  title: { type: String},
  message: { type: String}, 
  love: { type: Number, required: true, min: -100, max: 100 }, 
  money: { type: Number, required: true, min: -100, max: 100 },
  health: { type: Number, required: true, min: -100, max: 100 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
