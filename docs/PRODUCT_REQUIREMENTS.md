# CodeNCampus — Product Requirements Document (PRD)

**Document Version:** 1.0.0  
**Status:** Under Architectural Review  
**Author:** Principal Software Architect & Product Engineering  
**Owner:** Codazk Technologies Private Limited

---

## 1. Executive Summary & Vision

**CodeNCampus** is a commercial, multi-tenant digital operating system and Software-as-a-Service (SaaS) platform tailored for educational institutions ranging from Nursery to Class 12 (K-12). It supports multiple educational boards (CBSE, ICSE, and Indian State Boards), multiple school branches, and varied stakeholder roles (Students, Parents, Teachers, Principals, School Administrators, and Super Administrators).

The core business objective is to offer educational institutions an enterprise-grade platform that unifies academic lifecycle management, school administration, multi-stakeholder communication, fee processing, and operational analytics into a cohesive, secure, and modern digital ecosystem.

The technical architecture is built to support:

1. A unified mobile application for Android & iOS (React Native / Expo) with dynamic runtime branding and role-swapping capabilities.
2. An automated white-label build pipeline generating distinct branded applications for client schools.
3. High-throughput web portals (Next.js) tailored for school admins, principals, and teachers.
4. An enterprise backend (Node.js / Fastify / TypeScript / PostgreSQL) guaranteeing strict multi-tenant data isolation, regulatory compliance (DPDP Act 2023), and high operational availability.

---

## 2. Market & Regulatory Scope

### 2.1 Target Institutions

- Pre-Primary, Primary, Middle, Secondary, and Senior Secondary Schools (Nursery to Class 12).
- Multi-branch institutional trusts and school groups (shared group governance with isolated campus branches).
- Educational Boards:
  - **CBSE:** Grading systems (A1-E), Periodic Assessments, Subject Enrichment, Portfolios, Term Exams.
  - **ICSE / ISC:** Internal Assessments, Project Work, Board-specific weightages.
  - **State Boards:** Continuous and Comprehensive Evaluation (CCE) and regional marks-oriented schemes.

### 2.2 Compliance & Data Sovereignty

- **Digital Personal Data Protection Act (DPDP Act 2023 - India):** Explicit consent workflows for collecting minor (children) data, parental/guardian verification, right to correction, and right to erasure.
- Data residency within Indian AWS regions (`ap-south-1` Mumbai).
- Stringent Audit Logging for sensitive academic, financial, and personal data access.

---

## 3. Stakeholder Personas & Core Journeys

| Persona                  | Primary Needs & Journeys                                                                                                                    | Primary Access Medium            |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| **Super Admin (Codazk)** | Platform health, onboarding new school tenants, subscription billing, tenant tier limits, global feature flags, system-wide audit logs.     | Internal Web Console             |
| **School Admin**         | School configuration, staff recruitment/onboarding, fee schedule creation, student admissions, timetable generation, role permissions.      | Admin Web Portal                 |
| **Principal**            | Academic overview, teacher evaluations, school-wide attendance analytics, fee collection metrics, urgent broadcast circulars.               | Web & Executive Mobile Dashboard |
| **Teacher**              | Daily attendance marking, homework/assignment publishing, marks entry, report card generation, class remarks, parent messaging.             | Teacher Mobile & Web Portal      |
| **Parent**               | Real-time attendance notifications, homework tracker, report cards, fee payment with instant receipts, bus tracking, teacher communication. | Mobile App (Unified / Branded)   |
| **Student**              | Timetable, assigned homework submissions, exam schedule, report card history, digital library access, school notices.                       | Mobile App & Student Portal      |

---

## 4. Functional Requirements & Feature Modules

### 4.1 Core Modules (P0)

#### 4.1.1 Tenant & Organization Management

- **Hierarchical Structure:** Institutional Trust / Society -> School Campus / Branch -> Academic Years -> Shifts -> Classes -> Sections.
- **Academic Year Engine:** Setup of academic calendars (e.g., April 1 to March 31), term definitions, promotion workflows, and archived historical records.
- **Tenant Configuration:** Custom logo, color palette, custom subdomain (`schoolname.codencampus.com`), grading scales, and school-specific operational policies.

#### 4.1.2 Identity & Access Management (IAM)

- Multi-tenant authentication via Supabase Auth + Fastify backend JWT verification.
- Server-side human-readable ID generation (e.g., `DPS-STU-00001`, `DPS-TCH-00001`).
- Granular Role-Based Access Control (RBAC) with permission sets (e.g., `attendance.mark`, `marks.publish`, `fees.waive`).
- Dual-role support for single logins (e.g., a teacher who is also a parent in the same or linked school).

#### 4.1.3 Student Lifecycle Management

- Admission inquiry, digital application, document upload, verification, admission number assignment, and section allocation.
- Detailed student master record: demographic details, blood group, emergency contacts, medical records, past school transfer certificate (TC).
- Parent-student mapping supporting multiple guardians (primary parent, secondary guardian) and siblings linked under single parent accounts.

#### 4.1.4 Staff & Teacher Management

- Profile management: qualification, department, designation, employee ID, bio, contact details, emergency information.
- Subject-Teacher allocation: Mapping teachers as Class Teachers (primary in-charge) or Subject Teachers per class/section.

---

### 4.2 Academic Modules (P0 - P1)

#### 4.2.1 Attendance Management

- **Modes:** Class-level daily attendance (primary), subject-wise period attendance (senior classes), and staff biometric/manual attendance.
- **Statuses:** Present, Absent, Half-Day, Late, On-Duty (Sports/Competitions), Medical Leave.
- **Alerts:** Automated instant push notifications and SMS to parents upon absence detection.
- **Reporting:** Monthly attendance registers, percentage compliance checks for board exam eligibility.

#### 4.2.2 Timetable & Scheduling

- Weekly period matrix per class and section.
- Teacher workload balance checker (prevent double booking of teachers or shared resources like science labs).
- Substitute/Reliever teacher allocation system for absent staff.

#### 4.2.3 Homework & Study Materials

- Subject-wise homework publishing with attachments (PDFs, images, notes).
- Due date tracking, digital student submissions, and teacher evaluation comments.
- Centralized study material repository organized by subject, chapter, and unit.

#### 4.2.4 Examination, Marks & Report Cards

- Flexible exam setup: Unit Tests, Term Examinations, Half-Yearly, Annuals, Mock Tests.
- Configurable assessment structures: Scholastic (Theory, Practical, Assessment) and Co-scholastic (Art, Discipline, Physical Education).
- Grading engine supporting CBSE 9-point scale, ICSE percentages, and custom State Board thresholds.
- Dynamic PDF generation for CBSE-compliant Report Cards and Certificates (Bonafide, Transfer Certificate, Merit).

---

### 4.3 Administration & Financial Modules (P1)

#### 4.3.1 Fee Management & Online Collections

- Customizable Fee Structures: Tuition, Transport, Laboratory, Annual Development, Admission fee.
- Installment schedules: Monthly, Quarterly, Bi-Annual, Annual.
- Concessions and scholarships: Staff ward discount, sibling discount, merit waiver (with approval audit).
- Payment gateways: Cashfree, Razorpay, UPI QR integration, net-banking, credit/debit cards.
- Offline counter payment reconciliation: Cash/Cheque/Draft entry with automated digital receipt generation.
- Automated fee reminders, overdue penalties, and defaulter tracking.

#### 4.3.2 Communication & Noticeboard

- Multi-tier announcements: School-wide, class-specific, section-specific, or staff-only.
- Interactive circulars with acknowledgment tracking ("Mark as Read / Signed by Parent").
- Push notifications, SMS integration, and transactional WhatsApp API alerts for mission-critical updates.

---

### 4.4 Advanced Modules (P2 - P3)

- **Transport Management:** Bus routes, stops, vehicle tracking (GPS), driver contact, parent live arrival alerts.
- **Library Management:** Cataloging, barcode scanning, issue/return tracker, book loss/fine calculator.
- **HR & Payroll:** Biometric punch sync, leave management, pay slip generation.
- **Analytics & Executive Insights:** Drop-out risk indicator, fee collection recovery forecasting, teacher performance metrics.

---

## 5. Non-Functional Requirements (NFR)

### 5.1 Performance & Latency

- Mobile & Web API response time: 95th percentile (P95) < 250ms for typical read requests.
- Attendance bulk submit for 50 students: < 500ms.
- Scalability: Capable of supporting 100,000+ daily active users (DAU) across 500+ school tenants with horizontal backend scaling.

### 5.2 Availability & Reliability

- Uptime SLA: 99.9% target for core academic hours (06:00 to 20:00 IST).
- RPO (Recovery Point Objective): < 15 minutes.
- RTO (Recovery Time Objective): < 2 hours.

### 5.3 Security & Multi-Tenancy

- Zero data leakage across tenants: All queries scoped to `school_id` validated from authenticated backend session tokens.
- Secure secrets management via AWS SSM / Doppler / Vault.
- Role-Based Access Control enforced at the Fastify route hook level.
- Encrypted data at rest (PostgreSQL AES-256) and in transit (TLS 1.3).

---

## 6. Success Metrics & Key Performance Indicators (KPIs)

1. **Tenant Isolation Integrity:** 0 cross-tenant data leak vulnerabilities.
2. **Adoption Rate:** > 80% daily active parent engagement on mobile within 30 days of school rollout.
3. **Operational Efficiency:** > 60% reduction in manual fee collection effort and paper report card generation time.
4. **Platform Health:** API error rate < 0.1%, App crash-free rate > 99.5%.
