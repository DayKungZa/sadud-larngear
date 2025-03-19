// app/api/chatAll/route.ts
import { NextResponse } from "next/server";
import { connectToDatabase } from "@/libs/mongodb";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    await connectToDatabase();

    // 1) Get all chats
    const allChats = await Chat.find();

    // 2) Aggregate sums & counts by "row:col"
    //    e.g. cellMap["A:1"] = { totalLove, totalMoney, totalHealth, count }
    const cellMap: Record<
      string,
      { totalLove: number; totalMoney: number; totalHealth: number; count: number }
    > = {};

    allChats.forEach((chat) => {
      const row = chat.row;
      const col = chat.col;
      const key = `${row}:${col}`;

      if (!cellMap[key]) {
        cellMap[key] = {
          totalLove: 0,
          totalMoney: 0,
          totalHealth: 0,
          count: 0,
        };
      }
      cellMap[key].totalLove += chat.love || 0;
      cellMap[key].totalMoney += chat.money || 0;
      cellMap[key].totalHealth += chat.health || 0;
      cellMap[key].count++;
    });

    // 3) Convert sums to averages for each cell => "A:1": { love, money, health }
    const data: Record<string, { love: number; money: number; health: number }> = {};

    Object.entries(cellMap).forEach(([key, value]) => {
      const { totalLove, totalMoney, totalHealth, count } = value;
      data[key] = {
        love: totalLove / count,
        money: totalMoney / count,
        health: totalHealth / count,
      };
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("chatAll fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch all chats" }, { status: 500 });
  }
}
