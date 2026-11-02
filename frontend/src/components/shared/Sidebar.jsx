import { useState, useEffect } from 'react'
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom'
import useAuthStore from '../../store/authStore'
import toast from 'react-hot-toast'
import { GraduationCap, LogOut, Menu, X } from 'lucide-react'

export default function Sidebar({ links, role }) {
  const logout = useAuthStore((s) => s.logout)
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)

  // Auto-close mobile drawer when user navigates
  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/login')
  }

  return (
    <>
      {/* Mobile Top Header with Hamburger Toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1a3a6d] border-b border-[#142e56] z-40 px-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -ml-1 text-white hover:bg-white/10 rounded-lg focus:outline-none"
            aria-label="Toggle navigation"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <img
            src="/anazk-logo-light.png"
            alt="Anazk Technologies"
            className="h-5 w-auto object-contain"
            onError={(e) => { e.currentTarget.style.display = 'none' }}
          />
          <Link to={`/${role}`} className="text-white font-bold text-xs hover:opacity-90 transition-opacity">CodeNCampus</Link>
        </div>

        <span className="text-[10px] text-blue-200 uppercase tracking-wider font-bold bg-white/10 px-2 py-0.5 rounded">
          {role}
        </span>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 transition-opacity"
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={`w-64 sm:w-60 min-h-screen bg-[#1a3a6d] flex flex-col fixed left-0 top-0 z-50 select-none border-r border-[#142e56] transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header with Close button on mobile */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex flex-col gap-1.5 min-w-0">
            <a
              href="https://anazk.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity"
            >
              <img
                src="/anazk-logo-light.png"
                alt="Anazk Technologies"
                className="h-6 w-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </a>
            <div className="flex items-center gap-2 pt-0.5">
              <Link to={`/${role}`} className="text-white font-bold text-xs tracking-tight hover:opacity-90 transition-opacity">CodeNCampus</Link>
              <span className="text-[10px] text-blue-200 uppercase tracking-wider font-semibold bg-white/10 px-1.5 py-0.2 rounded">
                {role}
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden text-white/70 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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

        {/* Footer with User info & Logout */}
        <div className="p-3 border-t border-white/10 bg-[#142e56]/50">
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
            className="flex items-center gap-2 text-blue-200/80 hover:text-white text-xs font-medium w-full px-2.5 py-2 rounded-md hover:bg-white/10 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Logout
          </button>

          <div className="mt-2 pt-2 border-t border-white/5 text-center">
            <a
              href="https://anazk.online"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-blue-200/50 hover:text-blue-100 transition-colors"
            >
              by Anazk Technologies
            </a>
          </div>
        </div>
      </aside>
    </>
  )
}
