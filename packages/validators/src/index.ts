import { z } from 'zod';

// Environment Validation Schemas
export const apiEnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'staging', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string(),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().min(16),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  CORS_ORIGIN: z.string().default('*'),
});

export type ApiEnv = z.infer<typeof apiEnvSchema>;

// Tenant & Authentication Headers Schema
export const tenantHeadersSchema = z.object({
  'x-school-id': z.string().uuid({ message: 'x-school-id header must be a valid UUID' }).optional(),
  'x-active-role': z.string().optional(),
});

// User Role Enum Schema
export const userRoleSchema = z.enum([
  'SUPER_ADMIN',
  'SCHOOL_ADMIN',
  'PRINCIPAL',
  'TEACHER',
  'PARENT',
  'STUDENT',
  'STAFF',
]);

// Auth Request Schemas
export const loginRequestSchema = z.object({
  identifier: z.string().min(3, 'Email, phone number, or School ID is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  schoolId: z.string().uuid().optional(),
});

export const switchRoleSchema = z.object({
  targetRole: userRoleSchema,
  targetSchoolId: z.string().uuid().optional(),
});

export const passwordResetRequestSchema = z.object({
  identifier: z.string().min(3, 'Email, phone, or School ID is required'),
});

export const passwordResetConfirmSchema = z.object({
  token: z.string().min(16, 'Valid password reset token is required'),
  newPassword: z.string().min(6, 'New password must be at least 6 characters'),
});

export const createUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone must have at least 10 digits').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  fullName: z.string().min(2, 'Full name is required'),
  roles: z.array(userRoleSchema).min(1, 'At least one role is required'),
  schoolId: z.string().uuid('Valid school ID is required'),
}).refine((data) => data.email || data.phone, {
  message: 'Either email or phone must be provided',
  path: ['email'],
});

export const updateUserStatusSchema = z.object({
  isActive: z.boolean(),
});

export const updateMembershipStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export const linkParentStudentSchema = z.object({
  studentProfileId: z.string().uuid('Valid student profile ID is required'),
  parentProfileId: z.string().uuid('Valid parent profile ID is required'),
  relationType: z.enum(['FATHER', 'MOTHER', 'LEGAL_GUARDIAN', 'OTHER']),
  isPrimaryContact: z.boolean().default(false),
  canPickup: z.boolean().default(true),
});

// Attendance Validation Schema
export const markAttendanceEntrySchema = z.object({
  studentId: z.string().uuid(),
  status: z.enum(['PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'LEAVE']),
  remarks: z.string().max(255).optional(),
});

export const markAttendanceBatchSchema = z.object({
  sectionId: z.string().uuid(),
  academicYearId: z.string().uuid(),
  attendanceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  entries: z.array(markAttendanceEntrySchema).min(1),
});

// Human-Readable ID format verification
export const readableIdSchema = z.string().regex(/^[A-Z0-9]+-[A-Z]{3}-\d{5}$/, {
  message: 'Readable ID must follow format [CODE]-[ROLE]-[00000] (e.g. DPS-STU-00042)',
});

// Hex Color Code Validator
export const hexColorSchema = z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, {
  message: 'Color must be a valid hex code (e.g. #1E40AF)',
});

// Educational Board Schema
export const educationalBoardSchema = z.enum(['CBSE', 'ICSE', 'STATE_BOARD', 'IB', 'OTHER']);

// School Onboarding & Management Schemas
export const createSchoolSchema = z.object({
  name: z.string().min(3, 'School name must be at least 3 characters').max(255),
  code: z
    .string()
    .min(2, 'Code must be at least 2 characters')
    .max(20)
    .regex(/^[A-Z0-9_-]+$/, 'School code must be alphanumeric in uppercase (e.g. DPSRKP)'),
  boardType: educationalBoardSchema,
  subdomain: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/, 'Subdomain must contain only lowercase letters, numbers, and hyphens'),
  customDomain: z.string().max(255).optional(),
  affiliationNumber: z.string().max(100).optional(),
  contactEmail: z.string().email('Invalid contact email'),
  contactPhone: z.string().min(7, 'Invalid contact phone').max(25),
  appName: z.string().max(100).optional(),
  branding: z
    .object({
      logoUrl: z.string().url('Invalid logo URL').optional(),
      primaryColor: hexColorSchema.optional(),
      secondaryColor: hexColorSchema.optional(),
      accentColor: hexColorSchema.optional(),
    })
    .optional(),
  subscriptionPlan: z.enum(['STANDARD', 'PREMIUM', 'ENTERPRISE']).default('STANDARD'),
  adminUser: z
    .object({
      email: z.string().email().optional(),
      phone: z.string().min(10).optional(),
      fullName: z.string().min(2),
      password: z.string().min(6).optional(),
    })
    .optional(),
});

export const updateSchoolSchema = z.object({
  name: z.string().min(3).max(255).optional(),
  boardType: educationalBoardSchema.optional(),
  affiliationNumber: z.string().max(100).optional(),
  subdomain: z
    .string()
    .min(2)
    .max(50)
    .regex(/^[a-z0-9-]+$/)
    .optional(),
  customDomain: z.string().max(255).nullable().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().min(7).max(25).optional(),
  appName: z.string().max(100).optional(),
});

export const updateSchoolBrandingSchema = z.object({
  appName: z.string().max(100).optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: hexColorSchema.optional(),
  secondaryColor: hexColorSchema.optional(),
  accentColor: hexColorSchema.optional(),
});

export const updateSchoolStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'SUSPENDED']),
});

export const updateSubscriptionSchema = z.object({
  plan: z.enum(['STANDARD', 'PREMIUM', 'ENTERPRISE']),
  status: z.enum(['ACTIVE', 'SUSPENDED', 'EXPIRED']),
  expiresAt: z.string().datetime().nullable().optional(),
});

// Class & Section Management Schemas
export const createClassSchema = z.object({
  name: z.string().min(1, 'Class name is required').max(50),
  numericOrder: z.number().int().min(0).max(20),
  stage: z.enum(['PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY']),
  sectionNames: z.array(z.string().min(1).max(10)).optional(),
});

export const createSectionSchema = z.object({
  classId: z.string().uuid('Valid class UUID is required'),
  name: z.string().min(1, 'Section name is required').max(10),
  roomNumber: z.string().max(50).optional(),
  capacity: z.number().int().positive().optional(),
});

// Student Management Schemas
export const studentGenderSchema = z.enum(['MALE', 'FEMALE', 'OTHER']);
export const bloodGroupSchema = z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']);

export const createStudentSchema = z.object({
  fullName: z.string().min(2, 'Student full name is required').max(255),
  email: z.string().email('Invalid email address').optional(),
  phone: z.string().min(10, 'Phone must have at least 10 digits').optional(),
  password: z.string().min(6).optional(),
  admissionNumber: z.string().max(100).optional(),
  rollNumber: z.number().int().positive().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date of birth must be YYYY-MM-DD'),
  gender: studentGenderSchema,
  bloodGroup: bloodGroupSchema.optional(),
  emergencyContactPhone: z.string().min(7, 'Emergency contact phone is required').max(25),
  address: z.any().optional(),
  sectionId: z.string().min(1).optional(),
  parent: z
    .object({
      fullName: z.string().min(2, 'Parent name is required'),
      phone: z.string().min(10, 'Parent phone is required'),
      email: z.string().email().optional(),
      relationType: z.enum(['FATHER', 'MOTHER', 'LEGAL_GUARDIAN', 'OTHER']),
      isPrimaryContact: z.boolean().default(true),
      canPickup: z.boolean().default(true),
    })
    .optional(),
});

export const updateStudentSchema = z.object({
  fullName: z.string().min(2).max(255).optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().min(10).nullable().optional(),
  admissionNumber: z.string().max(100).optional(),
  rollNumber: z.number().int().positive().nullable().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: studentGenderSchema.optional(),
  bloodGroup: bloodGroupSchema.nullable().optional(),
  emergencyContactPhone: z.string().min(7).max(25).optional(),
  address: z.any().optional(),
  sectionId: z.string().min(1).nullable().optional(),
});

export const studentSearchQuerySchema = z.object({
  query: z.string().optional(),
  classId: z.string().uuid().optional(),
  sectionId: z.string().uuid().optional(),
  status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const studentImportRowSchema = z.object({
  fullName: z.string().min(2),
  admissionNumber: z.string().optional(),
  className: z.string().min(1),
  sectionName: z.string().min(1),
  rollNumber: z.coerce.number().int().positive().optional(),
  dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gender: z.string(),
  emergencyContactPhone: z.string().min(7),
  parentName: z.string().optional(),
  parentPhone: z.string().optional(),
  parentRelation: z.string().optional(),
});

export const studentBatchImportSchema = z.object({
  rows: z.array(studentImportRowSchema).min(1, 'At least one student row is required'),
});


