import React, { createContext, useContext, useReducer, useEffect, useCallback, ReactNode } from 'react';
import {
  Location,
  WeatherData,
  HistoricalWeather,
  TemperatureUnit,
  WeatherCondition,
  WeatherError,
} from '@/types/weather';
import {
  getWeatherData,
  getHistoricalWeather,
  getCurrentPosition,
  reverseGeocode,
} from '@/services/weatherApi';
import {
  getPreferences,
  savePreferences,
  getFavoriteLocations,
  saveFavoriteLocation,
  removeFavoriteLocation,
  getRecentLocations,
  addRecentLocation,
  isFavoriteLocation,
} from '@/utils/storage';

// State type
interface WeatherState {
  // Weather data
  currentLocation: Location | null;
  weatherData: WeatherData | null;
  historicalData: HistoricalWeather[] | null;
  
  // UI state
  isLoading: boolean;
  isLoadingHistorical: boolean;
  error: WeatherError | null;
  
  // User preferences
  temperatureUnit: TemperatureUnit;
  theme: 'auto' | 'light' | 'dark';
  
  // Saved locations
  favoriteLocations: Location[];
  recentLocations: Location[];
  
  // Current weather condition for theming
  currentCondition: WeatherCondition;
  isDay: boolean;
}

// Action types
type WeatherAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_LOADING_HISTORICAL'; payload: boolean }
  | { type: 'SET_ERROR'; payload: WeatherError | null }
  | { type: 'SET_LOCATION'; payload: Location }
  | { type: 'SET_WEATHER_DATA'; payload: WeatherData }
  | { type: 'SET_HISTORICAL_DATA'; payload: HistoricalWeather[] | null }
  | { type: 'SET_TEMPERATURE_UNIT'; payload: TemperatureUnit }
  | { type: 'SET_THEME'; payload: 'auto' | 'light' | 'dark' }
  | { type: 'SET_FAVORITES'; payload: Location[] }
  | { type: 'ADD_FAVORITE'; payload: Location }
  | { type: 'REMOVE_FAVORITE'; payload: string }
  | { type: 'SET_RECENT'; payload: Location[] }
  | { type: 'ADD_RECENT'; payload: Location };

// Initial state
const initialState: WeatherState = {
  currentLocation: null,
  weatherData: null,
  historicalData: null,
  isLoading: false,
  isLoadingHistorical: false,
  error: null,
  temperatureUnit: 'celsius',
  theme: 'auto',
  favoriteLocations: [],
  recentLocations: [],
  currentCondition: 'clear',
  isDay: true,
};

// Reducer
function weatherReducer(state: WeatherState, action: WeatherAction): WeatherState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload, error: action.payload ? null : state.error };
    case 'SET_LOADING_HISTORICAL':
      return { ...state, isLoadingHistorical: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload };
    case 'SET_WEATHER_DATA':
      return {
        ...state,
        weatherData: action.payload,
        currentCondition: action.payload.current.condition,
        isDay: action.payload.current.isDay,
        isLoading: false,
        error: null,
      };
    case 'SET_HISTORICAL_DATA':
      return { ...state, historicalData: action.payload, isLoadingHistorical: false };
    case 'SET_TEMPERATURE_UNIT':
      return { ...state, temperatureUnit: action.payload };
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    case 'SET_FAVORITES':
      return { ...state, favoriteLocations: action.payload };
    case 'ADD_FAVORITE':
      return {
        ...state,
        favoriteLocations: [action.payload, ...state.favoriteLocations.filter(l => l.id !== action.payload.id)],
      };
    case 'REMOVE_FAVORITE':
      return {
        ...state,
        favoriteLocations: state.favoriteLocations.filter(l => l.id !== action.payload),
      };
    case 'SET_RECENT':
      return { ...state, recentLocations: action.payload };
    case 'ADD_RECENT':
      return {
        ...state,
        recentLocations: [action.payload, ...state.recentLocations.filter(l => l.id !== action.payload.id)].slice(0, 5),
      };
    default:
      return state;
  }
}

// Context type
interface WeatherContextType extends WeatherState {
  // Actions
  fetchWeatherForLocation: (location: Location, forceRefresh?: boolean) => Promise<void>;
  fetchHistoricalData: (startDate: string, endDate: string, forceRefresh?: boolean) => Promise<void>;
  detectUserLocation: () => Promise<void>;
  setTemperatureUnit: (unit: TemperatureUnit) => void;
  setTheme: (theme: 'auto' | 'light' | 'dark') => void;
  addToFavorites: (location: Location) => void;
  removeFromFavorites: (locationId: string) => void;
  isLocationFavorite: (locationId: string) => boolean;
  clearError: () => void;
  refreshWeather: () => Promise<void>;
}

// Create context
const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

// Provider component
export function WeatherProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(weatherReducer, initialState);

  // Load preferences and saved locations on mount
  useEffect(() => {
    const prefs = getPreferences();
    dispatch({ type: 'SET_TEMPERATURE_UNIT', payload: prefs.temperatureUnit });
    dispatch({ type: 'SET_THEME', payload: prefs.theme });
    dispatch({ type: 'SET_FAVORITES', payload: getFavoriteLocations() });
    dispatch({ type: 'SET_RECENT', payload: getRecentLocations() });
  }, []);

  // Fetch weather for a location
  const fetchWeatherForLocation = useCallback(async (location: Location, forceRefresh = false) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_LOCATION', payload: location });

    try {
      const data = await getWeatherData(location, forceRefresh);
      dispatch({ type: 'SET_WEATHER_DATA', payload: data });
      
      // Add to recent locations
      addRecentLocation(location);
      dispatch({ type: 'ADD_RECENT', payload: location });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as WeatherError });
    }
  }, []);

  // Fetch historical data
  const fetchHistoricalData = useCallback(async (startDate: string, endDate: string, forceRefresh = false) => {
    if (!state.currentLocation) return;

    dispatch({ type: 'SET_LOADING_HISTORICAL', payload: true });

    try {
      const data = await getHistoricalWeather(state.currentLocation, startDate, endDate, forceRefresh);
      dispatch({ type: 'SET_HISTORICAL_DATA', payload: data });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error as WeatherError });
      dispatch({ type: 'SET_LOADING_HISTORICAL', payload: false });
    }
  }, [state.currentLocation]);

  // Detect user's current location
  const detectUserLocation = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });

    try {
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      const location = await reverseGeocode(latitude, longitude);
      if (location) {
        await fetchWeatherForLocation(location);
      }
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: {
          code: 'GEOLOCATION_ERROR',
          message: 'Unable to detect your location. Please search for a city.',
        },
      });
    }
  }, [fetchWeatherForLocation]);

  // Set temperature unit
  const setTemperatureUnit = useCallback((unit: TemperatureUnit) => {
    dispatch({ type: 'SET_TEMPERATURE_UNIT', payload: unit });
    savePreferences({ temperatureUnit: unit });
  }, []);

  // Set theme
  const setTheme = useCallback((theme: 'auto' | 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
    savePreferences({ theme });
  }, []);

  // Add to favorites
  const addToFavorites = useCallback((location: Location) => {
    saveFavoriteLocation(location);
    dispatch({ type: 'ADD_FAVORITE', payload: { ...location, isFavorite: true } });
  }, []);

  // Remove from favorites
  const removeFromFavorites = useCallback((locationId: string) => {
    removeFavoriteLocation(locationId);
    dispatch({ type: 'REMOVE_FAVORITE', payload: locationId });
  }, []);

  // Check if location is favorite
  const isLocationFavorite = useCallback((locationId: string) => {
    return isFavoriteLocation(locationId);
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: 'SET_ERROR', payload: null });
  }, []);

  // Refresh current weather
  const refreshWeather = useCallback(async () => {
    if (state.currentLocation) {
      await fetchWeatherForLocation(state.currentLocation, true);
    }
  }, [state.currentLocation, fetchWeatherForLocation]);

  const value: WeatherContextType = {
    ...state,
    fetchWeatherForLocation,
    fetchHistoricalData,
    detectUserLocation,
    setTemperatureUnit,
    setTheme,
    addToFavorites,
    removeFromFavorites,
    isLocationFavorite,
    clearError,
    refreshWeather,
  };

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

// Custom hook to use weather context
export function useWeather() {
  const context = useContext(WeatherContext);
  if (context === undefined) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
}

