import { PrismaClient } from '@codencampus/database';
import bcrypt from 'bcryptjs';
import {
  CreateSchoolDTO,
  UpdateSchoolDTO,
  UpdateSchoolBrandingDTO,
  UpdateSchoolStatusDTO,
  UpdateSubscriptionDTO,
  SchoolDetailDTO,
  PublicSchoolBrandingDTO,
  SchoolSummaryDTO,
} from '@codencampus/types';

export class SchoolNotFoundError extends Error {
  constructor(identifier: string) {
    super(`School not found: ${identifier}`);
    this.name = 'SchoolNotFoundError';
  }
}

export class DuplicateTenantError extends Error {
  constructor(field: string, value: string) {
    super(`A school with ${field} '${value}' already exists.`);
    this.name = 'DuplicateTenantError';
  }
}

export class SchoolsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Secure School Onboarding System (Super Admin only)
   * Creates the school tenant, sets up human-readable sequence counters,
   * configures white-label branding, and provisions initial School Admin.
   */
  async createSchool(dto: CreateSchoolDTO): Promise<SchoolDetailDTO> {
    const uppercaseCode = dto.code.toUpperCase().trim();
    const lowercaseSubdomain = dto.subdomain.toLowerCase().trim();

    // Check code collision
    const existingCode = await this.prisma.school.findUnique({
      where: { code: uppercaseCode },
    });
    if (existingCode) {
      throw new DuplicateTenantError('code', uppercaseCode);
    }

    // Check subdomain collision
    const existingSubdomain = await this.prisma.school.findUnique({
      where: { subdomain: lowercaseSubdomain },
    });
    if (existingSubdomain) {
      throw new DuplicateTenantError('subdomain', lowercaseSubdomain);
    }

    // Check custom domain collision if provided
    if (dto.customDomain) {
      const existingDomain = await this.prisma.school.findUnique({
        where: { customDomain: dto.customDomain.toLowerCase().trim() },
      });
      if (existingDomain) {
        throw new DuplicateTenantError('customDomain', dto.customDomain);
      }
    }

    const branding = dto.branding || {};
    const primaryColor = branding.primaryColor || '#1E40AF';
    const secondaryColor = branding.secondaryColor || '#3B82F6';
    const accentColor = branding.accentColor || '#DBEAFE';
    const appName = dto.appName || dto.name;

    // Use transaction to ensure atomic provisioning
    const school = await this.prisma.$transaction(async (tx) => {
      // 1. Create School Tenant Record
      const created = await tx.school.create({
        data: {
          name: dto.name.trim(),
          code: uppercaseCode,
          boardType: dto.boardType,
          subdomain: lowercaseSubdomain,
          customDomain: dto.customDomain ? dto.customDomain.toLowerCase().trim() : null,
          affiliationNumber: dto.affiliationNumber || null,
          contactEmail: dto.contactEmail.toLowerCase().trim(),
          contactPhone: dto.contactPhone.trim(),
          appName,
          logoUrl: branding.logoUrl || null,
          primaryColor,
          secondaryColor,
          accentColor,
          subscriptionPlan: dto.subscriptionPlan || 'STANDARD',
          subscriptionStatus: 'ACTIVE',
          status: 'ACTIVE',
        },
      });

      // 2. Initialize Human-Readable Tenant Sequences
      const sequenceTypes = ['STUDENT', 'STAFF', 'PARENT', 'INVOICE'];
      for (const seqType of sequenceTypes) {
        await tx.tenantSequence.create({
          data: {
            schoolId: created.id,
            entityType: seqType,
            currentValue: BigInt(0),
          },
        });
      }

      // 3. Provision Initial School Admin User if provided
      if (dto.adminUser) {
        const adminEmail = dto.adminUser.email?.toLowerCase().trim();
        const adminPhone = dto.adminUser.phone?.trim();
        const password = dto.adminUser.password || 'CampusAdmin@2026';
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Find or create user
        let user = null;
        if (adminEmail) {
          user = await tx.user.findUnique({ where: { email: adminEmail } });
        }
        if (!user && adminPhone) {
          user = await tx.user.findUnique({ where: { phone: adminPhone } });
        }

        if (!user) {
          user = await tx.user.create({
            data: {
              fullName: dto.adminUser.fullName.trim(),
              email: adminEmail || null,
              phone: adminPhone || null,
              passwordHash,
              isActive: true,
            },
          });
        }

        // Increment sequence for staff/admin
        await tx.tenantSequence.update({
          where: { schoolId_entityType: { schoolId: created.id, entityType: 'STAFF' } },
          data: { currentValue: { increment: 1 } },
        });

        const readableId = `${uppercaseCode}-ADM-00001`;

        // Create membership
        await tx.schoolMembership.create({
          data: {
            schoolId: created.id,
            userId: user.id,
            readableId,
            status: 'ACTIVE',
          },
        });

        // Assign SCHOOL_ADMIN role
        const adminRole = await tx.role.findFirst({
          where: { name: 'SCHOOL_ADMIN' },
        });

        if (adminRole) {
          await tx.userRole.create({
            data: {
              userId: user.id,
              roleId: adminRole.id,
              schoolId: created.id,
            },
          });
        }
      }

      return created;
    });

    return this.mapToDetail(school);
  }

  /**
   * List all schools with high-level summaries (Super Admin)
   */
  async listSchools(): Promise<SchoolSummaryDTO[]> {
    const schools = await this.prisma.school.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return schools.map((s) => ({
      id: s.id,
      name: s.name,
      code: s.code,
      boardType: s.boardType as any,
      subdomain: s.subdomain,
      customDomain: s.customDomain,
      status: s.status as any,
      branding: {
        appName: s.appName || s.name,
        logoUrl: s.logoUrl,
        primaryColor: s.primaryColor,
        secondaryColor: s.secondaryColor,
        accentColor: s.accentColor || undefined,
      },
    }));
  }

  /**
   * Get School Details by ID
   */
  async getSchoolById(id: string): Promise<SchoolDetailDTO> {
    const school = await this.prisma.school.findUnique({
      where: { id },
    });
    if (!school) {
      throw new SchoolNotFoundError(id);
    }
    return this.mapToDetail(school);
  }

  /**
   * Public Branding Resolution Endpoint
   * Resolves school branding by code, subdomain, or custom domain.
   * STRICT SECURITY: Never leaks internal identifiers, credentials, sequences, or other tenants' data!
   */
  async resolvePublicBranding(identifier: string): Promise<PublicSchoolBrandingDTO> {
    const cleanId = identifier.trim();

    const school = await this.prisma.school.findFirst({
      where: {
        OR: [
          { code: cleanId.toUpperCase() },
          { subdomain: cleanId.toLowerCase() },
          { customDomain: cleanId.toLowerCase() },
        ],
      },
      select: {
        code: true,
        name: true,
        appName: true,
        subdomain: true,
        customDomain: true,
        logoUrl: true,
        primaryColor: true,
        secondaryColor: true,
        accentColor: true,
        status: true,
      },
    });

    if (!school) {
      throw new SchoolNotFoundError(identifier);
    }

    if (school.status !== 'ACTIVE') {
      throw new Error(`School '${school.name}' is currently inactive.`);
    }

    return {
      schoolCode: school.code,
      name: school.name,
      shortName: school.name.split(',')[0].trim(),
      appName: school.appName || school.name,
      subdomain: school.subdomain,
      customDomain: school.customDomain,
      branding: {
        appName: school.appName || school.name,
        logoUrl: school.logoUrl,
        primaryColor: school.primaryColor,
        secondaryColor: school.secondaryColor,
        accentColor: school.accentColor || undefined,
      },
    };
  }

  /**
   * Update School Details (Name, Board, Domains, Contact)
   */
  async updateSchool(id: string, dto: UpdateSchoolDTO): Promise<SchoolDetailDTO> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new SchoolNotFoundError(id);

    if (dto.subdomain && dto.subdomain !== school.subdomain) {
      const duplicate = await this.prisma.school.findUnique({
        where: { subdomain: dto.subdomain.toLowerCase().trim() },
      });
      if (duplicate && duplicate.id !== id) {
        throw new DuplicateTenantError('subdomain', dto.subdomain);
      }
    }

    if (dto.customDomain && dto.customDomain !== school.customDomain) {
      const duplicate = await this.prisma.school.findUnique({
        where: { customDomain: dto.customDomain.toLowerCase().trim() },
      });
      if (duplicate && duplicate.id !== id) {
        throw new DuplicateTenantError('customDomain', dto.customDomain);
      }
    }

    const updated = await this.prisma.school.update({
      where: { id },
      data: {
        name: dto.name?.trim(),
        boardType: dto.boardType,
        affiliationNumber: dto.affiliationNumber,
        subdomain: dto.subdomain ? dto.subdomain.toLowerCase().trim() : undefined,
        customDomain: dto.customDomain !== undefined ? (dto.customDomain ? dto.customDomain.toLowerCase().trim() : null) : undefined,
        contactEmail: dto.contactEmail?.toLowerCase().trim(),
        contactPhone: dto.contactPhone?.trim(),
        appName: dto.appName?.trim(),
      },
    });

    return this.mapToDetail(updated);
  }

  /**
   * Update School Branding (Logos, Theme Colors, App Name)
   */
  async updateBranding(id: string, dto: UpdateSchoolBrandingDTO): Promise<SchoolDetailDTO> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new SchoolNotFoundError(id);

    const updated = await this.prisma.school.update({
      where: { id },
      data: {
        logoUrl: dto.logoUrl !== undefined ? dto.logoUrl : school.logoUrl,
        primaryColor: dto.primaryColor || school.primaryColor,
        secondaryColor: dto.secondaryColor || school.secondaryColor,
        accentColor: dto.accentColor || school.accentColor,
        appName: dto.appName !== undefined ? dto.appName : school.appName,
      },
    });

    return this.mapToDetail(updated);
  }

  /**
   * Activate or Deactivate School Account
   */
  async updateStatus(id: string, dto: UpdateSchoolStatusDTO): Promise<SchoolDetailDTO> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new SchoolNotFoundError(id);

    const updated = await this.prisma.school.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });

    return this.mapToDetail(updated);
  }

  /**
   * Manage School Subscription
   */
  async updateSubscription(id: string, dto: UpdateSubscriptionDTO): Promise<SchoolDetailDTO> {
    const school = await this.prisma.school.findUnique({ where: { id } });
    if (!school) throw new SchoolNotFoundError(id);

    const updated = await this.prisma.school.update({
      where: { id },
      data: {
        subscriptionPlan: dto.plan,
        subscriptionStatus: dto.status,
        subscriptionExpiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return this.mapToDetail(updated);
  }

  private mapToDetail(s: any): SchoolDetailDTO {
    return {
      id: s.id,
      organizationId: s.organizationId,
      name: s.name,
      code: s.code,
      boardType: s.boardType as any,
      subdomain: s.subdomain,
      customDomain: s.customDomain,
      affiliationNumber: s.affiliationNumber,
      contactEmail: s.contactEmail,
      contactPhone: s.contactPhone,
      appName: s.appName,
      status: s.status as any,
      subscriptionPlan: s.subscriptionPlan,
      subscriptionStatus: s.subscriptionStatus,
      subscriptionExpiresAt: s.subscriptionExpiresAt ? s.subscriptionExpiresAt.toISOString() : null,
      branding: {
        appName: s.appName || s.name,
        logoUrl: s.logoUrl,
        primaryColor: s.primaryColor,
        secondaryColor: s.secondaryColor,
        accentColor: s.accentColor || undefined,
      },
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    };
  }
}

