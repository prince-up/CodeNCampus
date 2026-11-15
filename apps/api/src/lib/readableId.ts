import { PrismaClient } from '@codencampus/database';
import { UserRole } from '@codencampus/types';

const ROLE_ABBREVIATIONS: Record<UserRole, string> = {
  STUDENT: 'STU',
  TEACHER: 'TCH',
  PARENT: 'PAR',
  SCHOOL_ADMIN: 'ADM',
  PRINCIPAL: 'PRN',
  STAFF: 'STF',
  SUPER_ADMIN: 'SAD',
};

export async function generateReadableId(
  prisma: PrismaClient,
  schoolId: string,
  role: UserRole
): Promise<string> {
  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    select: { code: true },
  });

  if (!school) {
    throw new Error(`School with ID ${schoolId} not found`);
  }

  const roleAbbr = ROLE_ABBREVIATIONS[role] || 'USR';
  const entityType = role;

  // Atomic upsert with increment on tenant_sequences
  const seq = await prisma.tenantSequence.upsert({
    where: {
      schoolId_entityType: {
        schoolId,
        entityType,
      },
    },
    update: {
      currentValue: {
        increment: 1,
      },
    },
    create: {
      schoolId,
      entityType,
      currentValue: 1,
    },
    select: {
      currentValue: true,
    },
  });

  const paddedNum = String(seq.currentValue).padStart(5, '0');
  return `${school.code}-${roleAbbr}-${paddedNum}`;
}

