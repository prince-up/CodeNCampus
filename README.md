# 🎓 CodeNCampus — School Management System (UMS)
### *A Product by [Anazk Technologies Private Limited](https://anazk.online)*

Full-featured, modern, production-grade **School Management System** (Classes 1–12) designed for K-12 institutions, colleges, and university campuses. Built under the product ecosystem of **Anazk Technologies Pvt. Ltd.** (makers of *CodeNCommit* & *CodeNBrowser*).

---

## 🏢 Parent Company
- **Company:** Anazk Technologies Private Limited
- **Official Website:** [https://anazk.online](https://anazk.online)
- **Product Suite:** CodeNCommit (Coding Assessment Platform), CodeNBrowser (Secure Lockdown Exam Browser), CodeNCampus (School Management System / UMS)

---

## 🌟 Portals & Features

### 1. 🛡️ Admin Portal (`/admin`)
- **Dashboard**: Live student & faculty headcounts, school-wide daily attendance %, tuition fee collection metrics, class distribution charts, and notices.
- **Student Management**: Full CRUD, profile bio, class & section allocation, parent contact records, and roll number assignment.
- **Teacher Management**: Faculty directory, department designations, subject allocations, and class assignments.
- **Classes & Sections**: Management of classes 1 to 12 with sections A through D.
- **Subject Directory**: Master subject catalog mapped to classes and assigned teachers.
- **Attendance Monitor**: Class-wise attendance percentage with low attendance warnings (<75%).
- **Exams & Report Cards**: Scheduling Unit Tests, Term 1/2, and Final examinations with automatic grade computing (A+ to F).
- **Fee Accounts**: Tuition and examination fee tracking, payment status records (Paid/Pending/Partial), and receipt generation.
- **Master Timetable**: Period-by-period class schedules (Periods 1 to 8).
- **Campus Notice Board**: Institutional circulars with priority tags (Urgent/Normal) and audience targeting (All, Teachers, Students).

### 2. 👨‍🏫 Teacher Portal (`/teacher`)
- **Faculty Dashboard**: Assigned classes and daily schedule.
- **Attendance Marking**: Single-click attendance marking per student (Present, Absent, Late) with a quick "Mark All Present" helper.
- **Marks Entry**: Interactive marks recording with real-time automatic grade preview.
- **Timetable**: Teacher's own assigned class schedule.
- **Notices**: Official school and faculty announcements.

### 3. 🎒 Student Portal (`/student`)
- **Student Dashboard**: Quick attendance %, marks overview, pending fee counter, and circulars.
- **Detailed Attendance**: Month-wise attendance breakdown and regularity tracking.
- **Report Cards**: Term-by-term examination results with subject scores, percentages, and pass/fail indicators.
- **Fee Status**: Fee dues, transaction receipts, and payment logs.
- **Weekly Timetable**: Full class timetable with visual highlight for today's periods.
- **Student Profile**: Personal biodata, guardian contact numbers, blood group, and address.

---

## 🔑 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@codencampus.com` | `Admin@123` |
| **Teacher** | `rajesh@codencampus.com` | `Teacher@123` |
| **Student** | `aarav@student.com` | `Student@123` |

---

## 🚀 Local Setup

### Backend
```bash
cd backend
npm install
npm start
```
> Runs on `http://localhost:5005` with auto-seeded demo records.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
> Runs on `http://localhost:5173`.

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Recharts, Zustand, React Router 6, React Hot Toast
- **Backend**: Node.js, Express.js, Mongoose, JWT, bcryptjs, mongodb-memory-server
- **Ecosystem**: Anazk Technologies Private Limited (`anazk.online`)
