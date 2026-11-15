import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@codencampus/database';
import { loginRequestSchema } from '@codencampus/validators';
import { AuthService } from './auth.service.js';

export async function authRoutes(
  fastify: FastifyInstance,
  options: { prisma?: PrismaClient } = {}
) {
  const prisma = options.prisma || new PrismaClient();
  const service = new AuthService(prisma);

  // POST /api/v1/auth/login
  fastify.post('/api/v1/auth/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = loginRequestSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid login parameters',
        issues: parseResult.error.issues,
      });
    }

    try {
      const session = await service.login(
        parseResult.data.identifier,
        parseResult.data.password,
        parseResult.data.schoolId
      );
      return reply.send({
        success: true,
        data: session,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      return reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: err instanceof Error ? err.message : 'Login failed',
      });
    }
  });

  // POST /api/v1/auth/logout
  fastify.post('/api/v1/auth/logout', async (_request, reply) => {
    return reply.send({
      success: true,
      data: { message: 'Logged out successfully' },
      timestamp: new Date().toISOString(),
    });
  });
}

