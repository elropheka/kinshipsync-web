/**
 * Utility functions for handling form validation errors with toast notifications
 */
import { toast } from 'sonner';
import type { FieldErrors, FieldValues } from 'react-hook-form';
import type { ZodError } from 'zod';

/**
 * Extracts the first validation error message from form errors
 * @param errors - React Hook Form field errors
 * @returns The first error message found, or null
 */
export function getFirstValidationError(errors: FieldErrors<FieldValues>): string | null {
  for (const fieldName in errors) {
    const error = errors[fieldName];
    if (error?.message) {
      return error.message as string;
    }
    // Handle nested errors
    if (error && typeof error === 'object' && 'message' in error) {
      return (error as { message?: string }).message || null;
    }
  }
  return null;
}

/**
 * Shows validation errors as toast notifications
 * @param errors - React Hook Form field errors
 * @param customMessage - Optional custom message to show before listing errors
 */
export function showValidationErrors(
  errors: FieldErrors<FieldValues>,
  customMessage?: string
): void {
  const errorMessages: string[] = [];
  
  // Collect all error messages
  for (const fieldName in errors) {
    const error = errors[fieldName];
    if (error?.message) {
      errorMessages.push(error.message as string);
    }
  }

  if (errorMessages.length > 0) {
    const message = customMessage || 'Please correct the following errors:';
    if (errorMessages.length === 1) {
      toast.error(`${message} ${errorMessages[0]}`);
    } else {
      toast.error(message, {
        description: errorMessages.slice(0, 3).join(', ') + (errorMessages.length > 3 ? '...' : ''),
      });
    }
  }
}

/**
 * Shows Zod validation errors as toast notifications
 * @param zodError - Zod error object
 * @param customMessage - Optional custom message to show before listing errors
 */
export function showZodValidationErrors(
  zodError: ZodError,
  customMessage?: string
): void {
  const errorMessages: string[] = [];
  
  // Collect all error messages from Zod
  zodError.errors.forEach((error) => {
    const fieldName = error.path.join('.');
    const message = error.message;
    errorMessages.push(fieldName ? `${fieldName}: ${message}` : message);
  });

  if (errorMessages.length > 0) {
    const message = customMessage || 'Please correct the following errors:';
    if (errorMessages.length === 1) {
      toast.error(errorMessages[0]);
    } else {
      toast.error(message, {
        description: errorMessages.slice(0, 3).join(', ') + (errorMessages.length > 3 ? '...' : ''),
      });
    }
  }
}

/**
 * Handles form validation and shows toast if validation fails
 * @param isValid - Whether the form is valid
 * @param errors - React Hook Form field errors
 * @param customMessage - Optional custom message
 * @returns true if valid, false otherwise
 */
export function handleFormValidation(
  isValid: boolean,
  errors: FieldErrors<FieldValues>,
  customMessage?: string
): boolean {
  if (!isValid) {
    showValidationErrors(errors, customMessage);
    return false;
  }
  return true;
}

