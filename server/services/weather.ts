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
}

export async function getWeatherData(location: string): Promise<WeatherData> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY || process.env.VITE_OPENWEATHERMAP_API_KEY || "default_key";
  
  try {
    // Get coordinates from location name
    const geoResponse = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=${apiKey}`
    );
    
    if (!geoResponse.ok) {
      throw new Error("Failed to geocode location");
    }
    
    const geoData = await geoResponse.json();
    
    if (!geoData.length) {
      throw new Error("Location not found");
    }
    
    const { lat, lon, name, country } = geoData[0];
    
    // Get weather data
    const weatherResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
    );
    
    if (!weatherResponse.ok) {
      throw new Error("Failed to fetch weather data");
    }
    
    const weatherData = await weatherResponse.json();
    
    const windDirections = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const windDirection = windDirections[Math.round(weatherData.wind?.deg / 22.5) % 16] || 'N';
    
    return {
      location: `${name}, ${country}`,
      temperature: Math.round(weatherData.main.temp),
      feelsLike: Math.round(weatherData.main.feels_like),
      condition: weatherData.weather[0].description,
      humidity: weatherData.main.humidity,
      windSpeed: Math.round(weatherData.wind?.speed * 3.6) || 0, // Convert m/s to km/h
      windDirection,
      visibility: Math.round((weatherData.visibility || 10000) / 1000), // Convert m to km
      pressure: weatherData.main.pressure,
      uvIndex: 0, // Would need UV Index API for this
      timestamp: new Date().toLocaleString()
    };
  } catch (error) {
    console.error("Weather API error:", error);
    throw new Error("Failed to fetch weather data. Please check the location and try again.");
  }
}
