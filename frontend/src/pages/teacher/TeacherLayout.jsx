import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, Calendar, Bell } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/teacher', label: 'Faculty Hub', icon: LayoutDashboard, end: true },
  { to: '/teacher/attendance', label: 'Mark Attendance', icon: ClipboardList },
  { to: '/teacher/marks', label: 'Enter Exam Marks', icon: FileText },
  { to: '/teacher/timetable', label: 'My Class Schedule', icon: Calendar },
  { to: '/teacher/notices', label: 'Official Notices', icon: Bell },
]

export default function TeacherLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="teacher" badgeColor="bg-emerald-500/20 text-emerald-300" />
      
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-slate-200/80 px-8 flex items-center justify-between sticky top-0 z-20 shadow-sm/50">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Faculty Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-extrabold text-[#050f4a]">Academic Class Management</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Faculty Active
            </div>

            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800 border border-emerald-200">
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
