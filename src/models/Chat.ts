import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema({
  row: { type: String, required: true }, // Example: "A"
  col: { type: String, required: true }, // Example: "13"
  username : {type: String , require: true},
  message: { type: String, required: true }, // Message text
  createdAt: { type: Date, default: Date.now }, // Timestamp
});

export default mongoose.models.Chat || mongoose.model("Chat", ChatSchema);
