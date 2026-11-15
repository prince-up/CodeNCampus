import { PrismaClient } from '@codencampus/database';
import bcrypt from 'bcryptjs';
import { AuthSessionDTO, UserRole, LinkedStudentDTO } from '@codencampus/types';
import { signAccessToken } from '../../lib/jwt.js';
import { DEFAULT_ROLE_PERMISSIONS } from '../../lib/permissions.js';

export class AuthService {
  constructor(private prisma: PrismaClient) {}

  async login(identifier: string, passwordPlain: string, targetSchoolId?: string): Promise<AuthSessionDTO> {
    const cleanId = identifier.trim();

    // 1. Find user by email, phone, or membership readableId
    let user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanId.toLowerCase() },
          { phone: cleanId },
          { memberships: { some: { readableId: cleanId.toUpperCase() } } },
        ],
      },
      include: {
        memberships: {
          include: {
            school: true,
          },
        },
        userRoles: {
          include: {
            role: true,
          },
        },
        studentProfile: {
          include: {
            parentMappings: {
              include: {
                student: {
                  include: { user: true },
                },
              },
            },
          },
        },
        parentProfile: {
          include: {
            studentMappings: {
              include: {
                student: {
                  include: { user: true },
                },
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new Error('Invalid credentials: user not found.');
    }

    if (!user.isActive) {
      throw new Error('Account deactivated. Please contact campus administration.');
    }

    // 2. Verify password hash
    if (user.passwordHash) {
      const isMatch = await bcrypt.compare(passwordPlain, user.passwordHash);
      if (!isMatch) {
        throw new Error('Invalid credentials: password incorrect.');
      }
    }

    // 3. Resolve school membership
    let membership = targetSchoolId
      ? user.memberships.find((m: any) => m.schoolId === targetSchoolId)
      : user.memberships[0];

    if (!membership && user.memberships.length > 0) {
      membership = user.memberships[0];
    }

    const schoolId = membership?.schoolId || 'global';
    const schoolName = membership?.school?.name || 'CodeNCampus';
    const readableId = membership?.readableId || 'CNC-ADM-00001';

    // 4. Resolve Roles
    const roles: UserRole[] = (user.userRoles || [])
      .filter((ur: any) => !ur.schoolId || ur.schoolId === schoolId)
      .map((ur: any) => ur.role?.name as UserRole)
      .filter(Boolean);

    const availableRoles: UserRole[] = roles.length ? roles : ['SCHOOL_ADMIN', 'TEACHER', 'PARENT', 'STUDENT'];
    const activeRole: UserRole = availableRoles[0];

    const permissions = DEFAULT_ROLE_PERMISSIONS[activeRole] || ['*'];

    // 5. Sign JWT
    const accessToken = signAccessToken({
      sub: user.id,
      email: user.email,
      phone: user.phone,
      schoolId,
      role: activeRole,
      permissions,
      readableId,
    });

    // 6. Linked students if parent
    const linkedStudents: LinkedStudentDTO[] = (user.parentProfile?.studentMappings || []).map((m: any) => ({
      studentProfileId: m.studentId,
      studentUserId: m.student?.userId,
      studentName: m.student?.user?.fullName || 'Student',
      readableId: 'DPS-STU-00104',
      admissionNumber: m.student?.admissionNumber || 'ADM-00104',
      relationType: m.relationType,
      isPrimaryContact: m.isPrimaryContact,
      canPickup: m.canPickup,
      schoolId,
    }));

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        phone: user.phone,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        isActive: user.isActive,
      },
      activeSchoolId: schoolId,
      activeSchoolName: schoolName,
      activeRole,
      readableId,
      permissions,
      availableSchools: (user.memberships || []).map((m: any) => ({
        id: m.schoolId,
        name: m.school?.name || 'Campus',
        code: m.school?.code || 'CNC',
        roles: availableRoles,
      })),
      availableRoles,
      linkedStudents: linkedStudents.length ? linkedStudents : undefined,
    };
  }
}

