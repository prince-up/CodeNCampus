import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { PrismaClient } from '@codencampus/database';
import {
  createSchoolSchema,
  updateSchoolSchema,
  updateSchoolBrandingSchema,
  updateSchoolStatusSchema,
  updateSubscriptionSchema,
} from '@codencampus/validators';
import { SchoolsService, DuplicateTenantError, SchoolNotFoundError } from './schools.service.js';
import { verifyAccessToken } from '../../lib/jwt.js';

export async function schoolRoutes(fastify: FastifyInstance, options: { prisma?: PrismaClient } = {}) {
  const prisma = options.prisma || new PrismaClient();
  const service = new SchoolsService(prisma);

  // Authentication helper for Super Admin & Tenant authorization
  const requireSuperAdminOrSchoolAdmin = async (
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply,
    targetSchoolId?: string
  ) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization bearer token',
      });
      return null;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      
      // Super Admin has global tenant control
      if (payload.role === 'SUPER_ADMIN') {
        return payload;
      }

      // School Admin can only manage their own school
      if (
        payload.role === 'SCHOOL_ADMIN' &&
        targetSchoolId &&
        payload.schoolId === targetSchoolId
      ) {
        return payload;
      }

      reply.status(403).send({
        success: false,
        statusCode: 403,
        error: 'Forbidden',
        message: 'Insufficient permissions for cross-tenant operations',
      });
      return null;
    } catch {
      reply.status(401).send({
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return null;
    }
  };

  const requireSuperAdminOnly = async (
    request: FastifyRequest,
    reply: FastifyReply
  ) => {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      reply.status(401).send({
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Missing or malformed Authorization bearer token',
      });
      return null;
    }

    const token = authHeader.split(' ')[1];
    try {
      const payload = verifyAccessToken(token);
      if (payload.role !== 'SUPER_ADMIN') {
        reply.status(403).send({
          success: false,
          statusCode: 403,
          error: 'Forbidden',
          message: 'Operation requires Super Admin authorization',
        });
        return null;
      }
      return payload;
    } catch {
      reply.status(401).send({
        success: false,
        statusCode: 401,
        error: 'Unauthorized',
        message: 'Invalid or expired token',
      });
      return null;
    }
  };

  // 1. PUBLIC ENDPOINT: Resolve dynamic school branding for Mobile / Web Clients
  fastify.get('/api/v1/schools/branding/:identifier', async (request, reply) => {
    const { identifier } = request.params as { identifier: string };
    try {
      const branding = await service.resolvePublicBranding(identifier);
      return reply.status(200).send({
        success: true,
        data: branding,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'BadRequest',
        message: err instanceof Error ? err.message : 'Failed to resolve branding',
      });
    }
  });

  // 2. SUPER ADMIN: Onboard New School Tenant
  fastify.post('/api/v1/schools', async (request, reply) => {
    const admin = await requireSuperAdminOnly(request, reply);
    if (!admin) return;

    const parseResult = createSchoolSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid school onboarding request payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const created = await service.createSchool(parseResult.data as any);
      return reply.status(201).send({
        success: true,
        data: created,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof DuplicateTenantError) {
        return reply.status(409).send({
          success: false,
          statusCode: 409,
          error: 'Conflict',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: err instanceof Error ? err.message : 'Failed to onboard school',
      });
    }
  });

  // 3. SUPER ADMIN: List All School Tenants
  fastify.get('/api/v1/schools', async (request, reply) => {
    const admin = await requireSuperAdminOnly(request, reply);
    if (!admin) return;

    const schools = await service.listSchools();
    return reply.status(200).send({
      success: true,
      data: schools,
      timestamp: new Date().toISOString(),
    });
  });

  // 4. GET School Details by ID
  fastify.get('/api/v1/schools/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const user = await requireSuperAdminOrSchoolAdmin(request, reply, request.params.id);
    if (!user) return;

    try {
      const school = await service.getSchoolById(request.params.id);
      return reply.status(200).send({
        success: true,
        data: school,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: 'Failed to retrieve school',
      });
    }
  });

  // 5. UPDATE School General Details
  fastify.patch('/api/v1/schools/:id', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const user = await requireSuperAdminOrSchoolAdmin(request, reply, request.params.id);
    if (!user) return;

    const parseResult = updateSchoolSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid update payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const updated = await service.updateSchool(request.params.id, parseResult.data as any);
      return reply.status(200).send({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof DuplicateTenantError) {
        return reply.status(409).send({
          success: false,
          statusCode: 409,
          error: 'Conflict',
          message: err.message,
        });
      }
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: 'Failed to update school',
      });
    }
  });

  // 6. UPDATE School Branding (Colors, Logo URL, App Name)
  fastify.patch('/api/v1/schools/:id/branding', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const user = await requireSuperAdminOrSchoolAdmin(request, reply, request.params.id);
    if (!user) return;

    const parseResult = updateSchoolBrandingSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid branding configuration payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const updated = await service.updateBranding(request.params.id, parseResult.data);
      return reply.status(200).send({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: 'Failed to update branding',
      });
    }
  });

  // 7. ACTIVATE or DEACTIVATE School Account (Super Admin only)
  fastify.patch('/api/v1/schools/:id/status', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const admin = await requireSuperAdminOnly(request, reply);
    if (!admin) return;

    const parseResult = updateSchoolStatusSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid status payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const updated = await service.updateStatus(request.params.id, parseResult.data);
      return reply.status(200).send({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: 'Failed to update school status',
      });
    }
  });

  // 8. MANAGE School Subscription (Super Admin only)
  fastify.patch('/api/v1/schools/:id/subscription', async (request: FastifyRequest<{ Params: { id: string } }>, reply) => {
    const admin = await requireSuperAdminOnly(request, reply);
    if (!admin) return;

    const parseResult = updateSubscriptionSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send({
        success: false,
        statusCode: 400,
        error: 'ValidationError',
        message: 'Invalid subscription payload',
        issues: parseResult.error.issues,
      });
    }

    try {
      const updated = await service.updateSubscription(request.params.id, parseResult.data);
      return reply.status(200).send({
        success: true,
        data: updated,
        timestamp: new Date().toISOString(),
      });
    } catch (err: unknown) {
      if (err instanceof SchoolNotFoundError) {
        return reply.status(404).send({
          success: false,
          statusCode: 404,
          error: 'NotFound',
          message: err.message,
        });
      }
      return reply.status(500).send({
        success: false,
        statusCode: 500,
        error: 'InternalError',
        message: 'Failed to update subscription',
      });
    }
  });
}

