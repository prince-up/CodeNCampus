import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import {
  LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap,
  ClipboardList, FileText, DollarSign, Bell, Calendar, Search
} from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students Directory', icon: Users },
  { to: '/admin/teachers', label: 'Faculty Directory', icon: UserCheck },
  { to: '/admin/classes', label: 'Classes & Sections', icon: BookOpen },
  { to: '/admin/subjects', label: 'Curriculum & Subjects', icon: GraduationCap },
  { to: '/admin/attendance', label: 'Attendance Records', icon: ClipboardList },
  { to: '/admin/exams', label: 'Exams & Reports', icon: FileText },
  { to: '/admin/fees', label: 'Fee Accounts', icon: DollarSign },
  { to: '/admin/timetable', label: 'Master Timetable', icon: Calendar },
  { to: '/admin/notices', label: 'Notice Board', icon: Bell },
]

export default function AdminLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="admin" badgeColor="bg-purple-500/20 text-purple-300" />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Institutional Administration</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#050f4a]">Academic Year 2024-25</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Sync Active
            </div>

            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-700 border border-slate-200">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
