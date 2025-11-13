/**
 * Manual test component for ThemeProvider
 * This file can be used to manually verify theme functionality
 */

import { ThemeProvider, useTheme } from './ThemeProvider';

function ThemeTestComponent() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div className="p-8 min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <h1 className="text-3xl font-bold mb-6">Theme System Test</h1>
      
      <div className="space-y-4">
        <div>
          <p className="font-semibold">Current Theme Setting: {theme}</p>
          <p className="font-semibold">Resolved Theme: {resolvedTheme}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setTheme('light')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Light Mode
          </button>
          <button
            onClick={() => setTheme('dark')}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Dark Mode
          </button>
          <button
            onClick={() => setTheme('system')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
          >
            System
          </button>
        </div>

        <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded">
          <h2 className="text-xl font-semibold mb-2">Test Card</h2>
          <p>This card should change colors based on the theme.</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            The background and text colors should transition smoothly.
          </p>
        </div>
      </div>
    </div>
  );
}

export function ThemeTest() {
  return (
    <ThemeProvider defaultTheme="system">
      <ThemeTestComponent />
    </ThemeProvider>
  );
}
