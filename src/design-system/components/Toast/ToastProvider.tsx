/**
 * ToastProvider Component
 * 
 * Context provider for managing toast notifications throughout the application.
 * Provides methods to show and dismiss toasts from anywhere in the component tree.
 * 
 * Requirements: 16.1, 16.2, 16.4
 */

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Toast, ToastType } from './Toast';

export interface ToastOptions {
  /** Toast message */
  message: string;
  /** Toast type */
  type?: ToastType;
  /** Duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  /** Show a toast notification */
  showToast: (options: ToastOptions) => string;
  /** Dismiss a specific toast by ID */
  dismissToast: (id: string) => void;
  /** Dismiss all toasts */
  dismissAll: () => void;
  /** Show a success toast (convenience method) */
  success: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  /** Show an error toast (convenience method) */
  error: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  /** Show a warning toast (convenience method) */
  warning: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
  /** Show an info toast (convenience method) */
  info: (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => string;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export interface ToastProviderProps {
  children: ReactNode;
  /** Maximum number of toasts to display at once */
  maxToasts?: number;
  /** Position of toast container */
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

/**
 * ToastProvider component
 * 
 * Features:
 * - Manages toast state globally
 * - Provides methods to show/dismiss toasts
 * - Limits maximum number of visible toasts
 * - Configurable position
 * - Convenience methods for different toast types
 */
export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 5,
  position = 'top-right',
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  // Generate unique ID for toast
  const generateId = useCallback(() => {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Show a toast
  const showToast = useCallback(
    (options: ToastOptions): string => {
      const id = generateId();
      const newToast: ToastItem = {
        id,
        type: 'info',
        duration: 5000,
        ...options,
      };

      setToasts((prev) => {
        const updated = [...prev, newToast];
        // Limit to maxToasts, removing oldest
        return updated.slice(-maxToasts);
      });

      return id;
    },
    [generateId, maxToasts]
  );

  // Dismiss a specific toast
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Dismiss all toasts
  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Convenience methods
  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return showToast({ ...options, message, type: 'success' });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return showToast({ ...options, message, type: 'error' });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return showToast({ ...options, message, type: 'warning' });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) => {
      return showToast({ ...options, message, type: 'info' });
    },
    [showToast]
  );

  const value: ToastContextValue = {
    showToast,
    dismissToast,
    dismissAll,
    success,
    error,
    warning,
    info,
  };

  // Position styles
  const positionStyles = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      
      {/* Toast Container */}
      <div
        className={`fixed ${positionStyles[position]} z-50 flex flex-col gap-2 pointer-events-none`}
        aria-live="polite"
        aria-atomic="false"
      >
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <div key={toast.id} className="pointer-events-auto">
              <Toast
                id={toast.id}
                message={toast.message}
                type={toast.type}
                duration={toast.duration}
                action={toast.action}
                onDismiss={dismissToast}
              />
            </div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};

/**
 * Hook to access toast context
 * 
 * @throws Error if used outside ToastProvider
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default ToastProvider;
