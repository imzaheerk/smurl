/**
 * Centralized route paths to avoid typos and simplify refactoring.
 * Use ANALYTICS_PATH for <Route path={...} /> and ANALYTICS(id) for <Link to={...} />.
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  SETTINGS: '/settings',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  NOT_FOUND: '/404',
  /** Route path for React Router (with :id param). */
  ANALYTICS_PATH: '/analytics/:id',
  /** Build analytics URL for a given id (for links). */
  ANALYTICS: (id: string) => `/analytics/${id}` as const,
  SHORTEN_HASH: '/#shorten',
} as const;
