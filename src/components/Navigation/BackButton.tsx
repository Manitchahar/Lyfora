/**
 * BackButton Component
 * 
 * Navigation button that goes back in history or to a fallback route.
 * 
 * Requirements: 6.1, 6.2, 14.2
 */

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  /** Fallback route if no history exists */
  fallback?: string;
  /** Custom label for the button */
  label?: string;
  /** Additional CSS classes */
  className?: string;
}

/**
 * BackButton component with navigate(-1) functionality
 * Requirements: 6.1 - Back button on detail pages
 * Requirements: 6.2 - navigate(-1) implementation
 * Requirements: 14.2 - Keyboard navigation and accessibility
 */
export function BackButton({ 
  fallback = '/', 
  label = 'Back',
  className = ''
}: BackButtonProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    // Check if there's history to go back to
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      // No history, use fallback route
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`
        inline-flex items-center gap-2 px-4 py-2
        text-gray-700 dark:text-gray-300
        hover:bg-gray-100 dark:hover:bg-gray-800
        rounded-lg transition-colors duration-200
        focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
        ${className}
      `}
      aria-label={label}
    >
      <ArrowLeft className="w-5 h-5" aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default BackButton;
