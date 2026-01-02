import { TemperatureUnit } from '@/types/weather';

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'fahrenheit') {
    return (celsius * 9) / 5 + 32;
  }
  return celsius;
}

export function formatTemperature(celsius: number, unit: TemperatureUnit, showUnit = true): string {
  const temp = convertTemperature(celsius, unit);
  const rounded = Math.round(temp);
  if (showUnit) {
    return `${rounded}°${unit === 'celsius' ? 'C' : 'F'}`;
  }
  return `${rounded}°`;
}

export function formatSpeed(kmh: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    // Convert km/h to mph for US users
    return `${Math.round(kmh * 0.621371)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

export function formatVisibility(meters: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    // Convert to miles for US users
    const miles = meters / 1609.34;
    return miles >= 1 ? `${miles.toFixed(1)} mi` : `${Math.round(meters * 3.28084)} ft`;
  }
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${Math.round(meters)} m`;
}

export function formatPressure(hPa: number): string {
  return `${Math.round(hPa)} hPa`;
}

export function formatPercentage(value: number): string {
  return `${Math.round(value)}%`;
}

export function formatPrecipitation(mm: number, unit: TemperatureUnit): string {
  if (unit === 'fahrenheit') {
    // Convert to inches for US users
    return `${(mm * 0.0393701).toFixed(2)} in`;
  }
  return `${mm.toFixed(1)} mm`;
}

