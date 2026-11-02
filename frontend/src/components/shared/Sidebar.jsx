import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { GraduationCap, LogOut } from 'lucide-react'

export default function Sidebar({ links, role }) {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <aside className="w-60 min-h-screen bg-[#1a3a6d] flex flex-col fixed left-0 top-0 z-30 select-none border-r border-[#142e56]">
      {/* Brand Header */}
      <div className="h-16 px-5 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-bold text-sm tracking-tight truncate leading-tight">CodeNCampus</p>
          <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold">
            {role} Portal
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-white/15 text-white font-semibold'
                  : 'text-blue-100/70 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <link.icon className="w-4 h-4 shrink-0" />
            <span className="truncate">{link.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User profile & Logout */}
      <div className="p-3 border-t border-white/10">
        <div className="flex items-center gap-2.5 px-2 py-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-xs font-semibold truncate leading-tight">{user?.name}</p>
            <p className="text-blue-200/60 text-[11px] truncate leading-tight">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-blue-200/80 hover:text-white text-xs font-medium w-full px-2.5 py-1.5 rounded-md hover:bg-white/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Logout
        </button>
      </div>
    </aside>
  )
}
