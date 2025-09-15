import { useState, useEffect, useRef } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageBubble } from "@/components/chat/message-bubble";
import { WeatherCard } from "@/components/chat/weather-card";
import { NewsCard } from "@/components/chat/news-card";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Send, Paperclip, Settings } from "lucide-react";
import type { Message } from "@shared/schema";

interface ChatResponse {
  message: string;
  metadata?: {
    type: 'weather' | 'news';
    data: any;
  };
  timestamp: string;
}

export default function ChatPage() {
  const { sessionId } = useParams();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch chat history
  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ['/api/chat', sessionId, 'messages'],
    enabled: !!sessionId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat", {
        content,
        sessionId,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/chat', sessionId, 'messages'] });
      setIsTyping(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
      setIsTyping(false);
    },
  });

  const handleSendMessage = async () => {
    const content = message.trim();
    if (!content || sendMessageMutation.isPending) return;

    setMessage("");
    setIsTyping(true);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      await sendMessageMutation.mutateAsync(content);
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const autoResize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    autoResize();
  }, [message]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-space-900 to-space-800">
        <div className="text-primary animate-pulse text-lg">Initializing NUKER AI...</div>
      </div>
    );
  }

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-space-900 to-space-800">
      {/* Header */}
      <header className="border-b border-border glass-effect px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-3 h-3 bg-accent rounded-full animate-pulse" data-testid="status-indicator"></div>
            <div>
              <h1 className="text-xl font-semibold text-primary" data-testid="title-nuker-ai">NUKER AI</h1>
              <p className="text-xs text-muted-foreground" data-testid="status-text">
                System Online • Uncensored Mode Active
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-xs text-muted-foreground" data-testid="text-timestamp">
              {currentTime}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center hover:bg-secondary/30 transition-colors"
              data-testid="button-settings"
            >
              <Settings className="w-4 h-4 text-secondary" />
            </Button>
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && (
          <div className="animate-slide-up">
            <MessageBubble
              role="assistant"
              content="Welcome to NUKER AI. I'm an advanced artificial intelligence with uncensored capabilities for honest, direct responses. I can provide weather information, news updates, and engage in open discussions."
              timestamp={new Date().toISOString()}
            />
            <div className="mt-2 ml-12">
              <p className="text-sm text-muted-foreground">
                Ask me about weather, news, or anything else you'd like to discuss.
              </p>
            </div>
          </div>
        )}

        {messages.map((msg: Message) => (
          <div key={msg.id} className="animate-slide-up">
            <MessageBubble
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp.toString()}
              metadata={msg.metadata}
            />
            
            {msg.metadata && typeof msg.metadata === 'object' && 'type' in msg.metadata && msg.metadata.type === 'weather' && 'data' in msg.metadata && msg.metadata.data ? (
              <div className="mt-4 ml-12">
                <WeatherCard data={msg.metadata.data as any} />
              </div>
            ) : null}
            
            {msg.metadata && typeof msg.metadata === 'object' && 'type' in msg.metadata && msg.metadata.type === 'news' && 'data' in msg.metadata && msg.metadata.data ? (
              <div className="mt-4 ml-12 space-y-4">
                {(msg.metadata.data as any[]).map((article: any, index: number) => (
                  <NewsCard key={index} article={article} />
                ))}
              </div>
            ) : null}
          </div>
        ))}

        {isTyping && <TypingIndicator />}
        
        <div ref={messagesEndRef} />
      </main>

      {/* Input */}
      <footer className="border-t border-border glass-effect p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end space-x-4">
            <div className="flex-1">
              <Textarea
                ref={textareaRef}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={1}
                className="w-full px-4 py-3 bg-input border neon-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                placeholder="Message Nuker AI..."
                disabled={sendMessageMutation.isPending}
                data-testid="textarea-message"
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost"
                size="sm"
                className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center hover:bg-secondary/30 transition-colors"
                disabled={sendMessageMutation.isPending}
                data-testid="button-attach"
              >
                <Paperclip className="w-4 h-4 text-secondary" />
              </Button>
              
              <Button
                onClick={handleSendMessage}
                disabled={!message.trim() || sendMessageMutation.isPending}
                className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center hover:bg-primary/80 transition-colors neon-glow disabled:opacity-50"
                data-testid="button-send"
              >
                <Send className="w-4 h-4 text-primary-foreground" />
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
            <div className="flex items-center space-x-4">
              <span>Uncensored Mode: <span className="text-accent">Active</span></span>
              <span>•</span>
              <span>Model: <span className="text-primary">GPT-4o</span></span>
            </div>
            <div>
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
