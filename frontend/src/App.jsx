import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import useAuthStore from './store/authStore'

// Pages
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Students from './pages/admin/Students'
import Teachers from './pages/admin/Teachers'
import Classes from './pages/admin/Classes'
import Subjects from './pages/admin/Subjects'
import Attendance from './pages/admin/Attendance'
import Exams from './pages/admin/Exams'
import Fees from './pages/admin/Fees'
import Notices from './pages/admin/Notices'
import Timetable from './pages/admin/Timetable'

// Teacher pages
import TeacherLayout from './pages/teacher/TeacherLayout'
import TeacherDashboard from './pages/teacher/TeacherDashboard'
import MarkAttendance from './pages/teacher/MarkAttendance'
import EnterMarks from './pages/teacher/EnterMarks'
import TeacherTimetable from './pages/teacher/TeacherTimetable'
import TeacherNotices from './pages/teacher/TeacherNotices'

// Student pages
import StudentLayout from './pages/student/StudentLayout'
import StudentDashboard from './pages/student/StudentDashboard'
import StudentAttendance from './pages/student/StudentAttendance'
import StudentResults from './pages/student/StudentResults'
import StudentFees from './pages/student/StudentFees'
import StudentTimetable from './pages/student/StudentTimetable'
import StudentNotices from './pages/student/StudentNotices'
import StudentProfile from './pages/student/StudentProfile'

const ProtectedRoute = ({ children, role }) => {
  const { user, token } = useAuthStore()
  if (!token || !user) return <Navigate to="/login" replace />
  if (role && user.role !== role) return <Navigate to="/login" replace />
  return children
}

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <div key={location.pathname} className="page-enter min-h-screen">
      <Routes location={location}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="classes" element={<Classes />} />
          <Route path="subjects" element={<Subjects />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="exams" element={<Exams />} />
          <Route path="fees" element={<Fees />} />
          <Route path="notices" element={<Notices />} />
          <Route path="timetable" element={<Timetable />} />
        </Route>

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute role="teacher"><TeacherLayout /></ProtectedRoute>}>
          <Route index element={<TeacherDashboard />} />
          <Route path="attendance" element={<MarkAttendance />} />
          <Route path="marks" element={<EnterMarks />} />
          <Route path="timetable" element={<TeacherTimetable />} />
          <Route path="notices" element={<TeacherNotices />} />
        </Route>

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="student"><StudentLayout /></ProtectedRoute>}>
          <Route index element={<StudentDashboard />} />
          <Route path="attendance" element={<StudentAttendance />} />
          <Route path="results" element={<StudentResults />} />
          <Route path="fees" element={<StudentFees />} />
          <Route path="timetable" element={<StudentTimetable />} />
          <Route path="notices" element={<StudentNotices />} />
          <Route path="profile" element={<StudentProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
