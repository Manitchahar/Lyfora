/**
 * Dashboard Component (Legacy)
 * 
 * This component is now deprecated in favor of DashboardRoute with nested routes.
 * Kept for backward compatibility if needed.
 * Updated to match design system standards.
 * 
 * @deprecated Use DashboardRoute with nested routes instead
 * 
 * Requirements: 2.3, 3.2, 8.5, 10.3, 10.4, 11.1
 */

import { useState } from 'react';
import { DailyRoutine } from './DailyRoutine';
import { DailyCheckIn } from './DailyCheckIn';
import { ProgressTracking } from './ProgressTracking';
import { ManualActivityLog } from './ManualActivityLog';
import { WellnessAssistant } from './WellnessAssistant';
import PersonaGallery from '../Personas/PersonaGallery';
import { NavBar } from '../Navigation/NavBar';
import { Card } from '../../design-system/components/Card/Card';
import { Droplet, Activity as ActivityIcon, Moon } from 'lucide-react';

export function Dashboard() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityComplete = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* NavBar with ThemeToggle - Requirements: 3.2 */}
      <NavBar />

      {/* Main Content - Requirements: 10.3, 10.4, 11.1 */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 space-y-8">
        {/* Welcome Section - Requirements: 8.5, 10.3 */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight">
            Welcome back!
          </h1>
          <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Let's continue your wellness journey today
          </p>
        </div>

        {/* Persona Gallery Section - Requirements: 2.3 */}
        <PersonaGallery />

        {/* Dashboard Grid - Requirements: 10.3, 10.4, 11.1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content Column - Requirements: 2.3, 10.4 */}
          <div className="lg:col-span-2 space-y-6">
            <DailyRoutine onActivityComplete={handleActivityComplete} />
            <ProgressTracking key={refreshKey} />
            <ManualActivityLog />
          </div>

          {/* Sidebar Column - Requirements: 2.3, 10.4 */}
          <div className="space-y-6">
            <DailyCheckIn />

            {/* Wellness Tips Card - Requirements: 2.3, 8.5 */}
            <Card variant="elevated" padding="md">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-6">
                Wellness Tips
              </h3>
              <div className="space-y-4">
                {/* Tip 1 - Requirements: 8.5 */}
                <div className="flex gap-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-100 dark:border-blue-900/50 transition-colors duration-150">
                  <Droplet className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1.5">
                      Stay Hydrated
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                      Drink water throughout the day to maintain energy and focus.
                    </p>
                  </div>
                </div>

                {/* Tip 2 - Requirements: 8.5 */}
                <div className="flex gap-4 p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-100 dark:border-green-900/50 transition-colors duration-150">
                  <ActivityIcon className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1.5">
                      Move Regularly
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300 leading-relaxed">
                      Take short breaks to stretch or walk every hour.
                    </p>
                  </div>
                </div>

                {/* Tip 3 - Requirements: 8.5 */}
                <div className="flex gap-4 p-4 bg-purple-50 dark:bg-purple-950/30 rounded-xl border border-purple-100 dark:border-purple-900/50 transition-colors duration-150">
                  <Moon className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-1.5">
                      Quality Sleep
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                      Maintain a consistent sleep schedule for better rest.
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <WellnessAssistant />
    </div>
  );
}
