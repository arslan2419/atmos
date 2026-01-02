import React from 'react';
import { useTheme } from '@/context/ThemeContext';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md',
}: ToggleProps) {
  const { theme } = useTheme();

  const sizeClasses = {
    sm: {
      track: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      track: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      track: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const sizes = sizeClasses[size];

  return (
    <label className="inline-flex items-center gap-3 cursor-pointer">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`
          relative inline-flex items-center rounded-full
          ${sizes.track}
          transition-colors duration-200 ease-in-out
          focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          disabled:opacity-50 disabled:cursor-not-allowed
          ${checked ? theme.accent : 'bg-white/30'}
        `}
      >
        <span
          className={`
            inline-block rounded-full bg-white shadow-lg
            ${sizes.thumb}
            transform transition-transform duration-200 ease-in-out
            ${checked ? sizes.translate : 'translate-x-0.5'}
          `}
        />
      </button>
      {label && (
        <span className={`text-sm font-medium ${theme.textPrimary}`}>
          {label}
        </span>
      )}
    </label>
  );
}

interface ToggleGroupProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  label?: string;
}

export function ToggleGroup<T extends string>({
  value,
  onChange,
  options,
  label,
}: ToggleGroupProps<T>) {
  const { theme } = useTheme();

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <span className={`text-sm font-medium ${theme.textSecondary}`}>
          {label}
        </span>
      )}
      <div className={`inline-flex rounded-xl p-1 ${theme.cardBg} backdrop-blur-md`}>
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 text-sm font-medium rounded-lg
              transition-all duration-200 ease-in-out
              focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white/50
              ${
                value === option.value
                  ? `${theme.accent} text-white shadow-md`
                  : `bg-transparent ${theme.textSecondary} hover:bg-white/10`
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

