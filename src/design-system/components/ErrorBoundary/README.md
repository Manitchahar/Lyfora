# ErrorBoundary Component

A React error boundary component that catches JavaScript errors anywhere in the child component tree and displays a fallback UI instead of crashing the entire application.

## Requirements

- 16.1: Display error message within 200ms
- 16.3: Provide actionable guidance in error messages
- 16.5: Log errors to console with sufficient context

## Features

- ✅ Catches React component errors
- ✅ Displays user-friendly error message
- ✅ Provides "Try Again" action to reset error state
- ✅ Logs errors to console in development mode
- ✅ Accessible error messages for screen readers
- ✅ Custom fallback UI support
- ✅ Theme-aware styling

## Usage

### Basic Usage

Wrap your application or specific components with ErrorBoundary:

```tsx
import { ErrorBoundary } from '../design-system/components';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

### With Custom Fallback

Provide a custom fallback UI:

```tsx
<ErrorBoundary
  fallback={(error, reset) => (
    <div>
      <h1>Oops! Something went wrong</h1>
      <p>{error.message}</p>
      <button onClick={reset}>Try Again</button>
    </div>
  )}
>
  <YourComponent />
</ErrorBoundary>
```

### With Error Callback

Handle errors with a custom callback:

```tsx
<ErrorBoundary
  onError={(error, errorInfo) => {
    // Log to error tracking service
    logErrorToService(error, errorInfo);
  }}
>
  <YourComponent />
</ErrorBoundary>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | Required | Child components to wrap |
| `fallback` | `(error: Error, reset: () => void) => ReactNode` | - | Custom fallback UI |
| `onError` | `(error: Error, errorInfo: ErrorInfo) => void` | - | Callback when error is caught |

## Default Fallback UI

The default fallback includes:

- Error icon with semantic color
- "Something went wrong" heading
- User-friendly error message
- Error details (development mode only)
- "Try Again" button to reset error state
- "Go to Home" button as fallback navigation

## Accessibility

- Uses `role="alert"` for error container
- Uses `aria-live="assertive"` for immediate announcement
- Provides keyboard-accessible action buttons
- Includes proper focus management

## Best Practices

1. **Wrap at appropriate levels**: Place ErrorBoundary at strategic points in your component tree
2. **Provide context**: Use the `onError` callback to log errors with context
3. **Custom fallbacks**: Create custom fallbacks for specific sections of your app
4. **Don't overuse**: Not every component needs its own ErrorBoundary

## Example: Section-Specific Error Boundary

```tsx
function Dashboard() {
  return (
    <div>
      <Header />
      
      <ErrorBoundary
        fallback={(error, reset) => (
          <div className="p-4 text-center">
            <p>Failed to load dashboard content</p>
            <button onClick={reset}>Retry</button>
          </div>
        )}
      >
        <DashboardContent />
      </ErrorBoundary>
      
      <Footer />
    </div>
  );
}
```

## Limitations

ErrorBoundary does **not** catch errors in:

- Event handlers (use try-catch)
- Asynchronous code (use try-catch or error handling hooks)
- Server-side rendering
- Errors thrown in the error boundary itself

For these cases, use the `useApiError` hook or traditional error handling.
