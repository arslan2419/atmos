import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
} from 'recharts';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatShortDayName, formatHour12h } from '@/utils/dateTime';
import { getWindDirection } from '@/utils/weatherCodes';

interface WindChartProps {
  type?: 'hourly' | 'daily';
  hours?: number;
  days?: number;
}

export function WindChart({ type = 'hourly', hours = 24, days = 7 }: WindChartProps) {
  const { weatherData, temperatureUnit } = useWeather();

  if (!weatherData) return null;

  const data = type === 'hourly'
    ? weatherData.hourly.slice(0, hours).map((h) => ({
        time: formatHour12h(h.time),
        speed: Math.round(h.windSpeed),
        direction: getWindDirection(h.windDirection),
        degrees: h.windDirection,
      }))
    : weatherData.daily.slice(0, days).map((d) => ({
        time: formatShortDayName(d.date),
        speed: Math.round(d.windSpeedMax),
        gusts: Math.round(d.windGustsMax),
        direction: getWindDirection(d.windDirectionDominant),
        degrees: d.windDirectionDominant,
      }));

  const unit = temperatureUnit === 'fahrenheit' ? 'mph' : 'km/h';

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Wind Speed</CardTitle>
      </CardHeader>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
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
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              content={<CustomTooltip unit={unit} type={type} />}
              cursor={{ stroke: 'rgba(255,255,255,0.2)' }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              stroke="#22c55e"
              strokeWidth={2}
              dot={{ fill: '#22c55e', r: 4 }}
              activeDot={{ r: 6 }}
              name="Speed"
            />
            {type === 'daily' && (
              <Line
                type="monotone"
                dataKey="gusts"
                stroke="#ef4444"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: '#ef4444', r: 4 }}
                activeDot={{ r: 6 }}
                name="Gusts"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  unit: string;
  type: 'hourly' | 'daily';
}

function CustomTooltip({ active, payload, label, unit, type }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-xl">
      <p className="text-white/70 text-sm mb-2">{label}</p>
      <p className="text-green-400 font-semibold">
        Speed: {data.speed} {unit}
      </p>
      {type === 'daily' && data.gusts && (
        <p className="text-red-400 font-semibold">
          Gusts: {data.gusts} {unit}
        </p>
      )}
      <p className="text-white/70 text-sm mt-1">
        Direction: {data.direction} ({data.degrees}°)
      </p>
    </div>
  );
}

