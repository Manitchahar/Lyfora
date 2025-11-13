/**
 * LoadingSpinner Component
 * 
 * A theme-aware loading spinner component with multiple size variants.
 * Follows Apple's design principles with smooth animations.
 * 
 * Requirements: 15.1, 15.3, 15.5
 */

import React from 'react';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps {
  /** Size variant of the spinner */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Optional className for additional styling */
  className?: string;
  /** Optional label for accessibility */
  label?: string;
}

/**
 * LoadingSpinner component with theme-aware styling
 * 
 * Features:
 * - Four size variants: sm (16px), md (24px), lg (32px), xl (48px)
 * - Theme-aware colors using primary color
 * - Smooth rotation animation
 * - Accessible with ARIA labels
 * - Appears within 200ms as per requirements
 */
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  label = 'Loading...',
}) => {
  // Size mappings
  const sizeMap = {
    sm: 16,
    md: 24,
    lg: 32,
    xl: 48,
  };

  const spinnerSize = sizeMap[size];

  return (
    <div
      className={`inline-flex items-center justify-center ${className}`}
      role="status"
      aria-label={label}
    >
      <Loader2
        size={spinnerSize}
        className="animate-spin text-primary-500 dark:text-primary-400"
        aria-hidden="true"
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
