// lib/mongoose.ts
import mongoose from "mongoose";

if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI is not set");

declare global {
  var _mongooseConn: Promise<typeof mongoose> | undefined;
}

export async function dbConnect() {
  if (!global._mongooseConn) {
    global._mongooseConn = mongoose.connect(process.env.MONGODB_URI!, {
      bufferCommands: false,
    });
  }
  return global._mongooseConn;
}
