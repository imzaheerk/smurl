import { FastifyReply, FastifyRequest } from 'fastify';

export interface AuthenticatedRequest extends FastifyRequest {
  user?: {
    id: string;
    email: string;
  };
}

export const authMiddleware = async (request: AuthenticatedRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    const payload = request.user as { id: string; email: string } | undefined;
    if (payload) {
      request.user = payload;
    }
  } catch {
    reply.code(401).send({ message: 'Unauthorized' });
  }
};

