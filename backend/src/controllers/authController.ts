import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { registerUser, validateUser } from '../services/authService';

interface RegisterBody {
  email: string;
  password: string;
}

interface LoginBody {
  email: string;
  password: string;
}

export async function authRoutes(app: FastifyInstance) {
  app.post(
    '/auth/register',
    {
      schema: {
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
        }
      }
    },
    async (request: FastifyRequest<{ Body: RegisterBody }>, reply: FastifyReply) => {
      const { email, password } = request.body;
      try {
        const user = await registerUser(email, password);
        reply.code(201).send({ id: user.id, email: user.email, createdAt: user.createdAt });
      } catch (err) {
        reply.code(400).send({ message: (err as Error).message });
      }
    }
  );

  app.post(
    '/auth/login',
    {
      schema: {
        tags: ['Auth'],
        body: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string', minLength: 6 }
          }
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
}

