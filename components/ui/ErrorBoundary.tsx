import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Log to crash reporting service (implement when ready)
    // crashReporting.recordError(error, errorInfo);
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.resetError);
      }

      return <DefaultErrorFallback error={this.state.error!} reset={this.resetError} />;
    }

    return this.props.children;
  }
}

// Default error fallback component
interface DefaultErrorFallbackProps {
  error: Error;
  reset: () => void;
  showDetails?: boolean;
}

export const DefaultErrorFallback: React.FC<DefaultErrorFallbackProps> = ({
  error,
  reset,
  showDetails = __DEV__, // Only show details in development
}) => {
  const [detailsVisible, setDetailsVisible] = React.useState(false);

  return (
    <View style={tw`flex-1 bg-gray-50 items-center justify-center p-6`}>
      <View style={tw`bg-white rounded-2xl p-8 w-full max-w-sm shadow-lg`}>
        {/* Error Icon */}
        <View style={tw`items-center mb-6`}>
          <View style={tw`w-20 h-20 bg-red-100 rounded-full items-center justify-center mb-4`}>
            <Ionicons name="alert-circle" size={40} color="#EF4444" />
          </View>
          <Text style={tw`text-xl font-bold text-gray-800 text-center mb-2`}>
            Oops! Something went wrong
          </Text>
          <Text style={tw`text-gray-600 text-center text-sm`}>
            We're sorry, but something unexpected happened. Please try again.
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={tw`space-y-3`}>
          <TouchableOpacity
            style={tw`bg-blue-600 py-3 px-6 rounded-xl`}
            onPress={reset}
          >
            <Text style={tw`text-white font-semibold text-center`}>
              Try Again
            </Text>
          </TouchableOpacity>

          {showDetails && (
            <TouchableOpacity
              style={tw`border border-gray-300 py-3 px-6 rounded-xl`}
              onPress={() => setDetailsVisible(!detailsVisible)}
            >
              <Text style={tw`text-gray-700 font-medium text-center`}>
                {detailsVisible ? 'Hide Details' : 'Show Details'}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Error Details (Development only) */}
        {showDetails && detailsVisible && (
          <View style={tw`mt-6 p-4 bg-gray-100 rounded-xl`}>
            <Text style={tw`text-xs font-bold text-gray-800 mb-2`}>
              Error Details:
            </Text>
            <ScrollView style={tw`max-h-40`}>
              <Text style={tw`text-xs text-gray-600 font-mono`}>
                {error.name}: {error.message}
              </Text>
              {error.stack && (
                <Text style={tw`text-xs text-gray-500 font-mono mt-2`}>
                  {error.stack}
                </Text>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  const handleError = React.useCallback((error: Error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  return { handleError, resetError, hasError: !!error };
};

// Async error boundary for handling promise rejections
export const AsyncErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      // You might want to show a toast or log this to your error reporting service
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
};

// Specific error components for different scenarios
export const NetworkErrorFallback: React.FC<{ onRetry: () => void }> = ({ onRetry }) => (
  <View style={tw`flex-1 items-center justify-center p-6`}>
    <View style={tw`items-center`}>
      <View style={tw`w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4`}>
        <Ionicons name="wifi-outline" size={32} color="#F59E0B" />
      </View>
      <Text style={tw`text-xl font-bold text-gray-800 text-center mb-2`}>
        Connection Problem
      </Text>
      <Text style={tw`text-gray-600 text-center text-sm mb-6`}>
        Please check your internet connection and try again.
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-600 py-3 px-6 rounded-xl`}
        onPress={onRetry}
      >
        <Text style={tw`text-white font-semibold`}>Retry</Text>
      </TouchableOpacity>
    </View>
  </View>
);

export const NotFoundErrorFallback: React.FC<{ onGoHome: () => void }> = ({ onGoHome }) => (
  <View style={tw`flex-1 items-center justify-center p-6`}>
    <View style={tw`items-center`}>
      <View style={tw`w-16 h-16 bg-gray-100 rounded-full items-center justify-center mb-4`}>
        <Ionicons name="search-outline" size={32} color="#6B7280" />
      </View>
      <Text style={tw`text-xl font-bold text-gray-800 text-center mb-2`}>
        Page Not Found
      </Text>
      <Text style={tw`text-gray-600 text-center text-sm mb-6`}>
        The page you're looking for doesn't exist or has been moved.
      </Text>
      <TouchableOpacity
        style={tw`bg-blue-600 py-3 px-6 rounded-xl`}
        onPress={onGoHome}
      >
        <Text style={tw`text-white font-semibold`}>Go Home</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// HOC for wrapping components with error boundary
export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  fallback?: (error: Error, reset: () => void) => ReactNode
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary fallback={fallback}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};
