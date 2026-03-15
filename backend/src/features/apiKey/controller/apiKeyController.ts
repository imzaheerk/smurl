import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { AuthenticatedRequest, authMiddleware } from '../../../middlewares/auth';
import {
  createApiKey,
  listApiKeys,
  revokeApiKey
} from '../usecases/apiKeyUsecase';
import { Type } from '@sinclair/typebox';
import {
  CreateApiKeyBodySchema,
  ApiKeyIdParamsSchema,
  CreateApiKeyResponseSchema,
  ApiKeyListResponseSchema,
  type CreateApiKeyBody,
  type ApiKeyIdParams
} from '../schemas/apiKeySchemas';

export async function apiKeyRoutes(app: FastifyInstance) {
  app.post<{ Body: CreateApiKeyBody }>(
    '/api-keys',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['API Keys'],
        body: CreateApiKeyBodySchema,
        response: {
          201: CreateApiKeyResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateApiKeyBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const body = request.body;
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
          200: ApiKeyListResponseSchema
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

  app.delete<{ Params: ApiKeyIdParams }>(
    '/api-keys/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['API Keys'],
        params: ApiKeyIdParamsSchema,
        response: {
          204: Type.Null()
        }
      }
    },
    async (request: FastifyRequest<{ Params: ApiKeyIdParams }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { id } = request.params;
      try {
        await revokeApiKey(id, userId);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}
