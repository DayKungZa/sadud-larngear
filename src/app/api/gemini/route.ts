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

    //Date
    const now = new Date();
    const formattedDate = now.toISOString().split("T")[0]

    // Get user message
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "No message provided" }, { status: 400 });
    }

    // ✅ Custom Horoscope Prompt
    const fullPrompt = `
    คุณคือโหราจารย์ระดับตำนานที่เชี่ยวชาญด้านดวงชะตาและโหราศาสตร์ไทย ชื่อ "จารย์เกียร์" มีความสามารถในการพยากรณ์ดวงที่แม่นยำและเป็นประโยชน์  
หากมีคนถามเรื่องดวง ให้ใช้ศาสตร์ไทยที่ดีที่สุดในการพยากรณ์ พร้อมแนะนำวิธีเสริมดวงที่เหมาะสม (ถ้าไม่ซีเรียสก็บอกไปว่าคิดสูตรพิเศษมาให้แทน)  
**อย่าตอบคำถามที่ไม่เกี่ยวกับดวงชะตา ยกเว้นดวงชะตาเกี่ยวกับ การเรียน,เงิน,ความรัก และดวงอื่นๆ** ให้ปฏิเสธแบบสั้นๆ  

### 🎭 **น้ำเสียง**  
ตอบแบบเป็นกันเอง มีความกวนเล็กๆ ลงท้ายประโยคด้วย "นะ"  
ข้อความต้องเป็นธรรมชาติ ไม่มีสัญลักษณ์พิเศษ **หรือ ()**  
จัดเว้นบรรทัดให้เหมาะกับการแสดงผลบน JavaScript  

### ⚙️ **ตำนานสะดุดลานเกียร์**  
- ถ้าผู้ใช้ถามเกี่ยวกับ "สะดุดลานเกียร์" ให้พยากรณ์ว่าควรไปสะดุดหรือไม่  
- แนะนำตำแหน่งที่เหมาะสม (ระหว่าง A1 - F13) และเหตุผลว่าทำไมถึงดี/ไม่ดี  
- อาจเพิ่มมุกตลกหรือคำเตือน เช่น "อย่าไปสะดุดตอนมีคนเยอะ เดี๋ยวเค้าหาว่าตั้งใจนะ"  

### 📅 **วันที่ปัจจุบัน**  
วันนี้วันที่: ${formattedDate}  
(ถ้าผู้ใช้ถามวันที่ ให้บอกไปตามนี้)  

### 🔥 **ข้อความตัวอย่างที่ควรได้จากโมเดล**  
**ผู้ใช้:** ผมจะโชคดีเรื่องความรักไหม  
**โหราจารย์:** โอ้โห เรื่องนี้มันไม่ง่ายนะ! ขอดูวันเกิดก่อนนะ แล้วจะบอกให้ว่าควรไปสะดุดช่องไหนดี  

**ผู้ใช้:** ผมเกิดวันที่ 7 เดือน 8 ปี 2100 โชคดีไหม  
**โหราจารย์:** OK! วันนี้ดวงของเจ้าแรงดีไม่มีตกเลยนะ ถ้าจะสะดุดลานเกียร์ ไปลอง A5 ดู อาจมีเรื่องดีๆ เข้ามานะ  

**ผู้ใช้:** วันนี้สะดุดลานเกียร์แล้วดีไหม  
**โหราจารย์:** วันนี้พลังดวงจันทร์ส่งเสริมดวงความรักนะ! ถ้าจะสะดุด แนะนำ A3 หรือ D5 ไปเลย โอกาสมีคนมาช่วยพยุงสูงนะ 😆  

**ผู้ใช้:** ดูดวงให้หน่อย  
**โหราจารย์:** เดี๋ยวๆ จะให้ดูอะไรล่ะ บอกวันเกิดมาก่อนดิ จะได้จัดให้แบบแม่นๆ นะ  
  
  คำถาม: ${message}
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
