/**
 * Accessibility Utilities
 * 
 * Utilities for ensuring WCAG AA compliance and accessibility best practices.
 * 
 * Requirements: 3.5, 14.2, 14.3, 14.4, 14.5, 14.6, 14.8, 14.9, 14.10
 */

/**
 * Calculate relative luminance of a color
 * Used for WCAG contrast ratio calculations
 * 
 * @param r - Red value (0-255)
 * @param g - Green value (0-255)
 * @param b - Blue value (0-255)
 * @returns Relative luminance (0-1)
 */
function getRelativeLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    const sRGB = c / 255;
    return sRGB <= 0.03928 ? sRGB / 12.92 : Math.pow((sRGB + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Convert hex color to RGB
 * 
 * @param hex - Hex color string (e.g., "#ffffff" or "ffffff")
 * @returns RGB object with r, g, b values (0-255)
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Calculate contrast ratio between two colors
 * WCAG 2.1 formula: (L1 + 0.05) / (L2 + 0.05)
 * where L1 is the lighter color and L2 is the darker color
 * 
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @returns Contrast ratio (1-21)
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);

  if (!rgb1 || !rgb2) {
    throw new Error('Invalid color format. Use hex colors (e.g., "#ffffff")');
  }

  const l1 = getRelativeLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getRelativeLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standards
 * 
 * WCAG AA Requirements:
 * - Normal text: 4.5:1
 * - Large text (18pt+ or 14pt+ bold): 3:1
 * 
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Object with pass/fail status and contrast ratio
 */
export function meetsWCAGAA(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(color1, color2);
  const required = isLargeText ? 3 : 4.5;
  const passes = ratio >= required;

  return { passes, ratio, required };
}

/**
 * Check if contrast ratio meets WCAG AAA standards
 * 
 * WCAG AAA Requirements:
 * - Normal text: 7:1
 * - Large text (18pt+ or 14pt+ bold): 4.5:1
 * 
 * @param color1 - First color (hex)
 * @param color2 - Second color (hex)
 * @param isLargeText - Whether the text is large (18pt+ or 14pt+ bold)
 * @returns Object with pass/fail status and contrast ratio
 */
export function meetsWCAGAAA(
  color1: string,
  color2: string,
  isLargeText: boolean = false
): { passes: boolean; ratio: number; required: number } {
  const ratio = getContrastRatio(color1, color2);
  const required = isLargeText ? 4.5 : 7;
  const passes = ratio >= required;

  return { passes, ratio, required };
}

/**
 * Generate an accessible label for screen readers
 * Useful for icon-only buttons and controls
 * 
 * @param action - The action being performed (e.g., "close", "open", "delete")
 * @param context - Optional context (e.g., "modal", "menu", "notification")
 * @returns Accessible label string
 */
export function generateAriaLabel(action: string, context?: string): string {
  if (context) {
    return `${action} ${context}`;
  }
  return action;
}

/**
 * Check if user prefers reduced motion
 * Respects the prefers-reduced-motion media query
 * 
 * @returns True if user prefers reduced motion
 */
export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Announce message to screen readers
 * Creates a temporary live region to announce a message
 * 
 * @param message - Message to announce
 * @param priority - Priority level ('polite' or 'assertive')
 */
export function announceToScreenReader(
  message: string,
  priority: 'polite' | 'assertive' = 'polite'
): void {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

/**
 * Trap focus within an element
 * Useful for modals and dialogs
 * 
 * @param element - Element to trap focus within
 * @returns Cleanup function to remove focus trap
 */
export function trapFocus(element: HTMLElement): () => void {
  const focusableElements = element.querySelectorAll<HTMLElement>(
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
  );

  const firstFocusable = focusableElements[0];
  const lastFocusable = focusableElements[focusableElements.length - 1];

  const handleTabKey = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      // Shift + Tab
      if (document.activeElement === firstFocusable) {
        e.preventDefault();
        lastFocusable?.focus();
      }
    } else {
      // Tab
      if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
  };

  element.addEventListener('keydown', handleTabKey);

  // Focus first element
  firstFocusable?.focus();

  // Return cleanup function
  return () => {
    element.removeEventListener('keydown', handleTabKey);
  };
}

/**
 * Get all focusable elements within a container
 * 
 * @param container - Container element
 * @returns Array of focusable elements
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector =
    'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
  return Array.from(container.querySelectorAll<HTMLElement>(selector));
}

/**
 * Check if element is visible to screen readers
 * 
 * @param element - Element to check
 * @returns True if element is visible to screen readers
 */
export function isVisibleToScreenReader(element: HTMLElement): boolean {
  // Check for aria-hidden
  if (element.getAttribute('aria-hidden') === 'true') return false;

  // Check for display: none or visibility: hidden
  const style = window.getComputedStyle(element);
  if (style.display === 'none' || style.visibility === 'hidden') return false;

  // Check for sr-only class (visually hidden but accessible)
  if (element.classList.contains('sr-only')) return true;

  return true;
}

/**
 * Validate heading hierarchy
 * Checks if headings follow proper order (h1 -> h2 -> h3, etc.)
 * 
 * @param container - Container to check (defaults to document.body)
 * @returns Array of heading hierarchy issues
 */
export function validateHeadingHierarchy(
  container: HTMLElement = document.body
): Array<{ element: HTMLElement; issue: string }> {
  const headings = Array.from(
    container.querySelectorAll<HTMLElement>('h1, h2, h3, h4, h5, h6')
  );

  const issues: Array<{ element: HTMLElement; issue: string }> = [];
  let previousLevel = 0;

  headings.forEach((heading) => {
    const level = parseInt(heading.tagName.substring(1));

    // Check if heading skips levels
    if (level > previousLevel + 1) {
      issues.push({
        element: heading,
        issue: `Heading level ${level} follows level ${previousLevel}, skipping level ${previousLevel + 1}`,
      });
    }

    previousLevel = level;
  });

  return issues;
}

/**
 * Color contrast test results for common color combinations
 * Used for documentation and testing
 */
export const colorContrastTests = {
  lightMode: {
    // Text on background
    bodyText: meetsWCAGAA('#111827', '#f9fafb'), // neutral-900 on neutral-50
    mutedText: meetsWCAGAA('#6b7280', '#f9fafb'), // neutral-500 on neutral-50
    primaryText: meetsWCAGAA('#0d9488', '#f9fafb'), // primary-600 on neutral-50
    // Button text
    primaryButton: meetsWCAGAA('#ffffff', '#14b8a6'), // white on primary-500
    // Links
    link: meetsWCAGAA('#0d9488', '#ffffff'), // primary-600 on white
  },
  darkMode: {
    // Text on background
    bodyText: meetsWCAGAA('#f3f4f6', '#111827'), // neutral-100 on neutral-900
    mutedText: meetsWCAGAA('#9ca3af', '#111827'), // neutral-400 on neutral-900
    primaryText: meetsWCAGAA('#2dd4bf', '#111827'), // primary-400 on neutral-900
    // Button text
    primaryButton: meetsWCAGAA('#ffffff', '#14b8a6'), // white on primary-500
    // Links
    link: meetsWCAGAA('#2dd4bf', '#1f2937'), // primary-400 on neutral-800
  },
};
