import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import {
  LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap,
  ClipboardList, FileText, DollarSign, Bell, Calendar
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { to: '/admin/classes', label: 'Classes', icon: BookOpen },
  { to: '/admin/subjects', label: 'Subjects', icon: GraduationCap },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/admin/exams', label: 'Exams & Results', icon: FileText },
  { to: '/admin/fees', label: 'Fees', icon: DollarSign },
  { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
]

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="admin" />
      
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm font-semibold text-slate-700">
            School Administration
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium">Logged in as:</span>
            <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
              {user?.name}
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
