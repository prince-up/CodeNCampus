import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, DollarSign, Calendar, Bell, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/student', label: 'Student Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/attendance', label: 'My Attendance', icon: ClipboardList },
  { to: '/student/results', label: 'Report Cards & Marks', icon: FileText },
  { to: '/student/fees', label: 'Fee Clearance', icon: DollarSign },
  { to: '/student/timetable', label: 'Weekly Schedule', icon: Calendar },
  { to: '/student/notices', label: 'Campus Bulletins', icon: Bell },
  { to: '/student/profile', label: 'Student Profile', icon: User },
]

export default function StudentLayout() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="student" badgeColor="bg-blue-500/20 text-[#3d9be0]" />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Student Portal</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#050f4a]">
              Class {profile?.class}-{profile?.section} · Roll #{profile?.rollNo}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-xs text-blue-800 border border-blue-200">
              {user?.name?.[0]?.toUpperCase()}
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
