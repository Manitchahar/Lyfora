/**
 * ThemeToggle Component
 * 
 * A toggle button for switching between light and dark themes.
 * Features smooth icon transitions and full accessibility.
 * 
 * Requirements: 3.2, 3.3, 14.3, 14.10
 */

import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../theme/ThemeProvider';

export interface ThemeToggleProps {
  /** Additional className */
  className?: string;
  /** Size of the toggle button */
  size?: 'sm' | 'md' | 'lg';
}

/**
 * ThemeToggle component
 * 
 * Features:
 * - Toggle button with sun/moon icons
 * - Smooth icon transition animation
 * - Connects to useTheme hook for theme switching
 * - Full keyboard accessibility
 * - Proper ARIA labels for screen readers
 * - Respects system preference when theme is 'system'
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  className = '',
  size = 'md',
}) => {
  const { theme, resolvedTheme, setTheme } = useTheme();

  // Handle theme toggle
  const handleToggle = () => {
    // If currently using system preference, switch to explicit theme
    if (theme === 'system') {
      setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
    } else {
      // Toggle between light and dark
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  // Size styles
  const sizeStyles = {
    sm: {
      button: 'p-1.5',
      icon: 16,
    },
    md: {
      button: 'p-2',
      icon: 20,
    },
    lg: {
      button: 'p-2.5',
      icon: 24,
    },
  };

  const { button: buttonSize, icon: iconSize } = sizeStyles[size];

  // Icon animation variants
  const iconVariants = {
    initial: { scale: 0, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1 },
    exit: { scale: 0, rotate: 180, opacity: 0 },
  };

  const iconTransition = {
    duration: 0.2,
    ease: [0.4, 0, 0.2, 1] as const,
  };

  // Determine which icon to show based on resolved theme
  const isDark = resolvedTheme === 'dark';

  // ARIA label
  const ariaLabel = isDark
    ? 'Switch to light mode'
    : 'Switch to dark mode';

  return (
    <button
      onClick={handleToggle}
      className={`
        ${buttonSize}
        rounded-lg
        text-neutral-700
        dark:text-neutral-300
        hover:bg-neutral-100
        dark:hover:bg-neutral-800
        active:bg-neutral-200
        dark:active:bg-neutral-700
        transition-colors
        duration-150
        focus:outline-none
        focus:ring-2
        focus:ring-primary-500
        focus:ring-offset-2
        dark:focus:ring-offset-neutral-900
        ${className}
      `}
      aria-label={ariaLabel}
      title={ariaLabel}
      type="button"
    >
      <div className="relative" style={{ width: iconSize, height: iconSize }}>
        <AnimatePresence mode="wait" initial={false}>
          {isDark ? (
            <motion.div
              key="moon"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={iconTransition}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Moon size={iconSize} aria-hidden="true" />
            </motion.div>
          ) : (
            <motion.div
              key="sun"
              variants={iconVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={iconTransition}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Sun size={iconSize} aria-hidden="true" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <span className="sr-only">{ariaLabel}</span>
    </button>
  );
};

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;
