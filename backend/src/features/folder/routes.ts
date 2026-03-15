import { FastifyInstance } from 'fastify';
import { folderRoutes } from './controller/folderController';

export async function registerFolderRoutes(app: FastifyInstance): Promise<void> {
  await folderRoutes(app);
}
