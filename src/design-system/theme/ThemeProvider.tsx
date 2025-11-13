/**
 * ThemeProvider Component
 * 
 * Manages theme state and provides theme context to the application.
 * Handles system preference detection, localStorage persistence, and theme switching.
 * 
 * Requirements: 3.1, 3.4, 4.1, 4.2, 4.3, 4.4
 */

import React, { createContext, useEffect, useState, useCallback } from 'react';

export type Theme = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export interface ThemeContextValue {
  /** Current theme setting (light, dark, or system) */
  theme: Theme;
  /** Resolved theme after system preference detection (light or dark) */
  resolvedTheme: ResolvedTheme;
  /** Function to update the theme */
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const STORAGE_KEY = 'lyfora-theme-preference';
const DARK_CLASS = 'dark';

/**
 * Detects the system color scheme preference
 * Requirements: 3.1 - System preference detection
 */
function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined') return 'light';
  
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  return mediaQuery.matches ? 'dark' : 'light';
}

/**
 * Loads theme preference from localStorage
 * Requirements: 3.4 - localStorage persistence
 */
function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && ['light', 'dark', 'system'].includes(stored)) {
      return stored as Theme;
    }
  } catch (error) {
    console.error('Failed to load theme preference:', error);
  }
  
  return null;
}

/**
 * Saves theme preference to localStorage
 * Requirements: 3.4 - localStorage persistence
 */
function saveTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.error('Failed to save theme preference:', error);
  }
}

/**
 * Resolves the actual theme to apply based on theme setting
 */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === 'system') {
    return getSystemTheme();
  }
  return theme;
}

export interface ThemeProviderProps {
  children: React.ReactNode;
  /** Default theme if no preference is stored */
  defaultTheme?: Theme;
}

/**
 * ThemeProvider component that manages theme state and applies theme to DOM
 * Requirements: 4.2 - ThemeProvider context for theme state
 */
export function ThemeProvider({ 
  children, 
  defaultTheme = 'system' 
}: ThemeProviderProps) {
  // Initialize theme from localStorage or default
  const [theme, setThemeState] = useState<Theme>(() => {
    return getStoredTheme() ?? defaultTheme;
  });

  // Resolve the actual theme to apply
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() => {
    return resolveTheme(theme);
  });

  /**
   * Updates theme and persists to localStorage
   * Requirements: 4.3 - Theme switching within 200ms
   */
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    saveTheme(newTheme);
    setResolvedTheme(resolveTheme(newTheme));
  }, []);

  /**
   * Apply dark class to root element based on resolved theme
   * Requirements: 4.4 - Apply dark class to root element
   */
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove existing class
    root.classList.remove(DARK_CLASS);
    
    // Add dark class if theme is dark
    if (resolvedTheme === 'dark') {
      root.classList.add(DARK_CLASS);
    }
  }, [resolvedTheme]);

  /**
   * Listen for system theme changes when theme is set to 'system'
   * Requirements: 3.1 - System preference detection
   */
  useEffect(() => {
    if (theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      setResolvedTheme(e.matches ? 'dark' : 'light');
    };

    // Modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
    // Legacy browsers
    else if (mediaQuery.addListener) {
      mediaQuery.addListener(handleChange);
      return () => mediaQuery.removeListener(handleChange);
    }
  }, [theme]);

  const value: ThemeContextValue = {
    theme,
    resolvedTheme,
    setTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access theme context
 * Requirements: 4.2 - useTheme hook for consuming theme context
 * 
 * @throws {Error} If used outside of ThemeProvider
 */
export function useTheme(): ThemeContextValue {
  const context = React.useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
}

export default ThemeProvider;
