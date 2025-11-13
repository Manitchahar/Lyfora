/**
 * Skeleton Component
 * 
 * A skeleton loading component for content placeholders.
 * Follows Apple's design principles with smooth pulse animations.
 * 
 * Requirements: 15.2, 15.3, 15.5
 */

import React from 'react';

export interface SkeletonProps {
  /** Width of the skeleton (CSS value or 'full') */
  width?: string | 'full';
  /** Height of the skeleton (CSS value) */
  height?: string;
  /** Shape variant of the skeleton */
  variant?: 'text' | 'circular' | 'rectangular';
  /** Optional className for additional styling */
  className?: string;
  /** Number of lines for text variant */
  lines?: number;
}

/**
 * Skeleton component for content loading
 * 
 * Features:
 * - Three variants: text, circular, rectangular
 * - Theme-aware colors
 * - Smooth pulse animation
 * - Flexible sizing
 * - Multi-line text support
 * - Accessible with ARIA attributes
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  width = 'full',
  height,
  variant = 'rectangular',
  className = '',
  lines = 1,
}) => {
  // Base styles for all variants
  const baseStyles = [
    'animate-pulse',
    'bg-neutral-200',
    'dark:bg-neutral-700',
  ];

  // Variant-specific styles
  const variantStyles = {
    text: ['rounded', 'h-4'],
    circular: ['rounded-full'],
    rectangular: ['rounded-lg'],
  };

  // Width styles
  const widthStyle = width === 'full' ? 'w-full' : '';
  const customWidth = width !== 'full' ? { width } : {};

  // Height styles
  const heightStyle = height ? '' : variant === 'circular' ? 'h-12 w-12' : 'h-24';
  const customHeight = height ? { height } : {};

  // Combine styles
  const skeletonClasses = [
    ...baseStyles,
    ...variantStyles[variant],
    widthStyle,
    heightStyle,
    className,
  ].join(' ');

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2" role="status" aria-label="Loading content">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={skeletonClasses}
            style={{
              ...customWidth,
              ...customHeight,
              // Last line is typically shorter
              width: index === lines - 1 ? '80%' : width === 'full' ? '100%' : width,
            }}
            aria-hidden="true"
          />
        ))}
        <span className="sr-only">Loading content...</span>
      </div>
    );
  }

  // Single skeleton element
  return (
    <div
      className={skeletonClasses}
      style={{ ...customWidth, ...customHeight }}
      role="status"
      aria-label="Loading content"
    >
      <span className="sr-only">Loading content...</span>
    </div>
  );
};

Skeleton.displayName = 'Skeleton';

export default Skeleton;
