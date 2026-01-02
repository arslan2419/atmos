import { X, Sun, Moon, Thermometer, Palette, Trash2 } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { useWeather } from '@/context/WeatherContext';
import { Card } from '@/components/ui/Card';
import { Button, IconButton } from '@/components/ui/Button';
import { ToggleGroup } from '@/components/ui/Toggle';
import { clearCache, clearRecentLocations } from '@/utils/storage';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const { theme, themeMode, weatherCondition, isDay } = useTheme();
  const { temperatureUnit, setTemperatureUnit, setTheme: setAppTheme } = useWeather();

  if (!isOpen) return null;

  const handleClearCache = () => {
    clearCache();
    clearRecentLocations();
    alert('Cache cleared successfully');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={`
          fixed right-0 top-0 h-full w-full max-w-md
          ${theme.backgroundClass} ${theme.backgroundGradient}
          shadow-2xl overflow-y-auto
          transform transition-transform duration-300
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`sticky top-0 ${theme.cardBg} backdrop-blur-lg border-b ${theme.cardBorder} p-4`}>
          <div className="flex items-center justify-between">
            <h2 className={`text-xl font-bold ${theme.textPrimary}`}>Settings</h2>
            <IconButton
              icon={<X className="w-5 h-5" />}
              onClick={onClose}
              label="Close settings"
            />
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Temperature Unit */}
          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              <Thermometer className={`w-5 h-5 ${theme.textSecondary}`} />
              <h3 className={`font-semibold ${theme.textPrimary}`}>Temperature Unit</h3>
            </div>
            <ToggleGroup
              value={temperatureUnit}
              onChange={setTemperatureUnit}
              options={[
                { value: 'celsius', label: '°C Celsius' },
                { value: 'fahrenheit', label: '°F Fahrenheit' },
              ]}
            />
          </Card>

          {/* Theme */}
          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              <Palette className={`w-5 h-5 ${theme.textSecondary}`} />
              <h3 className={`font-semibold ${theme.textPrimary}`}>Theme</h3>
            </div>
            <div className="space-y-3">
              <ToggleGroup
                value={themeMode}
                onChange={setAppTheme}
                options={[
                  { value: 'auto', label: 'Auto' },
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                ]}
              />
              <p className={`text-sm ${theme.textMuted}`}>
                {themeMode === 'auto'
                  ? 'Theme changes based on current weather conditions'
                  : `Using ${themeMode} theme`}
              </p>
            </div>
          </Card>

          {/* Current Theme Info */}
          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              {isDay ? (
                <Sun className={`w-5 h-5 ${theme.textSecondary}`} />
              ) : (
                <Moon className={`w-5 h-5 ${theme.textSecondary}`} />
              )}
              <h3 className={`font-semibold ${theme.textPrimary}`}>Current Conditions</h3>
            </div>
            <div className={`space-y-2 text-sm ${theme.textSecondary}`}>
              <p>Weather: <span className="capitalize">{weatherCondition.replace('-', ' ')}</span></p>
              <p>Time: {isDay ? 'Day' : 'Night'}</p>
              <p>Theme variant: {theme.isDark ? 'Dark' : 'Light'}</p>
            </div>
          </Card>

          {/* Data Management */}
          <Card padding="md">
            <div className="flex items-center gap-3 mb-4">
              <Trash2 className={`w-5 h-5 ${theme.textSecondary}`} />
              <h3 className={`font-semibold ${theme.textPrimary}`}>Data Management</h3>
            </div>
            <div className="space-y-3">
              <p className={`text-sm ${theme.textMuted}`}>
                Clear cached weather data and recent search history.
              </p>
              <Button
                variant="outline"
                onClick={handleClearCache}
                leftIcon={<Trash2 className="w-4 h-4" />}
              >
                Clear Cache
              </Button>
            </div>
          </Card>

          {/* About */}
          <Card padding="md">
            <h3 className={`font-semibold ${theme.textPrimary} mb-2`}>About Atmos</h3>
            <div className={`space-y-2 text-sm ${theme.textMuted}`}>
              <p>A modern weather application built with React.</p>
              <p>Weather data powered by Open-Meteo API.</p>
              <p className="pt-2">Version 1.0.0</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

