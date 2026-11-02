# 🎓 CodeNCampus — School Management System (UMS Style)

Full-featured, modern, demo-ready **School Management System** (Class 1–12) built with **React**, **Node.js/Express**, and **MongoDB**. Inspired by university management portals like LPU UMS.

---

## 🌟 Portals & Features

### 1. 🛡️ Admin Portal (`/admin`)
- **Dashboard**: Live stats (student count, faculty count, attendance %, fee collection graph, class distributions, urgent notices).
- **Student Management**: Add, view, edit, search, filter, and delete students with class/section assignments.
- **Teacher Management**: Faculty profiles, subject assignments, and class allocations.
- **Class & Section**: Configure classes 1–12 with sections A–D and class teachers.
- **Subject Directory**: Map subjects to classes and faculty.
- **Attendance Monitor**: School-wide attendance statistics, progress bars, and low-attendance warnings (<75%).
- **Exams & Grading**: Schedule Unit Tests, Term 1/2, and Finals; view student report cards with auto-grading (A+ to F).
- **Fee Management**: Track tuition, transport, exam fees; view collection analytics, and mark fees as paid.
- **Notice Board**: Post school-wide or audience-targeted notices (All / Students / Teachers) with priority tags.
- **Timetable Scheduler**: Period-by-period class timetable configuration (Periods 1–8).

### 2. 👨‍🏫 Teacher Portal (`/teacher`)
- **Teacher Dashboard**: Today's classes, assigned subjects, and notices.
- **Daily Attendance Marking**: Instant 1-click attendance entry with Present / Absent / Late controls and "Mark All Present" helper.
- **Marks Entry**: Interactive marks input with real-time grade calculations (A+, A, B, C, D, F).
- **Schedule**: View assigned class timetables.
- **Notices**: Read school-wide and teacher-specific circulars.

### 3. 🎒 Student Portal (`/student`)
- **Student Dashboard**: Attendance %, GPA/results overview, pending fee counter, and notices.
- **Detailed Attendance**: Month-wise attendance breakdown and low-attendance alerts.
- **Exam Results**: Term-wise marksheets with pass/fail indicators and subject breakdown.
- **Fee Status**: Fee dues, payment history, and auto-generated receipt numbers.
- **Weekly Timetable**: Period-wise timetable with visual highlight for today's schedule.
- **Notices & Circulars**: School announcements and updates.
- **Profile**: Student bio, parent contact info, blood group, and address.

---

## 🔑 Demo Login Credentials

The system includes pre-seeded demo accounts. Click any of the one-click quick-fill buttons on the login screen or use:

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@codencampus.com` | `Admin@123` |
| **Teacher** | `rajesh@codencampus.com` | `Teacher@123` |
| **Student** | `aarav@student.com` | `Student@123` |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- Node.js (v18+)
- (Optional) MongoDB local service — if not installed, the backend **automatically starts an in-memory MongoDB** and seeds 37 demo users, classes, subjects, exam results, and fee records!

### 1. Clone & Run Backend
```bash
cd backend
npm install
npm start
```
> Server runs on `http://localhost:5005`

### 2. Run Frontend
```bash
cd frontend
npm install
npm run dev
```
> App opens at `http://localhost:5173`

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Zustand, React Router 6, React Hot Toast
- **Backend**: Node.js, Express.js, Mongoose, JWT (JSON Web Tokens), bcryptjs, mongodb-memory-server
- **Database**: MongoDB (Local or In-Memory fallback)
