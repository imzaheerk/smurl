import { FastifyReply, FastifyRequest } from 'fastify';
import { validateApiKey } from '../services/apiKeyService';

/** Use for casting after auth: request has user set to decoded JWT or API key owner */
export type AuthenticatedRequest = FastifyRequest & {
  user?: { id: string; email: string };
};

function getBearerToken(request: FastifyRequest): string | null {
  const auth = request.headers.authorization;
  if (!auth || typeof auth !== 'string') return null;
  const parts = auth.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') return null;
  return parts[1]!;
}

export const authMiddleware = async (request: FastifyRequest, reply: FastifyReply) => {
  const token = getBearerToken(request);
  if (!token) {
    reply.code(401).send({ message: 'Unauthorized' });
    return;
  }

  // Try JWT first
  try {
    await request.jwtVerify();
    const payload = request.user as { id: string; email: string } | undefined;
    if (payload) {
      (request as AuthenticatedRequest).user = payload;
      return;
    }
  } catch {
    // Not a valid JWT; try API key
  }

  const user = await validateApiKey(token);
  if (user) {
    (request as AuthenticatedRequest).user = { id: user.id, email: user.email };
    return;
  }

  reply.code(401).send({ message: 'Unauthorized' });
};

