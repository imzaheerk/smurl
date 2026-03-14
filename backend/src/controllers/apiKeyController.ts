import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth';
import {
  createApiKey,
  listApiKeys,
  revokeApiKey
} from '../services/apiKeyService';

export async function apiKeyRoutes(app: FastifyInstance) {
  app.post(
    '/api-keys',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['API Keys'],
        body: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string', minLength: 1, maxLength: 100 }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              key: { type: 'string' },
              keyPrefix: { type: 'string' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const body = request.body as { name: string };
      try {
        const result = await createApiKey(userId, body.name);
        reply.code(201).send({
          id: result.id,
          name: result.name,
          key: result.key,
          keyPrefix: result.keyPrefix,
          createdAt: result.createdAt.toISOString()
        });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.get(
    '/api-keys',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['API Keys'],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                name: { type: 'string' },
                keyPrefix: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const list = await listApiKeys(userId);
      reply.send(list);
    }
  );

  app.delete(
    '/api-keys/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['API Keys'],
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
        await revokeApiKey(id, userId);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}
