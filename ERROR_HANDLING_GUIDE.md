# Error Handling Implementation Guide

This guide documents the error handling UI components implemented for the Lyfora application, covering Requirements 16.1-16.5.

## Overview

The error handling system consists of three main components:

1. **ErrorBoundary** - Catches React component errors
2. **Toast** - Displays temporary notifications for API errors
3. **useApiError Hook** - Simplifies API error handling with retry mechanisms

## Requirements Coverage

| Requirement | Component | Implementation |
|-------------|-----------|----------------|
| 16.1 - Display errors within 200ms | Toast, ErrorBoundary | Immediate rendering with optimized animations |
| 16.2 - Semantic error styling | Toast, Input | Red color scale with error icons |
| 16.3 - Actionable guidance | Toast, ErrorBoundary | Clear messages with retry actions |
| 16.4 - Auto-dismiss after 5s | Toast | Configurable duration with default 5000ms |
| 16.5 - Screen reader accessible | All components | ARIA attributes, live regions, semantic HTML |

## Architecture

```
AppLayout (Root)
├── ErrorBoundary (Catches React errors)
│   └── ToastProvider (Manages toast notifications)
│       └── Application Routes
│           └── Components using useApiError hook
```

## Components

### 1. ErrorBoundary

**Location:** `src/design-system/components/ErrorBoundary/`

**Purpose:** Catches JavaScript errors in React component tree and displays fallback UI.

**Features:**
- Catches component rendering errors
- Displays user-friendly error message
- Provides "Try Again" and "Go to Home" actions
- Shows error details in development mode
- Logs errors to console
- Accessible with ARIA attributes

**Usage:**

```tsx
import { ErrorBoundary } from './design-system/components';

// Wrap entire app
<ErrorBoundary>
  <App />
</ErrorBoundary>

// Wrap specific sections
<ErrorBoundary
  fallback={(error, reset) => (
    <CustomErrorUI error={error} onReset={reset} />
  )}
  onError={(error, errorInfo) => {
    logToService(error, errorInfo);
  }}
>
  <CriticalSection />
</ErrorBoundary>
```

### 2. Toast Notification System

**Location:** `src/design-system/components/Toast/`

**Purpose:** Display temporary notifications for API errors, success messages, warnings, and info.

**Features:**
- Four types: success, error, warning, info
- Auto-dismiss after configurable duration
- Manual dismiss with close button
- Optional action button (e.g., "Retry")
- Smooth animations
- Theme-aware styling
- Accessible to screen readers

**Setup:**

```tsx
import { ToastProvider } from './design-system/components';

<ToastProvider position="top-right" maxToasts={5}>
  <App />
</ToastProvider>
```

**Usage:**

```tsx
import { useToast } from './design-system/components';

function MyComponent() {
  const toast = useToast();

  // Success notification
  toast.success('Profile updated successfully!');

  // Error notification
  toast.error('Failed to save changes');

  // With retry action
  toast.error('Network error', {
    action: {
      label: 'Retry',
      onClick: () => retryOperation(),
    },
    duration: 0, // Don't auto-dismiss
  });

  // Warning
  toast.warning('Session will expire soon');

  // Info
  toast.info('New features available!');
}
```

### 3. useApiError Hook

**Location:** `src/hooks/useApiError.ts`

**Purpose:** Simplify API error handling with automatic toast notifications and retry mechanisms.

**Features:**
- Automatic error parsing
- Toast notifications
- Retry mechanism
- Custom error messages
- Error callbacks
- Development logging

**Usage:**

```tsx
import { useApiError } from './hooks/useApiError';

function DataComponent() {
  const { handleError, handleErrorWithRetry } = useApiError();

  // Basic error handling
  async function fetchData() {
    try {
      const data = await api.getData();
      return data;
    } catch (error) {
      handleError(error);
    }
  }

  // With retry mechanism
  async function saveData(data) {
    try {
      await api.saveData(data);
    } catch (error) {
      handleErrorWithRetry(error, () => saveData(data), {
        customMessage: 'Failed to save. Please try again.',
      });
    }
  }

  // Without toast (for form errors)
  async function submitForm(data) {
    try {
      await api.submit(data);
    } catch (error) {
      const apiError = handleError(error, {
        showToast: false,
      });
      setFormError(apiError.message);
    }
  }
}
```

## Integration Points

### 1. Application Root (AppLayout)

The ErrorBoundary and ToastProvider are integrated at the root level:

```tsx
// src/layouts/AppLayout.tsx
import { ErrorBoundary, ToastProvider } from '../design-system/components';

export function AppLayout() {
  return (
    <ErrorBoundary>
      <ToastProvider position="top-right">
        {/* Screen reader announcements */}
        <div ref={announceRef} className="sr-only" role="status" aria-live="polite" />
        <Outlet />
      </ToastProvider>
    </ErrorBoundary>
  );
}
```

### 2. Form Components

Forms already display inline errors using the Input component's error prop:

```tsx
// src/components/Auth/LoginForm.tsx
<Input
  type="email"
  label="Email"
  error={emailError}  // Inline error display
  icon={<Mail size={20} />}
/>
```

For API errors, use the useApiError hook:

```tsx
const { handleError } = useApiError();

async function handleSubmit(e) {
  e.preventDefault();
  try {
    await signIn(email, password);
  } catch (error) {
    handleError(error);
  }
}
```

### 3. Data Fetching Components

Use useApiError for consistent error handling:

```tsx
import { useApiError } from '../hooks/useApiError';

function DashboardData() {
  const { handleErrorWithRetry } = useApiError();
  const [data, setData] = useState(null);

  async function loadData() {
    try {
      const result = await api.fetchDashboard();
      setData(result);
    } catch (error) {
      handleErrorWithRetry(error, loadData);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  return <div>{/* Render data */}</div>;
}
```

## Error Types and Handling

### 1. Component Errors (React Errors)

**Caught by:** ErrorBoundary

**Examples:**
- Rendering errors
- Lifecycle method errors
- Constructor errors

**Handling:**
```tsx
<ErrorBoundary>
  <ComponentThatMightError />
</ErrorBoundary>
```

### 2. API Errors

**Caught by:** try-catch with useApiError hook

**Examples:**
- Network failures
- HTTP errors (4xx, 5xx)
- Timeout errors
- Validation errors

**Handling:**
```tsx
const { handleErrorWithRetry } = useApiError();

try {
  await api.call();
} catch (error) {
  handleErrorWithRetry(error, retryFn);
}
```

### 3. Form Validation Errors

**Caught by:** Form validation logic

**Examples:**
- Invalid email format
- Password requirements
- Required fields

**Handling:**
```tsx
<Input
  type="email"
  label="Email"
  error={validationError}
/>
```

### 4. Event Handler Errors

**Caught by:** try-catch blocks

**Examples:**
- Button click errors
- Form submission errors
- User interaction errors

**Handling:**
```tsx
const toast = useToast();

async function handleClick() {
  try {
    await performAction();
    toast.success('Action completed!');
  } catch (error) {
    toast.error('Action failed');
  }
}
```

## Best Practices

### 1. Choose the Right Error Handling Method

| Scenario | Method | Reason |
|----------|--------|--------|
| React component errors | ErrorBoundary | Catches rendering errors |
| API calls | useApiError hook | Consistent error handling with retry |
| Form validation | Input error prop | Inline field-specific errors |
| User actions | try-catch + toast | Immediate feedback |

### 2. Error Messages

**Good:**
- ✅ "Failed to save profile. Please try again."
- ✅ "Network error. Check your connection and retry."
- ✅ "Invalid email format. Please enter a valid email."

**Bad:**
- ❌ "Error 500"
- ❌ "Something went wrong"
- ❌ "An error occurred"

### 3. Retry Mechanisms

**Use retry for:**
- Network errors
- Timeout errors
- 5xx server errors
- Transient failures

**Don't retry for:**
- 4xx client errors (except 408, 429)
- Validation errors
- Authentication errors
- Authorization errors

### 4. Accessibility

All error components include:
- `role="alert"` for error containers
- `aria-live` regions for dynamic updates
- `aria-atomic` for complete message reading
- Keyboard accessible dismiss buttons
- Visible focus indicators

### 5. Development vs Production

**Development:**
- Show detailed error messages
- Log errors to console
- Display stack traces

**Production:**
- Show user-friendly messages
- Log errors to monitoring service
- Hide technical details

## Testing

### Manual Testing Checklist

- [ ] ErrorBoundary catches component errors
- [ ] ErrorBoundary displays fallback UI
- [ ] "Try Again" button resets error state
- [ ] Toast notifications appear within 200ms
- [ ] Toasts auto-dismiss after 5 seconds
- [ ] Toast close button works
- [ ] Retry action in toast works
- [ ] Multiple toasts stack correctly
- [ ] Toasts respect maxToasts limit
- [ ] Screen reader announces errors
- [ ] Keyboard navigation works
- [ ] Dark mode styling correct
- [ ] Form errors display inline
- [ ] API errors show toast notifications

### Automated Testing

See component-specific test files:
- `ErrorBoundary.test.tsx`
- `Toast.test.tsx`
- `useApiError.test.ts`

## Examples

### Complete Form with Error Handling

```tsx
import { useState } from 'react';
import { useApiError } from '../hooks/useApiError';
import { useToast } from '../design-system/components';
import { Input, Button } from '../design-system/components';

function ProfileForm() {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { handleErrorWithRetry } = useApiError();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setFieldErrors({});
    setLoading(true);

    try {
      await api.updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (error) {
      // Check if it's a validation error
      if (error.field) {
        setFieldErrors({ [error.field]: error.message });
      } else {
        // Show toast with retry for other errors
        handleErrorWithRetry(error, () => handleSubmit(e));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        error={fieldErrors.name}
      />
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        error={fieldErrors.email}
      />
      <Button type="submit" loading={loading}>
        Save Changes
      </Button>
    </form>
  );
}
```

### Data Loading with Error Boundary

```tsx
import { ErrorBoundary } from '../design-system/components';
import { useApiError } from '../hooks/useApiError';

function DashboardSection() {
  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="p-8 text-center">
          <p className="text-error-600 mb-4">Failed to load dashboard</p>
          <Button onClick={reset}>Retry</Button>
        </div>
      )}
    >
      <DashboardContent />
    </ErrorBoundary>
  );
}

function DashboardContent() {
  const { handleErrorWithRetry } = useApiError();
  const [data, setData] = useState(null);

  async function loadData() {
    try {
      const result = await api.fetchDashboard();
      setData(result);
    } catch (error) {
      handleErrorWithRetry(error, loadData);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (!data) return <LoadingSpinner />;
  return <div>{/* Render data */}</div>;
}
```

## Troubleshooting

### Toast not appearing

1. Ensure ToastProvider wraps your component
2. Check that useToast is called inside ToastProvider
3. Verify no CSS z-index conflicts

### ErrorBoundary not catching errors

1. ErrorBoundary only catches errors in child components
2. Doesn't catch errors in event handlers (use try-catch)
3. Doesn't catch async errors (use try-catch)

### Errors not accessible to screen readers

1. Verify `role="alert"` on error containers
2. Check `aria-live` regions are present
3. Test with actual screen reader software

## Future Enhancements

Potential improvements for the error handling system:

1. **Error tracking integration** - Send errors to Sentry or similar service
2. **Offline detection** - Special handling for offline errors
3. **Rate limiting** - Prevent duplicate error toasts
4. **Error recovery strategies** - Automatic retry with exponential backoff
5. **User feedback** - Allow users to report errors
6. **Error analytics** - Track error frequency and patterns

## Resources

- [ErrorBoundary Documentation](./src/design-system/components/ErrorBoundary/README.md)
- [Toast Documentation](./src/design-system/components/Toast/README.md)
- [useApiError Documentation](./src/hooks/README.md)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [ARIA Live Regions](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)
