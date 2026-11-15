import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@codencampus/database';
import { createClassSchema, createSectionSchema } from '@codencampus/validators';
import { ClassesService } from './classes.service.js';
import { verifyAccessToken } from '../../lib/jwt.js';

export async function classRoutes(fastify: FastifyInstance, options: { prisma?: PrismaClient } = {}) {
  const prisma = options.prisma || new PrismaClient();
  const service = new ClassesService(prisma);

  const authenticate = (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      reply.status(401).send({ success: false, error: 'Unauthorized', message: 'Missing token' });
      return null;
    }

    try {
      const payload = verifyAccessToken(authHeader.split(' ')[1]);
      const schoolId = (request.headers['x-school-id'] as string) || payload.schoolId;

      if (payload.role !== 'SUPER_ADMIN' && payload.schoolId !== schoolId) {
        reply.status(403).send({ success: false, error: 'Forbidden', message: 'Cross-tenant access prohibited' });
        return null;
      }

      return { payload, schoolId };
    } catch {
      reply.status(401).send({ success: false, error: 'Unauthorized', message: 'Invalid token' });
      return null;
    }
  };

  // 1. List Classes & Sections
  fastify.get('/api/v1/classes', async (request, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    try {
      const classes = await service.listClasses(auth.schoolId);
      return reply.send({ success: true, data: classes, timestamp: new Date().toISOString() });
    } catch (err: unknown) {
      return reply.status(500).send({
        success: false,
        error: 'InternalError',
        message: err instanceof Error ? err.message : 'Failed to list classes',
      });
    }
  });

  // 2. Create Class
  fastify.post('/api/v1/classes', async (request, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    const parseResult = createClassSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid class payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const created = await service.createClass(auth.schoolId, parseResult.data as any);
      return reply.status(201).send({ success: true, data: created, timestamp: new Date().toISOString() });
    } catch (err: unknown) {
      return reply.status(400).send({
        success: false,
        error: 'BadRequest',
        message: err instanceof Error ? err.message : 'Failed to create class',
      });
    }
  });

  // 3. Create Section in Class
  fastify.post('/api/v1/classes/:id/sections', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    const parseResult = createSectionSchema.safeParse({
      ...(request.body as object),
      classId: request.params.id,
    });

    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid section payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const created = await service.createSection(auth.schoolId, parseResult.data);
      return reply.status(201).send({ success: true, data: created, timestamp: new Date().toISOString() });
    } catch (err: unknown) {
      return reply.status(400).send({
        success: false,
        error: 'BadRequest',
        message: err instanceof Error ? err.message : 'Failed to create section',
      });
    }
  });
}

