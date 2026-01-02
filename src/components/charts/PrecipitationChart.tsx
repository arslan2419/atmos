import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { formatShortDayName, formatHour12h } from '@/utils/dateTime';

interface PrecipitationChartProps {
  type?: 'hourly' | 'daily';
  hours?: number;
  days?: number;
}

interface ChartDataItem {
  time: string;
  probability: number;
  amount: number;
}

export function PrecipitationChart({ type = 'daily', hours = 24, days = 7 }: PrecipitationChartProps) {
  const { weatherData } = useWeather();

  if (!weatherData) return null;

  const data: ChartDataItem[] = type === 'hourly'
    ? weatherData.hourly.slice(0, hours).map((h) => ({
        time: formatHour12h(h.time),
        probability: h.precipitationProbability,
        amount: h.precipitation,
      }))
    : weatherData.daily.slice(0, days).map((d) => ({
        time: formatShortDayName(d.date),
        probability: d.precipitationProbabilityMax,
        amount: d.precipitationSum,
      }));

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Rain Probability</CardTitle>
      </CardHeader>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
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
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: 'rgba(255,255,255,0.1)' }}
            />
            <Bar
              dataKey="probability"
              radius={[4, 4, 0, 0]}
              name="Probability"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={getProbabilityColor(entry.probability)}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function getProbabilityColor(probability: number): string {
  if (probability >= 80) return '#1e40af'; // Dark blue
  if (probability >= 60) return '#2563eb'; // Blue
  if (probability >= 40) return '#3b82f6'; // Light blue
  if (probability >= 20) return '#60a5fa'; // Lighter blue
  return '#93c5fd'; // Very light blue
}

interface CustomTooltipProps {
  active?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload as ChartDataItem;

  return (
    <div className="bg-slate-900/90 backdrop-blur-md rounded-lg p-3 border border-white/10 shadow-xl">
      <p className="text-white/70 text-sm mb-2">{label}</p>
      <p className="text-blue-400 font-semibold">
        {data.probability}% chance
      </p>
      <p className="text-white/70 text-sm">
        {data.amount.toFixed(1)} mm expected
      </p>
    </div>
  );
}
