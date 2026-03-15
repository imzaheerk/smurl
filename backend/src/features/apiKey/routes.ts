import { FastifyInstance } from 'fastify';
import { apiKeyRoutes } from './controller/apiKeyController';

export async function registerApiKeyRoutes(app: FastifyInstance): Promise<void> {
  await apiKeyRoutes(app);
}
