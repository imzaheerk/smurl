import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth';
import {
  createFolder,
  deleteFolder,
  listFoldersWithStats
} from '../services/folderService';

interface CreateFolderBody {
  name: string;
}

export async function folderRoutes(app: FastifyInstance) {
  app.get(
    '/folders',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                linkCount: { type: 'number' },
                totalClicks: { type: 'number' }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const list = await listFoldersWithStats(userId);
      reply.send(list);
    }
  );

  app.post(
    '/folders',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { name } = request.body as CreateFolderBody;
      try {
        const folder = await createFolder(userId, name);
        reply.code(201).send(folder);
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.delete(
    '/folders/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        },
        response: {
          204: { type: 'null' }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { id } = request.params as { id: string };
      try {
        await deleteFolder(id, userId);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}
