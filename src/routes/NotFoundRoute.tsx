/**
 * NotFound Route Component
 *
 * Provides a user-friendly fallback for unmatched URLs.
 * Requirements: 5.5, 14.4
 */

import { Link } from 'react-router-dom';
import { PageTransition } from '../components/PageTransition';
import { Button } from '../design-system/components/Button/Button';

export function NotFoundRoute() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center space-y-6">
          <p className="text-sm font-semibold tracking-widest text-primary-600 uppercase">404</p>
          <h1 className="text-4xl sm:text-5xl font-semibold text-neutral-900 dark:text-neutral-50">
            We can't find that page
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            The link you followed may be broken or the page may have been removed.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-3 justify-center">
            <Link to="/">
              <Button variant="primary" size="lg">
                Back to home
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="secondary" size="lg">
                Go to dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

export default NotFoundRoute;
