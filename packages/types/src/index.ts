// CodeNCampus — Shared Domain Types & DTOs

export type EducationalBoard = 'CBSE' | 'ICSE' | 'STATE_BOARD' | 'IB' | 'OTHER';

export type UserRole =
  | 'SUPER_ADMIN'
  | 'SCHOOL_ADMIN'
  | 'PRINCIPAL'
  | 'TEACHER'
  | 'PARENT'
  | 'STUDENT'
  | 'STAFF';

export type AccountStatus = 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'INACTIVE';

export interface SchoolBranding {
  appName?: string;
  logoUrl?: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  faviconUrl?: string;
}

export interface PublicSchoolBrandingDTO {
  schoolCode: string;
  name: string;
  shortName: string;
  appName: string;
  subdomain: string;
  customDomain?: string | null;
  branding: SchoolBranding;
}

export interface CreateSchoolDTO {
  name: string;
  code: string;
  boardType: EducationalBoard;
  subdomain: string;
  customDomain?: string;
  affiliationNumber?: string;
  contactEmail: string;
  contactPhone: string;
  appName?: string;
  branding?: {
    logoUrl?: string;
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
  subscriptionPlan?: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  adminUser?: {
    email?: string;
    phone?: string;
    fullName: string;
    password?: string;
  };
}

export interface UpdateSchoolDTO {
  name?: string;
  boardType?: EducationalBoard;
  affiliationNumber?: string;
  subdomain?: string;
  customDomain?: string | null;
  contactEmail?: string;
  contactPhone?: string;
  appName?: string;
}

export interface UpdateSchoolBrandingDTO {
  appName?: string;
  logoUrl?: string | null;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export interface UpdateSchoolStatusDTO {
  status: 'ACTIVE' | 'SUSPENDED';
}

export interface UpdateSubscriptionDTO {
  plan: 'STANDARD' | 'PREMIUM' | 'ENTERPRISE';
  status: 'ACTIVE' | 'SUSPENDED' | 'EXPIRED';
  expiresAt?: string | null;
}

export interface SchoolDetailDTO extends SchoolSummaryDTO {
  organizationId?: string | null;
  affiliationNumber?: string | null;
  contactEmail: string;
  contactPhone: string;
  appName?: string | null;
  subscriptionPlan: string;
  subscriptionStatus: string;
  subscriptionExpiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SchoolSummaryDTO {
  id: string;
  name: string;
  code: string;
  boardType: EducationalBoard;
  subdomain: string;
  customDomain?: string | null;
  branding: SchoolBranding;
  status: AccountStatus;
}

export interface UserSummaryDTO {
  id: string; // Internal UUID
  email?: string | null;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

export interface SchoolMembershipDTO {
  schoolId: string;
  schoolName: string;
  schoolCode: string;
  readableId: string; // e.g. DPS-STU-00001
  status: AccountStatus;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthTokenPayload {
  sub: string; // User UUID
  email?: string | null;
  phone?: string | null;
  schoolId: string;
  role: UserRole;
  permissions: string[];
  readableId?: string;
  iat?: number;
  exp?: number;
}

export interface LinkedStudentDTO {
  studentProfileId: string;
  studentUserId: string;
  studentName: string;
  readableId: string;
  admissionNumber: string;
  relationType: string;
  isPrimaryContact: boolean;
  canPickup: boolean;
  schoolId: string;
}

export interface AuthSessionDTO {
  accessToken: string;
  user: UserSummaryDTO;
  activeSchoolId: string;
  activeSchoolName: string;
  activeRole: UserRole;
  readableId: string;
  permissions: string[];
  availableSchools: Array<{
    id: string;
    name: string;
    code: string;
    roles: UserRole[];
  }>;
  availableRoles: UserRole[];
  linkedStudents?: LinkedStudentDTO[];
}

export interface SwitchRoleDTO {
  targetRole: UserRole;
  targetSchoolId?: string;
}

export interface PasswordResetRequestDTO {
  identifier: string; // email, phone, or readableId
}

export interface PasswordResetConfirmDTO {
  token: string;
  newPassword: string;
}

export interface CreateUserDTO {
  email?: string;
  phone?: string;
  password?: string;
  fullName: string;
  schoolId: string;
  roles: UserRole[];
  readableId?: string;
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'LEAVE';

export interface AttendanceRecordDTO {
  id: string;
  schoolId: string;
  studentId: string;
  sectionId: string;
  attendanceDate: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string | null;
  recordedBy: string;
}

export type InvoiceStatus = 'PENDING' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface FeeInvoiceSummaryDTO {
  id: string;
  schoolId: string;
  invoiceNumber: string; // e.g. DPS-INV-2026-00042
  studentId: string;
  dueDate: string;
  grossAmount: number;
  discountAmount: number;
  netPayable: number;
  paidAmount: number;
  status: InvoiceStatus;
}

export interface SectionDTO {
  id: string;
  schoolId: string;
  classId: string;
  className?: string;
  name: string;
  roomNumber?: string | null;
  capacity?: number | null;
  studentCount?: number;
}

export interface ClassDTO {
  id: string;
  schoolId: string;
  name: string;
  numericOrder: number;
  stage: string;
  sections: SectionDTO[];
}

export interface CreateClassDTO {
  name: string;
  numericOrder: number;
  stage: 'PRIMARY' | 'MIDDLE' | 'SECONDARY' | 'SENIOR_SECONDARY';
  sectionNames?: string[];
}

export interface CreateSectionDTO {
  classId: string;
  name: string;
  roomNumber?: string;
  capacity?: number;
}

export interface StudentParentInfoDTO {
  parentProfileId: string;
  parentUserId: string;
  fullName: string;
  phone?: string | null;
  email?: string | null;
  relationType: string;
  isPrimaryContact: boolean;
  canPickup: boolean;
}

export interface StudentDetailDTO {
  id: string; // studentProfileId
  schoolId: string;
  userId: string;
  readableId: string;
  admissionNumber: string;
  rollNumber?: number | null;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth: string;
  gender: string;
  bloodGroup?: string | null;
  emergencyContactPhone: string;
  address?: any;
  isActive: boolean;
  sectionId?: string | null;
  classId?: string | null;
  className?: string | null;
  sectionName?: string | null;
  parents: StudentParentInfoDTO[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentDTO {
  fullName: string;
  email?: string;
  phone?: string;
  password?: string;
  admissionNumber?: string;
  rollNumber?: number;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  bloodGroup?: string;
  emergencyContactPhone: string;
  address?: any;
  sectionId?: string;
  parent?: {
    fullName: string;
    phone: string;
    email?: string;
    relationType: 'FATHER' | 'MOTHER' | 'LEGAL_GUARDIAN' | 'OTHER';
    isPrimaryContact?: boolean;
    canPickup?: boolean;
  };
}

export interface UpdateStudentDTO {
  fullName?: string;
  email?: string | null;
  phone?: string | null;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string | null;
  emergencyContactPhone?: string;
  address?: any;
  sectionId?: string | null;
  rollNumber?: number | null;
  admissionNumber?: string;
}

export interface StudentSearchQueryDTO {
  query?: string;
  classId?: string;
  sectionId?: string;
  status?: 'ACTIVE' | 'INACTIVE';
  page?: number;
  limit?: number;
}

export interface StudentImportRowDTO {
  fullName: string;
  admissionNumber?: string;
  className: string;
  sectionName: string;
  rollNumber?: number;
  dateOfBirth: string;
  gender: string;
  emergencyContactPhone: string;
  parentName?: string;
  parentPhone?: string;
  parentRelation?: string;
}

export interface StudentImportResultDTO {
  totalRows: number;
  imported: number;
  failed: number;
  errors: Array<{ row: number; identifier: string; error: string }>;
  createdStudents: StudentDetailDTO[];
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  statusCode: number;
  error: string;
  message: string;
  timestamp: string;
  issues?: unknown[];
}
