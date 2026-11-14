// CodeNCampus — Shared Domain Types & DTOs

export type EducationalBoard = "CBSE" | "ICSE" | "STATE_BOARD" | "IB" | "OTHER";

export type UserRole =
  | "SUPER_ADMIN"
  | "SCHOOL_ADMIN"
  | "PRINCIPAL"
  | "TEACHER"
  | "PARENT"
  | "STUDENT"
  | "STAFF";

export type AccountStatus = "ACTIVE" | "SUSPENDED" | "PENDING" | "INACTIVE";

export interface SchoolBranding {
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  faviconUrl?: string;
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
  id: string; // Supabase UUID
  email?: string | null;
  phone?: string | null;
  fullName: string;
  avatarUrl?: string | null;
  isActive: boolean;
}

export interface SchoolMembershipDTO {
  schoolId: string;
  schoolName: string;
  readableId: string; // e.g. DPS-STU-00001
  status: AccountStatus;
  roles: UserRole[];
  permissions: string[];
}

export interface AuthBootstrapDTO {
  user: UserSummaryDTO;
  activeSchoolId: string;
  activeRole: UserRole;
  memberships: SchoolMembershipDTO[];
}

export type AttendanceStatus =
  "PRESENT" | "ABSENT" | "HALF_DAY" | "LATE" | "LEAVE";

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

export type InvoiceStatus =
  "PENDING" | "PARTIALLY_PAID" | "PAID" | "OVERDUE" | "CANCELLED";

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
