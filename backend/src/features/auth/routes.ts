import { FastifyInstance } from 'fastify';
import { authRoutes } from './controller/authController';

export async function registerAuthRoutes(app: FastifyInstance): Promise<void> {
  await authRoutes(app);
}
