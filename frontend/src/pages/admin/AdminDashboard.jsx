import { useEffect, useState } from 'react'
import { getAdminStats, getNotices } from '../../utils/api'
import { Users, UserCheck, ClipboardList, DollarSign, TrendingUp, Bell, GraduationCap, BookOpen } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
  <div className="card flex items-center gap-4">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center shrink-0`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
      {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
    </div>
  </div>
)

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

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
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Students" value={stats?.totalStudents || 0} icon={Users} color="bg-blue-500" />
        <StatCard label="Total Teachers" value={stats?.totalTeachers || 0} icon={UserCheck} color="bg-green-500" />
        <StatCard label="Attendance Today" value={`${stats?.attendancePercent || 0}%`} icon={ClipboardList} color="bg-orange-500" />
        <StatCard label="Fee Collected" value={`₹${((stats?.collectedFee || 0)/1000).toFixed(0)}K`} icon={DollarSign} color="bg-purple-500" sub={`₹${((stats?.pendingFee || 0)/1000).toFixed(0)}K pending`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="card xl:col-span-2">
          <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-blue-500" /> Students per Class
          </h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={classChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="students" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-purple-500" /> Fee Overview
          </h2>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={feeData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value">
                {feeData.map((_, i) => <Cell key={i} fill={i === 0 ? '#10b981' : '#ef4444'} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-green-500 rounded-full inline-block"></span> Collected</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500 rounded-full inline-block"></span> Pending</span>
          </div>
        </div>
      </div>

      {/* Recent Notices */}
      <div className="card">
        <h2 className="text-base font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Bell className="w-4 h-4 text-orange-500" /> Recent Notices
        </h2>
        {notices.length === 0 ? (
          <p className="text-slate-400 text-sm py-4 text-center">No notices yet</p>
        ) : (
          <div className="space-y-3">
            {notices.map((n) => (
              <div key={n._id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.priority === 'urgent' ? 'bg-red-500' : 'bg-blue-400'}`} />
                <div>
                  <p className="text-sm font-medium text-slate-700">{n.title}</p>
                  <p className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString('en-IN')} · {n.targetRole}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
