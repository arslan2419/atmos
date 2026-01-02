import React from 'react';
import { AlertCircle, WifiOff, Clock, RefreshCw, MapPin } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';
import { WeatherError } from '@/types/weather';
import { Button } from './Button';
import { Card } from './Card';

interface ErrorDisplayProps {
  error: WeatherError;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorDisplay({ error, onRetry, onDismiss }: ErrorDisplayProps) {
  const { theme } = useTheme();

  const getErrorIcon = () => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return <WifiOff className="w-12 h-12" />;
      case 'RATE_LIMIT':
        return <Clock className="w-12 h-12" />;
      case 'GEOLOCATION_ERROR':
        return <MapPin className="w-12 h-12" />;
      default:
        return <AlertCircle className="w-12 h-12" />;
    }
  };

  const getErrorTitle = () => {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return 'Connection Lost';
      case 'RATE_LIMIT':
        return 'Too Many Requests';
      case 'GEOLOCATION_ERROR':
        return 'Location Not Found';
      case 'SERVER_ERROR':
        return 'Service Unavailable';
      default:
        return 'Something Went Wrong';
    }
  };

  return (
    <Card className="max-w-md mx-auto text-center" padding="lg">
      <div className={`${theme.textMuted} mb-4 flex justify-center`}>
        {getErrorIcon()}
      </div>
      <h2 className={`text-xl font-bold mb-2 ${theme.textPrimary}`}>
        {getErrorTitle()}
      </h2>
      <p className={`${theme.textSecondary} mb-6`}>
        {error.message}
      </p>
      <div className="flex gap-3 justify-center">
        {onRetry && (
          <Button
            variant="primary"
            onClick={onRetry}
            leftIcon={<RefreshCw className="w-4 h-4" />}
          >
            Try Again
          </Button>
        )}
        {onDismiss && (
          <Button variant="ghost" onClick={onDismiss}>
            Dismiss
          </Button>
        )}
      </div>
    </Card>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-800 to-slate-900">
          <div className="max-w-md w-full text-center p-8 rounded-2xl bg-white/10 backdrop-blur-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">
              Oops! Something went wrong
            </h1>
            <p className="text-white/70 mb-6">
              We're sorry, but something unexpected happened. Please try refreshing the page.
            </p>
            <Button
              variant="primary"
              onClick={() => window.location.reload()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

