import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { WeatherCondition } from '@/types/weather';

interface WeatherAnimationsProps {
  condition: WeatherCondition;
  isDay: boolean;
}

export function WeatherAnimations({ condition, isDay }: WeatherAnimationsProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {condition === 'rain' && <RainAnimation />}
      {condition === 'drizzle' && <DrizzleAnimation />}
      {condition === 'snow' && <SnowAnimation />}
      {condition === 'thunderstorm' && <ThunderstormAnimation />}
      {(condition === 'clear' && !isDay) && <StarsAnimation />}
      {condition === 'cloudy' && <CloudsAnimation />}
      {condition === 'fog' && <FogAnimation />}
    </div>
  );
}

function RainAnimation() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-400/30 to-transparent rounded-full animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 30 + 20}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 0.5 + 0.5}s`,
          }}
        />
      ))}
    </div>
  );
}

function DrizzleAnimation() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-300/20 to-transparent rounded-full animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 15 + 10}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 1 + 1}s`,
          }}
        />
      ))}
    </div>
  );
}

function SnowAnimation() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 60 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/60 animate-snow"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 5}s`,
          }}
        />
      ))}
    </div>
  );
}

function ThunderstormAnimation() {
  return (
    <div className="absolute inset-0">
      {/* Rain */}
      {Array.from({ length: 80 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-500/40 to-transparent rounded-full animate-rain"
          style={{
            left: `${Math.random() * 100}%`,
            height: `${Math.random() * 40 + 30}px`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${Math.random() * 0.4 + 0.3}s`,
          }}
        />
      ))}
      {/* Lightning flashes */}
      <div className="absolute inset-0 animate-lightning bg-white/5" />
    </div>
  );
}

function StarsAnimation() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 60}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${Math.random() * 2 + 2}s`,
          }}
        />
      ))}
    </div>
  );
}

function CloudsAnimation() {
  return (
    <div className="absolute inset-0 opacity-20">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="absolute bg-white/30 rounded-full blur-3xl animate-float-slow"
          style={{
            left: `${i * 25}%`,
            top: `${Math.random() * 30}%`,
            width: `${Math.random() * 200 + 150}px`,
            height: `${Math.random() * 100 + 80}px`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${Math.random() * 20 + 30}s`,
          }}
        />
      ))}
    </div>
  );
}

function FogAnimation() {
  return (
    <div className="absolute inset-0">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-fog-drift"
          style={{
            top: `${30 + i * 20}%`,
            animationDelay: `${i * 3}s`,
            animationDuration: `${20 + i * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

