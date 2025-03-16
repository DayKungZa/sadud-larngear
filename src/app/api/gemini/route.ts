import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    // Validate API Key
    const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!API_KEY) {
      console.error("Error: Missing API Key");
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    // Initialize Gemini AI
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // ✅ Fastest Model

    // Get user message
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // ✅ Custom Horoscope Prompt
    const fullPrompt = `
    คุณคือโหราจารย์ผู้เชี่ยวชาญด้านดวงชะตาและโหราศาสตร์ไทย
    หากมีคนถามเรื่องดวงชะตา ให้ทำนายอย่างแม่นยำและแนะนำวิธีสะเดาะเคราะห์ (ขอแบบไม่จริงจังแต่ให้บอก user ว่า อันนี้เป็นวิธีที่เราแนะนำพิเศษแทน)
    อย่าตอบคำถามอื่นที่ไม่เกี่ยวข้องกับดวงชะตาแบบสั้นๆ กระชับๆ

    กรุณาทำนายโดยไม่มีสัญลักษณ์พิเศษเช่น ** หรือ () และให้แสดงผลแบบข้อความที่เป็นธรรมชาติ

    คำถาม: ${message}

    กรุณาตอบโดยใช้โครงสร้างนี้:
    1. คำทักทายที่สุภาพ
    2. ภาพรวมดวงชะตา
    3. การงาน
    4. การเงิน
    5. ความรัก
    6. สุขภาพ
    7. คำแนะนำพิเศษ (แบบขำๆ)
    8. คำอวยพรปิดท้าย
    `;

    // Generate AI Response
    const result = await model.generateContent(fullPrompt);

    // ✅ Fix response handling
    const responseText = result.response.text?.() || "ขออภัย ระบบไม่สามารถให้คำตอบได้ในขณะนี้";

    // ✅ Format text output cleanly
    const formattedText = responseText.replace(/\n/g, "\n\n");

    return NextResponse.json({ reply: formattedText });
  } catch (error: any) {
    console.error("Gemini API Error:", error.message || error);
    return NextResponse.json({ error: "Failed to fetch response from Gemini API" }, { status: 500 });
  }
}
