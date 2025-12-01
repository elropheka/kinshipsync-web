/**
 * Utility functions for handling and displaying user-friendly error messages
 */

/**
 * Converts raw errors to user-friendly messages
 * @param error - The error object, string, or unknown type
 * @returns A user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (error instanceof Error) {
    const message = error.message;

    // Handle Firebase Auth errors
    if (message.includes('auth/')) {
      if (message.includes('auth/user-not-found')) {
        return 'User account not found.';
      }
      if (message.includes('auth/wrong-password') || message.includes('auth/invalid-credential')) {
        return 'Invalid email or password.';
      }
      if (message.includes('auth/email-already-in-use')) {
        return 'This email is already registered.';
      }
      if (message.includes('auth/weak-password')) {
        return 'Password is too weak. Please use a stronger password.';
      }
      if (message.includes('auth/network-request-failed')) {
        return 'Network error. Please check your connection and try again.';
      }
      if (message.includes('auth/too-many-requests')) {
        return 'Too many requests. Please try again later.';
      }
      if (message.includes('auth/requires-recent-login')) {
        return 'Please log in again to continue.';
      }
      if (message.includes('auth/user-disabled')) {
        return 'This account has been disabled.';
      }
      if (message.includes('auth/operation-not-allowed')) {
        return 'This operation is not allowed.';
      }
    }

    // Handle Firebase Firestore errors
    if (message.includes('firestore/')) {
      if (message.includes('permission-denied')) {
        return 'You do not have permission to perform this action.';
      }
      if (message.includes('not-found')) {
        return 'The requested item was not found.';
      }
      if (message.includes('unavailable')) {
        return 'Service temporarily unavailable. Please try again later.';
      }
    }

    // Handle network errors
    if (message.includes('Failed to fetch') || message.includes('NetworkError')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Handle common error patterns
    if (message.includes('requires-recent-login')) {
      return 'Please log in again before performing this action.';
    }

    // Return a sanitized version of the error message if it's not too technical
    if (message.length < 100 && !message.includes('Error:') && !message.includes('at ')) {
      return message;
    }
  }

  // Default fallback
  return 'An unexpected error occurred. Please try again.';
}

/**
 * Checks if an error is a known error type
 */
export function isKnownError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message;
    return (
      message.includes('auth/') ||
      message.includes('firestore/') ||
      message.includes('Failed to fetch') ||
      message.includes('NetworkError')
    );
  }
  return false;
}

