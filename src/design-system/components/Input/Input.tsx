/**
 * Input Component
 * 
 * A text input component with label, error, and helper text support.
 * Includes icon support and proper accessibility attributes.
 * Features smooth focus animations that respect prefers-reduced-motion.
 * 
 * Requirements: 2.2, 12.3, 12.4, 14.5, 16.2
 */

import React, { useId } from 'react';
import { AlertCircle } from 'lucide-react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Label text for the input */
  label?: string;
  /** Error message to display */
  error?: string;
  /** Helper text to display below the input */
  helperText?: string;
  /** Icon to display on the left side of the input */
  icon?: React.ReactNode;
  /** Additional className for the container */
  containerClassName?: string;
}

/**
 * Input component with validation and accessibility
 * 
 * Features:
 * - Label with proper association
 * - Error state with red border and error message
 * - Helper text for additional guidance
 * - Left-aligned icon support
 * - Focus states with primary color ring and smooth scale animation
 * - Full keyboard accessibility
 * - ARIA attributes for screen readers
 * - Respects prefers-reduced-motion setting
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      helperText,
      icon,
      disabled = false,
      required = false,
      className = '',
      containerClassName = '',
      id: providedId,
      'aria-describedby': ariaDescribedBy,
      ...props
    },
    ref
  ) => {
    // Generate unique IDs for accessibility
    const generatedId = useId();
    const id = providedId || generatedId;
    const errorId = `${id}-error`;
    const helperId = `${id}-helper`;

    // Build aria-describedby
    const describedByIds = [
      error ? errorId : null,
      helperText ? helperId : null,
      ariaDescribedBy,
    ]
      .filter(Boolean)
      .join(' ');

    // Base input styles
    const baseInputStyles = [
      'w-full',
      'h-11', // 44px - mobile touch target
      'px-4',
      'text-base',
      'rounded-lg',
      'border',
      'transition-all',
      'duration-150',
      'ease-out',
      'bg-white',
      'dark:bg-neutral-800',
      'text-neutral-900',
      'dark:text-neutral-100',
      'placeholder:text-neutral-400',
      'dark:placeholder:text-neutral-500',
      'focus:outline-none',
      'disabled:opacity-50',
      'disabled:cursor-not-allowed',
      'disabled:bg-neutral-50',
      'dark:disabled:bg-neutral-900',
      // Requirement 12.3, 12.4: Focus animations with prefers-reduced-motion support
      'motion-safe:focus:scale-[1.01]',
      'motion-safe:focus:shadow-sm',
    ];

    // Conditional styles based on state
    const stateStyles = error
      ? [
          'border-error-500',
          'focus:border-error-500',
          'focus:ring-2',
          'focus:ring-error-500',
          'focus:ring-opacity-20',
        ]
      : [
          'border-neutral-300',
          'dark:border-neutral-700',
          'focus:border-primary-500',
          'focus:ring-2',
          'focus:ring-primary-500',
          'focus:ring-opacity-20',
        ];

    // Add padding for icon
    const iconStyles = icon ? ['pl-11'] : [];

    // Combine all input styles
    const inputClasses = [
      ...baseInputStyles,
      ...stateStyles,
      ...iconStyles,
      className,
    ].join(' ');

    return (
      <div className={`w-full ${containerClassName}`}>
        {/* Label */}
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1.5"
          >
            {label}
            {required && (
              <span className="text-error-500 ml-1" aria-label="required">
                *
              </span>
            )}
          </label>
        )}

        {/* Input container */}
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 dark:text-neutral-500 pointer-events-none"
              aria-hidden="true"
            >
              {icon}
            </div>
          )}

          {/* Input field */}
          <input
            ref={ref}
            id={id}
            disabled={disabled}
            required={required}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={describedByIds || undefined}
            aria-required={required}
            className={inputClasses}
            {...props}
          />

          {/* Error icon */}
          {error && (
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-error-500 pointer-events-none"
              aria-hidden="true"
            >
              <AlertCircle size={18} />
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <p
            id={errorId}
            className="mt-1.5 text-sm text-error-600 dark:text-error-400 flex items-start gap-1"
            role="alert"
          >
            <AlertCircle size={16} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}

        {/* Helper text */}
        {helperText && !error && (
          <p
            id={helperId}
            className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
