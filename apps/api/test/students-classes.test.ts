import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import Fastify from 'fastify';
import { classRoutes } from '../src/modules/classes/classes.routes.js';
import { studentRoutes } from '../src/modules/students/students.routes.js';
import { signAccessToken } from '../src/lib/jwt.js';

class MockStudentPrisma {
  schools: any[] = [];
  classes: any[] = [];
  sections: any[] = [];
  users: any[] = [];
  studentProfiles: any[] = [];
  parentProfiles: any[] = [];
  studentParentMappings: any[] = [];
  memberships: any[] = [];
  sequences: any[] = [];
  roles: any[] = [
    { id: 'role-student', name: 'STUDENT' },
    { id: 'role-parent', name: 'PARENT' },
    { id: 'role-school-admin', name: 'SCHOOL_ADMIN' },
  ];
  userRoles: any[] = [];

  school = {
    findUnique: async ({ where }: any) => {
      return this.schools.find((s) => s.id === where.id || s.code === where.code) || null;
    },
  };

  class = {
    findMany: async ({ where }: any) => {
      const cls = this.classes.filter((c) => c.schoolId === where.schoolId);
      return cls.map((c) => ({
        ...c,
        sections: this.sections
          .filter((s) => s.classId === c.id)
          .map((s) => ({
            ...s,
            _count: {
              students: this.studentProfiles.filter((p) => p.sectionId === s.id).length,
            },
          })),
      }));
    },
    findFirst: async ({ where }: any) => {
      const c = this.classes.find((item) => {
        if (where.id && item.id !== where.id) return false;
        if (where.schoolId && item.schoolId !== where.schoolId) return false;
        if (where.name && item.name !== where.name) return false;
        return true;
      });
      if (!c) return null;
      return {
        ...c,
        sections: this.sections
          .filter((s) => s.classId === c.id)
          .map((s) => ({
            ...s,
            _count: {
              students: this.studentProfiles.filter((p) => p.sectionId === s.id).length,
            },
          })),
      };
    },
    create: async ({ data }: any) => {
      const c = { id: `cls-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...data };
      this.classes.push(c);
      return c;
    },
  };

  section = {
    findFirst: async ({ where }: any) => {
      return this.sections.find((s) => {
        if (where.id && s.id !== where.id) return false;
        if (where.classId && s.classId !== where.classId) return false;
        if (where.schoolId && s.schoolId !== where.schoolId) return false;
        if (where.name && s.name !== where.name) return false;
        return true;
      }) || null;
    },
    create: async ({ data }: any) => {
      const s = { id: `sec-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...data };
      this.sections.push(s);
      return s;
    },
  };

  tenantSequence = {
    findUnique: async ({ where }: any) => {
      const { schoolId, entityType } = where.schoolId_entityType;
      return this.sequences.find((seq) => seq.schoolId === schoolId && seq.entityType === entityType) || null;
    },
    create: async ({ data }: any) => {
      const seq = { ...data, currentValue: BigInt(data.currentValue || 0) };
      this.sequences.push(seq);
      return seq;
    },
    update: async ({ where, data }: any) => {
      const { schoolId, entityType } = where.schoolId_entityType;
      let seq = this.sequences.find((s) => s.schoolId === schoolId && s.entityType === entityType);
      if (!seq) {
        seq = { schoolId, entityType, currentValue: BigInt(0) };
        this.sequences.push(seq);
      }
      if (data.currentValue?.increment) {
        seq.currentValue = BigInt(seq.currentValue) + BigInt(data.currentValue.increment);
      }
      return seq;
    },
  };

  user = {
    findUnique: async ({ where }: any) => {
      if (where.id) return this.users.find((u) => u.id === where.id) || null;
      if (where.email) return this.users.find((u) => u.email === where.email) || null;
      if (where.phone) return this.users.find((u) => u.phone === where.phone) || null;
      return null;
    },
    create: async ({ data }: any) => {
      const u = { id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...data };
      this.users.push(u);
      return u;
    },
    update: async ({ where, data }: any) => {
      const u = this.users.find((x) => x.id === where.id);
      if (!u) throw new Error('User not found');
      Object.assign(u, data);
      return u;
    },
  };

  studentProfile = {
    findUnique: async ({ where }: any) => {
      if (where.schoolId_admissionNumber) {
        const { schoolId, admissionNumber } = where.schoolId_admissionNumber;
        return this.studentProfiles.find((p) => p.schoolId === schoolId && p.admissionNumber === admissionNumber) || null;
      }
      return this.studentProfiles.find((p) => p.id === where.id) || null;
    },
    findFirst: async ({ where }: any) => {
      const p = this.studentProfiles.find((item) => {
        if (where.id && item.id !== where.id) return false;
        if (where.schoolId && item.schoolId !== where.schoolId) return false;
        if (where.deletedAt === null && item.deletedAt !== null) return false;
        return true;
      });
      if (!p) return null;
      return this.attachRelations(p);
    },
    findMany: async ({ where }: any) => {
      const matches = this.studentProfiles.filter((p) => {
        if (where.schoolId && p.schoolId !== where.schoolId) return false;
        if (where.sectionId && p.sectionId !== where.sectionId) return false;
        if (where.deletedAt === null && p.deletedAt !== null) return false;
        if (where.user?.isActive !== undefined) {
          const u = this.users.find((x) => x.id === p.userId);
          if (u?.isActive !== where.user.isActive) return false;
        }
        return true;
      });
      return matches.map((p) => this.attachRelations(p));
    },
    count: async ({ where }: any) => {
      return this.studentProfiles.filter((p) => p.schoolId === where.schoolId).length;
    },
    create: async ({ data }: any) => {
      const p = {
        id: `stu-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        deletedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...data,
      };
      this.studentProfiles.push(p);
      return p;
    },
    update: async ({ where, data }: any) => {
      const p = this.studentProfiles.find((x) => x.id === where.id);
      if (!p) throw new Error('StudentProfile not found');
      Object.assign(p, data, { updatedAt: new Date() });
      return p;
    },
  };

  parentProfile = {
    findFirst: async ({ where }: any) => {
      return this.parentProfiles.find((p) => p.schoolId === where.schoolId && p.userId === where.userId) || null;
    },
    create: async ({ data }: any) => {
      const p = { id: `par-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`, ...data };
      this.parentProfiles.push(p);
      return p;
    },
  };

  studentParentMapping = {
    findUnique: async ({ where }: any) => {
      const { studentId, parentId } = where.studentId_parentId;
      return this.studentParentMappings.find((m) => m.studentId === studentId && m.parentId === parentId) || null;
    },
    create: async ({ data }: any) => {
      const m = { id: `spm-${Date.now()}`, ...data };
      this.studentParentMappings.push(m);
      return m;
    },
  };

  schoolMembership = {
    findUnique: async ({ where }: any) => {
      if (where.schoolId_userId) {
        const { schoolId, userId } = where.schoolId_userId;
        return this.memberships.find((m) => m.schoolId === schoolId && m.userId === userId) || null;
      }
      return null;
    },
    create: async ({ data }: any) => {
      const m = { id: `mem-${Date.now()}`, ...data };
      this.memberships.push(m);
      return m;
    },
    updateMany: async ({ where, data }: any) => {
      let count = 0;
      for (const m of this.memberships) {
        if (m.schoolId === where.schoolId && m.userId === where.userId) {
          Object.assign(m, data);
          count++;
        }
      }
      return { count };
    },
  };

  role = {
    findFirst: async ({ where }: any) => {
      return this.roles.find((r) => r.name === where.name) || null;
    },
  };

  userRole = {
    findFirst: async ({ where }: any) => {
      return this.userRoles.find((ur) => ur.userId === where.userId && ur.roleId === where.roleId && ur.schoolId === where.schoolId) || null;
    },
    create: async ({ data }: any) => {
      this.userRoles.push(data);
      return data;
    },
  };

  $transaction = async (fn: any) => fn(this);

  private attachRelations(p: any) {
    const user = this.users.find((u) => u.id === p.userId);
    const membership = this.memberships.find((m) => m.schoolId === p.schoolId && m.userId === p.userId);
    const sec = this.sections.find((s) => s.id === p.sectionId);
    const cls = sec ? this.classes.find((c) => c.id === sec.classId) : null;
    const parentMaps = this.studentParentMappings.filter((m) => m.studentId === p.id);

    return {
      ...p,
      user: {
        ...user,
        memberships: membership ? [membership] : [],
      },
      section: sec ? { ...sec, class: cls } : null,
      parentMappings: parentMaps.map((m) => {
        const parent = this.parentProfiles.find((pp) => pp.id === m.parentId);
        const parentUser = parent ? this.users.find((u) => u.id === parent.userId) : null;
        return {
          ...m,
          parent: {
            ...parent,
            user: parentUser,
          },
        };
      }),
    };
  }
}

describe('Student & Class Management Workflow Tests', () => {
  let app: any;
  let mockPrisma: MockStudentPrisma;

  const schoolAId = 'sch-aaa';
  const schoolBId = 'sch-bbb';

  const schoolAAdminToken = signAccessToken({
    sub: 'admin-a',
    schoolId: schoolAId,
    role: 'SCHOOL_ADMIN',
    permissions: ['*'],
  });

  const schoolBAdminToken = signAccessToken({
    sub: 'admin-b',
    schoolId: schoolBId,
    role: 'SCHOOL_ADMIN',
    permissions: ['*'],
  });

  beforeEach(async () => {
    mockPrisma = new MockStudentPrisma();

    mockPrisma.schools.push(
      { id: schoolAId, code: 'DPSRKP', name: 'Delhi Public School' },
      { id: schoolBId, code: 'MODERN', name: 'Modern School' }
    );

    app = Fastify({ logger: false });
    await app.register(classRoutes, { prisma: mockPrisma as any });
    await app.register(studentRoutes, { prisma: mockPrisma as any });
  });

  // 1. CLASS & SECTION CREATION
  test('Class Management: Create Class with automatic Section A', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/classes',
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: {
        name: 'Class 10',
        numericOrder: 10,
        stage: 'SECONDARY',
        sectionNames: ['A', 'B'],
      },
    });

    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.equal(body.data.name, 'Class 10');
    assert.equal(body.data.sections.length, 2);
    assert.equal(body.data.sections[0].name, 'A');
    assert.equal(body.data.sections[1].name, 'B');
  });

  // 2. STUDENT CREATION & ATOMIC READABLE ID
  test('Student Management: Create student with section assignment & parent link', async () => {
    // First create a class
    const cls = await mockPrisma.class.create({
      data: { schoolId: schoolAId, name: 'Class 10', numericOrder: 10, stage: 'SECONDARY' },
    });
    const sec = await mockPrisma.section.create({
      data: { schoolId: schoolAId, classId: cls.id, name: 'A', roomNumber: 'Room 302' },
    });

    const studentPayload = {
      fullName: 'Aarav Sharma',
      email: 'aarav@dpsrkp.edu',
      dateOfBirth: '2010-06-15',
      gender: 'MALE',
      bloodGroup: 'B+',
      emergencyContactPhone: '+91 98765 43210',
      sectionId: sec.id,
      rollNumber: 14,
      parent: {
        fullName: 'Rajesh Sharma',
        phone: '+91 98765 43210',
        email: 'rajesh@sharma.com',
        relationType: 'FATHER',
      },
    };

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/students',
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: studentPayload,
    });

    assert.equal(res.statusCode, 201);
    const body = JSON.parse(res.body);
    assert.equal(body.data.fullName, 'Aarav Sharma');
    assert.equal(body.data.readableId, 'DPSRKP-STU-00001');
    assert.equal(body.data.sectionName, 'A');
    assert.equal(body.data.className, 'Class 10');
    assert.equal(body.data.parents.length, 1);
    assert.equal(body.data.parents[0].fullName, 'Rajesh Sharma');
    assert.equal(body.data.parents[0].relationType, 'FATHER');
  });

  // 3. EDIT STUDENT PROFILE & SECTION
  test('Student Management: Edit profile and update roll number', async () => {
    const createdRes = await app.inject({
      method: 'POST',
      url: '/api/v1/students',
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: {
        fullName: 'Diya Patel',
        dateOfBirth: '2010-08-20',
        gender: 'FEMALE',
        emergencyContactPhone: '+91 98765 11111',
      },
    });
    const student = JSON.parse(createdRes.body).data;

    const updateRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/students/${student.id}`,
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: {
        rollNumber: 25,
        bloodGroup: 'O+',
      },
    });

    assert.equal(updateRes.statusCode, 200);
    const updated = JSON.parse(updateRes.body).data;
    assert.equal(updated.rollNumber, 25);
    assert.equal(updated.bloodGroup, 'O+');
  });

  // 4. DEACTIVATE AND ACTIVATE STUDENT ACCOUNT
  test('Student Management: Activate and Deactivate student account', async () => {
    const createdRes = await app.inject({
      method: 'POST',
      url: '/api/v1/students',
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: {
        fullName: 'Rohan Mehra',
        dateOfBirth: '2011-03-12',
        gender: 'MALE',
        emergencyContactPhone: '+91 98765 22222',
      },
    });
    const student = JSON.parse(createdRes.body).data;

    // Deactivate
    const deactRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/students/${student.id}/status`,
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: { isActive: false },
    });

    assert.equal(deactRes.statusCode, 200);
    assert.equal(JSON.parse(deactRes.body).data.isActive, false);

    // Reactivate
    const reactRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/students/${student.id}/status`,
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: { isActive: true },
    });

    assert.equal(reactRes.statusCode, 200);
    assert.equal(JSON.parse(reactRes.body).data.isActive, true);
  });

  // 5. VALIDATED CSV/EXCEL BATCH IMPORT
  test('Student Management: Batch import creates students and auto-provisions classes', async () => {
    const importPayload = {
      rows: [
        {
          fullName: 'Kabir Sengupta',
          className: 'Class 8',
          sectionName: 'A',
          rollNumber: 1,
          dateOfBirth: '2012-01-10',
          gender: 'MALE',
          emergencyContactPhone: '+91 98765 33333',
          parentName: 'Amit Sengupta',
          parentPhone: '+91 98765 33333',
        },
        {
          fullName: 'Ananya Roy',
          className: 'Class 8',
          sectionName: 'B',
          rollNumber: 2,
          dateOfBirth: '2012-04-25',
          gender: 'FEMALE',
          emergencyContactPhone: '+91 98765 44444',
        },
      ],
    };

    const res = await app.inject({
      method: 'POST',
      url: '/api/v1/students/import',
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: importPayload,
    });

    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.data.imported, 2);
    assert.equal(body.data.failed, 0);
  });

  // 6. CROSS-TENANT ISOLATION
  test('Cross-Tenant: School Admin of School A cannot access or modify School B student', async () => {
    // Create student in School B
    const bRes = await app.inject({
      method: 'POST',
      url: '/api/v1/students',
      headers: { authorization: `Bearer ${schoolBAdminToken}` },
      payload: {
        fullName: 'Student of School B',
        dateOfBirth: '2010-01-01',
        gender: 'OTHER',
        emergencyContactPhone: '+91 99999 99999',
      },
    });
    const studentB = JSON.parse(bRes.body).data;

    // School A Admin tries to fetch School B student
    const fetchRes = await app.inject({
      method: 'GET',
      url: `/api/v1/students/${studentB.id}`,
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
    });

    assert.equal(fetchRes.statusCode, 404, 'Cross-tenant lookup must return 404');

    // School A Admin tries to edit School B student
    const patchRes = await app.inject({
      method: 'PATCH',
      url: `/api/v1/students/${studentB.id}`,
      headers: { authorization: `Bearer ${schoolAAdminToken}` },
      payload: { fullName: 'Hacked Name' },
    });

    assert.equal(patchRes.statusCode, 404, 'Cross-tenant edit must return 404');
  });
});
