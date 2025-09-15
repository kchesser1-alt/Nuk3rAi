interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishTime: string;
  imageUrl?: string;
  url?: string;
}

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  return (
    <div className="news-card rounded-2xl p-5 neon-border neon-glow-hover transition-all duration-300" data-testid={`card-news-${article.id}`}>
      <div className="flex items-start space-x-4">
        {article.imageUrl && (
          <img 
            src={article.imageUrl} 
            alt="News thumbnail" 
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            data-testid="img-news-thumbnail"
            onError={(e) => {
              // Fallback to a default tech/news image
              e.currentTarget.src = "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80";
            }}
          />
        )}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-foreground mb-2 line-clamp-2" data-testid="text-headline">
            {article.headline}
          </h4>
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3" data-testid="text-summary">
            {article.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span data-testid="text-source">{article.source}</span>
            <span data-testid="text-publish-time">{article.publishTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
