import { PrismaClient } from '@codencampus/database';
import bcrypt from 'bcryptjs';
import {
  CreateStudentDTO,
  UpdateStudentDTO,
  StudentDetailDTO,
  StudentSearchQueryDTO,
  StudentImportRowDTO,
  StudentImportResultDTO,
} from '@codencampus/types';

export class StudentNotFoundError extends Error {
  constructor(id: string) {
    super(`Student not found: ${id}`);
    this.name = 'StudentNotFoundError';
  }
}

export class DuplicateAdmissionNumberError extends Error {
  constructor(admissionNumber: string) {
    super(`A student with admission number '${admissionNumber}' already exists in this school.`);
    this.name = 'DuplicateAdmissionNumberError';
  }
}

export class StudentsService {
  constructor(private prisma: PrismaClient) {}

  /**
   * Create a new student with atomic ID generation, section assignment, and parent linkage
   */
  async createStudent(schoolId: string, dto: CreateStudentDTO): Promise<StudentDetailDTO> {
    const school = await this.prisma.school.findUnique({
      where: { id: schoolId },
    });
    if (!school) throw new Error('School not found');

    // Verify section if provided
    if (dto.sectionId) {
      const section = await this.prisma.section.findFirst({
        where: { id: dto.sectionId, schoolId },
      });
      if (!section) {
        throw new Error('Assigned section does not belong to this school');
      }
    }

    const createdStudent = await this.prisma.$transaction(async (tx) => {
      // 1. Increment atomic student sequence
      let seqRecord = await tx.tenantSequence.findUnique({
        where: { schoolId_entityType: { schoolId, entityType: 'STUDENT' } },
      });
      if (!seqRecord) {
        seqRecord = await tx.tenantSequence.create({
          data: { schoolId, entityType: 'STUDENT', currentValue: BigInt(0) },
        });
      }

      const updatedSeq = await tx.tenantSequence.update({
        where: { schoolId_entityType: { schoolId, entityType: 'STUDENT' } },
        data: { currentValue: { increment: 1 } },
      });

      const paddedNumber = String(updatedSeq.currentValue).padStart(5, '0');
      const readableId = `${school.code}-STU-${paddedNumber}`;
      const admissionNumber = dto.admissionNumber?.trim() || `ADM-${new Date().getFullYear()}-${paddedNumber}`;

      // Check admission number conflict
      const existingAdm = await tx.studentProfile.findUnique({
        where: { schoolId_admissionNumber: { schoolId, admissionNumber } },
      });
      if (existingAdm) {
        throw new DuplicateAdmissionNumberError(admissionNumber);
      }

      // 2. Hash temporary password
      const defaultPassword = dto.password || 'Campus@2026';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(defaultPassword, salt);

      // 3. Create User record
      const studentUser = await tx.user.create({
        data: {
          fullName: dto.fullName.trim(),
          email: dto.email ? dto.email.toLowerCase().trim() : null,
          phone: dto.phone?.trim() || null,
          passwordHash,
          isActive: true,
        },
      });

      // 4. Create Student Profile
      const studentProfile = await tx.studentProfile.create({
        data: {
          schoolId,
          userId: studentUser.id,
          admissionNumber,
          rollNumber: dto.rollNumber || null,
          sectionId: dto.sectionId || null,
          dateOfBirth: new Date(dto.dateOfBirth),
          gender: dto.gender,
          bloodGroup: dto.bloodGroup || null,
          emergencyContactPhone: dto.emergencyContactPhone.trim(),
          address: dto.address || null,
        },
      });

      // 5. Create School Membership
      await tx.schoolMembership.create({
        data: {
          schoolId,
          userId: studentUser.id,
          readableId,
          status: 'ACTIVE',
        },
      });

      // 6. Assign STUDENT Role
      const studentRole = await tx.role.findFirst({
        where: { name: 'STUDENT' },
      });
      if (studentRole) {
        await tx.userRole.create({
          data: {
            userId: studentUser.id,
            roleId: studentRole.id,
            schoolId,
          },
        });
      }

      // 7. Optional Parent Creation & Linkage
      if (dto.parent) {
        const pPhone = dto.parent.phone.trim();
        const pEmail = dto.parent.email ? dto.parent.email.toLowerCase().trim() : null;

        let parentUser = null;
        if (pEmail) {
          parentUser = await tx.user.findUnique({ where: { email: pEmail } });
        }
        if (!parentUser && pPhone) {
          parentUser = await tx.user.findUnique({ where: { phone: pPhone } });
        }

        if (!parentUser) {
          parentUser = await tx.user.create({
            data: {
              fullName: dto.parent.fullName.trim(),
              email: pEmail,
              phone: pPhone,
              passwordHash,
              isActive: true,
            },
          });
        }

        // Parent profile
        let parentProfile = await tx.parentProfile.findFirst({
          where: { schoolId, userId: parentUser.id },
        });
        if (!parentProfile) {
          parentProfile = await tx.parentProfile.create({
            data: {
              schoolId,
              userId: parentUser.id,
            },
          });
        }

        // Parent membership
        const parentMembership = await tx.schoolMembership.findUnique({
          where: { schoolId_userId: { schoolId, userId: parentUser.id } },
        });
        if (!parentMembership) {
          // Increment parent sequence
          await tx.tenantSequence.update({
            where: { schoolId_entityType: { schoolId, entityType: 'PARENT' } },
            data: { currentValue: { increment: 1 } },
          });
          const parentReadableId = `${school.code}-PAR-${paddedNumber}`;
          await tx.schoolMembership.create({
            data: {
              schoolId,
              userId: parentUser.id,
              readableId: parentReadableId,
              status: 'ACTIVE',
            },
          });
        }

        // Assign PARENT role
        const parentRole = await tx.role.findFirst({ where: { name: 'PARENT' } });
        if (parentRole) {
          const existingRole = await tx.userRole.findFirst({
            where: { userId: parentUser.id, roleId: parentRole.id, schoolId },
          });
          if (!existingRole) {
            await tx.userRole.create({
              data: {
                userId: parentUser.id,
                roleId: parentRole.id,
                schoolId,
              },
            });
          }
        }

        // Link parent to student
        await tx.studentParentMapping.create({
          data: {
            schoolId,
            studentId: studentProfile.id,
            parentId: parentProfile.id,
            relationType: dto.parent.relationType,
            isPrimaryContact: dto.parent.isPrimaryContact ?? true,
            canPickup: dto.parent.canPickup ?? true,
          },
        });
      }

      return studentProfile;
    });

    return this.getStudentById(schoolId, createdStudent.id);
  }

  /**
   * Search and filter students with pagination and tenant scoping
   */
  async searchStudents(
    schoolId: string,
    query: StudentSearchQueryDTO
  ): Promise<{ students: StudentDetailDTO[]; total: number; page: number; limit: number }> {
    const page = query.page || 1;
    const limit = query.limit || 20;
    const skip = (page - 1) * limit;

    const where: any = {
      schoolId,
      deletedAt: null,
    };

    if (query.sectionId) {
      where.sectionId = query.sectionId;
    }

    if (query.classId) {
      where.section = { classId: query.classId };
    }

    if (query.status === 'ACTIVE') {
      where.user = { isActive: true };
    } else if (query.status === 'INACTIVE') {
      where.user = { isActive: false };
    }

    if (query.query) {
      const q = query.query.trim();
      where.OR = [
        { admissionNumber: { contains: q, mode: 'insensitive' } },
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
        { user: { memberships: { some: { schoolId, readableId: { contains: q, mode: 'insensitive' } } } } },
      ];
    }

    const [total, profiles] = await Promise.all([
      this.prisma.studentProfile.count({ where }),
      this.prisma.studentProfile.findMany({
        where,
        skip,
        take: limit,
        include: {
          user: {
            include: {
              memberships: { where: { schoolId } },
            },
          },
          section: {
            include: { class: true },
          },
          parentMappings: {
            include: {
              parent: {
                include: { user: true },
              },
            },
          },
        },
        orderBy: [{ section: { class: { numericOrder: 'asc' } } }, { rollNumber: 'asc' }],
      }),
    ]);

    const students = profiles.map((p) => this.mapToDetail(p, schoolId));
    return { students, total, page, limit };
  }

  /**
   * Get single student by ID with tenant verification
   */
  async getStudentById(schoolId: string, studentProfileId: string): Promise<StudentDetailDTO> {
    const profile = await this.prisma.studentProfile.findFirst({
      where: { id: studentProfileId, schoolId, deletedAt: null },
      include: {
        user: {
          include: {
            memberships: { where: { schoolId } },
          },
        },
        section: {
          include: { class: true },
        },
        parentMappings: {
          include: {
            parent: {
              include: { user: true },
            },
          },
        },
      },
    });

    if (!profile) {
      throw new StudentNotFoundError(studentProfileId);
    }

    return this.mapToDetail(profile, schoolId);
  }

  /**
   * Edit student profile details, assign class/section, roll number, contact
   */
  async updateStudent(
    schoolId: string,
    studentProfileId: string,
    dto: UpdateStudentDTO
  ): Promise<StudentDetailDTO> {
    const profile = await this.prisma.studentProfile.findFirst({
      where: { id: studentProfileId, schoolId, deletedAt: null },
    });
    if (!profile) throw new StudentNotFoundError(studentProfileId);

    // Verify section if updating
    if (dto.sectionId && dto.sectionId !== profile.sectionId) {
      const section = await this.prisma.section.findFirst({
        where: { id: dto.sectionId, schoolId },
      });
      if (!section) {
        throw new Error('Target section does not belong to this school');
      }
    }

    // Check admission number conflict if changed
    if (dto.admissionNumber && dto.admissionNumber !== profile.admissionNumber) {
      const conflict = await this.prisma.studentProfile.findUnique({
        where: { schoolId_admissionNumber: { schoolId, admissionNumber: dto.admissionNumber } },
      });
      if (conflict && conflict.id !== studentProfileId) {
        throw new DuplicateAdmissionNumberError(dto.admissionNumber);
      }
    }

    await this.prisma.$transaction(async (tx) => {
      // Update User fields if provided
      if (dto.fullName !== undefined || dto.email !== undefined || dto.phone !== undefined) {
        await tx.user.update({
          where: { id: profile.userId },
          data: {
            fullName: dto.fullName?.trim(),
            email: dto.email !== undefined ? (dto.email ? dto.email.toLowerCase().trim() : null) : undefined,
            phone: dto.phone !== undefined ? (dto.phone ? dto.phone.trim() : null) : undefined,
          },
        });
      }

      // Update StudentProfile fields
      await tx.studentProfile.update({
        where: { id: studentProfileId },
        data: {
          admissionNumber: dto.admissionNumber?.trim(),
          rollNumber: dto.rollNumber !== undefined ? dto.rollNumber : undefined,
          sectionId: dto.sectionId !== undefined ? dto.sectionId : undefined,
          dateOfBirth: dto.dateOfBirth ? new Date(dto.dateOfBirth) : undefined,
          gender: dto.gender,
          bloodGroup: dto.bloodGroup !== undefined ? dto.bloodGroup : undefined,
          emergencyContactPhone: dto.emergencyContactPhone?.trim(),
          address: dto.address !== undefined ? dto.address : undefined,
        },
      });
    });

    return this.getStudentById(schoolId, studentProfileId);
  }

  /**
   * Activate or deactivate student account
   */
  async updateStudentStatus(
    schoolId: string,
    studentProfileId: string,
    isActive: boolean
  ): Promise<StudentDetailDTO> {
    const profile = await this.prisma.studentProfile.findFirst({
      where: { id: studentProfileId, schoolId },
    });
    if (!profile) throw new StudentNotFoundError(studentProfileId);

    await this.prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: profile.userId },
        data: { isActive },
      });

      await tx.schoolMembership.updateMany({
        where: { schoolId, userId: profile.userId },
        data: { status: isActive ? 'ACTIVE' : 'SUSPENDED' },
      });
    });

    return this.getStudentById(schoolId, studentProfileId);
  }

  /**
   * Link parent/guardian to student
   */
  async linkParent(
    schoolId: string,
    studentProfileId: string,
    dto: {
      fullName: string;
      phone: string;
      email?: string;
      relationType: 'FATHER' | 'MOTHER' | 'LEGAL_GUARDIAN' | 'OTHER';
      isPrimaryContact?: boolean;
      canPickup?: boolean;
    }
  ): Promise<StudentDetailDTO> {
    const student = await this.prisma.studentProfile.findFirst({
      where: { id: studentProfileId, schoolId },
    });
    if (!student) throw new StudentNotFoundError(studentProfileId);

    const school = await this.prisma.school.findUnique({ where: { id: schoolId } });
    if (!school) throw new Error('School not found');

    const pPhone = dto.phone.trim();
    const pEmail = dto.email ? dto.email.toLowerCase().trim() : null;

    await this.prisma.$transaction(async (tx) => {
      let parentUser = null;
      if (pEmail) {
        parentUser = await tx.user.findUnique({ where: { email: pEmail } });
      }
      if (!parentUser && pPhone) {
        parentUser = await tx.user.findUnique({ where: { phone: pPhone } });
      }

      if (!parentUser) {
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash('Parent@2026', salt);
        parentUser = await tx.user.create({
          data: {
            fullName: dto.fullName.trim(),
            email: pEmail,
            phone: pPhone,
            passwordHash,
            isActive: true,
          },
        });
      }

      let parentProfile = await tx.parentProfile.findFirst({
        where: { schoolId, userId: parentUser.id },
      });
      if (!parentProfile) {
        parentProfile = await tx.parentProfile.create({
          data: { schoolId, userId: parentUser.id },
        });
      }

      const existingMapping = await tx.studentParentMapping.findUnique({
        where: { studentId_parentId: { studentId: student.id, parentId: parentProfile.id } },
      });

      if (!existingMapping) {
        await tx.studentParentMapping.create({
          data: {
            schoolId,
            studentId: student.id,
            parentId: parentProfile.id,
            relationType: dto.relationType,
            isPrimaryContact: dto.isPrimaryContact ?? false,
            canPickup: dto.canPickup ?? true,
          },
        });
      }
    });

    return this.getStudentById(schoolId, studentProfileId);
  }

  /**
   * Validated Batch Student Import (from parsed Excel/CSV)
   */
  async importStudents(
    schoolId: string,
    rows: StudentImportRowDTO[]
  ): Promise<StudentImportResultDTO> {
    const errors: Array<{ row: number; identifier: string; error: string }> = [];
    const createdStudents: StudentDetailDTO[] = [];

    // Pre-cache classes and sections for efficient batch resolution
    const existingClasses = await this.prisma.class.findMany({
      where: { schoolId },
      include: { sections: true },
    });

    const classMap = new Map<string, any>();
    for (const c of existingClasses) {
      classMap.set(c.name.toLowerCase().trim(), c);
    }

    let rowIndex = 0;
    for (const row of rows) {
      rowIndex++;
      try {
        // Resolve Class & Section
        const cKey = row.className.toLowerCase().trim();
        let targetClass = classMap.get(cKey);

        if (!targetClass) {
          // Auto-provision class if not found
          const numOrder = parseInt(row.className.replace(/\D/g, ''), 10) || 1;
          targetClass = await this.prisma.class.create({
            data: {
              schoolId,
              name: row.className.trim(),
              numericOrder: numOrder,
              stage: numOrder > 10 ? 'SENIOR_SECONDARY' : numOrder > 8 ? 'SECONDARY' : 'MIDDLE',
            },
            include: { sections: true },
          });
          classMap.set(cKey, targetClass);
        }

        const sKey = row.sectionName.toUpperCase().trim();
        let targetSection = targetClass.sections?.find(
          (s: any) => s.name.toUpperCase().trim() === sKey
        );

        if (!targetSection) {
          targetSection = await this.prisma.section.create({
            data: {
              schoolId,
              classId: targetClass.id,
              name: sKey,
            },
          });
          targetClass.sections = targetClass.sections || [];
          targetClass.sections.push(targetSection);
        }

        const student = await this.createStudent(schoolId, {
          fullName: row.fullName,
          admissionNumber: row.admissionNumber,
          rollNumber: row.rollNumber,
          dateOfBirth: row.dateOfBirth,
          gender: (['MALE', 'FEMALE', 'OTHER'].includes(row.gender?.toUpperCase())
            ? row.gender.toUpperCase()
            : 'OTHER') as any,
          emergencyContactPhone: row.emergencyContactPhone,
          sectionId: targetSection.id,
          parent:
            row.parentName && row.parentPhone
              ? {
                  fullName: row.parentName,
                  phone: row.parentPhone,
                  relationType: (row.parentRelation?.toUpperCase() || 'LEGAL_GUARDIAN') as any,
                }
              : undefined,
        });

        createdStudents.push(student);
      } catch (err: unknown) {
        errors.push({
          row: rowIndex,
          identifier: row.admissionNumber || row.fullName,
          error: err instanceof Error ? err.message : 'Unknown import error',
        });
      }
    }

    return {
      totalRows: rows.length,
      imported: createdStudents.length,
      failed: errors.length,
      errors,
      createdStudents,
    };
  }

  private mapToDetail(p: any, schoolId: string): StudentDetailDTO {
    const membership = p.user?.memberships?.find((m: any) => m.schoolId === schoolId);
    return {
      id: p.id,
      schoolId: p.schoolId,
      userId: p.userId,
      readableId: membership?.readableId || 'PENDING',
      admissionNumber: p.admissionNumber,
      rollNumber: p.rollNumber,
      fullName: p.user?.fullName || '',
      email: p.user?.email,
      phone: p.user?.phone,
      dateOfBirth: p.dateOfBirth instanceof Date ? p.dateOfBirth.toISOString().split('T')[0] : p.dateOfBirth,
      gender: p.gender,
      bloodGroup: p.bloodGroup,
      emergencyContactPhone: p.emergencyContactPhone,
      address: p.address,
      isActive: p.user?.isActive ?? true,
      sectionId: p.sectionId,
      classId: p.section?.classId,
      className: p.section?.class?.name,
      sectionName: p.section?.name,
      parents: (p.parentMappings || []).map((m: any) => ({
        parentProfileId: m.parentId,
        parentUserId: m.parent?.userId,
        fullName: m.parent?.user?.fullName || '',
        phone: m.parent?.user?.phone,
        email: m.parent?.user?.email,
        relationType: m.relationType,
        isPrimaryContact: m.isPrimaryContact,
        canPickup: m.canPickup,
      })),
      createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : p.createdAt,
      updatedAt: p.updatedAt instanceof Date ? p.updatedAt.toISOString() : p.updatedAt,
    };
  }
}

