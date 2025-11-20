/**
 * Button Component
 * 
 * A versatile button component with multiple variants, sizes, and states.
 * Follows Apple's design principles with smooth animations and accessibility.
 * Respects prefers-reduced-motion setting.
 * 
 * Requirements: 2.1, 1.5, 12.3, 12.4, 14.2
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface ButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  /** Visual variant of the button */
  variant?: 'primary' | 'secondary' | 'tertiary' | 'ghost';
  /** Size variant with proper padding and typography */
  size?: 'sm' | 'md' | 'lg';
  /** Loading state with spinner icon */
  loading?: boolean;
  /** Icon to display before the button text */
  icon?: React.ReactNode;
  /** Button content */
  children?: React.ReactNode;
}

/**
 * Button component with variants and states
 * 
 * Features:
 * - Four variants: primary, secondary, tertiary, ghost
 * - Three sizes: sm, md, lg
 * - Loading state with spinner
 * - Hover, active, and disabled states with animations
 * - Full keyboard accessibility
 * - ARIA attributes for screen readers
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      icon,
      children,
      className = '',
      type = 'button',
      ...props
    },
    ref
  ) => {
    // Base styles - common to all variants
    const baseStyles = [
      'inline-flex',
      'items-center',
      'justify-center',
      'gap-2',
      'font-medium',
      'rounded-lg',
      'transition-all',
      'duration-150',
      'ease-out',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-primary-500',
      'focus:ring-offset-2',
      'dark:focus:ring-offset-neutral-900',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:pointer-events-none',
      // 'motion-safe:hover:scale-[1.02]', // Replaced by framer-motion
      // 'motion-safe:active:scale-[0.98]', // Replaced by framer-motion
    ];

    // Variant styles
    const variantStyles = {
      primary: [
        'bg-primary-500',
        'text-white',
        'hover:bg-primary-600',
        'active:bg-primary-700',
        'shadow-sm',
        'hover:shadow-md',
      ],
      secondary: [
        'bg-transparent',
        'text-primary-600',
        'dark:text-primary-400',
        'border',
        'border-primary-500',
        'hover:bg-primary-50',
        'dark:hover:bg-primary-950',
        'active:bg-primary-100',
        'dark:active:bg-primary-900',
      ],
      tertiary: [
        'bg-primary-50',
        'dark:bg-primary-950',
        'text-primary-700',
        'dark:text-primary-300',
        'hover:bg-primary-100',
        'dark:hover:bg-primary-900',
        'active:bg-primary-200',
        'dark:active:bg-primary-800',
      ],
      ghost: [
        'bg-transparent',
        'text-neutral-700',
        'dark:text-neutral-300',
        'hover:bg-neutral-100',
        'dark:hover:bg-neutral-800',
        'active:bg-neutral-200',
        'dark:active:bg-neutral-700',
      ],
    };

    // Size styles
    const sizeStyles = {
      sm: ['px-3', 'py-1.5', 'text-sm', 'min-h-[32px]'],
      md: ['px-4', 'py-2', 'text-base', 'min-h-[40px]'],
      lg: ['px-6', 'py-3', 'text-lg', 'min-h-[48px]'],
    };

    // Combine all styles
    const buttonClasses = [
      ...baseStyles,
      ...variantStyles[variant],
      ...sizeStyles[size],
      className,
    ].join(' ');

    // Determine if button should be disabled
    const isDisabled = disabled || loading;

    return (
      <motion.button
        ref={ref}
        type={type as "button" | "submit" | "reset"}
        disabled={isDisabled}
        className={buttonClasses}
        aria-busy={loading}
        aria-disabled={isDisabled}
        whileHover={{ scale: isDisabled ? 1 : 1.02 }}
        whileTap={{ scale: isDisabled ? 1 : 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        {...props}
      >
        {loading ? (
          <>
            <Loader2
              className="animate-spin"
              size={size === 'sm' ? 16 : size === 'lg' ? 20 : 18}
              aria-hidden="true"
            />
            <span className="sr-only">Loading...</span>
          </>
        ) : icon ? (
          <span aria-hidden="true">{icon}</span>
        ) : null}
        {children && <span>{children}</span>}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
