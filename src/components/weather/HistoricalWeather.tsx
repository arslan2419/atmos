import React, { useState, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  BarChart,
  Bar,
} from 'recharts';
import { format, subDays, parseISO, isAfter } from 'date-fns';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button, IconButton } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/Toggle';
import { WeatherIcon } from '@/components/ui/WeatherIcon';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatTemperature, convertTemperature, formatPrecipitation } from '@/utils/temperature';
import { formatDate, getDateRangeForPastWeek, getDateRangeForPastMonth, formatDateRange } from '@/utils/dateTime';
import { HistoricalWeather as HistoricalWeatherType } from '@/types/weather';

type DateRange = 'week' | 'month' | 'custom';

export function HistoricalWeather() {
  const { theme } = useTheme();
  const { 
    currentLocation, 
    historicalData, 
    isLoadingHistorical, 
    fetchHistoricalData,
    temperatureUnit,
  } = useWeather();

  const [dateRange, setDateRange] = useState<DateRange>('week');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch historical data when location or date range changes
  useEffect(() => {
    if (!currentLocation) return;

    let start: string, end: string;

    if (dateRange === 'week') {
      ({ start, end } = getDateRangeForPastWeek());
    } else if (dateRange === 'month') {
      ({ start, end } = getDateRangeForPastMonth());
    } else if (customStartDate && customEndDate) {
      start = customStartDate;
      end = customEndDate;
    } else {
      return;
    }

    fetchHistoricalData(start, end);
  }, [currentLocation, dateRange, customStartDate, customEndDate, fetchHistoricalData]);

  const handleDateRangeChange = (value: DateRange) => {
    setDateRange(value);
    if (value === 'custom') {
      setShowDatePicker(true);
    } else {
      setShowDatePicker(false);
    }
  };

  const handleCustomDateSubmit = () => {
    if (customStartDate && customEndDate) {
      // Validate dates
      const start = parseISO(customStartDate);
      const end = parseISO(customEndDate);
      const yesterday = subDays(new Date(), 1);

      if (isAfter(start, end)) {
        alert('Start date must be before end date');
        return;
      }

      if (isAfter(end, yesterday)) {
        alert('End date cannot be in the future');
        return;
      }

      setShowDatePicker(false);
    }
  };

  if (!currentLocation) {
    return (
      <Card padding="lg" className="text-center">
        <p className={theme.textMuted}>Select a location to view historical weather</p>
      </Card>
    );
  }

  const getDateRangeLabel = () => {
    if (dateRange === 'week') {
      const { start, end } = getDateRangeForPastWeek();
      return formatDateRange(start, end);
    } else if (dateRange === 'month') {
      const { start, end } = getDateRangeForPastMonth();
      return formatDateRange(start, end);
    } else if (customStartDate && customEndDate) {
      return formatDateRange(customStartDate, customEndDate);
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card padding="md">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className={`text-lg font-semibold ${theme.textPrimary}`}>Historical Weather</h2>
            <p className={`text-sm ${theme.textMuted}`}>{getDateRangeLabel()}</p>
          </div>
          
          <ToggleGroup
            value={dateRange}
            onChange={handleDateRangeChange}
            options={[
              { value: 'week', label: 'Past Week' },
              { value: 'month', label: 'Past Month' },
              { value: 'custom', label: 'Custom' },
            ]}
          />
        </div>

        {/* Custom Date Picker */}
        {showDatePicker && (
          <div className={`mt-4 pt-4 border-t ${theme.cardBorder}`}>
            <div className="flex flex-col sm:flex-row items-end gap-4">
              <div className="flex-1 w-full sm:w-auto">
                <label className={`block text-sm ${theme.textMuted} mb-1`}>Start Date</label>
                <input
                  type="date"
                  value={customStartDate}
                  onChange={(e) => setCustomStartDate(e.target.value)}
                  max={format(subDays(new Date(), 1), 'yyyy-MM-dd')}
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${theme.cardBg} ${theme.textPrimary}
                    border ${theme.cardBorder}
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  `}
                />
              </div>
              <div className="flex-1 w-full sm:w-auto">
                <label className={`block text-sm ${theme.textMuted} mb-1`}>End Date</label>
                <input
                  type="date"
                  value={customEndDate}
                  onChange={(e) => setCustomEndDate(e.target.value)}
                  max={format(subDays(new Date(), 1), 'yyyy-MM-dd')}
                  className={`
                    w-full px-3 py-2 rounded-lg
                    ${theme.cardBg} ${theme.textPrimary}
                    border ${theme.cardBorder}
                    focus:outline-none focus:ring-2 focus:ring-white/30
                  `}
                />
              </div>
              <Button onClick={handleCustomDateSubmit} variant="primary">
                Apply
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Loading State */}
      {isLoadingHistorical && (
        <Card padding="md">
          <div className="flex items-center justify-center py-12">
            <Loader2 className={`w-8 h-8 animate-spin ${theme.textMuted}`} />
            <span className={`ml-3 ${theme.textMuted}`}>Loading historical data...</span>
          </div>
        </Card>
      )}

      {/* Historical Data Display */}
      {!isLoadingHistorical && historicalData && historicalData.length > 0 && (
        <>
          {/* Temperature Chart */}
          <HistoricalTemperatureChart data={historicalData} temperatureUnit={temperatureUnit} />

          {/* Precipitation Chart */}
          <HistoricalPrecipitationChart data={historicalData} temperatureUnit={temperatureUnit} />

          {/* Data Table */}
          <HistoricalDataTable data={historicalData} temperatureUnit={temperatureUnit} />
        </>
      )}

      {/* No Data State */}
      {!isLoadingHistorical && (!historicalData || historicalData.length === 0) && (
        <Card padding="lg" className="text-center">
          <Calendar className={`w-12 h-12 mx-auto mb-4 ${theme.textMuted}`} />
          <p className={theme.textMuted}>No historical data available for the selected period</p>
        </Card>
      )}
    </div>
  );
}

interface ChartProps {
  data: HistoricalWeatherType[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

function HistoricalTemperatureChart({ data, temperatureUnit }: ChartProps) {
  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    max: Math.round(convertTemperature(d.temperatureMax, temperatureUnit)),
    min: Math.round(convertTemperature(d.temperatureMin, temperatureUnit)),
    mean: Math.round(convertTemperature(d.temperatureMean, temperatureUnit)),
  }));

  const unit = temperatureUnit === 'celsius' ? '°C' : '°F';

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Temperature History</CardTitle>
      </CardHeader>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="histMaxGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="histMinGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v) => `${v}°`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              formatter={(value: number) => [`${value}${unit}`, '']}
            />
            <Area
              type="monotone"
              dataKey="max"
              stroke="#f97316"
              fill="url(#histMaxGradient)"
              name="High"
            />
            <Area
              type="monotone"
              dataKey="min"
              stroke="#3b82f6"
              fill="url(#histMinGradient)"
              name="Low"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function HistoricalPrecipitationChart({ data, temperatureUnit }: ChartProps) {
  const chartData = data.map((d) => ({
    date: formatDate(d.date),
    precipitation: d.precipitation,
  }));

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Precipitation History</CardTitle>
      </CardHeader>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="date"
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              stroke="rgba(255,255,255,0.5)"
              tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
              tickLine={false}
              tickFormatter={(v) => `${v}mm`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(15, 23, 42, 0.9)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px',
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.7)' }}
              formatter={(value: number) => [`${value.toFixed(1)} mm`, 'Precipitation']}
            />
            <Bar
              dataKey="precipitation"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              name="Precipitation"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

interface TableProps {
  data: HistoricalWeatherType[];
  temperatureUnit: 'celsius' | 'fahrenheit';
}

function HistoricalDataTable({ data, temperatureUnit }: TableProps) {
  const { theme } = useTheme();

  return (
    <Card padding="md">
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className={`text-left ${theme.textMuted} text-sm border-b ${theme.cardBorder}`}>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3 pr-4">Condition</th>
              <th className="pb-3 pr-4">High</th>
              <th className="pb-3 pr-4">Low</th>
              <th className="pb-3 pr-4">Avg</th>
              <th className="pb-3 pr-4">Precip</th>
              <th className="pb-3">Wind</th>
            </tr>
          </thead>
          <tbody>
            {data.map((day) => (
              <tr key={day.date} className={`border-b ${theme.cardBorder} last:border-0`}>
                <td className={`py-3 pr-4 ${theme.textPrimary}`}>
                  {formatDate(day.date)}
                </td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <WeatherIcon
                      condition={day.condition}
                      isDay={true}
                      size="sm"
                      className={theme.textPrimary}
                    />
                    <span className={`text-sm ${theme.textSecondary}`}>
                      {day.conditionText}
                    </span>
                  </div>
                </td>
                <td className={`py-3 pr-4 ${theme.textPrimary}`}>
                  {formatTemperature(day.temperatureMax, temperatureUnit)}
                </td>
                <td className={`py-3 pr-4 ${theme.textMuted}`}>
                  {formatTemperature(day.temperatureMin, temperatureUnit)}
                </td>
                <td className={`py-3 pr-4 ${theme.textSecondary}`}>
                  {formatTemperature(day.temperatureMean, temperatureUnit)}
                </td>
                <td className={`py-3 pr-4 ${theme.textSecondary}`}>
                  {formatPrecipitation(day.precipitation, temperatureUnit)}
                </td>
                <td className={`py-3 ${theme.textSecondary}`}>
                  {Math.round(day.windSpeedMax)} km/h
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

