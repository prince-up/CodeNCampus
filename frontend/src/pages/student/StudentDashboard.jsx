import { useEffect, useState } from 'react'
import { getStudentAttendance, getStudentResults, getStudentFees, getNotices } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { ClipboardList, FileText, DollarSign, Bell } from 'lucide-react'

export default function StudentDashboard() {
  const user = useAuthStore(s => s.user)
  const profile = useAuthStore(s => s.profile)
  const [attStats, setAttStats] = useState(null)
  const [results, setResults] = useState([])
  const [feeStats, setFeeStats] = useState(null)
  const [notices, setNotices] = useState([])

  useEffect(() => {
    if (!profile?._id) return
    getStudentAttendance(profile._id).then(r => setAttStats(r.data.stats))
    getStudentResults(profile._id).then(r => setResults(r.data.data || []))
    getStudentFees(profile._id).then(r => setFeeStats(r.data.stats))
    getNotices({ role:'student' }).then(r => setNotices(r.data.data?.slice(0,4)||[]))
  }, [profile])

  const lastResults = results.slice(0,3)
  const attPct = parseFloat(attStats?.percentage || 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Hello, {user?.name}! 👋</h1>
        <p className="text-slate-500 text-sm">Class {profile?.class}-{profile?.section} · Roll No: {profile?.rollNo}</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className={`text-3xl font-bold mb-1 ${attPct>=75?'text-green-600':attPct>=60?'text-yellow-500':'text-red-600'}`}>{attStats?.percentage||0}%</div>
          <p className="text-xs text-slate-500">Attendance</p>
          {attPct < 75 && <p className="text-xs text-red-500 mt-1">⚠️ Low</p>}
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{results.length}</div>
          <p className="text-xs text-slate-500">Results Available</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-500 mb-1">₹{((feeStats?.balance||0)/1000).toFixed(1)}K</div>
          <p className="text-xs text-slate-500">Fee Pending</p>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-500 mb-1">{notices.length}</div>
          <p className="text-xs text-slate-500">Notices</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Results */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><FileText className="w-4 h-4 text-blue-500"/>Recent Results</h2>
          {lastResults.length === 0 ? <p className="text-slate-400 text-sm py-4 text-center">No results yet</p> : (
            <div className="space-y-2">
              {lastResults.map(r => {
                const pct = ((r.marksObtained/r.totalMarks)*100).toFixed(0)
                return (
                  <div key={r._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-slate-700">{r.subject?.name}</p>
                      <p className="text-xs text-slate-400">{r.exam?.name} · {r.exam?.term}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">{r.marksObtained}/{r.totalMarks}</p>
                      <span className={`text-xs font-bold ${
                        r.grade==='A+'||r.grade==='A'?'text-green-600':
                        r.grade==='B+'||r.grade==='B'?'text-blue-600':
                        r.grade==='F'?'text-red-600':'text-yellow-600'
                      }`}>{r.grade}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Notices */}
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500"/>Notices</h2>
          {notices.length === 0 ? <p className="text-slate-400 text-sm py-4 text-center">No notices</p> : (
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n._id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.priority==='urgent'?'bg-red-500':'bg-blue-400'}`}/>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{n.title}</p>
                    <p className="text-xs text-slate-500 line-clamp-1">{n.body}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{new Date(n.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
