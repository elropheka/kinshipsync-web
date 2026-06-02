import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';

export interface UseErrorToastOptions {
  title?: string;
  /** When true (default), show at most one toast per distinct error message. */
  once?: boolean;
}

function errorKey(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return String(error);
}

/**
 * Shows a Sonner error toast when `error` becomes truthy (never during render).
 */
export function useErrorToast(
  error: unknown,
  options?: UseErrorToastOptions
): void {
  const { title = 'Error', once = true } = options ?? {};
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error) {
      lastKeyRef.current = null;
      return;
    }

    const key = errorKey(error);
    if (once && lastKeyRef.current === key) {
      return;
    }
    lastKeyRef.current = key;

    const description = getErrorMessage(error);
    toast.error(title, { description });
  }, [error, title, once]);
}
