import { useEffect, useState } from 'react'
import { getAdminStats, getNotices } from '../../utils/api'
import { Users, UserCheck, ClipboardList, DollarSign, TrendingUp, Bell, GraduationCap, BookOpen, ArrowUpRight, ArrowDownRight, Sparkles } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const StatCard = ({ label, value, icon: Icon, color, sub, trend }) => (
  <div className="card relative overflow-hidden group">
    <div className="flex items-start justify-between">
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
        {sub && (
          <p className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-1">
            {sub}
          </p>
        )}
      </div>
      <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-105 duration-200`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
)

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getAdminStats(), getNotices()])
      .then(([s, n]) => {
        setStats(s.data.data)
        setNotices(n.data.data?.slice(0, 5) || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center h-80">
      <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
    </div>
  )

  const classChartData = stats?.classStats?.map(c => ({
    name: `Class ${c._id}`,
    students: c.count
  })) || []

  const feeData = [
    { name: 'Collected', value: stats?.collectedFee || 0 },
    { name: 'Pending', value: stats?.pendingFee || 0 },
  ]

  return (
    <div className="space-y-8">
      {/* Welcome Banner matching Anazk PageHero theme */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#050f4a] via-[#1a3a6d] to-blue-900 text-white p-8 sm:p-10 shadow-xl border border-white/10">
        <div className="absolute inset-0 grid-bg-dark opacity-30 pointer-events-none" />
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-blue-200 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#3d9be0]" /> Executive Institutional Overview
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            Welcome to CodeNCampus Central
          </h1>
          <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
            Monitor real-time academic records, attendance metrics, financial distributions, and communication across all class cohorts.
          </p>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          label="Active Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-blue-500/30"
          sub="30 demo profiles enrolled"
        />
        <StatCard
          label="Faculty Members"
          value={stats?.totalTeachers || 0}
          icon={UserCheck}
          color="bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-emerald-500/30"
          sub="Across 27 subject courses"
        />
        <StatCard
          label="Overall Attendance"
          value={`${stats?.attendancePercent || 0}%`}
          icon={ClipboardList}
          color="bg-gradient-to-tr from-amber-500 to-orange-600 shadow-amber-500/30"
          sub="Daily check-in aggregate"
        />
        <StatCard
          label="Fee Collection"
          value={`₹${((stats?.collectedFee || 0)/1000).toFixed(0)}K`}
          icon={DollarSign}
          color="bg-gradient-to-tr from-purple-600 to-pink-600 shadow-purple-500/30"
          sub={`₹${((stats?.pendingFee || 0)/1000).toFixed(0)}K pending dues`}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Class Enrollment Bar Chart */}
        <div className="card xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-blue-600" />
                Student Enrollment by Grade Cohort
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Classes 1 through 12 capacity distribution</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200/60">
              Live Aggregate
            </span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={classChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#050f4a',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)'
                }}
              />
              <Bar dataKey="students" fill="url(#barGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3d9be0" />
                  <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fee Collection Pie Chart */}
        <div className="card flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-1">
              <DollarSign className="w-4 h-4 text-purple-600" />
              Fee Realization Ratio
            </h2>
            <p className="text-xs text-slate-400 mb-4">Total billed vs collected tuition fees</p>
            
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie data={feeData} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                  <Cell fill="#10b981" />
                  <Cell fill="#f43f5e" />
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString()}`}
                  contentStyle={{
                    backgroundColor: '#050f4a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">Collected</span>
              <span className="text-base font-black text-emerald-800">₹{((stats?.collectedFee || 0)/1000).toFixed(0)}K</span>
            </div>
            <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100">
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 block">Pending</span>
              <span className="text-base font-black text-rose-800">₹{((stats?.pendingFee || 0)/1000).toFixed(0)}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Broadcasts & Notices */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Bell className="w-4 h-4 text-[#3d9be0]" />
              Official Campus Announcements
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Recent circulars broadcasted to students & staff</p>
          </div>
        </div>

        {notices.length === 0 ? (
          <p className="text-slate-400 text-sm py-8 text-center">No active announcements</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {notices.map((n) => (
              <div key={n._id} className="py-3.5 first:pt-0 last:pb-0 flex items-start gap-4">
                <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${n.priority === 'urgent' ? 'bg-rose-500 ring-4 ring-rose-100' : 'bg-blue-400'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                    <p className="text-sm font-bold text-slate-800 tracking-tight">{n.title}</p>
                    {n.priority === 'urgent' && (
                      <span className="text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Urgent
                      </span>
                    )}
                    <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full capitalize">
                      {n.targetRole}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    {new Date(n.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
