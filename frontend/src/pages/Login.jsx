import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { GraduationCap, Eye, EyeOff, Loader2, ArrowRight, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react'

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
      toast.success(`Welcome back, ${data.user.name}!`)
      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (email, password) => {
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#050f4a] text-white flex flex-col justify-between relative overflow-hidden font-sans selection:bg-blue-400 selection:text-white">
      {/* Background Decor & Grid matching Anazk */}
      <div className="absolute inset-0 grid-bg-dark pointer-events-none opacity-40" />
      <div className="absolute -top-40 -left-40 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[130px] pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[140px] pointer-events-none" />

      {/* Top Header / Branding */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-[#3d9be0] flex items-center justify-center shadow-lg shadow-blue-500/25">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-2">
              CodeNCampus
              <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-500/20 text-[#3d9be0] px-2 py-0.5 rounded-full border border-blue-400/30">
                UMS Suite
              </span>
            </span>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-6 text-sm text-slate-300 font-medium">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Demo Environment Live
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-5xl grid lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Value Proposition & Highlights */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-blue-300 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#3d9be0]" />
              Enterprise School Management Solution
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-black tracking-[-1.5px] leading-[1.08] text-white">
              Next-Gen School Portal <br />
              <span className="bg-gradient-to-r from-blue-400 via-[#3d9be0] to-indigo-300 bg-clip-text text-transparent">
                Powering K-12 Education.
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed">
              Unified platform for students, faculty, and school administrators. Built with real-time attendance, auto-grade analytics, and fee accounting.
            </p>

            <div className="grid sm:grid-cols-3 gap-3 pt-2">
              {[
                { title: 'Admin Controls', desc: 'Students, Staff & Fees' },
                { title: 'Teacher Hub', desc: '1-Click Attendance & Marks' },
                { title: 'Student Portal', desc: 'Live Grades & Time Table' },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/[0.04] border border-white/10 rounded-2xl p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-2 text-white font-bold text-sm mb-1">
                    <CheckCircle2 className="w-4 h-4 text-[#3d9be0]" />
                    {item.title}
                  </div>
                  <p className="text-xs text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Modern Glass Login Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white/10 border border-white/20 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative">
              <div className="mb-6">
                <h2 className="text-2xl font-black text-white tracking-tight">Sign In to Portal</h2>
                <p className="text-sm text-slate-300 mt-1">Select demo role below or enter credentials</p>
              </div>

              {/* Demo One-Click Selectors */}
              <div className="mb-6">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Select Demo Persona
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Admin', email: 'admin@codencampus.com', pass: 'Admin@123', color: 'hover:border-purple-400 hover:bg-purple-500/20 text-purple-200' },
                    { label: 'Teacher', email: 'rajesh@codencampus.com', pass: 'Teacher@123', color: 'hover:border-emerald-400 hover:bg-emerald-500/20 text-emerald-200' },
                    { label: 'Student', email: 'aarav@student.com', pass: 'Student@123', color: 'hover:border-blue-400 hover:bg-blue-500/20 text-blue-200' },
                  ].map((role) => (
                    <button
                      key={role.label}
                      type="button"
                      onClick={() => demoLogin(role.email, role.pass)}
                      className={`px-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-xs font-bold transition-all text-center ${role.color}`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@codencampus.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="!bg-white/[0.08] !border-white/10 !text-white placeholder-slate-400 focus:!border-[#3d9be0] focus:!bg-white/[0.12]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={(e) => setForm({ ...form, password: e.target.value })}
                      required
                      className="!bg-white/[0.08] !border-white/10 !text-white placeholder-slate-400 focus:!border-[#3d9be0] focus:!bg-white/[0.12] pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-500 to-[#3d9be0] hover:from-blue-600 hover:to-[#2e88cb] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 transition-all hover:shadow-blue-500/50 hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Launch Portal
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-5 text-center flex items-center justify-center gap-1.5 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Protected by 256-bit JWT Encryption</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs text-slate-400 border-t border-white/10">
        © 2024 CodeNCampus Technologies. All rights reserved. Designed for modern institutional scale.
      </footer>
    </div>
  )
}
