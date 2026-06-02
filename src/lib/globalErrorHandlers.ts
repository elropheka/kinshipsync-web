import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errorUtils';

let registered = false;

/**
 * Registers global handlers for unhandled promise rejections (user-facing toast).
 * Call once at app startup.
 */
export function registerGlobalErrorHandlers(): void {
  if (registered || typeof window === 'undefined') {
    return;
  }
  registered = true;

  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    const message = getErrorMessage(event.reason);
    toast.error('Something went wrong', { description: message });
  });
}
