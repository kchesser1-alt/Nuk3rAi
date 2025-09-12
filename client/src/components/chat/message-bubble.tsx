interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: any;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex items-start space-x-4 ${isUser ? 'justify-end' : ''}`}>
      {!isUser && (
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold" data-testid="avatar-assistant">
          N
        </div>
      )}
      
      <div className={`max-w-2xl ${isUser ? 'order-1' : ''}`}>
        <div className={`rounded-2xl p-4 ${
          isUser 
            ? 'bg-primary/10 border border-primary/30' 
            : 'message-bubble neon-border'
        }`} data-testid={`message-${role}`}>
          <p className="text-foreground">{content}</p>
        </div>
        <div className="text-xs text-muted-foreground mt-1 px-2" data-testid="text-timestamp">
          {new Date(timestamp).toLocaleTimeString()}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-secondary-foreground text-sm font-bold" data-testid="avatar-user">
          U
        </div>
      )}
    </div>
  );
}
