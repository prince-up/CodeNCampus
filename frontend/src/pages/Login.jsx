import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import {
  Eye, EyeOff, Loader2, ArrowRight, CheckCircle2,
  Users, Calendar, FileText, DollarSign, ShieldCheck,
  Building2, School, Award, Clock, Bell, Sparkles,
  BarChart3, Check, Layers, ChevronRight, HelpCircle
} from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: 'admin@codencampus.com', password: 'Admin@123' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [activePersona, setActivePersona] = useState('Admin')

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

  const demoLogin = (persona, email, password) => {
    setActivePersona(persona)
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900 flex flex-col">
      
      {/* ── Adaptive Top Header: Laptop vs Phone ── */}
      <header className="border-b border-slate-200/80 bg-white sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          
          {/* Brand Left: Always neat on both Phone & Laptop */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="https://anazk.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-90 transition-opacity flex items-center"
            >
              <img
                src="/anazk-logo-dark.png"
                alt="Anazk Technologies"
                className="h-7 sm:h-8 w-auto object-contain"
                onError={(e) => { e.currentTarget.style.display = 'none' }}
              />
            </a>
            <span className="text-slate-300 font-light text-base sm:text-lg">|</span>
            <Link to="/" className="flex items-center gap-1.5 hover:opacity-90 transition-opacity">
              <span className="text-base sm:text-lg font-black text-[#1a3a6d] tracking-tight">CodeNCampus</span>
              <span className="text-[10px] font-bold text-[#3d9be0] bg-blue-50 border border-blue-200/60 px-1.5 py-0.5 rounded uppercase tracking-wider">
                UMS
              </span>
            </Link>
          </div>

          {/* Right Side: Laptop vs Phone adaptive */}
          <div className="flex items-center">
            {/* On Laptop: Clean full text */}
            <a
              href="https://anazk.online"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex text-xs text-slate-500 hover:text-[#1a3a6d] font-medium transition-colors"
            >
              An Anazk Technologies Product
            </a>

            {/* On Phone: Subtle small pill badge */}
            <span className="sm:hidden inline-flex items-center gap-1 text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Anazk
            </span>
          </div>

        </div>
      </header>

      {/* ══════════════════════════════════════════════════
          SLIDE / SECTION 1: HERO & INTERACTIVE SIGN-IN
          ══════════════════════════════════════════════════ */}
      <section id="overview" className="py-12 lg:py-16 px-6 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* Left Column: Product Definition & Quick Highlights */}
          <div className="lg:col-span-7 space-y-7">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/70 text-xs font-bold text-[#1a3a6d] mb-5 shadow-xs">
                <School className="w-4 h-4 text-[#3d9be0]" />
                K–12 School Management Platform
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#1a3a6d] leading-[1.12] tracking-tight">
                One Platform to Run<br className="hidden sm:block" /> Your Entire School
              </h1>

              <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
                <strong className="text-slate-800 font-bold">CodeNCampus</strong> brings admins, teachers, and students together on a single unified portal. Manage attendance, exams, fees, timetables, and more — all from one place.
              </p>
            </div>

            {/* Quick Stats Row */}
            <div className="flex flex-wrap gap-3">
              {[
                { value: '37+', label: 'Demo Users' },
                { value: '11', label: 'Modules' },
                { value: '3', label: 'Role Portals' },
                { value: '24/7', label: 'Cloud Access' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-white border border-slate-200 shadow-xs">
                  <span className="text-base font-black text-[#1a3a6d]">{stat.value}</span>
                  <span className="text-[11px] font-semibold text-slate-500">{stat.label}</span>
                </div>
              ))}
            </div>

            {/* 4 Feature Pillar Cards */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-blue-200 transition-all group border-l-[3px] border-l-[#1a3a6d]">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1a3a6d] flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                    <Users className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Student & Staff Records</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-12">
                  Complete profiles, class assignments, and section management for every student and teacher.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-emerald-200 transition-all group border-l-[3px] border-l-emerald-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <Calendar className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Attendance & Timetables</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-12">
                  One-click daily attendance, automated tracking, and master period schedules for all classes.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-purple-200 transition-all group border-l-[3px] border-l-purple-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                    <FileText className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Exams & Report Cards</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-12">
                  Unit tests, term exams, automatic grading (A+ to F), and downloadable digital report cards.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs hover:shadow-md hover:border-amber-200 transition-all group border-l-[3px] border-l-amber-500">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <DollarSign className="w-4.5 h-4.5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-800">Fee Management</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed pl-12">
                  Fee structures, pending dues tracking, instant receipt generation, and collection summaries.
                </p>
              </div>
            </div>

            {/* Parent company attribution bar */}
            <div className="flex items-center gap-3 p-3.5 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100/80 border border-slate-200 text-xs text-slate-600">
              <div className="w-7 h-7 rounded-lg bg-[#1a3a6d] flex items-center justify-center shrink-0">
                <Building2 className="w-3.5 h-3.5 text-white" />
              </div>
              <span>
                A product of <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="font-bold text-[#1a3a6d] hover:underline">Anazk Technologies Pvt. Ltd.</a> — Building tools for modern education.
              </span>
            </div>
          </div>

          {/* Right Column: High-Impact Sign-In Card */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white border border-slate-200 rounded-2xl p-7 sm:p-8 shadow-sm">
              <div className="mb-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Institutional Portal
                </div>
                <h2 className="text-2xl font-bold text-[#1a3a6d] tracking-tight">Sign In</h2>
                <p className="text-xs text-slate-500 mt-0.5">Select demo role below or enter credentials</p>
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
                      onClick={() => demoLogin(item.label, item.email, item.pass)}
                      className={`py-2.5 px-3 text-xs font-bold rounded-lg border transition-all ${
                        activePersona === item.label
                          ? 'bg-[#1a3a6d] text-white border-[#1a3a6d] shadow-xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
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
                  className="w-full mt-2 py-3.5 rounded-lg bg-[#1a3a6d] hover:bg-[#142e56] text-white font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Enter {activePersona} Dashboard
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
      </section>

      {/* ══════════════════════════════════════════════════
          SLIDE / SECTION 2: HOW THE SYSTEM WORKS (3 TIERS)
          ══════════════════════════════════════════════════ */}
      <section id="modules" className="py-20 px-6 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3d9be0]">Institutional Hierarchy</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6d] tracking-tight">
            Designed for Every Stakeholder on Campus
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            CodeNCampus provides tailored workflows for administrators, educators, and pupils to ensure accountability and effortless transparency.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Admin Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 font-bold flex items-center justify-center text-lg">
              🛡️
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1a3a6d]">Administrative Hub</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Complete oversight over academic cycles, student admissions, fee collections, and staff allotments.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Student Directory & Section Allotment (A–D)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Faculty Directory & Course Mapping</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Master Timetable Builder (Periods 1 to 8)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fee Collection Ledgers & Receipts</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Campus-wide Bulletins & Circulars</span>
              </li>
            </ul>
          </div>

          {/* Teacher Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-lg">
              👨‍🏫
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1a3a6d]">Faculty Workspace</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Productivity-first classroom tools that minimize paperwork so teachers can focus on student instruction.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>1-Click Daily Attendance (Present, Absent, Late)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Bulk "Mark All Present" Helper</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Interactive Marks Entry with Live Grading</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Personal Faculty Class Schedule</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Departmental & Institutional Notices</span>
              </li>
            </ul>
          </div>

          {/* Student Tier */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 font-bold flex items-center justify-center text-lg">
              🎒
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1a3a6d]">Student & Parent Portal</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Self-service dashboard keeping students and parents informed on attendance percentages and exam outcomes.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Month-wise Attendance Tracking with 75% Alert</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Digital Term-wise Report Cards & Marks</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Fee Ledger, Dues Balance & Receipt Codes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Weekly Timetable with Highlighted Today View</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Student Biodata & Parent Contact Info</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SLIDE / SECTION 3: ENTERPRISE ARCHITECTURE & MODULES
          ══════════════════════════════════════════════════ */}
      <section id="architecture" className="py-20 px-6 max-w-7xl mx-auto w-full border-b border-slate-200/80">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#3d9be0]">Why CodeNCampus</span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6d] tracking-tight">
            Built for Reliability, Security & Simplicity
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            A robust and secure platform designed to handle the daily needs of schools — from small institutions to large campuses with thousands of students.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Security</span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">Secure Role-Based Login</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Every user gets a protected login. Admins, teachers, and students each see only the data and controls relevant to their role — nothing more, nothing less.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Management</span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">Complete Record System</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              11 interconnected modules covering students, teachers, subjects, attendance, exams, results, fees, timetable, and notices — all in one place.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Ready to Use</span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">Instant Demo Access</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Try the full system immediately with 37 pre-loaded demo accounts, complete attendance history, exam results, and fee records — no setup required.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Design</span>
            <h3 className="text-base font-bold text-slate-900 mt-2 mb-1">Works on Every Device</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clean, fast interface that works perfectly on phones, tablets, and laptops — with live interactive charts and dashboards for quick insights.
            </p>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          SLIDE / SECTION 4: ANAZK TECHNOLOGIES PARENT ECOSYSTEM
          ══════════════════════════════════════════════════ */}
      <section id="parent" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl bg-[#1a3a6d] text-white p-8 sm:p-12 lg:p-14 shadow-xl">
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-white/10 text-xs font-bold text-blue-200">
                <Building2 className="w-3.5 h-3.5 text-[#3d9be0]" />
                Parent Company Overview
              </div>
              
              <h2 className="text-3xl sm:text-4xl font-black leading-tight text-white">
                Anazk Technologies Private Limited
              </h2>

              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                CodeNCampus is built as the institutional management arm of <strong>Anazk Technologies</strong>. Our mission is to engineer high-integrity educational software for universities, colleges, and schools across India.
              </p>

              <div className="pt-2">
                <a
                  href="https://anazk.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#1a3a6d] hover:bg-blue-50 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                >
                  Visit anazk.online
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="lg:col-span-5 space-y-3">
              <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#3d9be0]">Product 01</span>
                <h4 className="font-bold text-sm text-white mt-0.5">CodeNCampus (This Platform)</h4>
                <p className="text-xs text-slate-300 mt-1">K-12 School Management & University UMS Suite.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Product 02</span>
                <h4 className="font-bold text-sm text-white mt-0.5">CodeNCommit</h4>
                <p className="text-xs text-slate-300 mt-1">Coding lab environment with 10-language auto-graded compiler.</p>
              </div>

              <div className="p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400">Product 03</span>
                <h4 className="font-bold text-sm text-white mt-0.5">CodeNBrowser</h4>
                <p className="text-xs text-slate-300 mt-1">Secure exam lockdown browser with AI cheating prevention.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          COMPREHENSIVE MULTI-COLUMN ENTERPRISE FOOTER
          ══════════════════════════════════════════════════ */}
      <footer className="border-t border-slate-200 bg-white mt-auto pt-16 pb-12 text-slate-600 text-xs">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          
          {/* Col 1: Brand & Parent Details */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <img src="/anazk-logo-dark.png" alt="Anazk Technologies" className="h-7 w-auto object-contain" />
              <span className="text-slate-300">|</span>
              <span className="font-black text-[#1a3a6d] text-base">CodeNCampus</span>
            </div>
            
            <p className="text-slate-500 leading-relaxed max-w-sm">
              CodeNCampus is an enterprise School Management System (UMS) developed by Anazk Technologies Private Limited to automate attendance, grading, timetables, and fee collections for Class 1 to 12 institutions.
            </p>

            <div className="text-[11px] text-slate-400">
              Corporate Entity: <strong>Anazk Technologies Private Limited</strong><br />
              Contact: <a href="mailto:help@codencommit.online" className="text-[#1a3a6d] hover:underline">help@codencommit.online</a> · +91 7986614646
            </div>
          </div>

          {/* Col 2: Modules */}
          <div>
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Core Modules</p>
            <ul className="space-y-2 text-slate-500">
              <li><a href="#overview" className="hover:text-[#1a3a6d]">Student Registry</a></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">Faculty Directory</a></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">1-Click Attendance</a></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">Examination & Marks</a></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">Fee Ledgers & Receipts</a></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">Master Timetable</a></li>
            </ul>
          </div>

          {/* Col 3: Stakeholder Portals */}
          <div>
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Portals</p>
            <ul className="space-y-2 text-slate-500">
              <li><button onClick={() => demoLogin('Admin', 'admin@codencampus.com', 'Admin@123')} className="hover:text-[#1a3a6d] text-left">Admin Portal</button></li>
              <li><button onClick={() => demoLogin('Teacher', 'rajesh@codencampus.com', 'Teacher@123')} className="hover:text-[#1a3a6d] text-left">Teacher Portal</button></li>
              <li><button onClick={() => demoLogin('Student', 'aarav@student.com', 'Student@123')} className="hover:text-[#1a3a6d] text-left">Student Portal</button></li>
              <li><a href="#overview" className="hover:text-[#1a3a6d]">RBAC Security</a></li>
            </ul>
          </div>

          {/* Col 4: Anazk Ecosystem Links */}
          <div>
            <p className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-3">Anazk Ecosystem</p>
            <ul className="space-y-2 text-slate-500">
              <li><a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a3a6d]">Anazk Technologies</a></li>
              <li><a href="https://codencommit.online" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a3a6d]">CodeNCommit Labs</a></li>
              <li><a href="https://anazk.online/products#codenbrowser" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a3a6d]">CodeNBrowser</a></li>
              <li><a href="https://anazk.online/book-demo" target="_blank" rel="noopener noreferrer" className="hover:text-[#1a3a6d]">Book Campus Demo</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © 2024 CodeNCampus. All rights reserved. A subsidiary product of <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="font-bold text-slate-600 hover:underline">Anazk Technologies Private Limited</a>.
          </div>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              All Systems Operational
            </span>
          </div>
        </div>
      </footer>

    </div>
  )
}
