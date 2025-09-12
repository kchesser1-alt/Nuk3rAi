import { NextRequest, NextResponse } from 'next/server';
import { storage } from '@/lib/storage';
import { chatMessageSchema } from '@shared/schema';
import { generateChatResponse, detectIntent } from '@/lib/services/openai';
import { getWeatherData } from '@/lib/services/weather';
import { getNewsArticles } from '@/lib/services/news';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = chatMessageSchema.parse(body);
    
    // Verify session exists
    const session = await storage.getChatSession(validatedData.sessionId);
    if (!session) {
      return NextResponse.json(
        { message: "Invalid session" },
        { status: 401 }
      );
    }
    
    // Save user message
    await storage.createMessage({
      sessionId: validatedData.sessionId,
      role: "user",
      content: validatedData.content,
      metadata: null
    });
    
    // Detect intent
    const intent = await detectIntent(validatedData.content);
    
    let assistantResponse = "";
    let metadata = null;
    
    if (intent.type === "weather" && intent.location) {
      try {
        const weatherData = await getWeatherData(intent.location);
        assistantResponse = `Here's the current weather information for ${weatherData.location}:`;
        metadata = { type: "weather", data: weatherData };
      } catch (error) {
        assistantResponse = `I couldn't fetch weather data for that location. Please check the location name and try again.`;
      }
    } else if (intent.type === "news") {
      try {
        const newsArticles = await getNewsArticles(intent.category);
        assistantResponse = intent.category 
          ? `Here are the latest ${intent.category} headlines:`
          : "Here are the latest news headlines:";
        metadata = { type: "news", data: newsArticles };
      } catch (error) {
        assistantResponse = "I couldn't fetch news articles at the moment. Please try again later.";
      }
    } else {
      // Get chat history for context
      const messages = await storage.getMessages(validatedData.sessionId);
      const chatHistory = messages.slice(-10).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      assistantResponse = await generateChatResponse([
        ...chatHistory,
        { role: "user", content: validatedData.content }
      ]);
    }
    
    // Save assistant response
    const assistantMessage = await storage.createMessage({
      sessionId: validatedData.sessionId,
      role: "assistant",
      content: assistantResponse,
      metadata: metadata
    });
    
    return NextResponse.json({
      message: assistantMessage.content,
      metadata: assistantMessage.metadata,
      timestamp: assistantMessage.timestamp
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { message: "Failed to process message" },
      { status: 500 }
    );
  }
}