/**
 * Route Configuration
 * 
 * Defines the application's route structure using React Router v6.
 * Includes routes for landing, authentication, dashboard, and onboarding.
 * 
 * Requirements: 5.1, 5.5
 */

import { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute';

// Lazy load route components for code splitting (Requirement 17.2)
const LandingRoute = lazy(() => import('./LandingRoute'));
const AuthRoute = lazy(() => import('./AuthRoute'));
const DashboardRoute = lazy(() => import('./DashboardRoute'));
const DashboardHomeRoute = lazy(() => import('./DashboardHomeRoute'));
const DashboardProgressRoute = lazy(() => import('./DashboardProgressRoute'));
const DashboardActivitiesRoute = lazy(() => import('./DashboardActivitiesRoute'));
const OnboardingRoute = lazy(() => import('./OnboardingRoute'));
const PersonaChatModalRoute = lazy(() => import('./PersonaChatModalRoute'));
const NotFoundRoute = lazy(() => import('./NotFoundRoute'));

/**
 * Main route configuration
 * Requirements: 5.1 - React Router v6 implementation with ProtectedRoute
 * Requirements: 5.5 - Deep link support for all pages
 * Requirements: 6.4 - AppLayout with scroll restoration and announcements
 */
export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <LandingRoute />,
      },
      {
        path: 'login',
        element: <AuthRoute mode="login" />,
      },
      {
        path: 'signup',
        element: <AuthRoute mode="signup" />,
      },
      {
        path: 'onboarding',
        element: (
          <ProtectedRoute>
            <OnboardingRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <ProtectedRoute>
            <DashboardRoute />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <DashboardHomeRoute />,
          },
          {
            path: 'progress',
            element: <DashboardProgressRoute />,
          },
          {
            path: 'activities',
            element: <DashboardActivitiesRoute />,
          },
        ],
      },
      // Modal route for persona chat (Requirements: 7.1, 7.3, 7.5)
      // This route will be displayed as a modal when opened with backgroundLocation state
      {
        path: 'dashboard/personas/:id',
        element: (
          <ProtectedRoute>
            <PersonaChatModalRoute />
          </ProtectedRoute>
        ),
      },
      {
        path: '*',
        element: <NotFoundRoute />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundRoute />,
  },
];

export default routes;
