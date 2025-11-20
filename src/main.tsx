import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useRoutes, useLocation, Location } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './design-system/theme/ThemeProvider';
import { RouteLoadingProvider } from './contexts/RouteLoadingContext';
import { ErrorBoundary } from './design-system/components';
import routes from './routes';
import './index.css';

/**
 * Loading fallback component for lazy-loaded routes
 * Requirements: 15.1, 15.2
 */
function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

/**
 * App component that renders routes with modal support and page transitions
 * Requirements: 5.1 - BrowserRouter setup
 * Requirements: 7.1, 7.3 - Modal route infrastructure with location state
 * Requirements: 12.1, 12.2, 12.5 - Page transitions with AnimatePresence
 */
function App() {
  const location = useLocation();

  // Check if we have a background location (for modal routes)
  const state = location.state as { backgroundLocation?: Location } | null;
  const backgroundLocation = state?.backgroundLocation;

  // Determine which location to use for routing
  const routeLocation = backgroundLocation || location;

  // Render routes with background location if modal is open
  const element = useRoutes(routes, routeLocation);
  const modalElement = backgroundLocation ? useRoutes(routes, location) : null;

  return (
    <>
      {/* 
        AnimatePresence for page transitions
        Requirements: 12.1, 12.2, 12.5
        - mode="wait": Wait for exit animation before entering new page
        - initial={false}: Disable initial animation on mount
        - Key based on pathname for proper transition detection
      */}
      <AnimatePresence mode="wait" initial={false}>
        <div key={routeLocation.pathname.split('/')[1] || 'home'}>
          {element}
        </div>
      </AnimatePresence>
      {/* Modal routes render on top without AnimatePresence */}
      {modalElement}
    </>
  );
}

/**
 * Main application entry point
 * Requirements: 5.1 - React Router v6 implementation
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <RouteLoadingProvider>
            <ErrorBoundary>
              <Suspense fallback={<LoadingFallback />}>
                <App />
              </Suspense>
            </ErrorBoundary>
          </RouteLoadingProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
