# React Router Infrastructure

This directory contains the routing configuration and route components for the Lyfora application.

## Structure

```
routes/
├── index.tsx           # Main route configuration
├── LandingRoute.tsx    # Landing page route
├── AuthRoute.tsx       # Login/signup route
├── OnboardingRoute.tsx # Onboarding flow route
└── DashboardRoute.tsx  # Dashboard route with nested routes
```

## Features Implemented

### 1. Route Configuration (Task 4.1)
- ✅ React Router v6 installed and configured
- ✅ BrowserRouter set up in main.tsx
- ✅ Route structure defined with lazy loading for code splitting
- ✅ Deep link support for all pages

### 2. Layout Components (Task 4.2)
- ✅ AppLayout component with scroll restoration
- ✅ ARIA live region for route change announcements
- ✅ AuthLayout component for authentication pages
- ✅ ThemeProvider integration

### 3. Protected Routes (Task 4.3)
- ✅ ProtectedRoute wrapper component
- ✅ Authentication check with redirect to login
- ✅ Intended destination preservation using location state
- ✅ Loading state during authentication check

### 4. Navigation Components (Task 4.4)
- ✅ BackButton component with navigate(-1) functionality
- ✅ Fallback route support when no history exists
- ✅ NavBar component with active route highlighting
- ✅ Mobile hamburger menu for small screens
- ✅ Keyboard navigation and focus management
- ✅ Theme toggle integration

## Route Structure

```
/                       → Landing page
/login                  → Login page
/signup                 → Signup page
/onboarding            → Onboarding flow (protected)
/dashboard             → Dashboard home (protected)
/dashboard/progress    → Progress tracking (protected)
/dashboard/activities  → Activities log (protected)
/dashboard/personas/:id → Persona chat modal (protected)
```

## Usage

### Navigating Between Routes

```tsx
import { useNavigate, Link } from 'react-router-dom';

// Using Link component (preferred for internal navigation)
<Link to="/dashboard">Go to Dashboard</Link>

// Using navigate hook (for programmatic navigation)
const navigate = useNavigate();
navigate('/dashboard');

// Going back
navigate(-1);
```

### Protected Routes

Protected routes automatically redirect unauthenticated users to the login page:

```tsx
// In routes/index.tsx
{
  path: 'dashboard',
  element: (
    <ProtectedRoute>
      <DashboardRoute />
    </ProtectedRoute>
  ),
}
```

### Using Navigation Components

```tsx
import { BackButton, NavBar } from '../components/Navigation';

// Back button with fallback
<BackButton fallback="/dashboard" label="Back to Dashboard" />

// Navigation bar (automatically included in dashboard)
<NavBar />
```

## Accessibility Features

- ✅ ARIA live region announces route changes to screen readers
- ✅ Keyboard navigation support for all interactive elements
- ✅ Focus management on route changes
- ✅ Proper ARIA labels on navigation elements
- ✅ Skip to main content support

## Performance Optimizations

- ✅ Code splitting with React.lazy for all route components
- ✅ Suspense boundaries with loading fallbacks
- ✅ Lazy loading reduces initial bundle size

## Requirements Satisfied

- **5.1**: React Router v6 implementation with proper history management
- **5.5**: Deep link support for all pages
- **6.1**: Back button on detail pages
- **6.2**: navigate(-1) implementation
- **6.3**: Active route highlighting in navigation
- **6.4**: Scroll restoration and route announcements
- **11.2**: Mobile hamburger menu
- **14.2**: Keyboard navigation and focus management
- **14.4**: ARIA live region for route changes
- **17.2**: Code splitting for routes

## Next Steps

The routing infrastructure is now complete. Future tasks will:
- Migrate existing pages to use the new routing system
- Implement modal routes for persona chat
- Add page transition animations
- Enhance navigation with breadcrumbs where appropriate
