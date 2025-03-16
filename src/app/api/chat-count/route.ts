import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectToDatabase();

    // ✅ Group by row & col and count messages per block
    const chatCounts = await Chat.aggregate([
      { $group: { _id: { row: "$row", col: "$col" }, count: { $sum: 1 } } },
    ]);

    return NextResponse.json({ success: true, chatCounts });
  } catch (error) {
    console.error("Chat Count Fetch Error:", error);
    return NextResponse.json({ error: "Failed to fetch chat counts" }, { status: 500 });
  }
}
