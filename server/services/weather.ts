export interface DailyForecast {
  date: string;
  highTemp: number;
  lowTemp: number;
  condition: string;
  weatherCode: number;
  uvIndex: number;
  chanceOfRain: number;
}

export interface WeatherData {
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

// Weather code to description mapping for Open-Meteo API
const getWeatherCondition = (weatherCode: number): string => {
  const weatherCodes: { [key: number]: string } = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    56: "Light freezing drizzle",
    57: "Dense freezing drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    66: "Light freezing rain",
    67: "Heavy freezing rain",
    71: "Slight snow fall",
    73: "Moderate snow fall",
    75: "Heavy snow fall",
    77: "Snow grains",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    85: "Slight snow showers",
    86: "Heavy snow showers",
    95: "Thunderstorm",
    96: "Thunderstorm with slight hail",
    99: "Thunderstorm with heavy hail"
  };
  return weatherCodes[weatherCode] || "Unknown";
};

export async function getWeatherData(location: string): Promise<WeatherData> {
  try {
    // Get coordinates from location name using Open-Meteo Geocoding API
    const geoResponse = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
    );
    
    if (!geoResponse.ok) {
      throw new Error("Failed to geocode location");
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.results || !geoData.results.length) {
      throw new Error("Location not found");
    }
    
    const { latitude, longitude, name, country } = geoData.results[0];
    
    // Get weather data using Open-Meteo Forecast API with imperial units (Fahrenheit) and 7-day forecast
    const weatherResponse = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m,visibility&daily=temperature_2m_max,temperature_2m_min,weather_code,uv_index_max,precipitation_probability_max&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=auto&forecast_days=7`
    );
    
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const daily = weatherData.daily;
    
    // Convert wind direction from degrees to cardinal direction
    const windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const windDirection = windDirections[Math.round(current.wind_direction_10m / 22.5) % 16] || 'N';
    
    return {
      location: country ? `${name}, ${country}` : name,
      temperature: Math.round(current.temperature_2m),
      feelsLike: Math.round(current.apparent_temperature),
      condition: getWeatherCondition(current.weather_code),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m), // Open-Meteo returns mph with imperial units
      windDirection,
      visibility: Math.round(current.visibility / 1609.34), // Convert m to miles
      pressure: Math.round(current.surface_pressure),
      uvIndex: Math.round(daily?.uv_index_max?.[0] || 0),
      timestamp: new Date().toLocaleString(),
      forecast: daily?.time?.map((date: string, index: number) => ({
        date,
        highTemp: Math.round(daily.temperature_2m_max[index]),
        lowTemp: Math.round(daily.temperature_2m_min[index]),
        condition: getWeatherCondition(daily.weather_code[index]),
        weatherCode: daily.weather_code[index],
        uvIndex: Math.round(daily.uv_index_max[index] || 0),
        chanceOfRain: Math.round(daily.precipitation_probability_max[index] || 0)
      })) || []
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data. Please check the location and try again.");
  }
}
