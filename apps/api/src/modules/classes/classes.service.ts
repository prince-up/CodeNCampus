import { PrismaClient } from '@codencampus/database';
import { ClassDTO, CreateClassDTO, CreateSectionDTO, SectionDTO } from '@codencampus/types';

export class ClassesService {
  constructor(private prisma: PrismaClient) {}

  async listClasses(schoolId: string): Promise<ClassDTO[]> {
    const classes = await this.prisma.class.findMany({
      where: { schoolId },
      include: {
        sections: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
      },
      orderBy: { numericOrder: 'asc' },
    });

    return classes.map((c: any) => ({
      id: c.id,
      schoolId: c.schoolId,
      name: c.name,
      numericOrder: c.numericOrder,
      stage: c.stage,
      sections: c.sections.map((s: any) => ({
        id: s.id,
        schoolId: s.schoolId,
        classId: s.classId,
        className: c.name,
        name: s.name,
        roomNumber: s.roomNumber,
        capacity: s.capacity,
        studentCount: s._count?.students || 0,
      })),
    }));
  }

  async createClass(schoolId: string, dto: CreateClassDTO): Promise<ClassDTO> {
    const existing = await this.prisma.class.findFirst({
      where: { schoolId, name: dto.name.trim() },
    });
    if (existing) {
      throw new Error(`Class '${dto.name}' already exists in this institution.`);
    }

    const createdClass = await this.prisma.$transaction(async (tx) => {
      const cls = await tx.class.create({
        data: {
          schoolId,
          name: dto.name.trim(),
          numericOrder: dto.numericOrder,
          stage: dto.stage,
        },
      });

      const sectionNames = dto.sectionNames?.length ? dto.sectionNames : ['A'];
      for (const sName of sectionNames) {
        await tx.section.create({
          data: {
            schoolId,
            classId: cls.id,
            name: sName.toUpperCase().trim(),
          },
        });
      }

      return cls;
    });

    return this.getClassById(schoolId, createdClass.id);
  }

  async createSection(schoolId: string, dto: CreateSectionDTO): Promise<SectionDTO> {
    const parentClass = await this.prisma.class.findFirst({
      where: { id: dto.classId, schoolId },
    });
    if (!parentClass) {
      throw new Error('Class not found in this school');
    }

    const sectionName = dto.name.toUpperCase().trim();
    const existing = await this.prisma.section.findFirst({
      where: { classId: dto.classId, name: sectionName },
    });
    if (existing) {
      throw new Error(`Section '${sectionName}' already exists in ${parentClass.name}`);
    }

    const created = await this.prisma.section.create({
      data: {
        schoolId,
        classId: dto.classId,
        name: sectionName,
        roomNumber: dto.roomNumber || null,
        capacity: dto.capacity || 45,
      },
    });

    return {
      id: created.id,
      schoolId: created.schoolId,
      classId: created.classId,
      className: parentClass.name,
      name: created.name,
      roomNumber: created.roomNumber,
      capacity: created.capacity,
      studentCount: 0,
    };
  }

  async getClassById(schoolId: string, classId: string): Promise<ClassDTO> {
    const cls = await this.prisma.class.findFirst({
      where: { id: classId, schoolId },
      include: {
        sections: {
          include: {
            _count: {
              select: { students: true },
            },
          },
        },
      },
    });

    if (!cls) {
      throw new Error('Class not found');
    }

    return {
      id: cls.id,
      schoolId: cls.schoolId,
      name: cls.name,
      numericOrder: cls.numericOrder,
      stage: cls.stage,
      sections: cls.sections.map((s: any) => ({
        id: s.id,
        schoolId: s.schoolId,
        classId: s.classId,
        className: cls.name,
        name: s.name,
        roomNumber: s.roomNumber,
        capacity: s.capacity,
        studentCount: s._count?.students || 0,
      })),
    };
  }
}

