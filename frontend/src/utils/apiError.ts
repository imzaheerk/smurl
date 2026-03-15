/**
 * Map raw API validation messages to user-friendly text.
 */
function normalizeValidationMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('email') && (m.includes('format') || m.includes('match')))
    return 'Please enter a valid email address.';
  if (m.includes('password') && (m.includes('length') || m.includes('match')))
    return 'Password must be at least 6 characters.';
  return message;
}

/**
 * Extract a user-facing message from an API/axios error.
 * Use for consistent error handling and toast messages.
 */
export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err == null) return fallback;
  if (typeof err !== 'object') return fallback;
  const obj = err as Record<string, unknown>;
  const data = obj.response as { data?: { message?: string } } | undefined;
  const message = data?.data?.message;
  if (typeof message !== 'string' || !message.trim()) return fallback;
  return normalizeValidationMessage(message.trim());
}
