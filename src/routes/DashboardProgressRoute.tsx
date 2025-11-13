/**
 * Dashboard Progress Route Component
 * 
 * Dedicated view for progress tracking and statistics.
 * Requirements: 5.1, 5.5, 6.3, 6.4, 12.1, 12.2
 */

import { ProgressTracking } from '../components/Dashboard/ProgressTracking';
import { BackButton } from '../components/Navigation/BackButton';
import { PageTransition } from '../components/PageTransition';

export function DashboardProgressRoute() {
  return (
    <PageTransition>
      <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <BackButton fallback="/dashboard" />
        <div>
          <h2 className="text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-neutral-50">
            Your Progress
          </h2>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 mt-1">
            Track your wellness journey over time
          </p>
        </div>
      </div>

      {/* Progress Tracking Component */}
      <ProgressTracking />
      </div>
    </PageTransition>
  );
}

export default DashboardProgressRoute;
