import axios, { AxiosError } from 'axios';
import {
  Location,
  WeatherData,
  CurrentWeather,
  HourlyForecast,
  DailyForecast,
  HistoricalWeather,
  OpenMeteoCurrentResponse,
  OpenMeteoHistoricalResponse,
  GeocodingResult,
  WeatherError,
} from '@/types/weather';
import { getWeatherCondition, getWeatherDescription } from '@/utils/weatherCodes';
import { getCachedData, setCachedData, getWeatherCacheKey, getHistoricalCacheKey } from '@/utils/storage';

const WEATHER_API_BASE = 'https://api.open-meteo.com/v1';
const HISTORICAL_API_BASE = 'https://archive-api.open-meteo.com/v1';
const GEOCODING_API_BASE = 'https://geocoding-api.open-meteo.com/v1';

// API error handler
function handleApiError(error: unknown): WeatherError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    if (axiosError.response) {
      const status = axiosError.response.status;
      if (status === 429) {
        return {
          code: 'RATE_LIMIT',
          message: 'Too many requests. Please wait a moment and try again.',
        };
      }
      if (status >= 500) {
        return {
          code: 'SERVER_ERROR',
          message: 'Weather service is temporarily unavailable. Please try again later.',
        };
      }
    }
    if (axiosError.code === 'ERR_NETWORK') {
      return {
        code: 'NETWORK_ERROR',
        message: 'Unable to connect. Please check your internet connection.',
      };
    }
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: 'An unexpected error occurred. Please try again.',
  };
}

// Search locations by name
export async function searchLocations(query: string): Promise<Location[]> {
  try {
    const response = await axios.get(`${GEOCODING_API_BASE}/search`, {
      params: {
        name: query,
        count: 10,
        language: 'en',
        format: 'json',
      },
    });

    if (!response.data.results) {
      return [];
    }

    return response.data.results.map((result: GeocodingResult) => ({
      id: `${result.latitude}_${result.longitude}`,
      name: result.name,
      country: result.country,
      countryCode: result.country_code,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      admin1: result.admin1,
    }));
  } catch (error) {
    throw handleApiError(error);
  }
}

// Reverse geocoding - get location from coordinates
export async function reverseGeocode(latitude: number, longitude: number): Promise<Location | null> {
  try {
    // Open-Meteo doesn't have reverse geocoding, so we'll create a location object
    // and use a separate service or just use coordinates
    const response = await axios.get(`${GEOCODING_API_BASE}/search`, {
      params: {
        name: `${latitude.toFixed(2)},${longitude.toFixed(2)}`,
        count: 1,
        language: 'en',
        format: 'json',
      },
    });

    // If we can't find the location, create a generic one
    if (!response.data.results || response.data.results.length === 0) {
      return {
        id: `${latitude}_${longitude}`,
        name: 'Current Location',
        country: 'Unknown',
        countryCode: 'XX',
        latitude,
        longitude,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      };
    }

    const result = response.data.results[0];
    return {
      id: `${result.latitude}_${result.longitude}`,
      name: result.name,
      country: result.country,
      countryCode: result.country_code,
      latitude: result.latitude,
      longitude: result.longitude,
      timezone: result.timezone,
      admin1: result.admin1,
    };
  } catch {
    // Return a basic location if reverse geocoding fails
    return {
      id: `${latitude}_${longitude}`,
      name: 'Current Location',
      country: 'Unknown',
      countryCode: 'XX',
      latitude,
      longitude,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }
}

// Get current weather and forecast
export async function getWeatherData(location: Location, forceRefresh = false): Promise<WeatherData> {
  const cacheKey = getWeatherCacheKey(location.latitude, location.longitude);
  
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedData<WeatherData>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await axios.get<OpenMeteoCurrentResponse>(`${WEATHER_API_BASE}/forecast`, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'is_day',
          'precipitation',
          'weather_code',
          'cloud_cover',
          'pressure_msl',
          'surface_pressure',
          'wind_speed_10m',
          'wind_direction_10m',
          'wind_gusts_10m',
        ].join(','),
        hourly: [
          'temperature_2m',
          'relative_humidity_2m',
          'apparent_temperature',
          'precipitation_probability',
          'precipitation',
          'weather_code',
          'visibility',
          'wind_speed_10m',
          'wind_direction_10m',
          'uv_index',
          'is_day',
        ].join(','),
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'apparent_temperature_max',
          'apparent_temperature_min',
          'sunrise',
          'sunset',
          'uv_index_max',
          'precipitation_sum',
          'precipitation_probability_max',
          'wind_speed_10m_max',
          'wind_gusts_10m_max',
          'wind_direction_10m_dominant',
        ].join(','),
        timezone: 'auto',
        forecast_days: 14,
        forecast_hours: 48,
      },
    });

    const data = response.data;
    const weatherData = transformWeatherData(data, location);
    
    // Cache the result
    setCachedData(cacheKey, weatherData);
    
    return weatherData;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Transform API response to our data structure
function transformWeatherData(data: OpenMeteoCurrentResponse, location: Location): WeatherData {
  const current: CurrentWeather = {
    temperature: data.current.temperature_2m,
    feelsLike: data.current.apparent_temperature,
    humidity: data.current.relative_humidity_2m,
    pressure: data.current.pressure_msl,
    windSpeed: data.current.wind_speed_10m,
    windDirection: data.current.wind_direction_10m,
    windGusts: data.current.wind_gusts_10m,
    visibility: data.current.visibility ?? 10000,
    uvIndex: data.current.uv_index ?? 0,
    cloudCover: data.current.cloud_cover,
    precipitation: data.current.precipitation,
    weatherCode: data.current.weather_code,
    condition: getWeatherCondition(data.current.weather_code),
    conditionText: getWeatherDescription(data.current.weather_code),
    isDay: data.current.is_day === 1,
    time: data.current.time,
  };

  const hourly: HourlyForecast[] = data.hourly.time.map((time, index) => ({
    time,
    temperature: data.hourly.temperature_2m[index],
    feelsLike: data.hourly.apparent_temperature[index],
    humidity: data.hourly.relative_humidity_2m[index],
    precipitation: data.hourly.precipitation[index],
    precipitationProbability: data.hourly.precipitation_probability[index],
    weatherCode: data.hourly.weather_code[index],
    condition: getWeatherCondition(data.hourly.weather_code[index]),
    conditionText: getWeatherDescription(data.hourly.weather_code[index]),
    windSpeed: data.hourly.wind_speed_10m[index],
    windDirection: data.hourly.wind_direction_10m[index],
    visibility: data.hourly.visibility[index],
    uvIndex: data.hourly.uv_index[index],
    isDay: data.hourly.is_day[index] === 1,
  }));

  const daily: DailyForecast[] = data.daily.time.map((date, index) => ({
    date,
    temperatureMax: data.daily.temperature_2m_max[index],
    temperatureMin: data.daily.temperature_2m_min[index],
    apparentTemperatureMax: data.daily.apparent_temperature_max[index],
    apparentTemperatureMin: data.daily.apparent_temperature_min[index],
    sunrise: data.daily.sunrise[index],
    sunset: data.daily.sunset[index],
    uvIndexMax: data.daily.uv_index_max[index],
    precipitationSum: data.daily.precipitation_sum[index],
    precipitationProbabilityMax: data.daily.precipitation_probability_max[index],
    windSpeedMax: data.daily.wind_speed_10m_max[index],
    windGustsMax: data.daily.wind_gusts_10m_max[index],
    windDirectionDominant: data.daily.wind_direction_10m_dominant[index],
    weatherCode: data.daily.weather_code[index],
    condition: getWeatherCondition(data.daily.weather_code[index]),
    conditionText: getWeatherDescription(data.daily.weather_code[index]),
  }));

  return {
    location,
    current,
    hourly,
    daily,
    timezone: data.timezone,
    timezoneAbbreviation: data.timezone_abbreviation,
    lastUpdated: new Date().toISOString(),
  };
}

// Get historical weather data
export async function getHistoricalWeather(
  location: Location,
  startDate: string,
  endDate: string,
  forceRefresh = false
): Promise<HistoricalWeather[]> {
  const cacheKey = getHistoricalCacheKey(location.latitude, location.longitude, startDate, endDate);
  
  // Check cache first
  if (!forceRefresh) {
    const cached = getCachedData<HistoricalWeather[]>(cacheKey);
    if (cached) {
      return cached;
    }
  }

  try {
    const response = await axios.get<OpenMeteoHistoricalResponse>(`${HISTORICAL_API_BASE}/archive`, {
      params: {
        latitude: location.latitude,
        longitude: location.longitude,
        start_date: startDate,
        end_date: endDate,
        daily: [
          'weather_code',
          'temperature_2m_max',
          'temperature_2m_min',
          'temperature_2m_mean',
          'precipitation_sum',
          'wind_speed_10m_max',
        ].join(','),
        timezone: 'auto',
      },
    });

    const data = response.data;
    const historicalData: HistoricalWeather[] = data.daily.time.map((date, index) => ({
      date,
      temperatureMax: data.daily.temperature_2m_max[index],
      temperatureMin: data.daily.temperature_2m_min[index],
      temperatureMean: data.daily.temperature_2m_mean[index],
      precipitation: data.daily.precipitation_sum[index],
      windSpeedMax: data.daily.wind_speed_10m_max[index],
      weatherCode: data.daily.weather_code[index],
      condition: getWeatherCondition(data.daily.weather_code[index]),
      conditionText: getWeatherDescription(data.daily.weather_code[index]),
    }));

    // Cache the result (longer cache for historical data)
    setCachedData(cacheKey, historicalData, 60 * 60 * 1000); // 1 hour
    
    return historicalData;
  } catch (error) {
    throw handleApiError(error);
  }
}

// Get user's current position
export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  });
}

