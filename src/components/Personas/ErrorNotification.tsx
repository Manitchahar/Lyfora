import { useEffect } from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorNotificationProps {
  error: string | null;
  onRetry?: () => void;
  onDismiss: () => void;
}

export function ErrorNotification({ error, onRetry, onDismiss }: ErrorNotificationProps) {
  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [error, onDismiss]);

  if (!error) return null;

  return (
    <div className="absolute bottom-full left-0 right-0 mb-2 px-4">
      <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl p-3 flex items-center gap-3 shadow-lg animate-slide-up">
        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
        <p className="text-sm text-red-700 dark:text-red-300 flex-1">{error}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm font-medium text-red-700 dark:text-red-300 hover:text-red-800 dark:hover:text-red-200 underline transition-colors"
            aria-label="Retry sending message"
          >
            Retry
          </button>
        )}
        <button
          onClick={onDismiss}
          className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 transition-colors"
          aria-label="Dismiss error"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
