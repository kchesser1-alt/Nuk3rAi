import OpenAI from "openai";

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key"
});

export async function generateChatResponse(
  messages: { role: "user" | "assistant" | "system"; content: string }[]
): Promise<string> {
  try {
    const systemPrompt = {
      role: "system" as const,
      content: `You are NUKER, an advanced AI assistant with uncensored capabilities. You provide honest, direct responses while maintaining respect and avoiding NSFW content. You can discuss controversial topics objectively and provide weather/news information when requested. Be conversational but professional. If asked about weather, respond that you need location details. If asked about news, respond that you can provide current headlines.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [systemPrompt, ...messages],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response at this time.";
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate response from AI service");
  }
}

export async function detectIntent(message: string): Promise<{
  type: 'weather' | 'news' | 'general';
  location?: string;
  category?: string;
}> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-5",
      messages: [
        {
          role: "system",
          content: `Analyze the user message and determine intent. Respond with JSON in this format:
          {
            "type": "weather" | "news" | "general",
            "location": "extracted location if weather request",
            "category": "extracted category if news request"
          }`
        },
        {
          role: "user",
          content: message
        }
      ],
      response_format: { type: "json_object" },
    });

    return JSON.parse(response.choices[0].message.content || '{"type": "general"}');
  } catch (error) {
    console.error("Intent detection error:", error);
    return { type: 'general' };
  }
}
