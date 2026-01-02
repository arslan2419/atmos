import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Droplets } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { DailyForecastSkeleton } from '@/components/ui/Skeleton';
import { ToggleGroup } from '@/components/ui/Toggle';
import { formatTemperature, formatSpeed, formatPrecipitation } from '@/utils/temperature';
import { formatShortDayName, formatTime12h } from '@/utils/dateTime';
import { DailyForecast as DailyForecastType } from '@/types/weather';

type ViewMode = '7days' | '14days';

export function DailyForecast() {
  const { weatherData, temperatureUnit, isLoading } = useWeather();
  const [viewMode, setViewMode] = useState<ViewMode>('7days');
  const [expandedDay, setExpandedDay] = useState<string | null>(null);

  if (isLoading || !weatherData) {
    return (
      <Card padding="md">
        <CardHeader>
          <CardTitle>Daily Forecast</CardTitle>
        </CardHeader>
        <DailyForecastSkeleton />
      </Card>
    );
  }

  const days = viewMode === '7days' ? weatherData.daily.slice(0, 7) : weatherData.daily;

  // Find temperature range for visualization
  const allTemps = days.flatMap(d => [d.temperatureMax, d.temperatureMin]);
  const minTemp = Math.min(...allTemps);
  const maxTemp = Math.max(...allTemps);
  const tempRange = maxTemp - minTemp;

  const toggleExpanded = (date: string) => {
    setExpandedDay(expandedDay === date ? null : date);
  };

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Daily Forecast</CardTitle>
        <ToggleGroup
          value={viewMode}
          onChange={setViewMode}
          options={[
            { value: '7days', label: '7 Days' },
            { value: '14days', label: '14 Days' },
          ]}
        />
      </CardHeader>

      <div className="space-y-2" role="list" aria-label="Daily weather forecast">
        {days.map((day, index) => (
          <DailyItem
            key={day.date}
            day={day}
            temperatureUnit={temperatureUnit}
            minTemp={minTemp}
            tempRange={tempRange}
            isFirst={index === 0}
            isExpanded={expandedDay === day.date}
            onToggle={() => toggleExpanded(day.date)}
          />
        ))}
      </div>
    </Card>
  );
}

interface DailyItemProps {
  day: DailyForecastType;
  temperatureUnit: 'celsius' | 'fahrenheit';
  minTemp: number;
  tempRange: number;
  isFirst: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

function DailyItem({
  day,
  temperatureUnit,
  minTemp,
  tempRange,
  isFirst,
  isExpanded,
  onToggle,
}: DailyItemProps) {
  const { theme } = useTheme();

  // Calculate position for temperature bar
  const lowPosition = ((day.temperatureMin - minTemp) / tempRange) * 100;
  const highPosition = ((day.temperatureMax - minTemp) / tempRange) * 100;

  return (
    <div
      className={`${theme.cardBg} rounded-xl overflow-hidden transition-all duration-200`}
      role="listitem"
    >
      {/* Main Row */}
      <button
        onClick={onToggle}
        className={`
          w-full flex items-center gap-3 p-4
          hover:bg-white/5 transition-colors duration-150
          focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/30
        `}
        aria-expanded={isExpanded}
        aria-label={`${formatShortDayName(day.date)}: ${day.conditionText}, High ${formatTemperature(day.temperatureMax, temperatureUnit)}, Low ${formatTemperature(day.temperatureMin, temperatureUnit)}`}
      >
        {/* Day Name */}
        <div className="w-16 text-left">
          <span className={`font-medium ${theme.textPrimary}`}>
            {isFirst ? 'Today' : formatShortDayName(day.date)}
          </span>
        </div>

        {/* Weather Icon & Precipitation */}
        <div className="flex items-center gap-2 w-20">
          <WeatherIcon
            condition={day.condition}
            isDay={true}
            size="sm"
            className={theme.textPrimary}
          />
          {day.precipitationProbabilityMax > 0 && (
            <div className={`flex items-center gap-0.5 ${theme.textMuted}`}>
              <Droplets className="w-3 h-3" />
              <span className="text-xs">{day.precipitationProbabilityMax}%</span>
            </div>
          )}
        </div>

        {/* Temperature Bar */}
        <div className="flex-1 flex items-center gap-3">
          <span className={`text-sm w-10 text-right ${theme.textMuted}`}>
            {formatTemperature(day.temperatureMin, temperatureUnit, false)}
          </span>
          
          <div className="flex-1 h-1.5 bg-white/10 rounded-full relative">
            <div
              className="absolute h-full rounded-full bg-gradient-to-r from-blue-400 to-orange-400"
              style={{
                left: `${lowPosition}%`,
                width: `${highPosition - lowPosition}%`,
              }}
            />
          </div>
          
          <span className={`text-sm w-10 ${theme.textPrimary} font-medium`}>
            {formatTemperature(day.temperatureMax, temperatureUnit, false)}
          </span>
        </div>

        {/* Expand Button */}
        <div className={`${theme.textMuted}`}>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </div>
      </button>

      {/* Expanded Details */}
      {isExpanded && (
        <div className={`px-4 pb-4 pt-2 border-t ${theme.cardBorder} grid grid-cols-2 md:grid-cols-4 gap-3`}>
          <DetailCell
            label="Condition"
            value={day.conditionText}
          />
          <DetailCell
            label="Feels Like"
            value={`${formatTemperature(day.apparentTemperatureMax, temperatureUnit, false)} / ${formatTemperature(day.apparentTemperatureMin, temperatureUnit, false)}`}
          />
          <DetailCell
            label="Precipitation"
            value={formatPrecipitation(day.precipitationSum, temperatureUnit)}
          />
          <DetailCell
            label="Wind"
            value={formatSpeed(day.windSpeedMax, temperatureUnit)}
          />
          <DetailCell
            label="Sunrise"
            value={formatTime12h(day.sunrise)}
          />
          <DetailCell
            label="Sunset"
            value={formatTime12h(day.sunset)}
          />
          <DetailCell
            label="UV Index"
            value={`${Math.round(day.uvIndexMax)}`}
          />
          <DetailCell
            label="Wind Gusts"
            value={formatSpeed(day.windGustsMax, temperatureUnit)}
          />
        </div>
      )}
    </div>
  );
}

interface DetailCellProps {
  label: string;
  value: string;
}

function DetailCell({ label, value }: DetailCellProps) {
  const { theme } = useTheme();

  return (
    <div>
      <p className={`text-xs ${theme.textMuted}`}>{label}</p>
      <p className={`text-sm font-medium ${theme.textPrimary}`}>{value}</p>
    </div>
  );
}

