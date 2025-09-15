import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';

export async function POST(request: NextRequest) {
  try {
    const { accessKey } = await request.json();
    
    const validAccessKey = process.env.ACCESS_KEY || "Welc0m3T0Nu3k3r";
    if (accessKey !== validAccessKey) {
      return NextResponse.json(
        { message: "Invalid access key" },
        { status: 401 }
      );
    }
    
    const session = await storage.createChatSession({
      sessionKey: accessKey
    });
    
    return NextResponse.json({ 
      message: "Authentication successful", 
      sessionId: session.id 
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { message: "Authentication failed" },
      { status: 500 }
    );
  }
}