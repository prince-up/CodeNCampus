import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@codencampus/database';
import {
  createStudentSchema,
  updateStudentSchema,
  studentSearchQuerySchema,
  studentBatchImportSchema,
} from '@codencampus/validators';
import {
  StudentsService,
  StudentNotFoundError,
  DuplicateAdmissionNumberError,
} from './students.service.js';
import { verifyAccessToken } from '../../lib/jwt.js';

export async function studentRoutes(
  fastify: FastifyInstance,
  options: { prisma?: PrismaClient } = {}
) {
  const prisma = options.prisma || new PrismaClient();
  const service = new StudentsService(prisma);

  const authenticate = (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization header',
      });
      return null;
    }

    try {
      const payload = verifyAccessToken(authHeader.split(' ')[1]);
      const schoolId = (request.headers['x-school-id'] as string) || payload.schoolId;

      // School Admin, Principal, or Super Admin
      if (
        payload.role !== 'SUPER_ADMIN' &&
        payload.role !== 'SCHOOL_ADMIN' &&
        payload.role !== 'PRINCIPAL' &&
        payload.role !== 'TEACHER'
      ) {
        reply.status(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Insufficient administrative permissions',
        });
        return null;
      }

      if (payload.role !== 'SUPER_ADMIN' && payload.schoolId !== schoolId) {
        reply.status(403).send({
          success: false,
          error: 'Forbidden',
          message: 'Cross-tenant access prohibited',
        });
        return null;
      }

      return { payload, schoolId };
    } catch {
      reply.status(401).send({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid or expired access token',
      });
      return null;
    }
  };

  // 1. Search & Filter Students
  fastify.get('/api/v1/students', async (request, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    const parseQuery = studentSearchQuerySchema.safeParse(request.query);
    if (!parseQuery.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid search parameters',
        issues: parseQuery.error.issues,
      });
    }

    try {
      const result = await service.searchStudents(auth.schoolId, parseQuery.data as any);
      return reply.send({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      return reply.status(500).send({
        success: false,
        error: 'InternalError',
        message: err instanceof Error ? err.message : 'Failed to search students',
      });
    }
  });

  // 2. Create Student
  fastify.post('/api/v1/students', async (request, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    const parseResult = createStudentSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid student registration payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const created = await service.createStudent(auth.schoolId, parseResult.data as any);
      return reply.status(201).send({
        success: true,
        data: created,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof DuplicateAdmissionNumberError) {
        return reply.status(409).send({
          success: false,
          error: 'Conflict',
          message: err.message,
        });
      }
      return reply.status(400).send({
        success: false,
        error: 'BadRequest',
        message: err instanceof Error ? err.message : 'Failed to create student',
      });
    }
  });

  // 3. Get Student by ID
  fastify.get(
    '/api/v1/students/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const auth = authenticate(request, reply);
      if (!auth) return;

      try {
        const student = await service.getStudentById(auth.schoolId, request.params.id);
        return reply.send({
          success: true,
          data: student,
          timestamp: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (err instanceof StudentNotFoundError) {
          return reply.status(404).send({
            success: false,
            error: 'NotFound',
            message: err.message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: 'InternalError',
          message: 'Failed to retrieve student',
        });
      }
    }
  );

  // 4. Update Student Profile & Section Assignment
  fastify.patch(
    '/api/v1/students/:id',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const auth = authenticate(request, reply);
      if (!auth) return;

      const parseResult = updateStudentSchema.safeParse(request.body);
      if (!parseResult.success) {
        return reply.status(400).send({
          success: false,
          error: 'ValidationError',
          message: 'Invalid update payload',
          issues: parseResult.error.issues,
        });
      }

      try {
        const updated = await service.updateStudent(
          auth.schoolId,
          request.params.id,
          parseResult.data as any
        );
        return reply.send({
          success: true,
          data: updated,
          timestamp: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (err instanceof StudentNotFoundError) {
          return reply.status(404).send({
            success: false,
            error: 'NotFound',
            message: err.message,
          });
        }
        if (err instanceof DuplicateAdmissionNumberError) {
          return reply.status(409).send({
            success: false,
            error: 'Conflict',
            message: err.message,
          });
        }
        return reply.status(400).send({
          success: false,
          error: 'BadRequest',
          message: err instanceof Error ? err.message : 'Failed to update student',
        });
      }
    }
  );

  // 5. Activate or Deactivate Student Account
  fastify.patch(
    '/api/v1/students/:id/status',
    async (
      request: FastifyRequest<{ Params: { id: string }; Body: { isActive: boolean } }>,
      reply
    ) => {
      const auth = authenticate(request, reply);
      if (!auth) return;

      const { isActive } = request.body || {};
      if (typeof isActive !== 'boolean') {
        return reply.status(400).send({
          success: false,
          error: 'ValidationError',
          message: "'isActive' boolean field is required",
        });
      }

      try {
        const updated = await service.updateStudentStatus(
          auth.schoolId,
          request.params.id,
          isActive
        );
        return reply.send({
          success: true,
          data: updated,
          timestamp: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (err instanceof StudentNotFoundError) {
          return reply.status(404).send({
            success: false,
            error: 'NotFound',
            message: err.message,
          });
        }
        return reply.status(500).send({
          success: false,
          error: 'InternalError',
          message: 'Failed to update student status',
        });
      }
    }
  );

  // 6. Link Parent / Guardian to Student
  fastify.post(
    '/api/v1/students/:id/parents',
    async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
      const auth = authenticate(request, reply);
      if (!auth) return;

      const body = request.body as any;
      if (!body?.fullName || !body?.phone || !body?.relationType) {
        return reply.status(400).send({
          success: false,
          error: 'ValidationError',
          message: 'fullName, phone, and relationType are required to link a parent',
        });
      }

      try {
        const updated = await service.linkParent(auth.schoolId, request.params.id, body);
        return reply.status(201).send({
          success: true,
          data: updated,
          timestamp: new Date().toISOString(),
        });
      } catch (err: unknown) {
        if (err instanceof StudentNotFoundError) {
          return reply.status(404).send({
            success: false,
            error: 'NotFound',
            message: err.message,
          });
        }
        return reply.status(400).send({
          success: false,
          error: 'BadRequest',
          message: err instanceof Error ? err.message : 'Failed to link parent',
        });
      }
    }
  );

  // 7. Validated Batch Excel/CSV Student Import
  fastify.post('/api/v1/students/import', async (request, reply) => {
    const auth = authenticate(request, reply);
    if (!auth) return;

    const parseResult = studentBatchImportSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        error: 'ValidationError',
        message: 'Invalid import dataset',
        issues: parseResult.error.issues,
      });
    }

    try {
      const result = await service.importStudents(auth.schoolId, parseResult.data.rows);
      return reply.status(200).send({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      return reply.status(500).send({
        success: false,
        error: 'InternalError',
        message: err instanceof Error ? err.message : 'Batch student import failed',
      });
    }
  });
}

