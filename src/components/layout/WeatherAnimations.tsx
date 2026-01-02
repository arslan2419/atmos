import { WeatherCondition } from '@/types/weather';

interface WeatherAnimationsProps {
  condition: WeatherCondition;
  isDay: boolean;
}

interface AnimationValue {
  left?: number;
  top?: number;
  height?: number;
  width?: number;
  size?: number;
  delay?: number;
  duration?: number;
}

// Pre-generated random values for deterministic animations
// These are generated at module load time, not during render
const generateValues = (count: number, config: { [key: string]: [number, number] }): AnimationValue[] => {
  const values: AnimationValue[] = [];
  for (let i = 0; i < count; i++) {
    const item: AnimationValue = {};
    let seedOffset = 0;
    for (const [key, [multiplier, offset]] of Object.entries(config)) {
      // Use a seeded random approach based on index
      const seed = ((i + seedOffset) * 9301 + 49297) % 233280;
      const rand = seed / 233280;
      (item as Record<string, number>)[key] = rand * multiplier + offset;
      seedOffset += 1000;
    }
    values.push(item);
  }
  return values;
};

// Pre-computed animation data at module level (outside component)
const RAIN_DATA = generateValues(100, { left: [100, 0], height: [30, 20], delay: [2, 0], duration: [0.5, 0.5] });
const DRIZZLE_DATA = generateValues(50, { left: [100, 0], height: [15, 10], delay: [3, 0], duration: [1, 1] });
const SNOW_DATA = generateValues(60, { left: [100, 0], size: [6, 4], delay: [5, 0], duration: [5, 5] });
const STORM_DATA = generateValues(80, { left: [100, 0], height: [40, 30], delay: [2, 0], duration: [0.4, 0.3] });
const STARS_DATA = generateValues(50, { left: [100, 0], top: [60, 0], size: [2, 1], delay: [3, 0], duration: [2, 2] });
const CLOUDS_DATA = generateValues(5, { top: [30, 0], width: [200, 150], height: [100, 80], duration: [20, 30] });
const FOG_DATA = [
  { top: 30, delay: 0, duration: 20 },
  { top: 50, delay: 3, duration: 25 },
  { top: 70, delay: 6, duration: 30 },
];

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
      {RAIN_DATA.map((drop, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-400/30 to-transparent rounded-full animate-rain"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function DrizzleAnimation() {
  return (
    <div className="absolute inset-0">
      {DRIZZLE_DATA.map((drop, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-300/20 to-transparent rounded-full animate-rain"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function SnowAnimation() {
  return (
    <div className="absolute inset-0">
      {SNOW_DATA.map((flake, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white/60 animate-snow"
          style={{
            left: `${flake.left}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            animationDelay: `${flake.delay}s`,
            animationDuration: `${flake.duration}s`,
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
      {STORM_DATA.map((drop, i) => (
        <div
          key={i}
          className="absolute w-0.5 bg-gradient-to-b from-blue-500/40 to-transparent rounded-full animate-rain"
          style={{
            left: `${drop.left}%`,
            height: `${drop.height}px`,
            animationDelay: `${drop.delay}s`,
            animationDuration: `${drop.duration}s`,
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
      {STARS_DATA.map((star, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-twinkle"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function CloudsAnimation() {
  return (
    <div className="absolute inset-0 opacity-20">
      {CLOUDS_DATA.map((cloud, i) => (
        <div
          key={i}
          className="absolute bg-white/30 rounded-full blur-3xl animate-float-slow"
          style={{
            left: `${i * 25}%`,
            top: `${cloud.top}%`,
            width: `${cloud.width}px`,
            height: `${cloud.height}px`,
            animationDelay: `${i * 2}s`,
            animationDuration: `${cloud.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

function FogAnimation() {
  return (
    <div className="absolute inset-0">
      {FOG_DATA.map((fog, i) => (
        <div
          key={i}
          className="absolute w-full h-32 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-fog-drift"
          style={{
            top: `${fog.top}%`,
            animationDelay: `${fog.delay}s`,
            animationDuration: `${fog.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
