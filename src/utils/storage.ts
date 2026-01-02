import { Location, UserPreferences, CacheEntry } from '@/types/weather';

const STORAGE_KEYS = {
  PREFERENCES: 'atmos_preferences',
  CACHE: 'atmos_cache',
  FAVORITES: 'atmos_favorites',
  RECENT: 'atmos_recent',
} as const;

const DEFAULT_PREFERENCES: UserPreferences = {
  temperatureUnit: 'celsius',
  theme: 'auto',
  favoriteLocations: [],
  recentLocations: [],
};

// Preferences
export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (stored) {
      return { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Error reading preferences:', error);
  }
  return DEFAULT_PREFERENCES;
}

export function savePreferences(preferences: Partial<UserPreferences>): void {
  try {
    const current = getPreferences();
    const updated = { ...current, ...preferences };
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
  } catch (error) {
    console.error('Error saving preferences:', error);
  }
}

// Favorite locations
export function getFavoriteLocations(): Location[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading favorites:', error);
  }
  return [];
}

export function saveFavoriteLocation(location: Location): void {
  try {
    const favorites = getFavoriteLocations();
    const exists = favorites.some((fav) => fav.id === location.id);
    if (!exists) {
      favorites.unshift({ ...location, isFavorite: true });
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites.slice(0, 10)));
    }
  } catch (error) {
    console.error('Error saving favorite:', error);
  }
}

export function removeFavoriteLocation(locationId: string): void {
  try {
    const favorites = getFavoriteLocations();
    const filtered = favorites.filter((fav) => fav.id !== locationId);
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error removing favorite:', error);
  }
}

export function isFavoriteLocation(locationId: string): boolean {
  const favorites = getFavoriteLocations();
  return favorites.some((fav) => fav.id === locationId);
}

// Recent locations
export function getRecentLocations(): Location[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error reading recent locations:', error);
  }
  return [];
}

export function addRecentLocation(location: Location): void {
  try {
    const recent = getRecentLocations();
    const filtered = recent.filter((loc) => loc.id !== location.id);
    filtered.unshift(location);
    localStorage.setItem(STORAGE_KEYS.RECENT, JSON.stringify(filtered.slice(0, 5)));
  } catch (error) {
    console.error('Error saving recent location:', error);
  }
}

export function clearRecentLocations(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.RECENT);
  } catch (error) {
    console.error('Error clearing recent locations:', error);
  }
}

// Cache management
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

export function getCachedData<T>(key: string): T | null {
  try {
    const stored = localStorage.getItem(`${STORAGE_KEYS.CACHE}_${key}`);
    if (stored) {
      const entry: CacheEntry<T> = JSON.parse(stored);
      if (Date.now() < entry.expiresAt) {
        return entry.data;
      }
      // Cache expired, remove it
      localStorage.removeItem(`${STORAGE_KEYS.CACHE}_${key}`);
    }
  } catch (error) {
    console.error('Error reading cache:', error);
  }
  return null;
}

export function setCachedData<T>(key: string, data: T, duration = CACHE_DURATION): void {
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + duration,
    };
    localStorage.setItem(`${STORAGE_KEYS.CACHE}_${key}`, JSON.stringify(entry));
  } catch (error) {
    console.error('Error setting cache:', error);
  }
}

export function clearCache(): void {
  try {
    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith(STORAGE_KEYS.CACHE)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Error clearing cache:', error);
  }
}

// Generate cache key for weather data
export function getWeatherCacheKey(lat: number, lon: number): string {
  return `weather_${lat.toFixed(2)}_${lon.toFixed(2)}`;
}

export function getHistoricalCacheKey(lat: number, lon: number, start: string, end: string): string {
  return `historical_${lat.toFixed(2)}_${lon.toFixed(2)}_${start}_${end}`;
}

