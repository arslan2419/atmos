import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudDrizzle,
  Snowflake,
  Wind,
  Droplets,
  Thermometer,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  type LucideIcon,
} from 'lucide-react';
import { WeatherCondition } from '@/types/weather';

interface WeatherIconProps {
  condition: WeatherCondition;
  isDay?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
  animated?: boolean;
}

const sizeClasses = {
  sm: 'w-5 h-5',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
  '2xl': 'w-24 h-24',
};

const weatherIcons: Record<WeatherCondition, { day: LucideIcon; night: LucideIcon }> = {
  clear: { day: Sun, night: Moon },
  'partly-cloudy': { day: CloudSun, night: CloudMoon },
  cloudy: { day: Cloud, night: Cloud },
  fog: { day: CloudFog, night: CloudFog },
  drizzle: { day: CloudDrizzle, night: CloudDrizzle },
  rain: { day: CloudRain, night: CloudRain },
  snow: { day: CloudSnow, night: Snowflake },
  thunderstorm: { day: CloudLightning, night: CloudLightning },
  unknown: { day: Cloud, night: Cloud },
};

export function WeatherIcon({
  condition,
  isDay = true,
  size = 'md',
  className = '',
  animated = false,
}: WeatherIconProps) {
  const icons = weatherIcons[condition] || weatherIcons.unknown;
  const Icon = isDay ? icons.day : icons.night;
  
  const animationClass = animated ? getAnimationClass(condition, isDay) : '';

  return (
    <Icon
      className={`${sizeClasses[size]} ${className} ${animationClass}`}
      aria-label={`${condition} weather`}
    />
  );
}

function getAnimationClass(condition: WeatherCondition, isDay: boolean): string {
  switch (condition) {
    case 'clear':
      return isDay ? 'animate-pulse-slow' : 'animate-twinkle';
    case 'rain':
    case 'drizzle':
      return 'animate-bounce-slow';
    case 'snow':
      return 'animate-float';
    case 'thunderstorm':
      return 'animate-flash';
    default:
      return '';
  }
}

// Additional weather-related icons as separate exports
export function WindIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Wind className={`${sizeClasses[size]} ${className}`} aria-label="Wind" />;
}

export function HumidityIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Droplets className={`${sizeClasses[size]} ${className}`} aria-label="Humidity" />;
}

export function TemperatureIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Thermometer className={`${sizeClasses[size]} ${className}`} aria-label="Temperature" />;
}

export function VisibilityIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Eye className={`${sizeClasses[size]} ${className}`} aria-label="Visibility" />;
}

export function PressureIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Gauge className={`${sizeClasses[size]} ${className}`} aria-label="Pressure" />;
}

export function SunriseIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Sunrise className={`${sizeClasses[size]} ${className}`} aria-label="Sunrise" />;
}

export function SunsetIcon({ className = '', size = 'md' }: { className?: string; size?: keyof typeof sizeClasses }) {
  return <Sunset className={`${sizeClasses[size]} ${className}`} aria-label="Sunset" />;
}

interface WindDirectionIconProps {
  degrees: number;
  className?: string;
  size?: keyof typeof sizeClasses;
}

export function WindDirectionIcon({ degrees, className = '', size = 'md' }: WindDirectionIconProps) {
  return (
    <ArrowUp
      className={`${sizeClasses[size]} ${className} transition-transform duration-300`}
      style={{ transform: `rotate(${degrees + 180}deg)` }}
      aria-label={`Wind direction ${degrees} degrees`}
    />
  );
}

