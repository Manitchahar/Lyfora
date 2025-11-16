/**
 * AppLayout Component
 * 
 * Root layout component that wraps all routes.
 * Handles scroll restoration and route change announcements for accessibility.
 * Provides ErrorBoundary and ToastProvider for error handling.
 * 
 * Requirements: 6.4, 14.4, 16.1, 16.2
 */

import { useEffect, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { ErrorBoundary, ToastProvider } from '../design-system/components';
import { SkipToContent } from '../components/SkipToContent';
import { useRouteLoading } from '../contexts/RouteLoadingContext';

export function AppLayout() {
  const location = useLocation();
  const announceRef = useRef<HTMLDivElement>(null);
  const { isLoading } = useRouteLoading();

  /**
   * Scroll to top on route change
   * Requirements: 6.4 - Scroll to top within 100ms on navigation
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  /**
   * Announce route changes to screen readers
   * Requirements: 14.4 - aria-live region for route announcements
   */
  useEffect(() => {
    if (announceRef.current) {
      const pageName = getPageName(location.pathname);
      announceRef.current.textContent = isLoading
        ? `Loading ${pageName}`
        : `Navigated to ${pageName}`;
    }
  }, [location.pathname, isLoading]);

  return (
    <ErrorBoundary>
      <ToastProvider position="top-right">
        {/* Skip to main content link - Requirements: 14.8 */}
        <SkipToContent />
        
        {/* Screen reader announcement for route changes */}
        <div
          ref={announceRef}
          className="sr-only"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        />
        
        <Outlet />
      </ToastProvider>
    </ErrorBoundary>
  );
}

/**
 * Converts pathname to readable page name for screen reader announcements
 */
function getPageName(pathname: string): string {
  // Remove leading slash and split by slash
  const segments = pathname.replace(/^\//, '').split('/');
  
  if (segments.length === 0 || segments[0] === '') {
    return 'home page';
  }
  
  // Handle specific routes
  const firstSegment = segments[0];
  
  switch (firstSegment) {
    case 'login':
      return 'login page';
    case 'signup':
      return 'sign up page';
    case 'dashboard':
      if (segments.length > 1) {
        return `${segments[1]} page`;
      }
      return 'dashboard';
    case 'onboarding':
      return 'onboarding';
    default:
      return `${firstSegment} page`;
  }
}

export default AppLayout;
