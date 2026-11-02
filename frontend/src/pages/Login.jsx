import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      setAuth(data.user, data.token, data.profile)
      toast.success(`Welcome, ${data.user.name}`)
      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (email, password) => {
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col justify-between font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Clean Header with Official Anazk Parent Branding */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a
              href="https://anazk.online"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <img
                src="/anazk-logo-dark.png"
                alt="Anazk Technologies"
                className="h-8 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            </a>
            <span className="text-slate-300 font-light">|</span>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-bold text-[#1a3a6d] tracking-tight">CodeNCampus</span>
              <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded uppercase tracking-wider">
                UMS
              </span>
            </div>
          </div>

          <a
            href="https://anazk.online"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-slate-500 hover:text-[#1a3a6d] font-medium flex items-center gap-1"
          >
            An Anazk Technologies Product
          </a>
        </div>
      </header>

      {/* Main Login Area */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm">
            <div className="mb-6">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Institutional Portal
              </div>
              <h1 className="text-2xl font-bold text-[#1a3a6d] tracking-tight">Sign In to CodeNCampus</h1>
              <p className="text-xs text-slate-500 mt-1">Class 1 to 12 School Management Suite</p>
            </div>

            {/* Persona Quick Select */}
            <div className="mb-6">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                Demo Accounts
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Admin', email: 'admin@codencampus.com', pass: 'Admin@123' },
                  { label: 'Teacher', email: 'rajesh@codencampus.com', pass: 'Teacher@123' },
                  { label: 'Student', email: 'aarav@student.com', pass: 'Student@123' },
                ].map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => demoLogin(item.email, item.pass)}
                    className="py-2 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#1a3a6d] hover:text-white hover:border-[#1a3a6d] transition-all"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="name@codencampus.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2.5 text-sm focus:border-[#1a3a6d] focus:ring-1 focus:ring-[#1a3a6d] transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2.5 text-sm focus:border-[#1a3a6d] focus:ring-1 focus:ring-[#1a3a6d] pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-3 rounded-lg bg-[#1a3a6d] hover:bg-[#142e56] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="text-center mt-6">
            <p className="text-xs text-slate-400">
              Developed & operated under <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-600 hover:underline">Anazk Technologies Private Limited</a>.
            </p>
          </div>

        </div>
      </main>

      {/* Corporate Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-400">
        © 2024 CodeNCampus · A Product of <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-600 hover:underline">Anazk Technologies Pvt. Ltd.</a>
      </footer>
    </div>
  )
}
