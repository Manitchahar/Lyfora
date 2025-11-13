/**
 * useModalNavigation Hook
 * 
 * A custom hook that provides a helper function for navigating to modal routes.
 * Automatically preserves the current location as background location.
 * 
 * Requirements: 7.1, 7.3, 7.5
 */

import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Hook for navigating to modal routes
 * 
 * Returns a function that navigates to a modal route while preserving
 * the current location as the background location.
 * 
 * @example
 * ```tsx
 * const navigateToModal = useModalNavigation();
 * 
 * // Open a modal route
 * navigateToModal('/dashboard/personas/123');
 * ```
 */
export function useModalNavigation() {
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Navigate to a modal route
   * 
   * @param to - The path to navigate to
   * @param options - Additional navigation options
   * 
   * Requirements: 7.1 - Modal routes add history entry
   * Requirements: 7.3 - Preserve underlying page state
   * Requirements: 7.5 - Support deep linking to modal routes
   */
  const navigateToModal = (to: string, options?: { replace?: boolean }) => {
    navigate(to, {
      ...options,
      state: { backgroundLocation: location },
    });
  };

  return navigateToModal;
}

export default useModalNavigation;
