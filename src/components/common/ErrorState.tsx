import { Button } from '@/components/ui/button';
import { getErrorMessage } from '@/lib/errorUtils';

export interface ErrorStateProps {
  error?: unknown;
  message?: string;
  title?: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  error,
  message,
  title = 'Something went wrong',
  onRetry,
  retryLabel = 'Try again',
  className = '',
}: ErrorStateProps) {
  const displayMessage =
    message ?? (error ? getErrorMessage(error) : 'An unexpected error occurred. Please try again.');

  return (
    <div
      className={`flex flex-col justify-center items-center h-full p-4 text-center ${className}`}
      role="alert"
    >
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-4 max-w-md">{displayMessage}</p>
      {onRetry && (
        <Button type="button" onClick={onRetry}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
