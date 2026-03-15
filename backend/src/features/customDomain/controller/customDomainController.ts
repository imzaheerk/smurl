import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Type } from '@sinclair/typebox';
import { AuthenticatedRequest, authMiddleware } from '../../../middlewares/auth';
import {
  addCustomDomain,
  deleteCustomDomain,
  listCustomDomains
} from '../usecases/customDomainUsecase';
import {
  AddDomainBodySchema,
  CustomDomainIdParamsSchema,
  CustomDomainListResponseSchema,
  CreateCustomDomainResponseSchema,
  type AddDomainBody,
  type CustomDomainIdParams
} from '../schemas/customDomainSchemas';

export async function customDomainRoutes(app: FastifyInstance) {
  app.get(
    '/custom-domains',
    {
      schema: {
        tags: ['Custom Domains'],
        response: {
          200: CustomDomainListResponseSchema
        }
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const list = await listCustomDomains(userId);
      reply.send(
        list.map((d) => ({
          id: d.id,
          domain: d.domain,
          verified: d.verified,
          createdAt: d.createdAt.toISOString()
        }))
      );
    }
  );

  app.post<{ Body: AddDomainBody }>(
    '/custom-domains',
    {
      schema: {
        tags: ['Custom Domains'],
        body: AddDomainBodySchema,
        response: {
          201: CreateCustomDomainResponseSchema
        }
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest<{ Body: AddDomainBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { domain } = request.body;
      try {
        const customDomain = await addCustomDomain(userId, domain);
        reply.code(201).send({
          id: customDomain.id,
          domain: customDomain.domain,
          verified: customDomain.verified,
          createdAt: customDomain.createdAt.toISOString()
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to add domain';
        reply.code(400).send({ message });
      }
    }
  );

  app.delete<{ Params: CustomDomainIdParams }>(
    '/custom-domains/:id',
    {
      schema: {
        tags: ['Custom Domains'],
        params: CustomDomainIdParamsSchema,
        response: {
          204: Type.Null()
        }
      },
      preHandler: [authMiddleware]
    },
    async (request: FastifyRequest<{ Params: CustomDomainIdParams }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { id } = request.params;
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
