import { PrismaClient } from "@prisma/client";

export * from "@prisma/client";

export type TenantPrismaClient = ReturnType<typeof createTenantPrismaClient>;

const TENANT_SCOPED_MODELS = new Set([
  "TenantSequence",
  "SchoolMembership",
  "Role",
  "UserRole",
  "AcademicYear",
  "Class",
  "Section",
  "AttendanceRecord",
  "StudentProfile",
  "ParentProfile",
  "StaffProfile",
  "StudentParentMapping",
]);

/**
 * Creates a tenant-scoped Prisma Client extension that automatically scopes
 * all queries to the designated schoolId.
 */
export function createTenantPrismaClient(
  schoolId: string,
  basePrisma?: PrismaClient,
) {
  const prisma = basePrisma ?? new PrismaClient();

  return prisma.$extends({
    name: "tenant-scoping",
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if (model === "School") {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              id: schoolId,
            };
          } else if (TENANT_SCOPED_MODELS.has(model)) {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              schoolId,
            };
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if (model === "School") {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              id: schoolId,
            };
          } else if (TENANT_SCOPED_MODELS.has(model)) {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              schoolId,
            };
          }
          return query(args);
        },
        async create({ model, args, query }) {
          if (TENANT_SCOPED_MODELS.has(model)) {
            (args as Record<string, unknown>).data = {
              ...((args as Record<string, unknown>).data as object),
              schoolId,
            };
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if (model === "School") {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              id: schoolId,
            };
          } else if (TENANT_SCOPED_MODELS.has(model)) {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              schoolId,
            };
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if (model === "School") {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              id: schoolId,
            };
          } else if (TENANT_SCOPED_MODELS.has(model)) {
            (args as Record<string, unknown>).where = {
              ...((args as Record<string, unknown>).where as object),
              schoolId,
            };
          }
          return query(args);
        },
      },
    },
  });
}
