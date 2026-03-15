import { FastifyInstance } from 'fastify';
import { urlRoutes } from './controller/urlController';
import { redirectRoutes } from './controller/redirectController';

export async function registerUrlRoutes(app: FastifyInstance): Promise<void> {
  await urlRoutes(app);
  await redirectRoutes(app);
}
