import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { schoolRoutes } from '../src/modules/schools/schools.routes.js';
import { signAccessToken } from '../src/lib/jwt.js';

// In-Memory Mock Prisma Implementation for deterministic tenant isolation testing
class MockPrisma {
  schools: any[] = [];
  users: any[] = [];
  memberships: any[] = [];
  sequences: any[] = [];
  roles: any[] = [
    { id: 'role-super-admin', name: 'SUPER_ADMIN' },
    { id: 'role-school-admin', name: 'SCHOOL_ADMIN' },
  ];
  userRoles: any[] = [];

  school = {
    findUnique: async ({ where }: any) => {
      if (where.id) return this.schools.find((s) => s.id === where.id) || null;
      if (where.code) return this.schools.find((s) => s.code === where.code) || null;
      if (where.subdomain) return this.schools.find((s) => s.subdomain === where.subdomain) || null;
      if (where.customDomain) return this.schools.find((s) => s.customDomain === where.customDomain) || null;
      return null;
    },
    findFirst: async ({ where }: any) => {
      if (where.OR) {
        for (const condition of where.OR) {
          const found = await this.school.findUnique({ where: condition });
          if (found) return found;
        }
        return null;
      }
      return this.schools[0] || null;
    },
    findMany: async () => [...this.schools],
    create: async ({ data }: any) => {
      const record = {
        id: `school-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      this.schools.push(record);
      return record;
    },
    update: async ({ where, data }: any) => {
      const idx = this.schools.findIndex((s) => s.id === where.id);
      if (idx === -1) throw new Error('Not found');
      this.schools[idx] = { ...this.schools[idx], ...data, updatedAt: new Date() };
      return this.schools[idx];
    },
  };

  tenantSequence = {
    create: async ({ data }: any) => {
      this.sequences.push(data);
      return data;
    },
    update: async () => ({}),
  };

  user = {
    findUnique: async () => null,
    create: async ({ data }: any) => {
      const u = { id: `user-${Date.now()}`, ...data };
      this.users.push(u);
      return u;
    },
  };

  schoolMembership = {
    create: async ({ data }: any) => {
      this.memberships.push(data);
      return data;
    },
  };

  role = {
    findFirst: async ({ where }: any) => {
      return this.roles.find((r) => r.name === where.name) || null;
    },
  };

  userRole = {
    create: async ({ data }: any) => {
      this.userRoles.push(data);
      return data;
    },
  };

  $transaction = async (fn: any) => {
    return fn(this);
  };
}

describe('CodeNCampus Multi-Tenant & White-Label Architecture Tests', () => {
  let app: any;
  let mockPrisma: MockPrisma;

  const schoolAId = 'school-aaa-111';
  const schoolBId = 'school-bbb-222';

  // Seed sample tokens
  const superAdminToken = signAccessToken({
    sub: 'super-admin-user-id',
    schoolId: 'global',
    role: 'SUPER_ADMIN',
    permissions: ['*'],
  });

  const schoolAAdminToken = signAccessToken({
    sub: 'school-a-admin-id',
    schoolId: schoolAId,
    role: 'SCHOOL_ADMIN',
    permissions: ['school.config.view', 'school.config.update'],
  });

  const schoolBAdminToken = signAccessToken({
    sub: 'school-b-admin-id',
    schoolId: schoolBId,
    role: 'SCHOOL_ADMIN',
    permissions: ['school.config.view', 'school.config.update'],
  });

  const studentToken = signAccessToken({
    sub: 'student-user-id',
    schoolId: schoolAId,
    role: 'STUDENT',
    permissions: ['attendance.view.self'],
  });

  beforeEach(async () => {
    mockPrisma = new MockPrisma();

    // Seed School A
    mockPrisma.schools.push({
      id: schoolAId,
      name: 'Delhi Public School, R.K. Puram',
      code: 'DPSRKP',
      subdomain: 'dpsrkp',
      customDomain: 'portal.dpsrkp.edu',
      boardType: 'CBSE',
      affiliationNumber: 'CBSE-2026-DEL-04',
      contactEmail: 'admin@dpsrkp.edu',
      contactPhone: '+91 11 2617 7372',
      appName: 'DPS RKP Campus',
      logoUrl: 'https://cdn.codencampus.com/logos/dpsrkp.png',
      primaryColor: '#0F5132',
      secondaryColor: '#198754',
      accentColor: '#D1E7DD',
      status: 'ACTIVE',
      subscriptionPlan: 'PREMIUM',
      subscriptionStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Seed School B
    mockPrisma.schools.push({
      id: schoolBId,
      name: 'Modern Senior Secondary School',
      code: 'MODERN',
      subdomain: 'modern',
      customDomain: 'portal.modernschool.org',
      boardType: 'CBSE',
      affiliationNumber: 'CBSE-2026-DEL-09',
      contactEmail: 'contact@modernschool.org',
      contactPhone: '+91 11 2331 1603',
      appName: 'Modern School App',
      logoUrl: 'https://cdn.codencampus.com/logos/modern.png',
      primaryColor: '#7C2D12',
      secondaryColor: '#B91C1C',
      accentColor: '#FEE2E2',
      status: 'ACTIVE',
      subscriptionPlan: 'STANDARD',
      subscriptionStatus: 'ACTIVE',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    app = Fastify({ logger: false });
    await app.register(schoolRoutes, { prisma: mockPrisma as any });
  });

  // ==========================================
  // 1. PUBLIC BRANDING RESOLUTION & ZERO-LEAK TESTS
  // ==========================================
  test('Public Branding: Resolves school branding safely by uppercase code', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/schools/branding/DPSRKP',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.success, true);
    assert.equal(body.data.schoolCode, 'DPSRKP');
    assert.equal(body.data.branding.primaryColor, '#0F5132');
    assert.equal(body.data.appName, 'DPS RKP Campus');

    // Security Verification: Ensure sensitive data is NEVER leaked to public
    assert.equal(body.data.contactEmail, undefined, 'Private contact email must not leak');
    assert.equal(body.data.contactPhone, undefined, 'Private phone must not leak');
    assert.equal(body.data.id, undefined, 'Database internal UUID must not leak');
    assert.equal(body.data.subscriptionPlan, undefined, 'Subscription financial tier must not leak');
  });

  test('Public Branding: Resolves school branding safely by custom domain', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/schools/branding/portal.dpsrkp.edu',
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.schoolCode, 'DPSRKP');
  });

  test('Public Branding: Returns 404 for unknown school identifier', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/v1/schools/branding/NONEXISTENT_SCHOOL',
    });

    assert.equal(res.statusCode, 404);
  });

  // ==========================================
  // 2. CROSS-TENANT ISOLATION TESTS
  // ==========================================
  test('Cross-Tenant: School Admin of School A cannot view School B details', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/v1/schools/${schoolBId}`,
      headers: {
        authorization: `Bearer ${schoolAAdminToken}`,
      },
    });

    assert.equal(res.statusCode, 403, 'Cross-tenant read must be forbidden (HTTP 403)');
    const body = JSON.parse(res.body);
    assert.match(body.message, /insufficient permissions/i);
  });

  test('Cross-Tenant: School Admin of School A cannot modify School B branding', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolBId}/branding`,
      headers: {
        authorization: `Bearer ${schoolAAdminToken}`,
      },
      payload: {
        primaryColor: '#000000',
      },
    });

    assert.equal(res.statusCode, 403, 'Cross-tenant branding mutation must be forbidden');
    // Verify School B color was not tampered with
    assert.equal(mockPrisma.schools.find((s) => s.id === schoolBId).primaryColor, '#7C2D12');
  });

  test('Tenant Self-Management: School Admin of School A CAN update School A branding', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolAId}/branding`,
      headers: {
        authorization: `Bearer ${schoolAAdminToken}`,
      },
      payload: {
        primaryColor: '#004D40',
        appName: 'DPS RKP Official App',
      },
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.branding.primaryColor, '#004D40');
    assert.equal(body.data.appName, 'DPS RKP Official App');
  });

  test('Role Boundary: Students cannot update school branding', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolAId}/branding`,
      headers: {
        authorization: `Bearer ${studentToken}`,
      },
      payload: {
        primaryColor: '#FF0000',
      },
    });

    assert.equal(res.statusCode, 403);
  });

  // ==========================================
  // 3. SUPER ADMIN ONBOARDING & GOVERNANCE TESTS
  // ==========================================
  test('Super Admin: Can onboard a new school with branding and sequences', async () => {
    const newSchoolPayload = {
      name: 'Oakridge International School',
      code: 'OAKRIDGE',
      boardType: 'IB',
      subdomain: 'oakridge',
      contactEmail: 'admin@oakridge.edu',
      contactPhone: '+91 40 6699 0000',
      appName: 'Oakridge Campus',
      branding: {
        primaryColor: '#4A148C',
        secondaryColor: '#7B1FA2',
        accentColor: '#E1BEE7',
        logoUrl: 'https://cdn.oakridge.edu/logo.png',
      },
      subscriptionPlan: 'ENTERPRISE',
      adminUser: {
        fullName: 'Principal Oakridge',
        email: 'principal@oakridge.edu',
        password: 'Password@123',
      },
    };

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/schools',
      headers: {
        authorization: `Bearer ${superAdminToken}`,
      },
      payload: newSchoolPayload,
    });

    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.equal(body.data.code, 'OAKRIDGE');
    assert.equal(body.data.branding.primaryColor, '#4A148C');
    assert.equal(body.data.subscriptionPlan, 'ENTERPRISE');

    // Verify sequences initialized
    assert.equal(mockPrisma.sequences.length, 4, '4 tenant sequences must be created');
  });

  test('Super Admin: Prevents duplicate school code registration', async () => {
    const duplicatePayload = {
      name: 'Duplicate School',
      code: 'DPSRKP', // Already exists in seed
      boardType: 'CBSE',
      subdomain: 'dps-duplicate',
      contactEmail: 'test@dup.com',
      contactPhone: '9876543210',
    };

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/schools',
      headers: {
        authorization: `Bearer ${superAdminToken}`,
      },
      payload: duplicatePayload,
    });

    assert.equal(res.statusCode, 409, 'Duplicate school code must return HTTP 409 Conflict');
  });

  test('Super Admin: Can activate or deactivate school account', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolAId}/status`,
      headers: {
        authorization: `Bearer ${superAdminToken}`,
      },
      payload: {
        status: 'SUSPENDED',
      },
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.status, 'SUSPENDED');

    // Public branding should now refuse resolution for suspended school
    const publicRes = await app.inject({
      method: 'GET',
      url: '/api/v1/schools/branding/DPSRKP',
    });
    assert.equal(publicRes.statusCode, 400);
    const pubBody = JSON.parse(publicRes.body);
    assert.match(pubBody.message, /inactive/i);
  });

  test('Super Admin: Can manage school subscription plan and expiry', async () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);

    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolAId}/subscription`,
      headers: {
        authorization: `Bearer ${superAdminToken}`,
      },
      payload: {
        plan: 'ENTERPRISE',
        status: 'ACTIVE',
        expiresAt: nextYear.toISOString(),
      },
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.subscriptionPlan, 'ENTERPRISE');
  });

  test('Non-SuperAdmin: Cannot deactivate school account', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/v1/schools/${schoolAId}/status`,
      headers: {
        authorization: `Bearer ${schoolAAdminToken}`,
      },
      payload: {
        status: 'SUSPENDED',
      },
    });

    assert.equal(res.statusCode, 403, 'Only Super Admin can deactivate school account');
  });
});

