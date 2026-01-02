import React, { useEffect } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { CurrentWeather } from '@/components/weather/CurrentWeather';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { WeatherDetails } from '@/components/weather/WeatherDetails';
import { SearchBar } from '@/components/search/SearchBar';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';
import { WeatherCardSkeleton } from '@/components/ui/Skeleton';
import { Card } from '@/components/ui/Card';
import { MapPin, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function HomePage() {
  const { theme } = useTheme();
  const { 
    weatherData, 
    currentLocation, 
    isLoading, 
    error,
    detectUserLocation,
    clearError,
    refreshWeather,
  } = useWeather();

  // Auto-detect location on first load if no location is set
  useEffect(() => {
    if (!currentLocation && !isLoading && !error) {
      detectUserLocation();
    }
  }, []);

  // Welcome screen when no location is selected
  if (!currentLocation && !isLoading && !error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card padding="lg" className="text-center">
          <MapPin className={`w-16 h-16 mx-auto mb-6 ${theme.textMuted}`} />
          <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
            Welcome to Atmos
          </h1>
          <p className={`${theme.textMuted} mb-8`}>
            Get real-time weather information for any location worldwide
          </p>
          
          <div className="space-y-4">
            <SearchBar />
            
            <div className="flex items-center gap-4 justify-center">
              <span className={theme.textMuted}>or</span>
            </div>
            
            <Button
              variant="secondary"
              onClick={detectUserLocation}
              leftIcon={<Navigation className="w-4 h-4" />}
              isLoading={isLoading}
            >
              Use my current location
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <ErrorDisplay
          error={error}
          onRetry={refreshWeather}
          onDismiss={clearError}
        />
        <div className="mt-8">
          <SearchBar />
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading && !weatherData) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
        <WeatherCardSkeleton />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Current Weather */}
      <CurrentWeather />

      {/* Hourly Forecast */}
      <HourlyForecast hours={24} />

      {/* Weather Details */}
      <WeatherDetails />

      {/* 7-Day Forecast */}
      <DailyForecast />
    </main>
  );
}

