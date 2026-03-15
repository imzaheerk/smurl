import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load root .env (smurl/.env) so one shared .env works; try both relative to src/ and dist/
const rootFromSrc = path.resolve(__dirname, '../../..', '.env');
const rootFromDist = path.resolve(__dirname, '../../../..', '.env');
const rootEnv = fs.existsSync(rootFromSrc) ? rootFromSrc : rootFromDist;
dotenv.config({ path: rootEnv });
// Then backend/.env if present (overrides for local backend-only vars)
dotenv.config();

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction = nodeEnv === 'production';

function parsePort(value: string | undefined, fallback: number): number {
  if (value === undefined || value === '') return fallback;
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

function requireInProduction(value: string | undefined, name: string): string {
  if (!isProduction) return value ?? '';
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable in production: ${name}. Set it in .env or your environment.`
    );
  }
  return value;
}

/** JWT secret must be strong in production (min 32 chars, no default). */
function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (isProduction) {
    if (!secret || secret.length < 32) {
      throw new Error(
        'JWT_SECRET must be set in production and at least 32 characters long for security.'
      );
    }
    return secret;
  }
  return secret ?? 'dev-secret-change-in-production';
}

function getBaseUrl(): string {
  const url = process.env.BASE_URL;
  if (isProduction && (!url || url.trim() === '')) {
    throw new Error('BASE_URL must be set in production (e.g. https://api.yourapp.com).');
  }
  return url?.trim() ?? 'http://localhost:5000';
}

function getDefaultRedirectHost(): string {
  try {
    const url = new URL(getBaseUrl());
    return url.hostname;
  } catch {
    return 'localhost';
  }
}

export const env = {
  nodeEnv,
  isProduction,
  port: parsePort(process.env.PORT, 5000),
  jwtSecret: getJwtSecret(),
  db: {
    host: isProduction
      ? requireInProduction(process.env.DB_HOST, 'DB_HOST')
      : (process.env.DB_HOST ?? 'localhost'),
    port: parsePort(process.env.DB_PORT, 5432),
    username: isProduction
      ? requireInProduction(process.env.DB_USER, 'DB_USER')
      : (process.env.DB_USER ?? 'postgres'),
    password: isProduction
      ? requireInProduction(process.env.DB_PASSWORD, 'DB_PASSWORD')
      : (process.env.DB_PASSWORD ?? 'postgres'),
    database: isProduction
      ? requireInProduction(process.env.DB_NAME, 'DB_NAME')
      : (process.env.DB_NAME ?? 'smurl')
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parsePort(process.env.REDIS_PORT, 6379)
  },
  baseUrl: getBaseUrl(),
  defaultRedirectHost: getDefaultRedirectHost()
};
