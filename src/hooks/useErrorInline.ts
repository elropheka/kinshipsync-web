import { getErrorMessage } from '@/lib/errorUtils';

export interface UseErrorInlineResult {
  hasError: boolean;
  message: string | null;
}

/**
 * Derives inline error display props without triggering toasts.
 */
export function useErrorInline(error: unknown): UseErrorInlineResult {
  if (!error) {
    return { hasError: false, message: null };
  }
  return {
    hasError: true,
    message: getErrorMessage(error),
  };
}
