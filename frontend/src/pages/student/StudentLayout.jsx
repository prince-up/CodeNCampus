import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import { LayoutDashboard, ClipboardList, FileText, DollarSign, Calendar, Bell, User } from 'lucide-react'

const links = [
  { to: '/student', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/student/attendance', label: 'My Attendance', icon: ClipboardList },
  { to: '/student/results', label: 'My Results', icon: FileText },
  { to: '/student/fees', label: 'Fee Status', icon: DollarSign },
  { to: '/student/timetable', label: 'Timetable', icon: Calendar },
  { to: '/student/notices', label: 'Notices', icon: Bell },
  { to: '/student/profile', label: 'My Profile', icon: User },
]

export default function StudentLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} role="student" color="from-blue-900 to-blue-800" />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6"><Outlet /></div>
      </main>
    </div>
  )
}
