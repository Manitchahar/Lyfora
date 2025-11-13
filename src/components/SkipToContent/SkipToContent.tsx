/**
 * SkipToContent Component
 * 
 * Provides a skip link for keyboard users to bypass navigation and jump directly to main content.
 * The link is visually hidden but becomes visible when focused.
 * 
 * Requirements: 14.8 - Skip to main content link
 */

import React from 'react';

export interface SkipToContentProps {
  /** ID of the main content element to skip to */
  targetId?: string;
  /** Custom label for the skip link */
  label?: string;
}

/**
 * SkipToContent component
 * 
 * Features:
 * - Visually hidden by default
 * - Becomes visible when focused via keyboard
 * - Positioned at the top of the page
 * - High z-index to ensure visibility
 * - Smooth scroll to target
 */
export const SkipToContent: React.FC<SkipToContentProps> = ({
  targetId = 'main-content',
  label = 'Skip to main content',
}) => {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only
        focus:not-sr-only
        focus:absolute
        focus:top-4
        focus:left-4
        focus:z-[9999]
        focus:px-4
        focus:py-2
        focus:bg-primary-500
        focus:text-white
        focus:rounded-lg
        focus:shadow-lg
        focus:outline-none
        focus:ring-2
        focus:ring-primary-600
        focus:ring-offset-2
        font-medium
        text-sm
      "
    >
      {label}
    </a>
  );
};

SkipToContent.displayName = 'SkipToContent';

export default SkipToContent;
