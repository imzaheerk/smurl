import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth';
import { addCustomDomain, deleteCustomDomain, listCustomDomains } from '../services/customDomainService';

interface AddDomainBody {
  domain: string;
}

export async function customDomainRoutes(app: FastifyInstance) {
  app.get(
    '/custom-domains',
    {
      schema: {
        tags: ['Custom Domains'],
        response: {
          200: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                domain: { type: 'string' },
                verified: { type: 'boolean' },
                createdAt: { type: 'string', format: 'date-time' }
              }
            }
          }
        }
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const list = await listCustomDomains(userId);
      reply.send(list);
    }
  );

  app.post(
    '/custom-domains',
    {
      schema: {
        tags: ['Custom Domains'],
        body: {
          type: 'object',
          required: ['domain'],
          properties: {
            domain: { type: 'string' }
          }
        },
        response: {
          201: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              domain: { type: 'string' },
              verified: { type: 'boolean' },
              createdAt: { type: 'string', format: 'date-time' }
            }
          }
        }
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { domain } = request.body as AddDomainBody;
      try {
        const customDomain = await addCustomDomain(userId, domain);
        reply.code(201).send(customDomain);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add domain';
        reply.code(400).send({ message });
      }
    }
  );

  app.delete(
    '/custom-domains/:id',
    {
      schema: {
        tags: ['Custom Domains'],
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
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { id } = request.params as { id: string };
      try {
        await deleteCustomDomain(id, userId);
        reply.code(204).send();
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete domain';
        reply.code(404).send({ message });
      }
    }
  );
}
