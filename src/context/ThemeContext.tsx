import { createContext, useContext, useMemo, ReactNode } from 'react';
import { WeatherCondition } from '@/types/weather';

// Theme configuration for different weather conditions
export interface WeatherTheme {
  // Background gradients
  backgroundGradient: string;
  backgroundClass: string;
  
  // Text colors
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  
  // Card/surface colors
  cardBg: string;
  cardBorder: string;
  
  // Accent colors
  accent: string;
  accentHover: string;
  
  // Animation class
  animationClass: string;
  
  // Is dark theme
  isDark: boolean;
}

const weatherThemes: Record<WeatherCondition, WeatherTheme> = {
  clear: {
    backgroundGradient: 'from-amber-300 via-orange-400 to-rose-500',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/20',
    cardBorder: 'border-white/30',
    accent: 'bg-amber-500',
    accentHover: 'hover:bg-amber-600',
    animationClass: 'animate-sunny',
    isDark: false,
  },
  'partly-cloudy': {
    backgroundGradient: 'from-sky-400 via-blue-400 to-indigo-500',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/20',
    cardBorder: 'border-white/30',
    accent: 'bg-sky-500',
    accentHover: 'hover:bg-sky-600',
    animationClass: 'animate-clouds',
    isDark: false,
  },
  cloudy: {
    backgroundGradient: 'from-slate-400 via-gray-500 to-slate-600',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/15',
    cardBorder: 'border-white/20',
    accent: 'bg-slate-500',
    accentHover: 'hover:bg-slate-600',
    animationClass: 'animate-overcast',
    isDark: false,
  },
  fog: {
    backgroundGradient: 'from-gray-300 via-slate-400 to-gray-500',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-700',
    cardBg: 'bg-white/30',
    cardBorder: 'border-white/40',
    accent: 'bg-gray-500',
    accentHover: 'hover:bg-gray-600',
    animationClass: 'animate-fog',
    isDark: false,
  },
  drizzle: {
    backgroundGradient: 'from-slate-500 via-blue-600 to-slate-700',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/15',
    cardBorder: 'border-white/20',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    animationClass: 'animate-drizzle',
    isDark: true,
  },
  rain: {
    backgroundGradient: 'from-slate-700 via-blue-800 to-slate-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-blue-600',
    accentHover: 'hover:bg-blue-700',
    animationClass: 'animate-rain',
    isDark: true,
  },
  snow: {
    backgroundGradient: 'from-sky-200 via-blue-300 to-indigo-400',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-slate-900',
    textSecondary: 'text-slate-800',
    textMuted: 'text-slate-700',
    cardBg: 'bg-white/40',
    cardBorder: 'border-white/50',
    accent: 'bg-sky-500',
    accentHover: 'hover:bg-sky-600',
    animationClass: 'animate-snow',
    isDark: false,
  },
  thunderstorm: {
    backgroundGradient: 'from-slate-800 via-purple-900 to-slate-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-purple-600',
    accentHover: 'hover:bg-purple-700',
    animationClass: 'animate-storm',
    isDark: true,
  },
  unknown: {
    backgroundGradient: 'from-slate-500 via-gray-600 to-slate-700',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/15',
    cardBorder: 'border-white/20',
    accent: 'bg-gray-500',
    accentHover: 'hover:bg-gray-600',
    animationClass: '',
    isDark: true,
  },
};

// Night variants (darker versions)
const nightThemes: Record<WeatherCondition, WeatherTheme> = {
  clear: {
    backgroundGradient: 'from-indigo-900 via-purple-900 to-slate-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-indigo-500',
    accentHover: 'hover:bg-indigo-600',
    animationClass: 'animate-stars',
    isDark: true,
  },
  'partly-cloudy': {
    backgroundGradient: 'from-slate-800 via-indigo-900 to-slate-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-indigo-500',
    accentHover: 'hover:bg-indigo-600',
    animationClass: 'animate-night-clouds',
    isDark: true,
  },
  cloudy: {
    backgroundGradient: 'from-slate-700 via-gray-800 to-slate-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-slate-500',
    accentHover: 'hover:bg-slate-600',
    animationClass: '',
    isDark: true,
  },
  fog: {
    backgroundGradient: 'from-slate-600 via-gray-700 to-slate-800',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-gray-500',
    accentHover: 'hover:bg-gray-600',
    animationClass: 'animate-fog',
    isDark: true,
  },
  drizzle: weatherThemes.drizzle,
  rain: weatherThemes.rain,
  snow: {
    backgroundGradient: 'from-slate-700 via-blue-800 to-indigo-900',
    backgroundClass: 'bg-gradient-to-br',
    textPrimary: 'text-white',
    textSecondary: 'text-white/90',
    textMuted: 'text-white/70',
    cardBg: 'bg-white/10',
    cardBorder: 'border-white/15',
    accent: 'bg-blue-500',
    accentHover: 'hover:bg-blue-600',
    animationClass: 'animate-snow',
    isDark: true,
  },
  thunderstorm: weatherThemes.thunderstorm,
  unknown: weatherThemes.unknown,
};

// Light/Dark override themes
const lightOverrideTheme: WeatherTheme = {
  backgroundGradient: 'from-sky-100 via-blue-100 to-indigo-100',
  backgroundClass: 'bg-gradient-to-br',
  textPrimary: 'text-slate-900',
  textSecondary: 'text-slate-700',
  textMuted: 'text-slate-500',
  cardBg: 'bg-white/10',
  cardBorder: 'border-slate-200',
  accent: 'bg-blue-500',
  accentHover: 'hover:bg-blue-600',
  animationClass: '',
  isDark: false,
};

const darkOverrideTheme: WeatherTheme = {
  backgroundGradient: 'from-slate-900 via-gray-900 to-slate-950',
  backgroundClass: 'bg-gradient-to-br',
  textPrimary: 'text-white',
  textSecondary: 'text-white/90',
  textMuted: 'text-white/70',
  cardBg: 'bg-white/10',
  cardBorder: 'border-white/15',
  accent: 'bg-blue-600',
  accentHover: 'hover:bg-blue-700',
  animationClass: '',
  isDark: true,
};

interface ThemeContextType {
  theme: WeatherTheme;
  themeMode: 'auto' | 'light' | 'dark';
  weatherCondition: WeatherCondition;
  isDay: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  weatherCondition: WeatherCondition;
  isDay: boolean;
  themeMode: 'auto' | 'light' | 'dark';
}

export function ThemeProvider({ children, weatherCondition, isDay, themeMode }: ThemeProviderProps) {
  const theme = useMemo(() => {
    let newTheme: WeatherTheme;

    if (themeMode === 'light') {
      newTheme = lightOverrideTheme;
    } else if (themeMode === 'dark') {
      newTheme = darkOverrideTheme;
    } else {
      // Auto mode - use weather-based theme
      newTheme = isDay ? weatherThemes[weatherCondition] : nightThemes[weatherCondition];
    }

    // Update document class for global styles
    document.documentElement.classList.toggle('dark', newTheme.isDark);

    return newTheme;
  }, [weatherCondition, isDay, themeMode]);

  return (
    <ThemeContext.Provider value={{ theme, themeMode, weatherCondition, isDay }}>
      {children}
    </ThemeContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { weatherThemes, nightThemes };

