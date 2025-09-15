import { 
  Cloud, Eye, Wind, Droplets, Gauge, Sun, CloudRain, 
  CloudSnow, Zap, CloudDrizzle, CloudLightning, Thermometer,
  Calendar, TrendingUp, TrendingDown, ArrowUp, ArrowDown,
  Sunrise, Sunset, Activity, Shield
} from "lucide-react";
import { motion } from "framer-motion";

interface DailyForecast {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  weatherCode: number;
  uvIndex: number;
  chanceOfRain: number;
}

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
  forecast: DailyForecast[];
}

interface WeatherCardProps {
  data: WeatherData;
}

export function WeatherCard({ data }: WeatherCardProps) {
  const getWeatherIcon = (condition: string, size: "sm" | "md" | "lg" = "md", animated: boolean = true) => {
    const lowerCondition = condition.toLowerCase();
    const sizeClass = size === "sm" ? "w-4 h-4" : size === "md" ? "w-6 h-6" : "w-8 h-8";
    const animationClass = animated ? "animate-pulse-slow" : "";
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return <Sun className={`${sizeClass} text-yellow-400 ${animationClass}`} />;
    } else if (lowerCondition.includes('partly') || lowerCondition.includes('mainly')) {
      return <Cloud className={`${sizeClass} text-blue-300 ${animationClass}`} />;
    } else if (lowerCondition.includes('overcast') || lowerCondition.includes('cloudy')) {
      return <Cloud className={`${sizeClass} text-gray-400 ${animationClass}`} />;
    } else if (lowerCondition.includes('thunderstorm') || lowerCondition.includes('lightning')) {
      return <CloudLightning className={`${sizeClass} text-purple-400 ${animationClass}`} />;
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('shower')) {
      return <CloudRain className={`${sizeClass} text-blue-400 ${animationClass}`} />;
    } else if (lowerCondition.includes('drizzle')) {
      return <CloudDrizzle className={`${sizeClass} text-blue-300 ${animationClass}`} />;
    } else if (lowerCondition.includes('snow')) {
      return <CloudSnow className={`${sizeClass} text-blue-100 ${animationClass}`} />;
    } else if (lowerCondition.includes('fog')) {
      return <Cloud className={`${sizeClass} text-gray-300 ${animationClass}`} />;
    } else {
      return <Cloud className={`${sizeClass} text-accent ${animationClass}`} />;
    }
  };

  const getUVLevel = (uvIndex: number) => {
    if (uvIndex <= 2) return { level: "Low", color: "text-green-400", bg: "bg-green-400/20" };
    if (uvIndex <= 5) return { level: "Moderate", color: "text-yellow-400", bg: "bg-yellow-400/20" };
    if (uvIndex <= 7) return { level: "High", color: "text-orange-400", bg: "bg-orange-400/20" };
    if (uvIndex <= 10) return { level: "Very High", color: "text-red-400", bg: "bg-red-400/20" };
    return { level: "Extreme", color: "text-purple-400", bg: "bg-purple-400/20" };
  };

  const getTemperatureTrend = (forecast: DailyForecast[]) => {
    if (forecast.length < 2) return null;
    const today = forecast[0]?.highTemp || 0;
    const tomorrow = forecast[1]?.highTemp || 0;
    const diff = tomorrow - today;
    
    if (Math.abs(diff) < 2) return { trend: "stable", icon: null, text: "Stable" };
    if (diff > 0) return { trend: "up", icon: <TrendingUp className="w-3 h-3" />, text: `+${diff}°F` };
    return { trend: "down", icon: <TrendingDown className="w-3 h-3" />, text: `${diff}°F` };
  };

  const formatDate = (dateString: string, format: "short" | "long" = "short") => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return "Today";
    if (date.toDateString() === tomorrow.toDateString()) return "Tomorrow";
    
    return format === "short" 
      ? date.toLocaleDateString('en-US', { weekday: 'short' })
      : date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const uvLevel = getUVLevel(data.uvIndex);
  const temperatureTrend = getTemperatureTrend(data.forecast);
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: true 
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="weather-card-premium rounded-3xl p-8 backdrop-blur-xl border border-white/10 shadow-2xl overflow-hidden relative"
      data-testid="card-weather"
    >
      {/* Premium Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary/10 to-transparent rounded-bl-full pointer-events-none" />
      
      <div className="relative z-10">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 backdrop-blur-sm border border-white/10"
              >
                {getWeatherIcon(data.condition, "lg")}
              </motion.div>
              
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight" data-testid="text-location">
                  {data.location}
                </h3>
                <p className="text-base text-muted-foreground mb-1" data-testid="text-condition">
                  {data.condition}
                </p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Activity className="w-3 h-3" />
                  <span data-testid="text-timestamp">
                    Updated {currentTime}
                  </span>
                  {temperatureTrend && (
                    <>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        {temperatureTrend.icon}
                        <span className={temperatureTrend.trend === 'up' ? 'text-red-400' : temperatureTrend.trend === 'down' ? 'text-blue-400' : 'text-muted-foreground'}>
                          {temperatureTrend.text}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <motion.div 
              className="text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2" 
              data-testid="text-temperature"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {data.temperature}°F
            </motion.div>
            <div className="text-base text-muted-foreground flex items-center gap-2" data-testid="text-feels-like">
              <Thermometer className="w-4 h-4" />
              Feels like {data.feelsLike}°F
            </div>
          </div>
        </div>
        
        {/* Main Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <motion.div 
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-blue-500/20">
                <Eye className="w-4 h-4 text-blue-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Visibility</span>
            </div>
            <div className="text-lg font-semibold" data-testid="text-visibility">{data.visibility} mi</div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-green-500/20">
                <Wind className="w-4 h-4 text-green-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Wind</span>
            </div>
            <div className="text-lg font-semibold" data-testid="text-wind">{data.windSpeed} mph {data.windDirection}</div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-cyan-500/20">
                <Droplets className="w-4 h-4 text-cyan-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Humidity</span>
            </div>
            <div className="text-lg font-semibold" data-testid="text-humidity">{data.humidity}%</div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300"
            whileHover={{ scale: 1.02, y: -2 }}
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Gauge className="w-4 h-4 text-purple-400" />
              </div>
              <span className="text-xs text-muted-foreground uppercase tracking-wide">Pressure</span>
            </div>
            <div className="text-lg font-semibold" data-testid="text-pressure">{data.pressure} hPa</div>
          </motion.div>
        </div>

        {/* UV Index Section */}
        <div className="mb-8">
          <motion.div 
            className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-2xl p-5 border border-white/10"
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/20">
                  <Shield className="w-5 h-5 text-yellow-400" />
                </div>
                <div>
                  <span className="text-sm text-muted-foreground uppercase tracking-wide">UV Index</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-2xl font-bold" data-testid="text-uv">{data.uvIndex}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${uvLevel.bg} ${uvLevel.color} font-medium`}>
                      {uvLevel.level}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-2 bg-gradient-to-r from-green-400 via-yellow-400 via-orange-400 via-red-400 to-purple-400 rounded-full opacity-30 mb-2" />
            <div 
              className="h-2 bg-gradient-to-r from-green-400 to-purple-400 rounded-full relative"
              style={{ width: `${Math.min((data.uvIndex / 11) * 100, 100)}%` }}
            >
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full border-2 border-current shadow-lg" />
            </div>
          </motion.div>
        </div>

        {/* 7-Day Forecast */}
        {data.forecast && data.forecast.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-primary" />
              <h4 className="text-lg font-semibold text-foreground">7-Day Forecast</h4>
            </div>
            
            <div className="space-y-3">
              {data.forecast.slice(0, 7).map((day, index) => (
                <motion.div
                  key={day.date}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                  className="bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 group"
                  data-testid={`forecast-day-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="min-w-[80px]">
                        <div className="text-sm font-medium text-foreground">
                          {formatDate(day.date)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 group-hover:scale-110 transition-transform duration-300">
                          {getWeatherIcon(day.condition, "sm", false)}
                        </div>
                        <div className="min-w-[120px]">
                          <div className="text-sm text-foreground">{day.condition}</div>
                          {day.chanceOfRain > 0 && (
                            <div className="text-xs text-blue-400 flex items-center gap-1">
                              <Droplets className="w-3 h-3" />
                              {day.chanceOfRain}%
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <ArrowUp className="w-3 h-3 text-red-400" />
                          <span className="text-lg font-semibold text-foreground" data-testid={`text-high-${index}`}>
                            {day.highTemp}°
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ArrowDown className="w-3 h-3 text-blue-400" />
                          <span className="text-sm text-muted-foreground" data-testid={`text-low-${index}`}>
                            {day.lowTemp}°
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right min-w-[60px]">
                        <div className="text-xs text-muted-foreground mb-1">UV</div>
                        <div className={`text-sm font-medium ${getUVLevel(day.uvIndex).color}`} data-testid={`text-uv-${index}`}>
                          {day.uvIndex}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}