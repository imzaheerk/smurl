import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { registerUser, validateUser, getOrCreateDemoUser } from '../usecases/authUsecase';
import {
  RegisterBodySchema,
  LoginBodySchema,
  AuthUserResponseSchema,
  TokenResponseSchema,
  DemoResponseSchema,
  type RegisterBody,
  type LoginBody
} from '../schemas/authSchemas';

export async function authRoutes(app: FastifyInstance) {
  app.post<{ Body: RegisterBody }>(
    '/auth/register',
    {
      schema: {
        tags: ['Auth'],
        body: RegisterBodySchema,
        response: {
          201: AuthUserResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
      const { email, password } = request.body;
      try {
        const user = await registerUser(email, password);
        reply.code(201).send({
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString()
        });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post<{ Body: LoginBody }>(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        body: LoginBodySchema,
        response: {
          200: TokenResponseSchema
        }
      }
    },
    async (request: FastifyRequest<{ Body: LoginBody }>, reply: FastifyReply) => {
      const { email, password } = request.body;
      const user = await validateUser(email, password);
      if (!user) {
        reply.code(401).send({ message: 'Invalid credentials' });
        return;
      }
      const token = app.jwt.sign({ id: user.id, email: user.email });
      reply.send({ token });
    }
  );

  app.post(
    '/auth/demo',
    {
      schema: {
        tags: ['Auth'],
        description: 'Create (if needed) and log in as a demo user for testing.',
        response: {
          200: DemoResponseSchema
        }
      },
      config: {
        rateLimit: false
      }
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const user = await getOrCreateDemoUser();
      const token = app.jwt.sign({ id: user.id, email: user.email });
      reply.send({ token, email: user.email });
    }
  );
}
