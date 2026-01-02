# Atmos Weather ⛅

A modern, responsive, and highly interactive Weather Web Application built with React. Features real-time weather data, forecasts, historical weather information, and beautiful dynamic themes that adapt to current weather conditions.

![Atmos Weather App](https://via.placeholder.com/800x400?text=Atmos+Weather+App)

## ✨ Features

### 🌍 Location & Search
- Search weather by city, country, or coordinates
- Auto-detect user location via browser geolocation
- Save favorite locations for quick access
- View recently searched locations

### 🌤️ Current Weather
- Real-time temperature and "feels like" temperature
- Weather conditions (sunny, cloudy, rainy, snow, thunderstorm, fog)
- Wind speed, direction, and gusts
- Humidity, visibility, and pressure
- UV index with safety levels
- Sunrise and sunset times

### 📅 Forecast Views
- **Hourly Forecast**: Next 24-48 hours with precipitation probability
- **Daily Forecast**: 7-14 day outlook with expandable details
- Toggle between Celsius and Fahrenheit
- Interactive temperature range visualization

### ⏳ Historical Weather
- View past weather data with date picker
- Pre-set ranges: Past week, past month
- Custom date range selection
- Historical data displayed in charts and tables
- Temperature trends and precipitation history

### 🎨 Dynamic UI / Theme System
The app automatically changes its appearance based on weather conditions:

| Weather | Theme |
|---------|-------|
| ☀️ Clear (Day) | Warm gradients, amber/orange tones |
| 🌙 Clear (Night) | Deep purple/indigo, starry effect |
| ☁️ Cloudy | Soft gray, muted tones |
| 🌧️ Rain | Dark blue, rain animation |
| ❄️ Snow | Light blue, snowfall effect |
| 🌪️ Thunderstorm | Dark purple, lightning flashes |
| 🌫️ Fog | Soft gray with drifting fog |

- Manual dark/light mode override available
- Smooth CSS transitions between themes
- Weather animations (rain, snow, lightning, stars)

### 📊 Data Visualization
- Temperature trend charts (line/area)
- Precipitation probability charts (bar)
- Wind speed trends
- Interactive tooltips
- Responsive charts that work on all devices

### ⚡ Performance
- API response caching (10-minute TTL)
- Lazy loading for route components
- Skeleton loaders for better UX
- Error boundaries for graceful failures
- Optimized re-renders with React best practices

### ♿ Accessibility
- Full keyboard navigation support
- ARIA labels throughout
- Screen reader friendly
- High contrast mode support
- Reduced motion preference respected

## 🛠️ Tech Stack

- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe code
- **Vite** - Lightning-fast build tool
- **Tailwind CSS v4** - Utility-first styling
- **React Router v7** - Client-side routing
- **Recharts** - Beautiful charts
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **Lucide React** - Beautiful icons
- **Open-Meteo API** - Free weather data

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/atmos.git
cd atmos
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Building for Production

```bash
npm run build
```

The build output will be in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

## 📁 Project Structure

```
src/
├── components/
│   ├── charts/          # Data visualization components
│   │   ├── TemperatureChart.tsx
│   │   ├── PrecipitationChart.tsx
│   │   └── WindChart.tsx
│   ├── layout/          # App layout components
│   │   ├── Header.tsx
│   │   ├── SettingsPanel.tsx
│   │   └── WeatherAnimations.tsx
│   ├── search/          # Search functionality
│   │   └── SearchBar.tsx
│   ├── ui/              # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ErrorDisplay.tsx
│   │   ├── Skeleton.tsx
│   │   ├── Toggle.tsx
│   │   └── WeatherIcon.tsx
│   └── weather/         # Weather display components
│       ├── CurrentWeather.tsx
│       ├── DailyForecast.tsx
│       ├── HourlyForecast.tsx
│       ├── HistoricalWeather.tsx
│       └── WeatherDetails.tsx
├── context/
│   ├── ThemeContext.tsx  # Dynamic theme management
│   └── WeatherContext.tsx # Global weather state
├── hooks/
│   ├── useDebounce.ts
│   ├── useGeolocation.ts
│   └── useLocalStorage.ts
├── pages/
│   ├── ForecastPage.tsx
│   ├── HistoricalPage.tsx
│   └── HomePage.tsx
├── services/
│   └── weatherApi.ts    # Open-Meteo API integration
├── types/
│   └── weather.ts       # TypeScript interfaces
├── utils/
│   ├── dateTime.ts      # Date formatting utilities
│   ├── storage.ts       # LocalStorage management
│   ├── temperature.ts   # Unit conversion
│   └── weatherCodes.ts  # WMO weather code mapping
├── App.tsx
├── index.css
└── main.tsx
```

## 🌐 API Reference

This app uses the [Open-Meteo API](https://open-meteo.com/) - a free, open-source weather API.

### Endpoints Used

- **Geocoding**: Search locations by name
- **Current Weather**: Real-time weather data
- **Hourly Forecast**: Up to 48 hours ahead
- **Daily Forecast**: Up to 14 days ahead
- **Historical Data**: Past weather archive

### Rate Limits

Open-Meteo has generous rate limits for non-commercial use. The app implements caching to minimize API calls.

## 🎨 Customization

### Changing the Theme

Themes are defined in `src/context/ThemeContext.tsx`. Each weather condition has both day and night variants.

### Adding New Weather Animations

Add new animations in `src/components/layout/WeatherAnimations.tsx` and define the keyframes in `src/index.css`.

### Modifying API Caching

Cache duration can be adjusted in `src/utils/storage.ts`:

```typescript
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes
```

## 📱 Responsive Design

The app is fully responsive and works great on:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔒 Privacy

- Location data is only used for weather lookups
- Preferences stored locally in browser storage
- No data sent to third-party analytics
- No cookies used

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather data
- [Lucide](https://lucide.dev/) for beautiful icons
- [Recharts](https://recharts.org/) for charts
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Made with ❤️ by [Your Name]
