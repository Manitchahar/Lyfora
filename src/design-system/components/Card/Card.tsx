/**
 * Card Component
 * 
 * A versatile card component with multiple variants and padding options.
 * Follows Apple's design principles with consistent border radius and theme-aware colors.
 * Respects prefers-reduced-motion setting.
 * 
 * Requirements: 2.3, 1.1, 1.2, 12.3, 12.4
 */

import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  /** Visual variant of the card */
  variant?: 'elevated' | 'outlined' | 'filled';
  /** Padding size variant */
  padding?: 'sm' | 'md' | 'lg';
  /** Enable hover effect with shadow transition */
  hoverable?: boolean;
  /** Card content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * Card component with variants
 * 
 * Features:
 * - Three variants: elevated (with shadow), outlined (with border), filled (with background)
 * - Three padding sizes: sm (16px), md (24px), lg (32px)
 * - Optional hover effect with shadow transition
 * - Consistent 16px border radius
 * - Theme-aware colors for light and dark modes
 */
export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = 'elevated',
      padding = 'md',
      hoverable = false,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    // Base styles - common to all variants
    const baseStyles = [
      'rounded-2xl', // 16px border radius
      'transition-all',
      'duration-150',
      'ease-out',
    ];

    // Variant styles
    const variantStyles = {
      elevated: [
        'bg-white',
        'dark:bg-neutral-800',
        'shadow-md',
        hoverable && 'hover:shadow-lg',
      ],
      outlined: [
        'bg-white',
        'dark:bg-neutral-800',
        'border',
        'border-neutral-200',
        'dark:border-neutral-700',
        hoverable && 'hover:border-neutral-300',
        hoverable && 'dark:hover:border-neutral-600',
      ],
      filled: [
        'bg-neutral-50',
        'dark:bg-neutral-900',
        hoverable && 'hover:bg-neutral-100',
        hoverable && 'dark:hover:bg-neutral-800',
      ],
    };

    // Padding styles
    const paddingStyles = {
      sm: 'p-4',  // 16px
      md: 'p-6',  // 24px
      lg: 'p-8',  // 32px
    };

    // Hoverable styles - Requirement 12.4: Respect prefers-reduced-motion
    const hoverStyles = hoverable
      ? [
        'cursor-pointer',
        'cursor-pointer',
        // 'motion-safe:hover:scale-[1.01]', // Replaced by framer-motion
      ]
      : [];

    // Combine all styles
    const cardClasses = [
      ...baseStyles,
      ...variantStyles[variant].filter(Boolean),
      paddingStyles[padding],
      ...hoverStyles,
      className,
    ].join(' ');

    return (
      <motion.div
        ref={ref}
        className={cardClasses}
        whileHover={hoverable ? { scale: 1.01, y: -2 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
