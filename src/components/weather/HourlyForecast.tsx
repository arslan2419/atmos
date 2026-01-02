import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/Button';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { HourlyForecastSkeleton } from '@/components/ui/Skeleton';
import { formatTemperature } from '@/utils/temperature';
import { formatHour12h, isCurrentHour } from '@/utils/dateTime';
import { HourlyForecast as HourlyForecastType } from '@/types/weather';

interface HourlyForecastProps {
  hours?: number;
}

export function HourlyForecast({ hours = 24 }: HourlyForecastProps) {
  const { weatherData, temperatureUnit, isLoading } = useWeather();
  const scrollRef = useRef<HTMLDivElement>(null);

  if (isLoading || !weatherData) {
    return (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Hourly Forecast</CardTitle>
        </CardHeader>
        <HourlyForecastSkeleton />
      </Card>
    );
  }

  const hourlyData = weatherData.hourly.slice(0, hours);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Hourly Forecast</CardTitle>
        <div className="flex gap-1">
          <IconButton
            icon={<ChevronLeft className="w-5 h-5" />}
            onClick={() => scroll('left')}
            label="Scroll left"
            size="sm"
          />
          <IconButton
            icon={<ChevronRight className="w-5 h-5" />}
            onClick={() => scroll('right')}
            label="Scroll right"
            size="sm"
          />
        </div>
      </CardHeader>

      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 -mx-2 px-2"
        role="list"
        aria-label="Hourly weather forecast"
      >
        {hourlyData.map((hour, index) => (
          <HourlyItem
            key={hour.time}
            hour={hour}
            temperatureUnit={temperatureUnit}
            isNow={index === 0 || isCurrentHour(hour.time)}
          />
        ))}
      </div>
    </Card>
  );
}

interface HourlyItemProps {
  hour: HourlyForecastType;
  temperatureUnit: 'celsius' | 'fahrenheit';
  isNow: boolean;
}

function HourlyItem({ hour, temperatureUnit, isNow }: HourlyItemProps) {
  const { theme } = useTheme();

  return (
    <div
      className={`
        flex flex-col items-center gap-2 min-w-[70px] p-3 rounded-xl
        transition-all duration-200
        ${isNow ? `${theme.accent} shadow-lg` : `${theme.cardBg} hover:bg-white/15`}
      `}
      role="listitem"
      aria-label={`${isNow ? 'Now' : formatHour12h(hour.time)}: ${hour.conditionText}, ${formatTemperature(hour.temperature, temperatureUnit)}`}
    >
      <span className={`text-xs font-medium ${isNow ? 'text-white' : theme.textSecondary}`}>
        {isNow ? 'Now' : formatHour12h(hour.time)}
      </span>
      
      <WeatherIcon
        condition={hour.condition}
        isDay={hour.isDay}
        size="md"
        className={isNow ? 'text-white' : theme.textPrimary}
      />
      
      <span className={`text-lg font-semibold ${isNow ? 'text-white' : theme.textPrimary}`}>
        {formatTemperature(hour.temperature, temperatureUnit, false)}
      </span>

      {hour.precipitationProbability > 0 && (
        <div className={`flex items-center gap-1 ${isNow ? 'text-white/80' : theme.textMuted}`}>
          <Droplets className="w-3 h-3" />
          <span className="text-xs">{hour.precipitationProbability}%</span>
        </div>
      )}
    </div>
  );
}

