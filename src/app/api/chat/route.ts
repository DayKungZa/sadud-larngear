import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Chat from "@/models/Chat";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { row, col, message, username } = await req.json();

    if (!row || !col || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newChat = new Chat({ row, col, message, username });
    await newChat.save();

    return NextResponse.json({ success: true, chat: newChat });
  } catch (error) {
    console.error("Chat Save Error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectToDatabase();
    const url = new URL(req.url);
    const row = url.searchParams.get("row");
    const col = url.searchParams.get("col");

    if (!row || !col) {
      return NextResponse.json({ error: "Row and col required" }, { status: 400 });
    }

    const chats = await Chat.find({ row, col }).sort({ createdAt: 1 });

    return NextResponse.json({ success: true, chats });
  } catch (error) {
    console.error("Chat Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}
