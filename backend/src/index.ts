import Fastify from 'fastify';
import cors from '@fastify/cors';
import jwt from '@fastify/jwt';
import rateLimit from '@fastify/rate-limit';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import { AppDataSource } from './config/data-source';
import { env } from './config/env';
import { authRoutes } from './controllers/authController';
import { redirectRoutes } from './controllers/redirectController';
import { urlRoutes } from './controllers/urlController';

const start = async () => {
  const app = Fastify({
    logger: true
  });

  await app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
  await redirectRoutes(app);

  try {
    await AppDataSource.initialize();
    app.log.info('Data source has been initialized');

    await app.listen({ port: env.port, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${env.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

