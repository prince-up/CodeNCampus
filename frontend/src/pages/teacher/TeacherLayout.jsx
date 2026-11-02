import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, Calendar, Bell } from 'lucide-react'

const links = [
  { to: '/teacher', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/teacher/attendance', label: 'Mark Attendance', icon: ClipboardList },
  { to: '/teacher/marks', label: 'Enter Marks', icon: FileText },
  { to: '/teacher/timetable', label: 'My Timetable', icon: Calendar },
  { to: '/teacher/notices', label: 'Notices', icon: Bell },
]

export default function TeacherLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} role="teacher" color="from-green-900 to-green-800" />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  )
}
