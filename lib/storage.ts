// In-memory storage implementation for Next.js app
import { nanoid } from 'nanoid';

interface ChatSession {
  id: string;
  sessionKey: string;
  createdAt: Date;
}

interface Message {
  id: string;
  sessionId: string;
  content: string;
  role: 'user' | 'assistant';
  metadata: any;
  timestamp: Date;
  createdAt: Date;
}

class InMemoryStorage {
  private sessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, Message[]> = new Map();

  async createChatSession(data: { sessionKey: string }): Promise<ChatSession> {
    const session: ChatSession = {
      id: nanoid(),
      sessionKey: data.sessionKey,
      createdAt: new Date()
    };
    this.sessions.set(session.id, session);
    this.messages.set(session.id, []);
    return session;
  }

  async getChatSession(id: string): Promise<ChatSession | null> {
    return this.sessions.get(id) || null;
  }

  async createMessage(data: { sessionId: string; content: string; role: 'user' | 'assistant'; metadata?: any }): Promise<Message> {
    const message: Message = {
      id: nanoid(),
      sessionId: data.sessionId,
      content: data.content,
      role: data.role,
      metadata: data.metadata || null,
      timestamp: new Date(),
      createdAt: new Date()
    };
    
    const sessionMessages = this.messages.get(data.sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(data.sessionId, sessionMessages);
    
    return message;
  }

  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messages.get(sessionId) || [];
  }
}

export const storage = new InMemoryStorage();