// CodeNCampus — Role & Permission Catalog

import { UserRole } from '@codencampus/types';

export interface PermissionDefinition {
  code: string;
  module: string;
  description: string;
}

export const PERMISSIONS = {
  // Super Admin & Multi-Tenant Management
  SCHOOLS_MANAGE: 'schools.manage',
  SCHOOLS_CREATE: 'schools.create',
  SUBSCRIPTIONS_MANAGE: 'subscriptions.manage',

  // School & Tenant Management
  SCHOOL_CONFIG_VIEW: 'school.config.view',
  SCHOOL_CONFIG_UPDATE: 'school.config.update',

  // User Management
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_MANAGE: 'users.manage', // Activate / deactivate / suspend

  // Student Profiles
  STUDENTS_VIEW: 'students.view',
  STUDENTS_CREATE: 'students.create',
  STUDENTS_UPDATE: 'students.update',
  STUDENTS_DELETE: 'students.delete',

  // Attendance
  ATTENDANCE_MARK: 'attendance.mark',
  ATTENDANCE_VIEW_CLASS: 'attendance.view.class',
  ATTENDANCE_VIEW_SELF: 'attendance.view.self',

  // Exams & Marks
  MARKS_ENTRY: 'marks.entry',
  MARKS_PUBLISH: 'marks.publish',
  MARKS_VIEW_SELF: 'marks.view.self',

  // Fees
  FEES_STRUCTURE_MANAGE: 'fees.structure.manage',
  FEES_COLLECT: 'fees.collect',
  FEES_WAIVE: 'fees.waive',
  FEES_VIEW_SELF: 'fees.view.self',
} as const;

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  SUPER_ADMIN: Object.values(PERMISSIONS),

  SCHOOL_ADMIN: [
    PERMISSIONS.SCHOOL_CONFIG_VIEW,
    PERMISSIONS.SCHOOL_CONFIG_UPDATE,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_MANAGE,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.STUDENTS_CREATE,
    PERMISSIONS.STUDENTS_UPDATE,
    PERMISSIONS.STUDENTS_DELETE,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_VIEW_CLASS,
    PERMISSIONS.MARKS_PUBLISH,
    PERMISSIONS.FEES_STRUCTURE_MANAGE,
    PERMISSIONS.FEES_COLLECT,
    PERMISSIONS.FEES_WAIVE,
  ],

  PRINCIPAL: [
    PERMISSIONS.SCHOOL_CONFIG_VIEW,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW_CLASS,
    PERMISSIONS.MARKS_PUBLISH,
    PERMISSIONS.FEES_WAIVE,
  ],

  TEACHER: [
    PERMISSIONS.SCHOOL_CONFIG_VIEW,
    PERMISSIONS.STUDENTS_VIEW,
    PERMISSIONS.ATTENDANCE_MARK,
    PERMISSIONS.ATTENDANCE_VIEW_CLASS,
    PERMISSIONS.MARKS_ENTRY,
  ],

  PARENT: [
    PERMISSIONS.ATTENDANCE_VIEW_SELF,
    PERMISSIONS.MARKS_VIEW_SELF,
    PERMISSIONS.FEES_VIEW_SELF,
  ],

  STUDENT: [
    PERMISSIONS.ATTENDANCE_VIEW_SELF,
    PERMISSIONS.MARKS_VIEW_SELF,
  ],

  STAFF: [
    PERMISSIONS.SCHOOL_CONFIG_VIEW,
  ],
};

