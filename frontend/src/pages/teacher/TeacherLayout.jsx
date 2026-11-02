import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, Calendar, Bell } from 'lucide-react'
import useAuthStore from '../../store/authStore'

const links = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/attendance', label: 'Mark Attendance', icon: ClipboardList },
  { to: '/teacher/marks', label: 'Enter Marks', icon: FileText },
  { to: '/teacher/timetable', label: 'Timetable', icon: Calendar },
  { to: '/teacher/notices', label: 'Notices', icon: Bell },
]

export default function TeacherLayout() {
  const user = useAuthStore((s) => s.user)

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar links={links} role="teacher" />
      
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="text-sm font-semibold text-slate-700">
            Teacher Workspace
          </div>
          <div className="text-xs font-semibold text-slate-800 bg-slate-100 px-2.5 py-1 rounded-md">
            {user?.name}
          </div>
        </header>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
