/**
 * AuthLayout Component
 * 
 * Layout wrapper for authentication pages (login/signup).
 * Provides consistent styling and structure for auth flows.
 * 
 * Requirements: 6.4, 14.4
 */

import { ReactNode } from 'react';
import { SkipToContent } from '../components/SkipToContent';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <SkipToContent />
      <main id="main-content" className="w-full max-w-md" role="main">
        {children}
      </main>
    </div>
  );
}

export default AuthLayout;
