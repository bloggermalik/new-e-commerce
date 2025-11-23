
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  // Fallback for cases like 'throw 500' or other non-string/non-Error objects
  return "An unexpected error occurred.";
}