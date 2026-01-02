import { WeatherCondition } from '@/types/weather';

// WMO Weather interpretation codes (WW)
// https://open-meteo.com/en/docs
export const WEATHER_CODES: Record<number, { condition: WeatherCondition; description: string }> = {
  0: { condition: 'clear', description: 'Clear sky' },
  1: { condition: 'clear', description: 'Mainly clear' },
  2: { condition: 'partly-cloudy', description: 'Partly cloudy' },
  3: { condition: 'cloudy', description: 'Overcast' },
  45: { condition: 'fog', description: 'Fog' },
  48: { condition: 'fog', description: 'Depositing rime fog' },
  51: { condition: 'drizzle', description: 'Light drizzle' },
  53: { condition: 'drizzle', description: 'Moderate drizzle' },
  55: { condition: 'drizzle', description: 'Dense drizzle' },
  56: { condition: 'drizzle', description: 'Light freezing drizzle' },
  57: { condition: 'drizzle', description: 'Dense freezing drizzle' },
  61: { condition: 'rain', description: 'Slight rain' },
  63: { condition: 'rain', description: 'Moderate rain' },
  65: { condition: 'rain', description: 'Heavy rain' },
  66: { condition: 'rain', description: 'Light freezing rain' },
  67: { condition: 'rain', description: 'Heavy freezing rain' },
  71: { condition: 'snow', description: 'Slight snow fall' },
  73: { condition: 'snow', description: 'Moderate snow fall' },
  75: { condition: 'snow', description: 'Heavy snow fall' },
  77: { condition: 'snow', description: 'Snow grains' },
  80: { condition: 'rain', description: 'Slight rain showers' },
  81: { condition: 'rain', description: 'Moderate rain showers' },
  82: { condition: 'rain', description: 'Violent rain showers' },
  85: { condition: 'snow', description: 'Slight snow showers' },
  86: { condition: 'snow', description: 'Heavy snow showers' },
  95: { condition: 'thunderstorm', description: 'Thunderstorm' },
  96: { condition: 'thunderstorm', description: 'Thunderstorm with slight hail' },
  99: { condition: 'thunderstorm', description: 'Thunderstorm with heavy hail' },
};

export function getWeatherCondition(code: number): WeatherCondition {
  return WEATHER_CODES[code]?.condition || 'unknown';
}

export function getWeatherDescription(code: number): string {
  return WEATHER_CODES[code]?.description || 'Unknown';
}

export function getWindDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index];
}

export function getUVIndexLevel(uvIndex: number): { level: string; color: string } {
  if (uvIndex <= 2) return { level: 'Low', color: 'text-green-500' };
  if (uvIndex <= 5) return { level: 'Moderate', color: 'text-yellow-500' };
  if (uvIndex <= 7) return { level: 'High', color: 'text-orange-500' };
  if (uvIndex <= 10) return { level: 'Very High', color: 'text-red-500' };
  return { level: 'Extreme', color: 'text-purple-500' };
}

export function getVisibilityLevel(visibility: number): string {
  if (visibility >= 10000) return 'Excellent';
  if (visibility >= 5000) return 'Good';
  if (visibility >= 2000) return 'Moderate';
  if (visibility >= 1000) return 'Poor';
  return 'Very Poor';
}

export function getHumidityLevel(humidity: number): string {
  if (humidity < 30) return 'Low';
  if (humidity < 60) return 'Comfortable';
  if (humidity < 80) return 'Humid';
  return 'Very Humid';
}

