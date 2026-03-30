export const TOKEN_KEY = 'token';
export const GUEST_TOKEN = 'guest-demo-token';

export function isGuestToken(token: string | null | undefined): boolean {
  return token === GUEST_TOKEN;
}

export function isGuestSession(): boolean {
  if (typeof window === 'undefined') return false;
  return isGuestToken(localStorage.getItem(TOKEN_KEY));
}

export function startGuestSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, GUEST_TOKEN);
}
