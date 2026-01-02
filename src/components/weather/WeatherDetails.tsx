import React from 'react';
import { 
  Wind, 
  Droplets, 
  Eye, 
  Gauge, 
  Sun, 
  Sunrise, 
  Sunset,
  CloudRain,
  Thermometer,
} from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { WindDirectionIcon } from '@/components/ui/WeatherIcon';
import { formatTime12h } from '@/utils/dateTime';
import { getWindDirection, getUVIndexLevel, getVisibilityLevel, getHumidityLevel } from '@/utils/weatherCodes';
import { formatTemperature, formatVisibility, formatSpeed, formatPressure, formatPrecipitation } from '@/utils/temperature';

export function WeatherDetails() {
  const { theme } = useTheme();
  const { weatherData, temperatureUnit } = useWeather();

  if (!weatherData) return null;

  const { current, daily } = weatherData;
  const today = daily[0];
  const uvLevel = getUVIndexLevel(current.uvIndex);

  const details = [
    {
      icon: <Wind className="w-6 h-6" />,
      label: 'Wind',
      value: formatSpeed(current.windSpeed, temperatureUnit),
      subValue: getWindDirection(current.windDirection),
      extra: (
        <WindDirectionIcon 
          degrees={current.windDirection} 
          className={theme.textSecondary}
          size="sm"
        />
      ),
    },
    {
      icon: <Droplets className="w-6 h-6" />,
      label: 'Humidity',
      value: `${current.humidity}%`,
      subValue: getHumidityLevel(current.humidity),
    },
    {
      icon: <Eye className="w-6 h-6" />,
      label: 'Visibility',
      value: formatVisibility(current.visibility, temperatureUnit),
      subValue: getVisibilityLevel(current.visibility),
    },
    {
      icon: <Gauge className="w-6 h-6" />,
      label: 'Pressure',
      value: formatPressure(current.pressure),
      subValue: 'Sea level',
    },
    {
      icon: <Sun className="w-6 h-6" />,
      label: 'UV Index',
      value: `${Math.round(current.uvIndex)}`,
      subValue: uvLevel.level,
      subValueClass: uvLevel.color,
    },
    {
      icon: <Thermometer className="w-6 h-6" />,
      label: 'Feels Like',
      value: formatTemperature(current.feelsLike, temperatureUnit),
      subValue: `Actual: ${formatTemperature(current.temperature, temperatureUnit)}`,
    },
    {
      icon: <CloudRain className="w-6 h-6" />,
      label: 'Precipitation',
      value: formatPrecipitation(today.precipitationSum, temperatureUnit),
      subValue: `${today.precipitationProbabilityMax}% chance`,
    },
    {
      icon: <Wind className="w-6 h-6" />,
      label: 'Wind Gusts',
      value: formatSpeed(current.windGusts, temperatureUnit),
      subValue: 'Max gusts',
    },
  ];

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Weather Details</CardTitle>
      </CardHeader>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {details.map((detail, index) => (
          <DetailItem key={index} {...detail} />
        ))}
      </div>

      {/* Sunrise & Sunset */}
      <div className={`mt-6 pt-6 border-t ${theme.cardBorder}`}>
        <div className="grid grid-cols-2 gap-4">
          <div className={`flex items-center gap-4 ${theme.cardBg} rounded-xl p-4`}>
            <Sunrise className={`w-8 h-8 ${theme.textSecondary}`} />
            <div>
              <p className={`text-sm ${theme.textMuted}`}>Sunrise</p>
              <p className={`text-lg font-semibold ${theme.textPrimary}`}>
                {formatTime12h(today.sunrise)}
              </p>
            </div>
          </div>
          <div className={`flex items-center gap-4 ${theme.cardBg} rounded-xl p-4`}>
            <Sunset className={`w-8 h-8 ${theme.textSecondary}`} />
            <div>
              <p className={`text-sm ${theme.textMuted}`}>Sunset</p>
              <p className={`text-lg font-semibold ${theme.textPrimary}`}>
                {formatTime12h(today.sunset)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subValue?: string;
  subValueClass?: string;
  extra?: React.ReactNode;
}

function DetailItem({ icon, label, value, subValue, subValueClass, extra }: DetailItemProps) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.cardBg} rounded-xl p-4`}>
      <div className="flex items-center justify-between mb-2">
        <span className={theme.textMuted}>{icon}</span>
        {extra}
      </div>
      <p className={`text-xs ${theme.textMuted} mb-1`}>{label}</p>
      <p className={`text-lg font-semibold ${theme.textPrimary}`}>{value}</p>
      {subValue && (
        <p className={`text-xs ${subValueClass || theme.textMuted}`}>{subValue}</p>
      )}
    </div>
  );
}

