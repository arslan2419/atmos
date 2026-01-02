import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className = '',
  variant = 'rectangular',
  width,
  height,
  animation = 'pulse',
}: SkeletonProps) {
  const baseClasses = 'bg-white/20 backdrop-blur-sm';
  
  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  const style: React.CSSProperties = {
    width: width ?? '100%',
    height: height ?? (variant === 'text' ? '1em' : '100%'),
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

// Common skeleton layouts
export function WeatherCardSkeleton() {
  return (
    <div className="p-6 rounded-2xl bg-white/10 backdrop-blur-md space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton variant="text" width={120} height={24} />
        <Skeleton variant="circular" width={48} height={48} />
      </div>
      <div className="space-y-2">
        <Skeleton variant="text" width={80} height={48} />
        <Skeleton variant="text" width={160} height={20} />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
        <Skeleton variant="rectangular" height={60} />
      </div>
    </div>
  );
}

export function HourlyForecastSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden py-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 min-w-[60px]">
          <Skeleton variant="text" width={40} height={16} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={32} height={20} />
        </div>
      ))}
    </div>
  );
}

export function DailyForecastSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/10">
          <Skeleton variant="text" width={60} height={20} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="text" width={80} height={20} />
        </div>
      ))}
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
          <Skeleton variant="circular" width={24} height={24} />
          <div className="flex-1 space-y-1">
            <Skeleton variant="text" width="60%" height={18} />
            <Skeleton variant="text" width="40%" height={14} />
          </div>
        </div>
      ))}
    </div>
  );
}

