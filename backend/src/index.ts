import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { apiKeyRoutes } from './controllers/apiKeyController';
import { authRoutes } from './controllers/authController';
import { customDomainRoutes } from './controllers/customDomainController';
import { folderRoutes } from './controllers/folderController';
import { redirectRoutes } from './controllers/redirectController';
import { urlRoutes } from './controllers/urlController';
import { getOrCreateDemoUser } from './services/authService';

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

  await authRoutes(app);
  await urlRoutes(app);
  await apiKeyRoutes(app);
  await customDomainRoutes(app);
  await folderRoutes(app);
  await redirectRoutes(app);

  try {
    await AppDataSource.initialize();
    app.log.info('Data source has been initialized');

    // Ensure demo user exists on startup
    try {
      const demoUser = await getOrCreateDemoUser();
      app.log.info(
        { email: demoUser.email, id: demoUser.id },
        'Demo user is ready for login'
      );
    } catch (err) {
      app.log.error({ err }, 'Failed to ensure demo user exists');
    }

    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

