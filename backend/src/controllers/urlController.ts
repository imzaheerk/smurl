import { FastifyInstance, FastifyReply } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth';
import {
  createShortUrl,
  deleteUrl,
  getUrlAnalytics,
  getUserUrls
} from '../services/urlService';

interface ShortenBody {
  url: string;
  customAlias?: string;
  expiresAt?: string;
}

export async function urlRoutes(app: FastifyInstance) {
  // Public shorten endpoint (no auth) for landing page
  app.post(
    '/public/shorten',
    {
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute'
        }
      },
      schema: {
        tags: ['URL'],
        body: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string' },
            customAlias: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              shortUrl: { type: 'string' },
              id: { type: 'string' }
            }
          }
        }
      }
    },
    async (request: { body: ShortenBody }, reply: FastifyReply) => {
      const { url, customAlias, expiresAt } = request.body;
      try {
        const expires = expiresAt ? new Date(expiresAt) : null;
        const result = await createShortUrl({
          userId: null,
          originalUrl: url,
          customAlias,
          expiresAt: expires
        });
        reply.send({ shortUrl: result.shortUrl, id: result.url.id });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post(
    '/url/shorten',
    {
      preHandler: [authMiddleware],
      config: {
        rateLimit: {
          max: 20,
          timeWindow: '1 minute'
        }
      },
      schema: {
        tags: ['URL'],
        body: {
          type: 'object',
          required: ['url'],
          properties: {
            url: { type: 'string' },
            customAlias: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              shortUrl: { type: 'string' }
            }
          }
        }
      }
    },
    async (request: AuthenticatedRequest & { Body: ShortenBody }, reply: FastifyReply) => {
      const user = request.user!;
      const { url, customAlias, expiresAt } = request.body;
      try {
        const expires = expiresAt ? new Date(expiresAt) : null;
        const result = await createShortUrl({
          userId: user.id,
          originalUrl: url,
          customAlias,
          expiresAt: expires
        });
        reply.send({ shortUrl: result.shortUrl, id: result.url.id });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.get(
    '/url/my-urls',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['URL'],
        querystring: {
          type: 'object',
          properties: {
            page: { type: 'number' },
            limit: { type: 'number' }
          }
        }
      }
    },
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      const user = request.user!;
      const { page = 1, limit = 10 } = request.query as { page?: number; limit?: number };
      const result = await getUserUrls(user.id, page, limit);
      reply.send(result);
    }
  );

  app.get(
    '/url/:id/analytics',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Analytics'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const result = await getUrlAnalytics(id);
        reply.send(result);
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );

  app.delete(
    '/url/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['URL'],
        params: {
          type: 'object',
          required: ['id'],
          properties: {
            id: { type: 'string' }
          }
        }
      }
    },
    async (request: AuthenticatedRequest, reply: FastifyReply) => {
      const user = request.user!;
      const { id } = request.params as { id: string };
      try {
        await deleteUrl(id, user.id);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}

