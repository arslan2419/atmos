import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const { theme } = useTheme();

  const baseClasses = `
    inline-flex items-center justify-center gap-2
    font-medium rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
    ${fullWidth ? 'w-full' : ''}
  `;

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantClasses = {
    primary: `${theme.accent} text-white ${theme.accentHover} focus:ring-blue-500`,
    secondary: `${theme.cardBg} ${theme.textPrimary} hover:bg-white/30 focus:ring-white/50`,
    ghost: `bg-transparent ${theme.textPrimary} hover:bg-white/10 focus:ring-white/50`,
    outline: `bg-transparent border-2 ${theme.cardBorder} ${theme.textPrimary} hover:bg-white/10 focus:ring-white/50`,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        leftIcon
      )}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
}

export function IconButton({
  icon,
  variant = 'ghost',
  size = 'md',
  label,
  className = '',
  ...props
}: IconButtonProps) {
  const { theme } = useTheme();

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-xl
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-3',
  };

  const variantClasses = {
    primary: `${theme.accent} text-white ${theme.accentHover} focus:ring-blue-500`,
    secondary: `${theme.cardBg} ${theme.textPrimary} hover:bg-white/30 focus:ring-white/50`,
    ghost: `bg-transparent ${theme.textPrimary} hover:bg-white/10 focus:ring-white/50`,
  };

  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label={label}
      title={label}
      {...props}
    >
      {icon}
    </button>
  );
}

