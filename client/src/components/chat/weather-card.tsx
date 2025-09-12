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
  return (
    <div className="weather-card rounded-2xl p-6 neon-border neon-glow-hover transition-all duration-300" data-testid="card-weather">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground" data-testid="text-location">
            {data.location}
          </h3>
          <p className="text-sm text-muted-foreground" data-testid="text-timestamp">
            {data.timestamp}
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-primary" data-testid="text-temperature">
            {data.temperature}°C
          </div>
          <div className="text-sm text-muted-foreground" data-testid="text-feels-like">
            Feels like {data.feelsLike}°C
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-6 text-sm mb-4">
        <div className="flex items-center space-x-2">
          <Cloud className="w-4 h-4 text-accent" />
          <span data-testid="text-condition">{data.condition}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Eye className="w-4 h-4 text-accent" />
          <span data-testid="text-visibility">{data.visibility}km visibility</span>
        </div>
        <div className="flex items-center space-x-2">
          <Wind className="w-4 h-4 text-accent" />
          <span data-testid="text-wind">{data.windSpeed} km/h {data.windDirection}</span>
        </div>
      </div>
      
      <div className="pt-4 border-t border-border/30">
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="flex items-center space-x-1">
            <Droplets className="w-3 h-3" />
            <span>Humidity: <span className="text-foreground" data-testid="text-humidity">{data.humidity}%</span></span>
          </span>
          <span className="flex items-center space-x-1">
            <Gauge className="w-3 h-3" />
            <span>Pressure: <span className="text-foreground" data-testid="text-pressure">{data.pressure} hPa</span></span>
          </span>
          <span className="flex items-center space-x-1">
            <Sun className="w-3 h-3" />
            <span>UV Index: <span className="text-foreground" data-testid="text-uv">{data.uvIndex}</span></span>
          </span>
        </div>
      </div>
    </div>
  );
}
