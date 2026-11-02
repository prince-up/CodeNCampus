import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { GraduationCap, LogOut, ChevronRight } from 'lucide-react'

export default function Sidebar({ links, role, badgeColor = 'bg-blue-500/20 text-[#3d9be0]' }) {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-[#050f4a] flex flex-col fixed left-0 top-0 z-30 border-r border-white/10 select-none">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 grid-bg-dark opacity-20 pointer-events-none" />

      {/* Brand Header */}
      <div className="p-5 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-[#3d9be0] flex items-center justify-center shadow-lg shadow-blue-500/25 shrink-0">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-extrabold text-base tracking-tight truncate">CodeNCampus</p>
            <span className={`inline-block text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full mt-0.5 ${badgeColor}`}>
              {role} portal
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-3.5 space-y-1.5 overflow-y-auto relative z-10 custom-scrollbar">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <link.icon className="w-4 h-4 shrink-0" />
            <span className="flex-1 truncate">{link.label}</span>
            <ChevronRight className="w-3.5 h-3.5 opacity-40 shrink-0" />
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout Button */}
      <div className="p-4 border-t border-white/10 relative z-10 bg-white/[0.02]">
        <div className="flex items-center gap-3 mb-3 p-2 rounded-xl bg-white/5 border border-white/5">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm shrink-0 shadow-md">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs font-bold truncate leading-tight">{user?.name}</p>
            <p className="text-slate-400 text-[11px] truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 text-rose-300 hover:text-white text-xs font-semibold w-full py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all duration-200"
        >
          <LogOut className="w-3.5 h-3.5" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
