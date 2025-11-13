/**
 * useApiError Hook
 * 
 * Custom hook for handling API errors with toast notifications and retry mechanisms.
 * 
 * Requirements: 16.1, 16.2, 16.3, 16.4
 */

import { useCallback } from 'react';
import { useToast } from '../design-system/components';

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
  statusCode?: number;
}

export interface UseApiErrorOptions {
  /** Show toast notification for errors */
  showToast?: boolean;
  /** Custom error message override */
  customMessage?: string;
  /** Callback when error occurs */
  onError?: (error: ApiError) => void;
}

/**
 * Hook for handling API errors
 * 
 * Features:
 * - Displays toast notifications for errors
 * - Provides retry mechanism
 * - Extracts actionable error messages
 * - Logs errors for debugging
 * 
 * @returns Object with error handling utilities
 */
export const useApiError = () => {
  const toast = useToast();

  /**
   * Handle an API error
   */
  const handleError = useCallback(
    (error: unknown, options: UseApiErrorOptions = {}) => {
      const { showToast: shouldShowToast = true, customMessage, onError } = options;

      // Parse error into ApiError format
      const apiError = parseError(error);

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', apiError);
      }

      // Call custom error handler
      onError?.(apiError);

      // Show toast notification
      if (shouldShowToast) {
        const message = customMessage || apiError.message;
        toast.error(message, {
          duration: 5000,
        });
      }

      return apiError;
    },
    [toast]
  );

  /**
   * Handle an API error with retry option
   */
  const handleErrorWithRetry = useCallback(
    (error: unknown, retryFn: () => void | Promise<void>, options: UseApiErrorOptions = {}) => {
      const { showToast: shouldShowToast = true, customMessage, onError } = options;

      // Parse error into ApiError format
      const apiError = parseError(error);

      // Log error in development
      if (process.env.NODE_ENV === 'development') {
        console.error('API Error:', apiError);
      }

      // Call custom error handler
      onError?.(apiError);

      // Show toast notification with retry action
      if (shouldShowToast) {
        const message = customMessage || apiError.message;
        toast.error(message, {
          duration: 0, // Don't auto-dismiss when retry is available
          action: {
            label: 'Retry',
            onClick: () => {
              retryFn();
            },
          },
        });
      }

      return apiError;
    },
    [toast]
  );

  return {
    handleError,
    handleErrorWithRetry,
  };
};

/**
 * Parse unknown error into ApiError format
 */
function parseError(error: unknown): ApiError {
  // Handle ApiError objects
  if (isApiError(error)) {
    return error;
  }

  // Handle Error objects
  if (error instanceof Error) {
    return {
      message: error.message || 'An unexpected error occurred',
    };
  }

  // Handle response errors (fetch API)
  if (isResponseError(error)) {
    return {
      message: error.statusText || 'Network request failed',
      statusCode: error.status,
    };
  }

  // Handle string errors
  if (typeof error === 'string') {
    return {
      message: error,
    };
  }

  // Handle object with message property
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      message: String((error as { message: unknown }).message),
    };
  }

  // Default error
  return {
    message: 'An unexpected error occurred',
  };
}

/**
 * Type guard for ApiError
 */
function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as ApiError).message === 'string'
  );
}

/**
 * Type guard for Response errors
 */
function isResponseError(error: unknown): error is Response {
  return (
    typeof error === 'object' &&
    error !== null &&
    'status' in error &&
    'statusText' in error
  );
}

export default useApiError;
