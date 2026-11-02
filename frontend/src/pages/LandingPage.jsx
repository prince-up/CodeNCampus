import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap, Users, Calendar, FileText, DollarSign,
  ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, School,
  Sparkles, BookOpen, Clock, Award, BarChart3, Bell, ArrowUpRight
} from 'lucide-react'

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState('admin')

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      
      {/* ── Top Global Navbar (Anazk Tech Standard) ── */}
      <header className="border-b border-slate-200/80 bg-white/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="hover:opacity-90 transition-opacity flex items-center">
              <img src="/anazk-logo-dark.png" alt="Anazk Technologies" className="h-8 w-auto object-contain" />
            </a>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black text-[#1a3a6d] tracking-tight">CodeNCampus</span>
              <span className="text-[10px] font-bold text-[#3d9be0] bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded uppercase tracking-wider">
                UMS Suite
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <a href="#features" className="hover:text-[#1a3a6d] transition-colors">Features</a>
            <a href="#portals" className="hover:text-[#1a3a6d] transition-colors">Portals</a>
            <a href="#modules" className="hover:text-[#1a3a6d] transition-colors">Modules</a>
            <a href="#faq" className="hover:text-[#1a3a6d] transition-colors">Architecture</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#1a3a6d] px-4 py-2.5 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold bg-[#1a3a6d] hover:bg-[#142e56] text-white px-5 py-2.5 rounded-lg transition-all shadow-sm hover:shadow"
            >
              Live Demo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f8fafc] via-white to-white pt-16 pb-24 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200/70 text-xs font-bold text-[#1a3a6d]">
              <span className="w-2 h-2 rounded-full bg-[#3d9be0] animate-pulse"></span>
              An Anazk Technologies Educational Software Product
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-[#1a3a6d] tracking-tight leading-[1.12]">
              The Unified Operating System for <span className="text-[#3d9be0]">K–12 Campuses</span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
              CodeNCampus connects administrators, teachers, and students on a single enterprise platform. Attendance, automated gradecards, fee collections, and timetables — seamlessly synchronized.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#1a3a6d] hover:bg-[#142e56] text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-blue-900/10 hover:shadow-xl transition-all"
              >
                Launch Demo Portal
                <ArrowRight className="w-5 h-5" />
              </Link>
              <a
                href="#features"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 px-7 py-4 rounded-xl font-bold text-base hover:bg-slate-50 transition-colors"
              >
                Explore Modules
              </a>
            </div>

            {/* Quick stats counter */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-200/80 max-w-4xl mx-auto text-left">
              <div>
                <p className="text-3xl font-black text-[#1a3a6d]">1 to 12</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Classes Supported</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#1a3a6d]">3 Portals</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Admin, Faculty, Student</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#1a3a6d]">100%</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Digital Workflow</p>
              </div>
              <div>
                <p className="text-3xl font-black text-[#1a3a6d]">Real-Time</p>
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mt-0.5">Marks & Attendance</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Product Preview / Mockup Strip ── */}
      <section className="py-16 bg-[#f8fafc] border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Interactive Portal Suite</span>
                <h2 className="text-2xl font-black text-[#1a3a6d] mt-1">Experience All Three Personas</h2>
              </div>
              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
                {[
                  { id: 'admin', label: 'Admin Portal' },
                  { id: 'teacher', label: 'Teacher Hub' },
                  { id: 'student', label: 'Student Dashboard' },
                ].map(t => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id)}
                    className={`px-4 py-2 rounded-lg transition-all ${activeTab === t.id ? 'bg-[#1a3a6d] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Preview Content */}
            <div className="pt-6">
              {activeTab === 'admin' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <Users className="w-6 h-6 text-[#1a3a6d] mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Student & Faculty Records</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Add, modify, search, and assign students to sections A-D across all 12 grades with instant teacher allocations.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <BarChart3 className="w-6 h-6 text-[#3d9be0] mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Attendance & Fee Realization</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">School-wide attendance percentage calculations with warnings for students below 75%, and live fee realization ledger.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <Bell className="w-6 h-6 text-purple-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Notice & Timetable Scheduler</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Targeted notices (All / Teachers / Students) with priority flags, and 8-period weekly master timetable designer.</p>
                  </div>
                </div>
              )}

              {activeTab === 'teacher' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <Calendar className="w-6 h-6 text-emerald-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">1-Click Daily Attendance</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Present, Absent, and Late attendance marking with bulk 'Mark All Present' helper to save teacher time.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <Award className="w-6 h-6 text-blue-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Marks Entry & Auto Grading</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Enter examination marks for Unit Tests and Term Finals with real-time grade generation from A+ to F.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <Clock className="w-6 h-6 text-amber-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Assigned Classes & Schedule</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Faculty view of daily timetable periods, subject mappings, and department notices.</p>
                  </div>
                </div>
              )}

              {activeTab === 'student' && (
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <BarChart3 className="w-6 h-6 text-[#1a3a6d] mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Monthly Attendance Tracker</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Month-by-month attendance progress bars with warning alerts if attendance drops below mandatory 75%.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <FileText className="w-6 h-6 text-emerald-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Report Cards & Term Marks</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Comprehensive marksheet categorized by exam term with individual subject breakdown, total, and pass/fail status.</p>
                  </div>
                  <div className="p-5 rounded-xl border border-slate-200/80 bg-slate-50">
                    <DollarSign className="w-6 h-6 text-amber-600 mb-3" />
                    <h3 className="font-bold text-slate-900 mb-1">Fee Clearance & Receipts</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">Clear breakdown of paid vs pending fees with generated receipt tracking numbers for parent reference.</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Ready to see it in action?</span>
              <Link to="/login" className="text-xs font-bold text-[#1a3a6d] hover:text-[#3d9be0] flex items-center gap-1 transition-colors">
                Launch Live Demo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9 Core Modules Grid ── */}
      <section id="modules" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3d9be0]">Complete Institutional Coverage</span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6d]">Everything a School Needs to Run</h2>
            <p className="text-slate-600 text-sm sm:text-base">Built specifically for Class 1 to 12 school administrations following national curriculum structures.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Student Management', desc: 'Central student registry with roll numbers, blood group, guardian details, and class sections.' },
              { title: 'Faculty & Subject Mapping', desc: 'Manage teaching staff credentials, employee IDs, subject assignments, and departmental roles.' },
              { title: 'Class & Section Builder', desc: 'Define classes 1 through 12, divide cohorts into sections A-D, and assign dedicated class teachers.' },
              { title: 'Daily Attendance Engine', desc: 'Period and daily attendance tracking with automated calculation of student attendance percentage.' },
              { title: 'Exams & Automated Grading', desc: 'Unit Tests, Term 1, Term 2, and Final Exams with standardized A+, A, B, C, D, and F grading hooks.' },
              { title: 'Fee Accounting & Ledgers', desc: 'Monthly tuition fees, examination dues, balance tracking, and auto-generated receipt serials.' },
              { title: 'Master Timetable Scheduler', desc: 'Configurable 8-period school timetable with automated conflict checking between faculty.' },
              { title: 'Institutional Notice Board', desc: 'Broadcast circulars targeted to all campus members, teachers-only, or students-only.' },
              { title: 'Multi-Role Security (RBAC)', desc: 'Bank-grade JWT authentication ensuring students, teachers, and admins only access authorized areas.' },
            ].map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-xs transition-all bg-white">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1a3a6d] font-bold text-xs flex items-center justify-center mb-4">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-slate-900 text-base mb-2">{m.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Anazk Ecosystem Callout ── */}
      <section className="py-20 bg-[#1a3a6d] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#3d9be0]">Part of Anazk Technologies</span>
              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Built by the team powering university examination and assessment tech
              </h2>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                CodeNCampus is developed under <strong>Anazk Technologies Private Limited</strong>. Alongside <em>CodeNCommit</em> (automated coding education & evaluation) and <em>CodeNBrowser</em> (secure lockdown exam browser), we engineer enterprise software for modern educational institutions.
              </p>
              <div className="pt-2">
                <a
                  href="https://anazk.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-[#1a3a6d] px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-colors"
                >
                  Visit anazk.online <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="bg-white/10 border border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 backdrop-blur-sm">
              <h3 className="font-bold text-lg text-white">The Anazk EdTech Suite</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-[#3d9be0] uppercase">CodeNCampus (This System)</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Campus & School Management OS</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-emerald-400 uppercase">CodeNCommit</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Coding Labs, Auto-Grading & Assessments</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
                  <div className="text-xs font-bold text-purple-400 uppercase">CodeNBrowser</div>
                  <div className="text-sm font-semibold text-white mt-0.5">Secure Lockdown Exam Browser with AI Proctoring</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action Banner ── */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-black text-[#1a3a6d]">Ready to explore the demo system?</h2>
          <p className="text-slate-600 text-base max-w-xl mx-auto">
            Test all 3 role perspectives immediately. Admin credentials, faculty marks entry, and student attendance are pre-loaded with demo data.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 bg-[#1a3a6d] hover:bg-[#142e56] text-white px-8 py-4 rounded-xl font-bold text-base shadow-md transition-all"
            >
              Enter Demo System <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-200 bg-white py-10 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src="/anazk-logo-dark.png" alt="Anazk Technologies" className="h-6 w-auto object-contain" />
            <span>·</span>
            <span>CodeNCampus Institutional Portal</span>
          </div>
          <div>
            © 2024 CodeNCampus · A Product of <a href="https://anazk.online" target="_blank" rel="noopener noreferrer" className="font-semibold text-slate-800 hover:underline">Anazk Technologies Private Limited</a>. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  )
}
