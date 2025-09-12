interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  metadata?: any;
}

export function MessageBubble({ role, content, timestamp }: MessageBubbleProps) {
  const isUser = role === "user";
  
  return (
    <div className={`flex items-start gap-4 ${isUser ? 'justify-end flex-row-reverse' : ''} group animate-slide-up`}>
      {/* Avatar */}
      <div className="flex-shrink-0" data-testid={`avatar-${role}`}>
        <div className={`avatar-enhanced ${
          isUser 
            ? 'avatar-user-enhanced' 
            : 'avatar-assistant-enhanced'
        }`}>
          {isUser ? 'U' : 'N'}
        </div>
      </div>
      
      {/* Message Content */}
      <div className="max-w-2xl min-w-[120px] flex flex-col">
        <div className={`bubble-enhanced ${
          isUser 
            ? 'bubble-user' 
            : 'bubble-assistant'
        }`} data-testid={`message-${role}`}>
          <p className="text-foreground leading-relaxed whitespace-pre-wrap">{content}</p>
        </div>
        
        {/* Timestamp */}
        <div className={`timestamp-enhanced ${isUser ? 'text-right' : 'text-left'}`} data-testid="text-timestamp">
          {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
}
