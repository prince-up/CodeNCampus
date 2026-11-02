import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, DollarSign, Calendar, Bell, User } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/student/results', label: 'Results', icon: FileText },
  { to: '/student/fees', label: 'Fees', icon: DollarSign },
  { to: '/student/timetable', label: 'Timetable', icon: Calendar },
  { to: '/student/notices', label: 'Notices', icon: Bell },
  { to: '/student/profile', label: 'Profile', icon: User },
]

export default function StudentLayout() {
  const user = useAuthStore((s) => s.user)
  const profile = useAuthStore((s) => s.profile)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="student" />
      
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm font-semibold text-slate-700">
            Student Portal
          </div>
          <div className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            {user?.name} · Class {profile?.class}-{profile?.section}
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
