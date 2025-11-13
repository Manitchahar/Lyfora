/**
 * ThemeProvider and useTheme Tests
 * 
 * Tests for theme management, localStorage persistence, and system preference detection.
 * Requirements: 3.4, 4.2
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, renderHook, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider, useTheme } from './ThemeProvider';
import { ReactNode } from 'react';

describe('ThemeProvider', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    // Reset document class
    document.documentElement.className = '';
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Basic Functionality', () => {
    it('renders children', () => {
      render(
        <ThemeProvider>
          <div>Test Content</div>
        </ThemeProvider>
      );
      
      expect(screen.getByText(/test content/i)).toBeInTheDocument();
    });

    it('provides theme context to children', () => {
      const TestComponent = () => {
        const { theme } = useTheme();
        return <div>Current theme: {theme}</div>;
      };

      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      expect(screen.getByText(/current theme:/i)).toBeInTheDocument();
    });
  });

  describe('Default Theme', () => {
    it('defaults to system theme', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      expect(result.current.theme).toBe('system');
    });

    it('uses custom default theme when provided', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
        ),
      });
      
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('Theme Switching', () => {
    it('switches to light theme', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('light');
      
      await waitFor(() => {
        expect(result.current.theme).toBe('light');
        expect(result.current.resolvedTheme).toBe('light');
      });
    });

    it('switches to dark theme', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('dark');
      
      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
        expect(result.current.resolvedTheme).toBe('dark');
      });
    });

    it('switches to system theme', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('system');
      
      await waitFor(() => {
        expect(result.current.theme).toBe('system');
      });
    });
  });

  describe('DOM Class Application', () => {
    it('adds dark class to root element when theme is dark', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('dark');
      
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
    });

    it('removes dark class from root element when theme is light', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      // First set to dark
      result.current.setTheme('dark');
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(true);
      });
      
      // Then switch to light
      result.current.setTheme('light');
      await waitFor(() => {
        expect(document.documentElement.classList.contains('dark')).toBe(false);
      });
    });
  });

  describe('localStorage Persistence', () => {
    it('saves theme preference to localStorage', async () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('dark');
      
      await waitFor(() => {
        expect(localStorage.getItem('lyfora-theme-preference')).toBe('dark');
      });
    });

    it('loads theme preference from localStorage', () => {
      localStorage.setItem('lyfora-theme-preference', 'light');
      
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      expect(result.current.theme).toBe('light');
    });

    it('persists theme changes across re-renders', async () => {
      const { result, rerender } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      result.current.setTheme('dark');
      
      await waitFor(() => {
        expect(result.current.theme).toBe('dark');
      });
      
      rerender();
      
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('System Preference Detection', () => {
    it('resolves system theme to light when system prefers light', () => {
      // Mock matchMedia to return light preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: false, // false means light mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
        ),
      });
      
      expect(result.current.resolvedTheme).toBe('light');
    });

    it('resolves system theme to dark when system prefers dark', () => {
      // Mock matchMedia to return dark preference
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation((query: string) => ({
          matches: true, // true means dark mode
          media: query,
          onchange: null,
          addListener: vi.fn(),
          removeListener: vi.fn(),
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
          dispatchEvent: vi.fn(),
        })),
      });

      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider defaultTheme="system">{children}</ThemeProvider>
        ),
      });
      
      expect(result.current.resolvedTheme).toBe('dark');
    });
  });

  describe('useTheme Hook', () => {
    it('throws error when used outside ThemeProvider', () => {
      // Suppress console.error for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      expect(() => {
        renderHook(() => useTheme());
      }).toThrow('useTheme must be used within a ThemeProvider');
      
      consoleSpy.mockRestore();
    });

    it('returns theme context value', () => {
      const { result } = renderHook(() => useTheme(), {
        wrapper: ({ children }: { children: ReactNode }) => (
          <ThemeProvider>{children}</ThemeProvider>
        ),
      });
      
      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('resolvedTheme');
      expect(result.current).toHaveProperty('setTheme');
      expect(typeof result.current.setTheme).toBe('function');
    });
  });

  describe('Integration Test', () => {
    it('complete theme switching flow works correctly', async () => {
      const TestComponent = () => {
        const { theme, resolvedTheme, setTheme } = useTheme();
        return (
          <div>
            <div data-testid="theme">{theme}</div>
            <div data-testid="resolved">{resolvedTheme}</div>
            <button onClick={() => setTheme('light')}>Light</button>
            <button onClick={() => setTheme('dark')}>Dark</button>
            <button onClick={() => setTheme('system')}>System</button>
          </div>
        );
      };

      const user = userEvent.setup();
      
      render(
        <ThemeProvider>
          <TestComponent />
        </ThemeProvider>
      );
      
      // Click dark button
      await user.click(screen.getByRole('button', { name: /dark/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('dark');
        expect(screen.getByTestId('resolved')).toHaveTextContent('dark');
        expect(document.documentElement.classList.contains('dark')).toBe(true);
        expect(localStorage.getItem('lyfora-theme-preference')).toBe('dark');
      });
      
      // Click light button
      await user.click(screen.getByRole('button', { name: /light/i }));
      
      await waitFor(() => {
        expect(screen.getByTestId('theme')).toHaveTextContent('light');
        expect(screen.getByTestId('resolved')).toHaveTextContent('light');
        expect(document.documentElement.classList.contains('dark')).toBe(false);
        expect(localStorage.getItem('lyfora-theme-preference')).toBe('light');
      });
    });
  });
});
