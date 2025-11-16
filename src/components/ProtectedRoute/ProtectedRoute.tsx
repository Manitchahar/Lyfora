/**
 * ProtectedRoute Component
 * 
 * Wrapper component that checks authentication status and redirects
 * unauthenticated users to login while preserving their intended destination.
 * 
 * Requirements: 5.1
 */

import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../design-system/components/Button/Button';
import { useRouteLoading } from '../../contexts/RouteLoadingContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * ProtectedRoute wrapper component
 * Requirements: 5.1 - Redirect to login if not authenticated
 * Requirements: 5.1 - Preserve intended destination for post-login redirect
 */
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, error, refreshSession } = useAuth();
  const location = useLocation();
  const { startLoading, stopLoading, withLoader } = useRouteLoading();

  useEffect(() => {
    if (!loading) {
      return;
    }

    startLoading();
    return () => {
      stopLoading();
    };
  }, [loading, startLoading, stopLoading]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur rounded-2xl shadow-lg p-8 text-center space-y-4">
          <p className="text-lg font-semibold text-gray-900 dark:text-white">We couldn't verify your session.</p>
          <p className="text-gray-600 dark:text-gray-400">Check your network connection and try again.</p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => withLoader(refreshSession)}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated, preserving the intended destination
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return <>{children}</>;
}

export default ProtectedRoute;
