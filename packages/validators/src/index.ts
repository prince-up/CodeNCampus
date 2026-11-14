import { z } from "zod";

// Environment Validation Schemas
export const apiEnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "staging", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default("0.0.0.0"),
  DATABASE_URL: z.string().url(),
  SUPABASE_JWT_SECRET: z.string().min(16),
  REDIS_URL: z.string().default("redis://127.0.0.1:6379"),
  CORS_ORIGIN: z.string().default("*"),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

// Tenant & Authentication Headers Schema
export const tenantHeadersSchema = z.object({
  "x-school-id": z
    .string()
    .uuid({ message: "x-school-id header must be a valid UUID" }),
  "x-active-role": z.string().optional(),
});

// Auth DTO Schemas
export const loginRequestSchema = z.object({
  identifier: z.string().min(3, "Email or phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Attendance Validation Schema
export const markAttendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(["PRESENT", "ABSENT", "HALF_DAY", "LATE", "LEAVE"]),
  remarks: z.string().max(255).optional(),
});

export const markAttendanceBatchSchema = z.object({
  sectionId: z.string().uuid(),
  academicYearId: z.string().uuid(),
  attendanceDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  entries: z.array(markAttendanceEntrySchema).min(1),
});

// Human-Readable ID format verification
export const readableIdSchema = z.string().regex(/^[A-Z0-9]+-[A-Z]{3}-\d{5}$/, {
  message:
    "Readable ID must follow format [CODE]-[ROLE]-[00000] (e.g. DPS-STU-00042)",
});
