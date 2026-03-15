import { FastifyInstance } from 'fastify';
import { customDomainRoutes } from './controller/customDomainController';

export async function registerCustomDomainRoutes(app: FastifyInstance): Promise<void> {
  await customDomainRoutes(app);
}
