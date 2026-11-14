# CodeNCampus — Database Design & Schema Specification

**Document Version:** 1.0.0  
**Status:** Under Architectural Review  
**Author:** Database Architect & Principal Engineer  
**Owner:** Codazk Technologies Private Limited

---

## 1. Database Architectural Principles

1. **UUIDv4 as Immutable Primary Keys:** All persistent entities use cryptographically secure UUIDs (`uuid_generate_v4()` or `gen_random_uuid()`) for primary keys. Never expose autoincrement integer IDs externally.
2. **Server-Generated Human-Readable IDs:** For everyday school communications and badges, generate deterministic, school-scoped human-readable identifiers (e.g., `DPS-STU-00001`, `DPS-TCH-00001`, `DPS-INV-2026-00123`) backed by atomic tenant sequence tables.
3. **Mandatory Tenant Scoping (`school_id`):** Every tenant-bound table MUST contain a non-nullable `school_id UUID REFERENCES schools(id) ON DELETE CASCADE`.
4. **Composite Indexes for Multitenancy:** All primary queries are scoped to `school_id`. Every single-column index is superseded by composite indexes prefixed with `school_id` (e.g., `INDEX (school_id, roll_number)`, `INDEX (school_id, status)`).
5. **Soft Deletes vs. Hard Deletes:** Sensitive student, financial, and attendance records use soft deletes (`deleted_at TIMESTAMP WITH TIME ZONE NULL`) to preserve auditability and prevent accidental cascading loss.

---

## 2. Entity Relationship Overview

```mermaid
erDiagram
    ORGANIZATION ||--o{ SCHOOL : "owns branches"
    SCHOOL ||--o{ ACADEMIC_YEAR : "schedules"
    SCHOOL ||--o{ USER : "registers"
    SCHOOL ||--o{ CLASS : "contains"
    SCHOOL ||--o{ FEE_STRUCTURE : "defines"

    ACADEMIC_YEAR ||--o{ TERM : "divides into"
    CLASS ||--o{ SECTION : "splits into"
    SECTION ||--o{ STUDENT_ENROLLMENT : "enrolls"

    USER ||--o{ USER_ROLE : "assigned"
    ROLE ||--o{ USER_ROLE : "granted to"
    ROLE ||--o{ ROLE_PERMISSION : "holds"
    PERMISSION ||--o{ ROLE_PERMISSION : "maps"

    USER ||--o| STUDENT_PROFILE : "has"
    USER ||--o| STAFF_PROFILE : "has"
    USER ||--o| PARENT_PROFILE : "has"

    PARENT_PROFILE ||--o{ STUDENT_PARENT_MAPPING : "linked to"
    STUDENT_PROFILE ||--o{ STUDENT_PARENT_MAPPING : "belongs to"

    SECTION ||--o{ TIMETABLE_ENTRY : "schedules"
    STAFF_PROFILE ||--o{ TIMETABLE_ENTRY : "teaches"

    SECTION ||--o{ ATTENDANCE_RECORD : "records daily"
    STUDENT_PROFILE ||--o{ ATTENDANCE_RECORD : "evaluated in"

    ACADEMIC_YEAR ||--o{ EXAM : "holds"
    EXAM ||--o{ EXAM_MARK : "scores"
    STUDENT_PROFILE ||--o{ EXAM_MARK : "achieves"

    STUDENT_PROFILE ||--o{ FEE_INVOICE : "billed"
    FEE_INVOICE ||--o{ FEE_PAYMENT : "settled by"
    FEE_PAYMENT ||--o| FEE_RECEIPT : "generates"
```

---

## 3. Core Database Tables (PostgreSQL DDL / Prisma Model Schema)

### 3.1 Organization, School & Tenant Sequences

```sql
-- Root Educational Trust or Multi-Branch Enterprise
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Individual School Campus / Tenant Branch
CREATE TABLE schools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL, -- e.g. "DPSRKP"
    affiliation_number VARCHAR(100),   -- CBSE/ICSE Board Affiliation ID
    board_type VARCHAR(50) NOT NULL,   -- 'CBSE', 'ICSE', 'STATE_BOARD', 'IB'
    subdomain VARCHAR(100) UNIQUE NOT NULL, -- e.g. "dpsrkp.codencampus.com"
    custom_domain VARCHAR(255) UNIQUE,
    logo_url TEXT,
    primary_color VARCHAR(10) DEFAULT '#1E40AF',
    secondary_color VARCHAR(10) DEFAULT '#3B82F6',
    address JSONB,
    contact_email VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(50) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'SUSPENDED', 'TRIAL'
    subscription_plan VARCHAR(50) NOT NULL DEFAULT 'STANDARD',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Atomic sequence generator per tenant to prevent race conditions during human ID creation
CREATE TABLE tenant_sequences (
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- 'STUDENT', 'STAFF', 'PARENT', 'INVOICE'
    current_value BIGINT NOT NULL DEFAULT 0,
    PRIMARY KEY (school_id, entity_type)
);
```

### 3.2 Academic Structure

```sql
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,        -- '2026-2027'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_academic_year UNIQUE (school_id, name)
);

CREATE TABLE terms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,       -- 'Term 1', 'Quarter 1', 'Half-Yearly'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,        -- 'Class 10', 'Nursery', 'Grade 5'
    numeric_order INT NOT NULL,       -- For sorting (Nursery=-2, LKG=-1, UKG=0, Class 1=1)
    stage VARCHAR(50) NOT NULL,       -- 'PRE_PRIMARY', 'PRIMARY', 'MIDDLE', 'SECONDARY', 'SENIOR_SECONDARY'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_class_name UNIQUE (school_id, name)
);

CREATE TABLE sections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(10) NOT NULL,        -- 'A', 'B', 'Rose', 'Lotus'
    room_number VARCHAR(50),
    capacity INT DEFAULT 45,
    class_teacher_id UUID,            -- References staff_profiles(id)
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_class_section UNIQUE (class_id, name)
);
```

### 3.3 Identity, Access Control & User Profiles

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(), -- Matches Supabase Auth user.id
    email VARCHAR(255) UNIQUE,
    phone VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Maps users to schools with tenant-scoped readable IDs
CREATE TABLE school_memberships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    readable_id VARCHAR(100) NOT NULL, -- e.g. 'DPS-STU-00042'
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_user UNIQUE (school_id, user_id),
    CONSTRAINT uq_school_readable_id UNIQUE (school_id, readable_id)
);

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE, -- NULL indicates global system roles
    name VARCHAR(100) NOT NULL,       -- 'SUPER_ADMIN', 'SCHOOL_ADMIN', 'PRINCIPAL', 'TEACHER', 'PARENT', 'STUDENT'
    is_system_role BOOLEAN NOT NULL DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) UNIQUE NOT NULL, -- 'attendance.mark', 'marks.publish', 'fees.collect'
    module VARCHAR(100) NOT NULL,      -- 'ATTENDANCE', 'EXAMS', 'FEES'
    description TEXT
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, school_id, role_id)
);

-- Profiles
CREATE TABLE student_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    admission_number VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10),
    aadhaar_number_encrypted TEXT,    -- Stored encrypted per DPDP Act
    emergency_contact_phone VARCHAR(50) NOT NULL,
    address JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    CONSTRAINT uq_school_admission_number UNIQUE (school_id, admission_number)
);

CREATE TABLE student_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    roll_number INT,
    status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE', -- 'ACTIVE', 'PROMOTED', 'DETAINED', 'TRANSFERRED'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_year_enrollment UNIQUE (student_id, academic_year_id)
);

CREATE TABLE parent_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    occupation VARCHAR(100),
    annual_income NUMERIC(15,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE student_parent_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    parent_id UUID NOT NULL REFERENCES parent_profiles(id) ON DELETE CASCADE,
    relation_type VARCHAR(50) NOT NULL, -- 'FATHER', 'MOTHER', 'LEGAL_GUARDIAN'
    is_primary_contact BOOLEAN NOT NULL DEFAULT FALSE,
    can_pickup BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_parent_rel UNIQUE (student_id, parent_id)
);

CREATE TABLE staff_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_code VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    qualifications JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_employee_code UNIQUE (school_id, employee_code)
);
```

### 3.4 Attendance & Academics

```sql
CREATE TABLE attendance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- 'PRESENT', 'ABSENT', 'HALF_DAY', 'LATE', 'LEAVE'
    remarks TEXT,
    recorded_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_daily_attendance UNIQUE (student_id, attendance_date)
);

CREATE INDEX idx_attendance_school_date_section ON attendance_records (school_id, attendance_date, section_id);
```

### 3.5 Examinations & Grading

```sql
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    term_id UUID REFERENCES terms(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL, -- 'Half-Yearly Examination 2026'
    exam_type VARCHAR(50) NOT NULL, -- 'UNIT_TEST', 'TERM', 'PRACTICAL', 'ANNUAL'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE exam_marks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL,
    max_marks NUMERIC(5,2) NOT NULL,
    marks_obtained NUMERIC(5,2),
    is_absent BOOLEAN NOT NULL DEFAULT FALSE,
    grade VARCHAR(10),
    remarks TEXT,
    entered_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_student_exam_subject UNIQUE (exam_id, student_id, subject_id)
);

CREATE INDEX idx_exam_marks_school_student ON exam_marks (school_id, student_id);
```

### 3.6 Fee Management & Financial Transactions

```sql
CREATE TABLE fee_heads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL, -- 'Tuition Fee', 'Transport Fee', 'Computer Lab Fee'
    account_code VARCHAR(50),
    is_optional BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    total_amount NUMERIC(12,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE fee_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_number VARCHAR(100) NOT NULL, -- 'DPS-INV-2026-00049'
    student_id UUID NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    gross_amount NUMERIC(12,2) NOT NULL,
    discount_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_payable NUMERIC(12,2) NOT NULL,
    paid_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING', -- 'PENDING', 'PARTIALLY_PAID', 'PAID', 'OVERDUE'
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_school_invoice_num UNIQUE (school_id, invoice_number)
);

CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES fee_invoices(id) ON DELETE CASCADE,
    payment_reference VARCHAR(150) NOT NULL, -- PG Transaction ID or Cheque No
    payment_mode VARCHAR(50) NOT NULL,       -- 'ONLINE_UPI', 'NET_BANKING', 'CASH', 'CHEQUE', 'POS'
    amount_paid NUMERIC(12,2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    gateway_provider VARCHAR(50),            -- 'RAZORPAY', 'CASHFREE', 'MANUAL'
    status VARCHAR(50) NOT NULL DEFAULT 'SUCCESS',
    collected_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
```

### 3.7 Audit Logging System

```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,      -- 'FEE_PAYMENT_COLLECTED', 'MARKS_UPDATED', 'STUDENT_DELETED'
    entity_name VARCHAR(100) NOT NULL, -- 'fee_invoices', 'exam_marks'
    entity_id UUID NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_school_created ON audit_logs (school_id, created_at DESC);
```

---

## 4. Prisma Client Architecture & Tenant Scoping Extensions

To make tenant isolation seamless and eliminate developer error, the shared `@codencampus/database` package provides an extended Prisma Client leveraging **Prisma Client Extensions**:

```typescript
// packages/database/src/client.ts
import { PrismaClient } from "@prisma/client";

export function createTenantPrismaClient(schoolId: string) {
  const basePrisma = new PrismaClient();

  return basePrisma.$extends({
    query: {
      $allModels: {
        async findMany({ model, args, query }) {
          if ("schoolId" in basePrisma[model as any].fields) {
            args.where = { ...args.where, schoolId };
          }
          return query(args);
        },
        async findFirst({ model, args, query }) {
          if ("schoolId" in basePrisma[model as any].fields) {
            args.where = { ...args.where, schoolId };
          }
          return query(args);
        },
        async create({ model, args, query }) {
          if ("schoolId" in basePrisma[model as any].fields) {
            args.data = { ...args.data, schoolId };
          }
          return query(args);
        },
        async updateMany({ model, args, query }) {
          if ("schoolId" in basePrisma[model as any].fields) {
            args.where = { ...args.where, schoolId };
          }
          return query(args);
        },
        async deleteMany({ model, args, query }) {
          if ("schoolId" in basePrisma[model as any].fields) {
            args.where = { ...args.where, schoolId };
          }
          return query(args);
        },
      },
    },
  });
}
```

---

## 5. Migration Strategy & Zero-Downtime Releases

1. **Prisma Migrate in CI/CD:** Database schema changes are committed as SQL migrations under `packages/database/prisma/migrations`.
2. **Backward-Compatible Rollouts (Expand & Contract Pattern):**
   - **Phase 1 (Expand):** Add new columns as optional/nullable; deploy schema migration.
   - **Phase 2:** Deploy updated API code that writes to both old and new fields.
   - **Phase 3 (Contract):** Run backfill scripts, mark column `NOT NULL`, drop deprecated columns.
3. **Automated RDS Snapshots:** Triggered prior to running production migrations via GitHub Actions deployment workflow.
