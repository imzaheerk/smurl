import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 5000),
  jwtSecret: process.env.JWT_SECRET ?? 'change-me',
  demoUser: {
    email: process.env.DEMO_USER_EMAIL ?? 'demo@smurl.app',
    password: process.env.DEMO_USER_PASSWORD ?? 'demo1234'
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 5432),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_NAME ?? 'url_shortener'
  },
  redis: {
    host: process.env.REDIS_HOST ?? 'localhost',
    port: Number(process.env.REDIS_PORT ?? 6379)
  },
  baseUrl: process.env.BASE_URL ?? 'http://localhost:5000',
  /** Host used for default short links (no port), e.g. localhost or smurl.to */
  defaultRedirectHost: (() => {
    const u = process.env.BASE_URL ?? 'http://localhost:5000';
    try {
      const url = new URL(u);
      return url.hostname;
    } catch {
      return 'localhost';
    }
  })()
};

