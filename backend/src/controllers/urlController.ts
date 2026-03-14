import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../middlewares/auth';
import {
  createShortUrl,
  createShortUrlBulk,
  deleteUrl,
  getUrlAnalytics,
  getUserUrls,
  updateUrlFolder,
  updateUrlSchedule
} from '../services/urlService';

interface ShortenBody {
  url: string;
  customAlias?: string;
  expiresAt?: string;
  folderId?: string;
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as ShortenBody;
      const { url, customAlias, expiresAt } = body;
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
            url: { type: 'string', minLength: 1 },
            customAlias: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            folderId: { type: 'string' }
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest & { body: ShortenBody };
      const user = req.user!;
      const { url, customAlias, expiresAt, folderId } = req.body;
      const originalUrl = typeof url === 'string' ? url.trim() : '';
      if (!originalUrl) {
        reply.code(400).send({ message: 'Please enter a destination URL.' });
        return;
      }
      try {
        const expires = expiresAt ? new Date(expiresAt) : null;
        const result = await createShortUrl({
          userId: user.id,
          originalUrl,
          customAlias,
          expiresAt: expires,
          folderId: folderId || null
        });
        reply.send({ shortUrl: result.shortUrl, id: result.url.id });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post(
    '/url/bulk',
    {
      preHandler: [authMiddleware],
      config: {
        rateLimit: {
          max: 10,
          timeWindow: '1 minute'
        }
      },
      schema: {
        tags: ['URL'],
        body: {
          type: 'object',
          required: ['rows'],
          properties: {
            rows: {
              type: 'array',
              maxItems: 100,
              items: {
                type: 'object',
                required: ['url'],
                properties: {
                  url: { type: 'string' },
                  customAlias: { type: 'string' },
                  expiresAt: { type: 'string' }
                }
              }
            },
            folderId: { type: 'string' }
          }
        },
        response: {
          200: {
            type: 'object',
            properties: {
              created: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    id: { type: 'string' },
                    shortUrl: { type: 'string' },
                    originalUrl: { type: 'string' },
                    shortCode: { type: 'string' }
                  }
                }
              },
              errors: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    row: { type: 'number' },
                    url: { type: 'string' },
                    message: { type: 'string' }
                  }
                }
              }
            }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const body = request.body as { rows: { url: string; customAlias?: string; expiresAt?: string }[]; folderId?: string };
      try {
        const folderId = body.folderId == null || body.folderId === '' ? null : body.folderId;
        const result = await createShortUrlBulk(user.id, body.rows, folderId);
        reply.send(result);
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
            limit: { type: 'number' },
            folderId: { type: 'string' },
            search: { type: 'string' },
            from: { type: 'string' },
            to: { type: 'string' },
            expired: { type: 'boolean' },
            hasClicks: { type: 'boolean' }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const q = request.query as {
        page?: number;
        limit?: number;
        folderId?: string;
        search?: string;
        from?: string;
        to?: string;
        expired?: boolean;
        hasClicks?: boolean;
      };
      const { page = 1, limit = 10, folderId, search, from, to, expired, hasClicks } = q;
      const result = await getUserUrls(user.id, page, limit, {
        folderId,
        search,
        from,
        to,
        expired,
        hasClicks
      });
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const result = await getUrlAnalytics(id);
        reply.send(result);
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );

  app.patch(
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
        },
        body: {
          type: 'object',
          properties: {
            folderId: { type: 'string' },
            activeFrom: { type: ['string', 'null'] },
            activeTo: { type: ['string', 'null'] }
          }
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const { id } = request.params as { id: string };
      const body = (request.body as {
        folderId?: string | null;
        activeFrom?: string | null;
        activeTo?: string | null;
      }) ?? {};
      try {
        if (body.folderId !== undefined) {
          const folderId = body.folderId === undefined || body.folderId === null || body.folderId === ''
            ? null
            : String(body.folderId);
          await updateUrlFolder(id, user.id, folderId);
        }
        if (body.activeFrom !== undefined || body.activeTo !== undefined) {
          const activeFrom =
            body.activeFrom === null || body.activeFrom === ''
              ? null
              : body.activeFrom
                ? new Date(body.activeFrom)
                : undefined;
          const activeTo =
            body.activeTo === null || body.activeTo === ''
              ? null
              : body.activeTo
                ? new Date(body.activeTo)
                : undefined;
          await updateUrlSchedule(id, user.id, {
            ...(activeFrom !== undefined && { activeFrom }),
            ...(activeTo !== undefined && { activeTo })
          });
        }
        reply.code(204).send();
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
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
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

