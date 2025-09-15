export function TypingIndicator() {
  return (
    <div className="animate-slide-up" data-testid="typing-indicator">
      <div className="flex items-start space-x-4">
        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
          N
        </div>
        <div className="message-bubble rounded-2xl p-4 neon-border">
          <div className="flex items-center space-x-2 text-muted-foreground">
            <span>Nuker is thinking</span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
