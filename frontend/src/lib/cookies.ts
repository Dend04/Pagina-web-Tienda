// Utility functions for handling httpOnly cookies
// Note: These functions are for CLIENT-SIDE cookie management
// The actual token is stored in an httpOnly cookie set by the server

export const AUTH_COOKIE_NAME = 'auth_token';

/**
 * Get the authentication token from cookies
 * This only works if the server sets the cookie with accessible property
 * For true httpOnly cookies, you need middleware to validate
 */
export function getAuthToken(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === AUTH_COOKIE_NAME) {
      return value;
    }
  }
  return null;
}

/**
 * Check if user is authenticated by checking for the cookie
 */
export function isAuthenticated(): boolean {
  return getAuthToken() !== null;
}

/**
 * Set a cookie (for non-httpOnly fallback or other cookies)
 */
export function setCookie(name: string, value: string, days?: number): void {
  if (typeof document === 'undefined') return;
  
  let expires = '';
  if (days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    expires = `; expires=${date.toUTCString()}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/; SameSite=Lax`;
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC`;
}

/**
 * Clear all auth-related data
 */
export function clearAuth(): void {
  deleteCookie(AUTH_COOKIE_NAME);
  localStorage.removeItem('user'); // Still need to store user data separately
}
