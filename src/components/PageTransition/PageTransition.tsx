/**
 * PageTransition Component
 * 
 * Wrapper component that adds fade and slide animations to page transitions.
 * Uses Framer Motion for smooth enter/exit animations.
 * 
 * Requirements: 12.1, 12.2, 12.5
 */

import { motion, HTMLMotionProps } from 'framer-motion';

export interface PageTransitionProps extends Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit'> {
  /** Page content */
  children: React.ReactNode;
  /** Additional className */
  className?: string;
}

/**
 * PageTransition component for route animations
 * 
 * Features:
 * - Fade and slide animations for page changes
 * - 300ms duration with easeInOut timing (Requirement 12.5)
 * - Respects prefers-reduced-motion setting (Requirement 12.4)
 * - Works with AnimatePresence in parent component
 */
export const PageTransition: React.FC<PageTransitionProps> = ({
  children,
  className = '',
  ...props
}) => {
  // Check if user prefers reduced motion (Requirement 12.4)
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Animation variants - fade and slide (Requirements 12.1, 12.2)
  const variants = {
    initial: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : 20,
    },
    animate: {
      opacity: 1,
      y: 0,
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -20,
    },
  };

  // Transition settings - 300ms duration with easeInOut (Requirement 12.5)
  const transition = {
    duration: 0.3,
    ease: [0.4, 0, 0.2, 1] as const, // easeInOut cubic-bezier
  };

  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
};

PageTransition.displayName = 'PageTransition';

export default PageTransition;
