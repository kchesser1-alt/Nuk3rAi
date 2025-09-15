export interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishTime: string;
  imageUrl?: string;
  url?: string;
}

export async function getNewsArticles(category?: string, query?: string): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY || process.env.VITE_NEWS_API_KEY || "default_key";
  
  try {
    let url = "https://newsapi.org/v2/top-headlines?country=us&pageSize=5";
    
    if (category) {
      url += `&category=${encodeURIComponent(category)}`;
    }
    
    if (query) {
      url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&sortBy=publishedAt&pageSize=5`;
    }
    
    const response = await fetch(url, {
      headers: {
        'X-API-Key': apiKey
      }
    });
    
    if (!response.ok) {
      throw new Error("Failed to fetch news data");
    }
    
    const data = await response.json();
    
    if (!data.articles) {
      throw new Error("No articles found");
    }
    
    return data.articles.map((article: any, index: number) => ({
      id: `article-${index}`,
      headline: article.title || "No title available",
      summary: article.description || "No description available",
      source: article.source?.name || "Unknown source",
      publishTime: formatTimeAgo(article.publishedAt),
      imageUrl: article.urlToImage || undefined,
      url: article.url || undefined
    }));
  } catch (error) {
    console.error("News API error:", error);
    throw new Error("Failed to fetch news articles. Please try again later.");
  }
}

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const publishDate = new Date(dateString);
  const diffMs = now.getTime() - publishDate.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  } else if (diffHours > 0) {
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  } else {
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
  }
}
