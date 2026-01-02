import React from 'react';
import { Star, MapPin, RefreshCw } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/Button';
import { WeatherCardSkeleton } from '@/components/ui/Skeleton';
import { formatTemperature } from '@/utils/temperature';
import { formatFullDate } from '@/utils/dateTime';

export function CurrentWeather() {
  const { theme } = useTheme();
  const {
    weatherData,
    currentLocation,
    temperatureUnit,
    isLoading,
    addToFavorites,
    removeFromFavorites,
    isLocationFavorite,
    refreshWeather,
  } = useWeather();

  if (isLoading || !weatherData || !currentLocation) {
    return <WeatherCardSkeleton />;
  }

  const { current, daily } = weatherData;
  const today = daily[0];
  const isFavorite = isLocationFavorite(currentLocation.id);

  const handleToggleFavorite = () => {
    if (isFavorite) {
      removeFromFavorites(currentLocation.id);
    } else {
      addToFavorites(currentLocation);
    }
  };

  return (
    <Card className="relative overflow-hidden" padding="lg">
      {/* Location Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-2">
          <MapPin className={`w-5 h-5 ${theme.textSecondary}`} />
          <div>
            <h1 className={`text-xl md:text-2xl font-bold ${theme.textPrimary}`}>
              {currentLocation.name}
            </h1>
            <p className={`text-sm ${theme.textMuted}`}>
              {currentLocation.admin1 ? `${currentLocation.admin1}, ` : ''}{currentLocation.country}
            </p>
          </div>
        </div>
        <div className="flex gap-1">
          <IconButton
            icon={<RefreshCw className="w-5 h-5" />}
            onClick={refreshWeather}
            label="Refresh weather"
            variant="ghost"
          />
          <IconButton
            icon={
              <Star
                className={`w-5 h-5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
              />
            }
            onClick={handleToggleFavorite}
            label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            variant="ghost"
          />
        </div>
      </div>

      {/* Main Weather Display */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
        {/* Temperature & Icon */}
        <div className="flex items-center gap-4">
          <WeatherIcon
            condition={current.condition}
            isDay={current.isDay}
            size="2xl"
            className={theme.textPrimary}
            animated
          />
          <div>
            <div className={`text-6xl md:text-7xl font-light ${theme.textPrimary}`}>
              {formatTemperature(current.temperature, temperatureUnit, false)}
            </div>
            <p className={`text-sm ${theme.textMuted}`}>
              Feels like {formatTemperature(current.feelsLike, temperatureUnit)}
            </p>
          </div>
        </div>

        {/* Condition & Date */}
        <div className="text-center md:text-left md:ml-auto">
          <p className={`text-xl md:text-2xl font-medium ${theme.textPrimary} mb-1`}>
            {current.conditionText}
          </p>
          <p className={`text-sm ${theme.textMuted}`}>
            {formatFullDate(current.time)}
          </p>
          <div className={`flex items-center gap-4 mt-3 ${theme.textSecondary}`}>
            <span>H: {formatTemperature(today.temperatureMax, temperatureUnit, false)}</span>
            <span>L: {formatTemperature(today.temperatureMin, temperatureUnit, false)}</span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <QuickStat
          label="Wind"
          value={`${Math.round(current.windSpeed)} km/h`}
        />
        <QuickStat
          label="Humidity"
          value={`${current.humidity}%`}
        />
        <QuickStat
          label="UV Index"
          value={`${Math.round(current.uvIndex)}`}
        />
        <QuickStat
          label="Pressure"
          value={`${Math.round(current.pressure)} hPa`}
        />
      </div>
    </Card>
  );
}

interface QuickStatProps {
  label: string;
  value: string;
}

function QuickStat({ label, value }: QuickStatProps) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.cardBg} rounded-xl p-3 text-center`}>
      <p className={`text-xs ${theme.textMuted} mb-1`}>{label}</p>
      <p className={`text-lg font-semibold ${theme.textPrimary}`}>{value}</p>
    </div>
  );
}

