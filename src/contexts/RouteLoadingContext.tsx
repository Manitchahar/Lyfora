/**
 * RouteLoadingContext
 *
 * Provides a shared loading indicator so route transitions and protected
 * guards can coordinate a single visual spinner/progress bar.
 */

import { createContext, ReactNode, useCallback, useContext, useMemo, useState } from 'react';

interface RouteLoadingContextValue {
  isLoading: boolean;
  startLoading: () => void;
  stopLoading: () => void;
  withLoader: <T>(operation: () => Promise<T>) => Promise<T>;
}

const RouteLoadingContext = createContext<RouteLoadingContextValue | undefined>(undefined);

export function RouteLoadingProvider({ children }: { children: ReactNode }) {
  const [pendingCount, setPendingCount] = useState(0);

  const startLoading = useCallback(() => {
    setPendingCount((count) => count + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setPendingCount((count) => Math.max(0, count - 1));
  }, []);

  const withLoader = useCallback(
    async <T,>(operation: () => Promise<T>) => {
      startLoading();
      try {
        return await operation();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading]
  );

  const value = useMemo(
    () => ({
      isLoading: pendingCount > 0,
      startLoading,
      stopLoading,
      withLoader,
    }),
    [pendingCount, startLoading, stopLoading, withLoader]
  );

  return (
    <RouteLoadingContext.Provider value={value}>
      {children}
      <RouteLoadingOverlay active={value.isLoading} />
    </RouteLoadingContext.Provider>
  );
}

export function useRouteLoading() {
  const context = useContext(RouteLoadingContext);
  if (!context) {
    throw new Error('useRouteLoading must be used within a RouteLoadingProvider');
  }
  return context;
}

function RouteLoadingOverlay({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden={!active}
      className={`pointer-events-none fixed inset-x-0 top-0 z-[9999] transition-opacity duration-150 ${
        active ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="h-1 w-full bg-gradient-to-r from-teal-400 via-blue-500 to-teal-500 animate-pulse" />
    </div>
  );
}
