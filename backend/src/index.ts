import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { registerAuthRoutes } from './features/auth/routes';
import { registerUrlRoutes } from './features/url/routes';
import { registerApiKeyRoutes } from './features/apiKey/routes';
import { registerCustomDomainRoutes } from './features/customDomain/routes';
import { registerFolderRoutes } from './features/folder/routes';
import { isDemoUserSeedEnabled } from './config/seed-data';
import { getOrCreateDemoUser } from './features/auth/usecases/authUsecase';

const start = async () => {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  });

  await app.register(jwt, {
    secret: env.jwtSecret
  });

  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  await app.register(swagger, {
    openapi: {
      info: {
        title: 'URL Shortener API',
        version: '1.0.0'
      }
    }
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs'
  });

  await registerAuthRoutes(app);
  await registerUrlRoutes(app);
  await registerApiKeyRoutes(app);
  await registerCustomDomainRoutes(app);
  await registerFolderRoutes(app);

  try {
    await AppDataSource.initialize();
    app.log.info('Data source has been initialized');

    if (isDemoUserSeedEnabled()) {
      try {
        const demoUser = await getOrCreateDemoUser();
        app.log.info('Demo user is ready for login');
      } catch (err) {
        app.log.error({ err }, 'Failed to ensure demo user exists');
      }
    } else {
      app.log.info(
        'Demo user skipped: add DEMO_USER_EMAIL and DEMO_USER_PASSWORD to .env (project root or backend/) to create one on startup (see backend/.env.example)'
      );
    }

    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
