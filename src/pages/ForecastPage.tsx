import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { HourlyForecast } from '@/components/weather/HourlyForecast';
import { DailyForecast } from '@/components/weather/DailyForecast';
import { TemperatureChart } from '@/components/charts/TemperatureChart';
import { PrecipitationChart } from '@/components/charts/PrecipitationChart';
import { WindChart } from '@/components/charts/WindChart';
import { Card } from '@/components/ui/Card';
import { MapPin } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';
import { ErrorDisplay } from '@/components/ui/ErrorDisplay';

export function ForecastPage() {
  const { theme } = useTheme();
  const { weatherData, currentLocation, error, clearError, refreshWeather } = useWeather();

  if (!currentLocation) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card padding="lg" className="text-center">
          <MapPin className={`w-16 h-16 mx-auto mb-6 ${theme.textMuted}`} />
          <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
            Select a Location
          </h1>
          <p className={`${theme.textMuted} mb-8`}>
            Search for a city to view the detailed forecast
          </p>
          <SearchBar />
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <ErrorDisplay
          error={error}
          onRetry={refreshWeather}
          onDismiss={clearError}
        />
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
          Weather Forecast
        </h1>
        <p className={`${theme.textMuted}`}>
          {currentLocation.name}, {currentLocation.country}
        </p>
      </div>

      {/* 48-Hour Hourly Forecast */}
      <HourlyForecast hours={48} />

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart type="hourly" hours={24} />
        <PrecipitationChart type="hourly" hours={24} />
      </div>

      {/* Daily Forecast */}
      <DailyForecast />

      {/* Daily Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TemperatureChart type="daily" days={14} />
        <WindChart type="daily" days={14} />
      </div>

      {/* Weekly Summary Cards */}
      {weatherData && (
        <Card padding="md">
          <h2 className={`text-lg font-semibold mb-4 ${theme.textPrimary}`}>
            Weekly Summary
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              label="Avg High"
              value={`${Math.round(
                weatherData.daily.slice(0, 7).reduce((sum, d) => sum + d.temperatureMax, 0) / 7
              )}°`}
            />
            <SummaryCard
              label="Avg Low"
              value={`${Math.round(
                weatherData.daily.slice(0, 7).reduce((sum, d) => sum + d.temperatureMin, 0) / 7
              )}°`}
            />
            <SummaryCard
              label="Total Precip"
              value={`${weatherData.daily.slice(0, 7).reduce((sum, d) => sum + d.precipitationSum, 0).toFixed(1)} mm`}
            />
            <SummaryCard
              label="Max Wind"
              value={`${Math.round(
                Math.max(...weatherData.daily.slice(0, 7).map((d) => d.windSpeedMax))
              )} km/h`}
            />
          </div>
        </Card>
      )}
    </main>
  );
}

interface SummaryCardProps {
  label: string;
  value: string;
}

function SummaryCard({ label, value }: SummaryCardProps) {
  const { theme } = useTheme();

  return (
    <div className={`${theme.cardBg} rounded-xl p-4 text-center`}>
      <p className={`text-xs ${theme.textMuted} mb-1`}>{label}</p>
      <p className={`text-xl font-bold ${theme.textPrimary}`}>{value}</p>
    </div>
  );
}

