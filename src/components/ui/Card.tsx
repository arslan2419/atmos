import { ReactNode, forwardRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  onClick?: () => void;
  role?: string;
  ariaLabel?: string;
}

const paddingClasses = {
  none: '',
  sm: 'p-3',
  md: 'p-4 md:p-5',
  lg: 'p-6 md:p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(function Card({
  children,
  className = '',
  hover = false,
  padding = 'md',
  onClick,
  role,
  ariaLabel,
}, ref) {
  const { theme } = useTheme();
  
  const baseClasses = `
    rounded-2xl backdrop-blur-md border
    ${theme.cardBg} ${theme.cardBorder}
    ${paddingClasses[padding]}
    transition-all duration-300 ease-in-out
    ${hover ? 'hover:scale-[1.02] hover:shadow-lg cursor-pointer' : ''}
    ${onClick ? 'cursor-pointer' : ''}
  `;

  return (
    <div
      ref={ref}
      className={`${baseClasses} ${className}`}
      onClick={onClick}
      role={role}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      {children}
    </div>
  );
});

interface CardHeaderProps {
  children: ReactNode;
  className?: string;
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  const { theme } = useTheme();
  
  return (
    <div className={`flex items-center justify-between mb-4 ${theme.textPrimary} ${className}`}>
      {children}
    </div>
  );
}

interface CardTitleProps {
  children: ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
}

export function CardTitle({ children, className = '', as: Component = 'h3' }: CardTitleProps) {
  const { theme } = useTheme();
  
  return (
    <Component className={`font-semibold ${theme.textPrimary} ${className}`}>
      {children}
    </Component>
  );
}

interface CardContentProps {
  children: ReactNode;
  className?: string;
}

export function CardContent({ children, className = '' }: CardContentProps) {
  return <div className={className}>{children}</div>;
}

