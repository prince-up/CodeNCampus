import { Outlet } from 'react-router-dom'
import Sidebar from '../../components/shared/Sidebar'
import {
  LayoutDashboard, Users, UserCheck, BookOpen, GraduationCap,
  ClipboardList, FileText, DollarSign, Bell, Calendar
} from 'lucide-react'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/students', label: 'Students', icon: Users },
  { to: '/admin/teachers', label: 'Teachers', icon: UserCheck },
  { to: '/admin/classes', label: 'Classes', icon: BookOpen },
  { to: '/admin/subjects', label: 'Subjects', icon: GraduationCap },
  { to: '/admin/attendance', label: 'Attendance', icon: ClipboardList },
  { to: '/admin/exams', label: 'Exams & Results', icon: FileText },
  { to: '/admin/fees', label: 'Fee Management', icon: DollarSign },
  { to: '/admin/timetable', label: 'Timetable', icon: Calendar },
  { to: '/admin/notices', label: 'Notices', icon: Bell },
]

export default function AdminLayout() {
  return (
    <div className="flex">
      <Sidebar links={links} role="admin" color="from-slate-900 to-slate-800" />
      <main className="flex-1 ml-64 min-h-screen">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
