/**
 * ErrorBoundary Component
 * 
 * A React error boundary that catches JavaScript errors anywhere in the child
 * component tree and displays a fallback UI instead of crashing the app.
 * 
 * Requirements: 16.1, 16.3, 16.5
 */

import { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '../Button';

export interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Custom fallback UI (optional) */
  fallback?: (error: Error, reset: () => void) => ReactNode;
  /** Callback when an error is caught */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary component with fallback UI
 * 
 * Features:
 * - Catches React component errors
 * - Displays user-friendly error message
 * - Provides "Try Again" action to reset
 * - Logs errors to console in development
 * - Accessible error messages for screen readers
 * - Custom fallback UI support
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: undefined,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: undefined,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      // Default fallback UI
      return (
        <div
          className="min-h-screen flex items-center justify-center p-4 bg-neutral-50 dark:bg-neutral-900"
          role="alert"
          aria-live="assertive"
        >
          <div className="max-w-md w-full bg-white dark:bg-neutral-800 rounded-lg shadow-lg p-8 text-center">
            {/* Error Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-error-100 dark:bg-error-900 flex items-center justify-center">
                <AlertTriangle
                  className="text-error-600 dark:text-error-400"
                  size={32}
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
              Something went wrong
            </h1>

            {/* Error Message */}
            <p className="text-neutral-600 dark:text-neutral-400 mb-6">
              We encountered an unexpected error. Please try again or contact support if the
              problem persists.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === 'development' && (
              <div className="mb-6 p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg text-left">
                <p className="text-sm font-mono text-error-600 dark:text-error-400 break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={this.handleReset}
                icon={<RefreshCw size={18} />}
              >
                Try Again
              </Button>
              <Button
                variant="secondary"
                onClick={() => window.location.href = '/'}
              >
                Go to Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
