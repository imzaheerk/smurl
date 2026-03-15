import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { Type } from '@sinclair/typebox';
import { AuthenticatedRequest, authMiddleware } from '../../../middlewares/auth';
import {
  createFolder,
  deleteFolder,
  listFoldersWithStats
} from '../usecases/folderUsecase';
import {
  CreateFolderBodySchema,
  FolderIdParamsSchema,
  FolderListResponseSchema,
  CreateFolderResponseSchema,
  type CreateFolderBody,
  type FolderIdParams
} from '../schemas/folderSchemas';

export async function folderRoutes(app: FastifyInstance) {
  app.get(
    '/folders',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        response: {
          200: FolderListResponseSchema
        }
      }
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const list = await listFoldersWithStats(userId);
      reply.send(
        list.map((f) => ({
          id: f.id,
          name: f.name,
          createdAt: f.createdAt.toISOString(),
          linkCount: f.linkCount,
          totalClicks: f.totalClicks
        }))
      );
    }
  );

  app.post<{ Body: CreateFolderBody }>(
    '/folders',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        body: CreateFolderBodySchema,
        response: {
          201: CreateFolderResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: CreateFolderBody }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { name } = request.body;
      try {
        const folder = await createFolder(userId, name);
        reply.code(201).send({
          id: folder.id,
          name: folder.name,
          createdAt: folder.createdAt.toISOString()
        });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.delete<{ Params: FolderIdParams }>(
    '/folders/:id',
    {
      preHandler: [authMiddleware],
      schema: {
        tags: ['Folders'],
        params: FolderIdParamsSchema,
        response: {
          204: Type.Null()
        }
      }
    },
    async (request: FastifyRequest<{ Params: FolderIdParams }>, reply: FastifyReply) => {
      const req = request as AuthenticatedRequest;
      const userId = req.user!.id;
      const { id } = request.params;
      try {
        await deleteFolder(id, userId);
        reply.code(204).send();
      } catch (err) {
        reply.code(404).send({ message: (err as Error).message });
      }
    }
  );
}
