/**
 * Seed data configuration.
 * Demo user credentials are read only from env (DEMO_USER_EMAIL, DEMO_USER_PASSWORD).
 * Set them in .env (gitignored) to have a demo user created on startup.
 * No credentials in code — safe to commit.
 */

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

export interface DemoUserSeed {
  email: string;
  password: string;
}

/**
 * Returns demo user credentials for seeding (getOrCreateDemoUser).
 * Only when both DEMO_USER_EMAIL and DEMO_USER_PASSWORD are set in env.
 * In production, password must be at least 8 characters.
 */
export function getDemoUserSeed(): DemoUserSeed | null {
  const email = process.env.DEMO_USER_EMAIL?.trim();
  const password = process.env.DEMO_USER_PASSWORD;

  if (!email || !password) return null;
  if (isProduction && password.length < 8) return null;

  return { email, password };
}

/** Whether the app should create/ensure the demo user on startup. */
export function isDemoUserSeedEnabled(): boolean {
  return getDemoUserSeed() !== null;
}
