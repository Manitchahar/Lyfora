/**
 * ErrorHandlingExample Component
 * 
 * Demonstrates the error handling UI components in action.
 * This is an example component for testing and documentation purposes.
 * 
 * Requirements: 16.1, 16.2, 16.3, 16.4, 16.5
 */

import { useState } from 'react';
import { useToast } from '../../design-system/components';
import { useApiError } from '../../hooks/useApiError';
import { Button } from '../../design-system/components/Button/Button';
import { Card } from '../../design-system/components/Card/Card';

export function ErrorHandlingExample() {
  const toast = useToast();
  const { handleError, handleErrorWithRetry } = useApiError();
  const [shouldError, setShouldError] = useState(false);

  // Simulate API call that fails
  const simulateApiError = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    throw new Error('Failed to fetch data from server');
  };

  // Simulate API call that succeeds
  const simulateApiSuccess = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { data: 'Success!' };
  };

  // Example 1: Basic error toast
  const handleBasicError = async () => {
    try {
      await simulateApiError();
    } catch (error) {
      handleError(error);
    }
  };

  // Example 2: Error with retry
  const handleErrorWithRetryExample = async () => {
    try {
      await simulateApiError();
    } catch (error) {
      handleErrorWithRetry(error, handleErrorWithRetryExample, {
        customMessage: 'Failed to load data. Click retry to try again.',
      });
    }
  };

  // Example 3: Success toast
  const handleSuccess = async () => {
    try {
      await simulateApiSuccess();
      toast.success('Operation completed successfully!');
    } catch (error) {
      handleError(error);
    }
  };

  // Example 4: Warning toast
  const handleWarning = () => {
    toast.warning('Your session will expire in 5 minutes');
  };

  // Example 5: Info toast
  const handleInfo = () => {
    toast.info('New features are now available!');
  };

  // Example 6: Custom duration
  const handleCustomDuration = () => {
    toast.success('This message will disappear in 2 seconds', {
      duration: 2000,
    });
  };

  // Example 7: No auto-dismiss
  const handleNoAutoDismiss = () => {
    toast.error('This error requires your attention', {
      duration: 0,
      action: {
        label: 'Dismiss',
        onClick: () => console.log('Dismissed'),
      },
    });
  };

  // Example 8: Component that throws error (for ErrorBoundary)
  const ErrorComponent = () => {
    if (shouldError) {
      throw new Error('Component rendering error!');
    }
    return <p className="text-neutral-600 dark:text-neutral-400">Component rendered successfully</p>;
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Error Handling Examples
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Demonstrating ErrorBoundary, Toast notifications, and useApiError hook
          </p>
        </div>

        {/* Toast Examples */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Toast Notifications
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button variant="primary" onClick={handleSuccess}>
              Show Success
            </Button>
            <Button variant="secondary" onClick={handleBasicError}>
              Show Error
            </Button>
            <Button variant="tertiary" onClick={handleWarning}>
              Show Warning
            </Button>
            <Button variant="ghost" onClick={handleInfo}>
              Show Info
            </Button>
            <Button variant="primary" onClick={handleCustomDuration}>
              Custom Duration (2s)
            </Button>
            <Button variant="secondary" onClick={handleNoAutoDismiss}>
              No Auto-Dismiss
            </Button>
          </div>
        </Card>

        {/* API Error Handling */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            API Error Handling
          </h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Basic error handling with toast notification:
              </p>
              <Button variant="primary" onClick={handleBasicError}>
                Trigger API Error
              </Button>
            </div>
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                Error handling with retry mechanism:
              </p>
              <Button variant="secondary" onClick={handleErrorWithRetryExample}>
                Trigger Error with Retry
              </Button>
            </div>
          </div>
        </Card>

        {/* ErrorBoundary Example */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            ErrorBoundary
          </h2>
          <div className="space-y-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Click the button below to trigger a component error that will be caught by ErrorBoundary:
            </p>
            <Button
              variant={shouldError ? 'secondary' : 'primary'}
              onClick={() => setShouldError(!shouldError)}
            >
              {shouldError ? 'Reset Component' : 'Trigger Component Error'}
            </Button>
            <div className="p-4 bg-neutral-100 dark:bg-neutral-800 rounded-lg">
              <ErrorComponent />
            </div>
          </div>
        </Card>

        {/* Multiple Toasts */}
        <Card variant="elevated" padding="lg">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Multiple Toasts
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
            Click rapidly to see multiple toasts stacking (max 5):
          </p>
          <Button
            variant="primary"
            onClick={() => {
              toast.info(`Toast ${Date.now()}`);
            }}
          >
            Add Toast
          </Button>
        </Card>

        {/* Accessibility Info */}
        <Card variant="outlined" padding="lg">
          <h2 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Accessibility Features
          </h2>
          <ul className="space-y-2 text-sm text-neutral-600 dark:text-neutral-400">
            <li>✅ All toasts use <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">role="alert"</code></li>
            <li>✅ Error toasts use <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">aria-live="assertive"</code></li>
            <li>✅ Other toasts use <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">aria-live="polite"</code></li>
            <li>✅ Close buttons have <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">aria-label</code></li>
            <li>✅ All interactive elements are keyboard accessible</li>
            <li>✅ Focus indicators visible on all focusable elements</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

export default ErrorHandlingExample;
