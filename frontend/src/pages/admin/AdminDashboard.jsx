import { useEffect, useState } from 'react'
import { getAdminStats, getNotices } from '../../utils/api'
import { Users, UserCheck, ClipboardList, DollarSign, Bell, GraduationCap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-72">
        <div className="w-8 h-8 border-3 border-[#1a3a6d] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const classChartData = stats?.classStats?.map(c => ({
    name: `Class ${c._id}`,
    students: c.count
  })) || []

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-xs text-slate-500 mt-0.5">Welcome back to the administrative portal</p>
        </div>
        <div className="text-xs text-slate-500 bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
          Academic Year 2024-25
        </div>
      </div>

      {/* Metric Cards - Simple & Crisp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: stats?.totalStudents || 0, icon: Users, sub: 'Active enrollments' },
          { label: 'Total Teachers', value: stats?.totalTeachers || 0, icon: UserCheck, sub: 'Teaching staff' },
          { label: 'Today Attendance', value: `${stats?.attendancePercent || 0}%`, icon: ClipboardList, sub: 'Average presence' },
          { label: 'Fee Collection', value: `₹${((stats?.collectedFee || 0)/1000).toFixed(0)}K`, icon: DollarSign, sub: `₹${((stats?.pendingFee || 0)/1000).toFixed(0)}K pending` },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{m.label}</span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <m.icon className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-slate-900">{m.value}</div>
            <p className="text-xs text-slate-400 mt-1">{m.sub}</p>
          </div>
        ))}
      </div>

      {/* Main Grid: Chart & Notice Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Enrollment */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-bold text-slate-800">Students per Class</h2>
              <p className="text-xs text-slate-400">Class 1 to 12 distribution</p>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={classChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a3a6d',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="students" fill="#1a3a6d" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Notices */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Bell className="w-4 h-4 text-slate-500" />
                Latest Notices
              </h2>
            </div>

            {notices.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">No notices available</p>
            ) : (
              <div className="space-y-3">
                {notices.map((n) => (
                  <div key={n._id} className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="text-xs font-bold text-slate-800 truncate">{n.title}</p>
                      {n.priority === 'urgent' && (
                        <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.2 rounded font-semibold uppercase">
                          Urgent
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      {new Date(n.date).toLocaleDateString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
