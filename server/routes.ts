import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { chatMessageSchema, weatherRequestSchema, newsRequestSchema } from "@shared/schema";
import { generateChatResponse, detectIntent } from "./services/openai";
import { getWeatherData } from "./services/weather";
import { getNewsArticles } from "./services/news";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication endpoint
  app.post("/api/auth", async (req, res) => {
    try {
      const { accessKey } = req.body;
      
      if (accessKey !== "Welc0m3T0Nu3k3r") {
        return res.status(401).json({ message: "Invalid access key" });
      }
      
      const session = await storage.createChatSession({
        sessionKey: accessKey
      });
      
      res.json({ 
        message: "Authentication successful", 
        sessionId: session.id 
      });
    } catch (error) {
      console.error("Auth error:", error);
      res.status(500).json({ message: "Authentication failed" });
    }
  });

  // Chat message endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = chatMessageSchema.parse(req.body);
      
      // Verify session exists
      const session = await storage.getChatSession(validatedData.sessionId);
      if (!session) {
        return res.status(401).json({ message: "Invalid session" });
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
      
      res.json({
        message: assistantMessage.content,
        metadata: assistantMessage.metadata,
        timestamp: assistantMessage.timestamp
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ message: "Failed to process message" });
    }
  });

  // Get chat history
  app.get("/api/chat/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      
      const session = await storage.getChatSession(sessionId);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      const messages = await storage.getMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Get messages error:", error);
      res.status(500).json({ message: "Failed to retrieve messages" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
