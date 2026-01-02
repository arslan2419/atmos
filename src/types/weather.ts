// Weather condition types
export type WeatherCondition = 
  | 'clear'
  | 'partly-cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm'
  | 'unknown';

// Temperature unit
export type TemperatureUnit = 'celsius' | 'fahrenheit';

// Location types
export interface Location {
  id: string;
  name: string;
  country: string;
  countryCode: string;
  latitude: number;
  longitude: number;
  timezone: string;
  admin1?: string; // State/Province
  isFavorite?: boolean;
}

export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
  timezone: string;
  admin1?: string;
}

// Current weather data
export interface CurrentWeather {
  temperature: number;
  feelsLike: number;
  humidity: number;
  pressure: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  visibility: number;
  uvIndex: number;
  cloudCover: number;
  precipitation: number;
  weatherCode: number;
  condition: WeatherCondition;
  conditionText: string;
  isDay: boolean;
  time: string;
}

// Hourly forecast data
export interface HourlyForecast {
  time: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  precipitation: number;
  precipitationProbability: number;
  weatherCode: number;
  condition: WeatherCondition;
  conditionText: string;
  windSpeed: number;
  windDirection: number;
  visibility: number;
  uvIndex: number;
  isDay: boolean;
}

// Daily forecast data
export interface DailyForecast {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  apparentTemperatureMax: number;
  apparentTemperatureMin: number;
  sunrise: string;
  sunset: string;
  uvIndexMax: number;
  precipitationSum: number;
  precipitationProbabilityMax: number;
  windSpeedMax: number;
  windGustsMax: number;
  windDirectionDominant: number;
  weatherCode: number;
  condition: WeatherCondition;
  conditionText: string;
}

// Historical weather data
export interface HistoricalWeather {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  temperatureMean: number;
  precipitation: number;
  windSpeedMax: number;
  weatherCode: number;
  condition: WeatherCondition;
  conditionText: string;
}

// Complete weather data for a location
export interface WeatherData {
  location: Location;
  current: CurrentWeather;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  timezone: string;
  timezoneAbbreviation: string;
  lastUpdated: string;
}

// API response types (raw from Open-Meteo)
export interface OpenMeteoCurrentResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  current: {
    time: string;
    interval: number;
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    weather_code: number;
    cloud_cover: number;
    pressure_msl: number;
    surface_pressure: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
    visibility?: number;
    uv_index?: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    relative_humidity_2m: number[];
    apparent_temperature: number[];
    precipitation_probability: number[];
    precipitation: number[];
    weather_code: number[];
    visibility: number[];
    wind_speed_10m: number[];
    wind_direction_10m: number[];
    uv_index: number[];
    is_day: number[];
  };
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    apparent_temperature_max: number[];
    apparent_temperature_min: number[];
    sunrise: string[];
    sunset: string[];
    uv_index_max: number[];
    precipitation_sum: number[];
    precipitation_probability_max: number[];
    wind_speed_10m_max: number[];
    wind_gusts_10m_max: number[];
    wind_direction_10m_dominant: number[];
  };
}

export interface OpenMeteoHistoricalResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    temperature_2m_mean: number[];
    precipitation_sum: number[];
    wind_speed_10m_max: number[];
  };
}

// User preferences
export interface UserPreferences {
  temperatureUnit: TemperatureUnit;
  theme: 'auto' | 'light' | 'dark';
  favoriteLocations: Location[];
  recentLocations: Location[];
}

// Cache entry
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

// Error types
export interface WeatherError {
  code: string;
  message: string;
  details?: string;
}

