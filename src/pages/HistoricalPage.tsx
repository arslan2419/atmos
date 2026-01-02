import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { HistoricalWeather } from '@/components/weather/HistoricalWeather';
import { Card } from '@/components/ui/Card';
import { MapPin, Calendar } from 'lucide-react';
import { SearchBar } from '@/components/search/SearchBar';

export function HistoricalPage() {
  const { theme } = useTheme();
  const { currentLocation } = useWeather();

  if (!currentLocation) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4">
        <Card padding="lg" className="text-center">
          <MapPin className={`w-16 h-16 mx-auto mb-6 ${theme.textMuted}`} />
          <h1 className={`text-2xl font-bold mb-2 ${theme.textPrimary}`}>
            Select a Location
          </h1>
          <p className={`${theme.textMuted} mb-8`}>
            Search for a city to view historical weather data
          </p>
          <SearchBar />
        </Card>
      </div>
    );
  }

  return (
    <main className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Calendar className={`w-8 h-8 ${theme.textSecondary}`} />
        <div>
          <h1 className={`text-2xl font-bold ${theme.textPrimary}`}>
            Historical Weather
          </h1>
          <p className={`${theme.textMuted}`}>
            {currentLocation.name}, {currentLocation.country}
          </p>
        </div>
      </div>

      {/* Historical Weather Component */}
      <HistoricalWeather />
    </main>
  );
}

