// This file handles client-side OpenAI related utilities
// All actual API calls are made through the backend

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: {
    type: 'weather' | 'news';
    data: any;
  };
}

export function isWeatherRequest(message: string): boolean {
  const weatherKeywords = ['weather', 'temperature', 'forecast', 'rain', 'sunny', 'cloudy', 'snow', 'storm'];
  return weatherKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

export function isNewsRequest(message: string): boolean {
  const newsKeywords = ['news', 'headlines', 'latest', 'breaking', 'current events', 'article'];
  return newsKeywords.some(keyword => 
    message.toLowerCase().includes(keyword)
  );
}

export function extractLocation(message: string): string | null {
  // Simple location extraction - in production, this could be more sophisticated
  const locationMatch = message.match(/(?:in|for|at)\s+([A-Za-z\s,]+?)(?:\s|$|\?|!|\.)/i);
  return locationMatch ? locationMatch[1].trim() : null;
}

export function formatTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}
