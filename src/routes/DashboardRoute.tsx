/**
 * Dashboard Route Component
 * 
 * Main dashboard layout with nested routes for different sections.
 * Implements design system with NavBar, ThemeToggle, and responsive layout.
 * 
 * Requirements: 2.3, 3.2, 8.5, 10.3, 10.4, 11.1, 5.1, 5.5, 6.3, 6.4
 */

import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Outlet } from 'react-router-dom';
import { NavBar } from '../components/Navigation/NavBar';
import { WellnessAssistant } from '../components/Dashboard/WellnessAssistant';
import { PageTransition } from '../components/PageTransition';
import { useRouteLoading } from '../contexts/RouteLoadingContext';
import { useWellnessProfile } from '../hooks/useWellnessProfile';
import { useToast } from '../design-system/components';

export function DashboardRoute() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const { withLoader } = useRouteLoading();
  const { hasProfile, refreshProfile } = useWellnessProfile(user?.id);

  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    let isMounted = true;

    withLoader(refreshProfile)
      .then((profileExists) => {
        if (!isMounted) {
          return;
        }
        if (profileExists === false) {
          navigate('/onboarding', { replace: true });
        }
      })
      .catch((error) => {
        if (!isMounted) {
          return;
        }
        console.error('Failed to load wellness profile', error);
        toast.error('Unable to load your wellness profile. Please try again.');
      });

    return () => {
      isMounted = false;
    };
  }, [user, navigate, refreshProfile, withLoader, toast]);

  // Show loading state while checking profile - Requirements: 8.5
  if (hasProfile === null) {
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-base text-neutral-600 dark:text-neutral-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
        {/* NavBar with ThemeToggle - Requirements: 3.2, 6.4 */}
        <NavBar />

        {/* Main Content - Requirements: 10.3, 10.4, 11.1, 14.8 */}
        <main 
          id="main-content" 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12"
          role="main"
        >
          {/* Nested routes render here - Requirements: 5.1, 5.5, 6.3, 6.4, 12.1, 12.2 */}
          <Outlet />
        </main>

        <WellnessAssistant />
      </div>
    </PageTransition>
  );
}

export default DashboardRoute;
