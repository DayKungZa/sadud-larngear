import mongoose from "mongoose";

const MONGODB_URI: string = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

// ✅ ใช้ interface ที่ถูกต้อง
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// ✅ กำหนดให้ globalThis.mongoose มี type ที่ถูกต้อง
const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

// ✅ ตรวจสอบค่า `cached` อย่างปลอดภัย
const cached: MongooseCache = globalWithMongoose.mongoose ?? { conn: null, promise: null };

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    mongoose.Promise = global.Promise; // ✅ ป้องกัน warning ของ Mongoose ใน Next.js

    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: "10DaysChallenge",
        bufferCommands: false,
      })
      .then((mongooseInstance) => mongooseInstance);
  }

  cached.conn = await cached.promise;
  globalWithMongoose.mongoose = cached; // ✅ บันทึกค่าไว้ใน globalThis
  return cached.conn;
}
