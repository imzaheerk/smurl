import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../../../middlewares/auth';
import {
  createShortUrl,
  createShortUrlBulk,
  deleteUrl,
  getUrlAnalytics,
  getUserUrls,
  updateUrlFolder,
  updateUrlSchedule
} from '../usecases/urlUsecase';
import {
  PublicShortenBodySchema,
  ShortenBodySchema,
  BulkBodySchema,
  MyUrlsQuerystringSchema,
  UrlIdParamsSchema,
  UrlPatchBodySchema,
  ShortenResponseSchema,
  BulkResponseSchema,
  type PublicShortenBody,
  type ShortenBody,
  type BulkBody,
  type MyUrlsQuerystring,
  type UrlIdParams,
  type UrlPatchBody
} from '../schemas/urlSchemas';

export async function urlRoutes(app: FastifyInstance) {
  app.post<{ Body: PublicShortenBody; Reply: { shortUrl: string; id: string } }>(
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
        body: PublicShortenBodySchema,
        response: {
          200: ShortenResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: PublicShortenBody }>, reply: FastifyReply) => {
      const body = request.body;
      const { url, customAlias, expiresAt } = body;
      try {
        const result = await createShortUrl({
          userId: null,
          originalUrl: url,
          customAlias,
          expiresAt: expiresAt ?? null
        });
        reply.send({ shortUrl: result.shortUrl, id: result.url.id });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post<{ Body: ShortenBody; Reply: { shortUrl: string; id: string } }>(
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
        body: ShortenBodySchema,
        response: {
          200: ShortenResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: ShortenBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const body = request.body;
      const { url, customAlias, expiresAt, folderId } = body;
      const originalUrl = typeof url === 'string' ? url.trim() : '';
      if (!originalUrl) {
        reply.code(400).send({ message: 'Please enter a destination URL.' });
        return;
      }
      try {
        const result = await createShortUrl({
          userId: user.id,
          originalUrl,
          customAlias,
          expiresAt: expiresAt ?? null,
          folderId: folderId ?? null
        });
        reply.send({ shortUrl: result.shortUrl, id: result.url.id });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post<{ Body: BulkBody }>(
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
        body: BulkBodySchema,
        response: {
          200: BulkResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: BulkBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const body = request.body;
      try {
        const folderId = body.folderId == null || body.folderId === '' ? null : body.folderId;
        const result = await createShortUrlBulk(user.id, body.rows, folderId);
        reply.send(result);
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.get<{ Querystring: MyUrlsQuerystring }>(
    '/url/my-urls',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['URL'],
        querystring: MyUrlsQuerystringSchema
      }
    },
    async (request: FastifyRequest<{ Querystring: MyUrlsQuerystring }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const q = request.query;
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

  app.get<{ Params: UrlIdParams }>(
    '/url/:id/analytics',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Analytics'],
        params: UrlIdParamsSchema
      }
    },
    async (request: FastifyRequest<{ Params: UrlIdParams }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const result = await getUrlAnalytics(id);
        reply.send(result);
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );

  app.patch<{ Params: UrlIdParams; Body: UrlPatchBody }>(
    '/url/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['URL'],
        params: UrlIdParamsSchema,
        body: UrlPatchBodySchema
      }
    },
    async (request: FastifyRequest<{ Params: UrlIdParams; Body: UrlPatchBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const { id } = request.params;
      const body = request.body ?? {};
      try {
        if (body.folderId !== undefined) {
          const folderId =
            body.folderId === undefined || body.folderId === null || body.folderId === ''
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

  app.delete<{ Params: UrlIdParams }>(
    '/url/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['URL'],
        params: UrlIdParamsSchema
      }
    },
    async (request: FastifyRequest<{ Params: UrlIdParams }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const user = req.user!;
      const { id } = request.params;
      try {
        await deleteUrl(id, user.id);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}
