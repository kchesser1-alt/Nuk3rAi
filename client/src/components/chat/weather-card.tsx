import { Cloud, Eye, Wind, Droplets, Gauge, Sun } from "lucide-react";

interface WeatherData {
  location: string;
  temperature: number;
  feelsLike: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  windDirection: string;
  visibility: number;
  pressure: number;
  uvIndex: number;
  timestamp: string;
}

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const getWeatherIcon = (condition: string) => {
    const lowerCondition = condition.toLowerCase();
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className="w-6 h-6 text-primary animate-pulse-slow" />;
    } else if (lowerCondition.includes('cloud') || lowerCondition.includes('overcast')) {
      return <Cloud className="w-6 h-6 text-accent" />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return <Droplets className="w-6 h-6 text-blue-400" />;
    } else if (lowerCondition.includes('wind')) {
      return <Wind className="w-6 h-6 text-accent" />;
    } else {
      return <Cloud className="w-6 h-6 text-accent" />;
    }
  };

  return (
    <div className="weather-card rounded-2xl p-6 neon-border transition-all duration-300 animate-slide-up" data-testid="card-weather">
      {/* Header Section */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {getWeatherIcon(data.condition)}
            <div>
              <h3 className="text-lg font-semibold text-foreground" data-testid="text-location">
                {data.location}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid="text-condition">
                {data.condition}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1" data-testid="text-timestamp">
            Updated {new Date(data.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        
        <div className="text-right">
          <div className="text-4xl font-bold text-primary mb-1" data-testid="text-temperature">
            {data.temperature}°
          </div>
          <div className="text-sm text-muted-foreground" data-testid="text-feels-like">
            Feels like {data.feelsLike}°C
          </div>
        </div>
      </div>
      
      {/* Main Conditions */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
          <Eye className="w-4 h-4 text-accent flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Visibility</div>
            <div className="text-sm font-medium" data-testid="text-visibility">{data.visibility} km</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
          <Wind className="w-4 h-4 text-accent flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Wind</div>
            <div className="text-sm font-medium" data-testid="text-wind">{data.windSpeed} km/h {data.windDirection}</div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 p-3 rounded-lg bg-background/30 backdrop-blur-sm">
          <Droplets className="w-4 h-4 text-accent flex-shrink-0" />
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground">Humidity</div>
            <div className="text-sm font-medium" data-testid="text-humidity">{data.humidity}%</div>
          </div>
        </div>
      </div>
      
      {/* Additional Data */}
      <div className="pt-4 border-t border-primary/20">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Gauge className="w-3 h-3" />
              Pressure
            </span>
            <span className="text-foreground font-medium" data-testid="text-pressure">{data.pressure} hPa</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1 text-muted-foreground">
              <Sun className="w-3 h-3" />
              UV Index
            </span>
            <span className="text-foreground font-medium" data-testid="text-uv">{data.uvIndex}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
