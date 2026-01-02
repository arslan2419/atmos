import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WeatherProvider, useWeather } from '@/context/WeatherContext';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { Header } from '@/components/layout/Header';
import { SettingsPanel } from '@/components/layout/SettingsPanel';
import { WeatherAnimations } from '@/components/layout/WeatherAnimations';
import { ErrorBoundary } from '@/components/ui/ErrorDisplay';
import { WeatherCardSkeleton } from '@/components/ui/Skeleton';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ForecastPage = lazy(() => import('@/pages/ForecastPage').then(m => ({ default: m.ForecastPage })));
const HistoricalPage = lazy(() => import('@/pages/HistoricalPage').then(m => ({ default: m.HistoricalPage })));

// Loading fallback component
function PageLoader() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-6">
      <WeatherCardSkeleton />
      <WeatherCardSkeleton />
    </div>
  );
}

// Main app content with theme applied
function AppContent() {
  const { currentCondition, isDay, theme: appTheme } = useWeather();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider
      weatherCondition={currentCondition}
      isDay={isDay}
      themeMode={appTheme}
    >
      <AppLayout
        settingsOpen={settingsOpen}
        setSettingsOpen={setSettingsOpen}
      />
    </ThemeProvider>
  );
}

interface AppLayoutProps {
  settingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
}

function AppLayout({ settingsOpen, setSettingsOpen }: AppLayoutProps) {
  const { theme, weatherCondition, isDay, themeMode } = useTheme();

  return (
    <div
      className={`
        min-h-screen relative
        ${theme.backgroundClass} ${theme.backgroundGradient}
        transition-all duration-700 ease-in-out
      `}
    >
      {/* Weather animations (only in auto mode) */}
      {themeMode === 'auto' && (
        <WeatherAnimations condition={weatherCondition} isDay={isDay} />
      )}

      {/* Main content */}
      <div className="relative z-10">
        <Header onSettingsClick={() => setSettingsOpen(true)} />
        
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forecast" element={<ForecastPage />} />
            <Route path="/historical" element={<HistoricalPage />} />
          </Routes>
        </Suspense>
      </div>

      {/* Settings panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <WeatherProvider>
          <AppContent />
        </WeatherProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
