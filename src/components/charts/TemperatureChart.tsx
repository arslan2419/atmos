import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { convertTemperature } from '@/utils/temperature';
import { formatHour12h, formatShortDayName } from '@/utils/dateTime';

interface TemperatureChartProps {
  type?: 'hourly' | 'daily';
  hours?: number;
  days?: number;
}

export function TemperatureChart({ type = 'hourly', hours = 24, days = 7 }: TemperatureChartProps) {
  const { weatherData, temperatureUnit } = useWeather();

  if (!weatherData) return null;

  const data = type === 'hourly'
    ? weatherData.hourly.slice(0, hours).map((h) => ({
        time: formatHour12h(h.time),
        temperature: Math.round(convertTemperature(h.temperature, temperatureUnit)),
        feelsLike: Math.round(convertTemperature(h.feelsLike, temperatureUnit)),
        fullTime: h.time,
      }))
    : weatherData.daily.slice(0, days).map((d) => ({
        time: formatShortDayName(d.date),
        temperature: Math.round(convertTemperature(d.temperatureMax, temperatureUnit)),
        min: Math.round(convertTemperature(d.temperatureMin, temperatureUnit)),
        fullTime: d.date,
      }));

  const unit = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="temperatureGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              {type === 'daily' && (
                <linearGradient id="minTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              )}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="time"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}°`}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} type={type} />}
              cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Area
              type="monotone"
              dataKey="temperature"
              stroke="#f97316"
              strokeWidth={2}
              fill="url(#temperatureGradient)"
              name={type === 'daily' ? 'High' : 'Temperature'}
            />
            {type === 'daily' && (
              <Area
                type="monotone"
                dataKey="min"
                stroke="#3b82f6"
                strokeWidth={2}
                fill="url(#minTempGradient)"
                name="Low"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  unit: string;
  type: 'hourly' | 'daily';
}

function CustomTooltip({ active, payload, label, unit }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-xl">
      <p className="text-white/70 text-sm mb-2">{label}</p>
      {payload.map((entry, index) => (
        <p key={index} className="text-white font-semibold" style={{ color: entry.color }}>
          {entry.name}: {entry.value}{unit}
        </p>
      ))}
    </div>
  );
}

