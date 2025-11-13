/**
 * Toast Component
 * 
 * A notification component for displaying temporary messages to users.
 * Supports different types (success, error, warning, info) with auto-dismiss.
 * 
 * Requirements: 16.1, 16.2, 16.4, 16.5
 */

import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  /** Unique identifier for the toast */
  id: string;
  /** Toast message */
  message: string;
  /** Toast type determines icon and color */
  type?: ToastType;
  /** Duration in milliseconds before auto-dismiss (0 = no auto-dismiss) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss: (id: string) => void;
  /** Optional action button */
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Toast notification component
 * 
 * Features:
 * - Four types: success, error, warning, info
 * - Auto-dismiss after specified duration
 * - Manual dismiss with close button
 * - Optional action button
 * - Smooth enter/exit animations
 * - Accessible to screen readers
 * - Theme-aware styling
 */
export const Toast: React.FC<ToastProps> = ({
  id,
  message,
  type = 'info',
  duration = 5000,
  onDismiss,
  action,
}) => {
  // Auto-dismiss after duration
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onDismiss(id);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [id, duration, onDismiss]);

  // Icon based on type
  const icons = {
    success: <CheckCircle size={20} aria-hidden="true" />,
    error: <AlertCircle size={20} aria-hidden="true" />,
    warning: <AlertTriangle size={20} aria-hidden="true" />,
    info: <Info size={20} aria-hidden="true" />,
  };

  // Styles based on type
  const typeStyles = {
    success: {
      container: 'bg-success-50 dark:bg-success-900 border-success-200 dark:border-success-700',
      icon: 'text-success-600 dark:text-success-400',
      text: 'text-success-900 dark:text-success-100',
      button: 'text-success-600 dark:text-success-400 hover:text-success-700 dark:hover:text-success-300',
    },
    error: {
      container: 'bg-error-50 dark:bg-error-900 border-error-200 dark:border-error-700',
      icon: 'text-error-600 dark:text-error-400',
      text: 'text-error-900 dark:text-error-100',
      button: 'text-error-600 dark:text-error-400 hover:text-error-700 dark:hover:text-error-300',
    },
    warning: {
      container: 'bg-warning-50 dark:bg-warning-900 border-warning-200 dark:border-warning-700',
      icon: 'text-warning-600 dark:text-warning-400',
      text: 'text-warning-900 dark:text-warning-100',
      button: 'text-warning-600 dark:text-warning-400 hover:text-warning-700 dark:hover:text-warning-300',
    },
    info: {
      container: 'bg-primary-50 dark:bg-primary-900 border-primary-200 dark:border-primary-700',
      icon: 'text-primary-600 dark:text-primary-400',
      text: 'text-primary-900 dark:text-primary-100',
      button: 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300',
    },
  };

  const styles = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`
        flex items-start gap-3 p-4 rounded-lg border shadow-lg
        min-w-[320px] max-w-md
        ${styles.container}
      `}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
      aria-atomic="true"
    >
      {/* Icon */}
      <div className={`flex-shrink-0 ${styles.icon}`}>
        {icons[type]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium ${styles.text}`}>
          {message}
        </p>
        {action && (
          <button
            onClick={() => {
              action.onClick();
              onDismiss(id);
            }}
            className={`mt-2 text-sm font-medium underline ${styles.button} transition-colors`}
          >
            {action.label}
          </button>
        )}
      </div>

      {/* Close Button */}
      <button
        onClick={() => onDismiss(id)}
        className={`flex-shrink-0 ${styles.button} transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded`}
        aria-label="Dismiss notification"
      >
        <X size={18} />
      </button>
    </motion.div>
  );
};

export default Toast;
