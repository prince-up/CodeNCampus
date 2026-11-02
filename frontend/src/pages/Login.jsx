import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import {
  Eye, EyeOff, Loader2, ArrowRight, CheckCircle2,
  Users, Calendar, FileText, DollarSign, ShieldCheck,
  Building2, School
} from 'lucide-react'

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
      {/* Top Navbar */}
      <header className="border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
            className="text-xs text-slate-500 hover:text-[#1a3a6d] font-medium hidden sm:flex items-center gap-1"
          >
            An Anazk Technologies Product
          </a>
        </div>
      </header>

      {/* Main 2-Column Showcase & Sign In */}
      <main className="flex-1 flex items-center justify-center px-6 py-12 lg:py-16">
        <div className="w-full max-w-6xl grid lg:grid-cols-12 gap-12 lg:gap-14 items-center">

          {/* Left Column: Product Value, What is CodeNCampus & Features */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-blue-50 border border-blue-200/70 text-[12px] font-semibold text-[#1a3a6d] mb-4">
                <School className="w-4 h-4 text-[#3d9be0]" />
                K–12 Institutional Management Platform
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-black text-[#1a3a6d] leading-[1.18] tracking-tight">
                Complete Campus Management System for Modern Schools
              </h1>

              <p className="mt-4 text-base text-slate-600 leading-relaxed">
                <strong className="text-slate-800 font-semibold">CodeNCampus</strong> is an institutional operating system designed to digitize daily school operations. From Class 1 to 12, it seamlessly connects school leadership, teachers, and students into one unified portal.
              </p>
            </div>

            {/* What CodeNCampus Does - Feature Pillars */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a3a6d] flex items-center justify-center mb-2.5">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Student & Staff Records</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Centralized student dossiers, teacher subject assignments, and class section management.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center mb-2.5">
                  <Calendar className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Live Attendance & Timetables</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Single-click daily attendance marking, automated alerts, and master period schedules.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center mb-2.5">
                  <FileText className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Exams & Grade Computing</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Unit tests, term exams, real-time grading scale (A+ to F), and digital report cards.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center mb-2.5">
                  <DollarSign className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Fee Accounts & Receipts</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Fee structures, pending dues ledger, instant receipt generation, and collection summaries.
                </p>
              </div>
            </div>

            {/* Parent company trust badge */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
              <span>
                Part of the <strong>Anazk Technologies</strong> educational software suite alongside <em>CodeNCommit</em> & <em>CodeNBrowser</em>.
              </span>
            </div>
          </div>

          {/* Right Column: Clean Sign In Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-slate-200/90 rounded-2xl p-8 shadow-sm">
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Institutional Portal
                </div>
                <h2 className="text-2xl font-bold text-[#1a3a6d] tracking-tight">Sign In</h2>
                <p className="text-xs text-slate-500 mt-1">Select demo role below or enter credentials</p>
              </div>

              {/* Persona Quick Select */}
              <div className="mb-6">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Select Demo Account
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
                      className="py-2.5 px-3 text-xs font-semibold rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-[#1a3a6d] hover:text-white hover:border-[#1a3a6d] transition-all"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">Email Address</label>
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
                      Enter Dashboard
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by Anazk Security & RBAC</span>
              </div>
            </div>
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
