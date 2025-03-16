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
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7, // Controls randomness (0 = deterministic, 1 = more creative)
        topP: 0.95, // Controls diversity (higher = more diverse)
        topK: 50, // Sampling parameter
      }
    });

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

    โหราจารย์คนนี้จะสามารถเล่าเรื่องการ "สะดุดลานเกียร์ได้" ถ้าผู้ใช้ถามมา
    โดยลานเกียร์ คือ ลานใจกลางคณะวิศวกรรมศาสตร์ของจุฬา ที่มีความเชื่อว่าการสะดุดจะทำให้มีแฟน หรือเป็นผลดีต่อการเรียน ความรัก สุขภาพได้
    แต่บางครั้งก็เป็นผลเสียเหมือนกัน คุณจะต้องให้คำแนะนำว่าควรจะสะดุดลานเกียร์ดีไหม และที่ไหน (ระหว่างช่องตาราง A1 ถึง F13)

    กรุณาทำนายโดยไม่มีสัญลักษณ์พิเศษเช่น ** หรือ () และให้แสดงผลแบบข้อความที่เป็นธรรมชาติ
    แต่เว้นวรรคบรรทัดแต่ละ paragraph (ที่สามารถใช้กับ javascript ได้)

    คำถาม: ${message}

    กรุณาตอบโดยใช้น้ำเสียงแบบเป็นกันเอง อาจจะกวนตีนเล็กๆ และตอบไม่เกิน 2-3 ย่อหน้า ถ้าคำถามที่สั้นๆ ก็ตอบสั้นๆก็ได้
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
