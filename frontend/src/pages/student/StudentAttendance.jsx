import { useEffect, useState } from 'react'
import { getStudentAttendance } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { Loader2 } from 'lucide-react'

export default function StudentAttendance() {
  const profile = useAuthStore(s => s.profile)
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [month, setMonth] = useState(new Date().getMonth() + 1)
  const [year, setYear] = useState(new Date().getFullYear())

  useEffect(() => {
    if (!profile?._id) return
    setLoading(true)
    getStudentAttendance(profile._id, { month, year })
      .then(r => { setData(r.data.data); setStats(r.data.stats) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile, month, year])

  const pct = parseFloat(stats?.percentage || 0)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Attendance</h1>
      </div>

      <div className="flex gap-3">
        <select value={month} onChange={e=>setMonth(e.target.value)} className="w-36">
          {['January','February','March','April','May','June','July','August','September','October','November','December'].map((m,i)=>(
            <option key={m} value={i+1}>{m}</option>
          ))}
        </select>
        <select value={year} onChange={e=>setYear(e.target.value)} className="w-24">
          {[2024,2025,2026].map(y=><option key={y}>{y}</option>)}
        </select>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-4 gap-3">
          {[
            { label:'Total', value:stats.total, color:'text-slate-700' },
            { label:'Present', value:stats.present, color:'text-green-600' },
            { label:'Absent', value:stats.absent, color:'text-red-600' },
            { label:'Late', value:stats.late, color:'text-yellow-600' },
          ].map(s => (
            <div key={s.label} className="card text-center py-4">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {stats && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Overall Attendance</span>
            <span className={`text-lg font-bold ${pct>=75?'text-green-600':pct>=60?'text-yellow-500':'text-red-600'}`}>{pct}%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3">
            <div className={`h-3 rounded-full transition-all ${pct>=75?'bg-green-500':pct>=60?'bg-yellow-500':'bg-red-500'}`} style={{width:`${Math.min(pct,100)}%`}}/>
          </div>
          {pct < 75 && <p className="text-xs text-red-500 mt-2">⚠️ Your attendance is below 75%. Please attend regularly.</p>}
        </div>
      )}

      <div className="card">
        <h2 className="font-semibold text-slate-700 mb-4">Attendance Records</h2>
        {loading ? <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-blue-500"/></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Date</th><th>Subject</th><th>Status</th></tr></thead>
              <tbody>
                {data.map(a => (
                  <tr key={a._id}>
                    <td>{new Date(a.date).toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}</td>
                    <td>{a.subject?.name}</td>
                    <td><span className={`badge-${a.status} capitalize`}>{a.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.length === 0 && <p className="text-center py-8 text-slate-400">No records for selected period</p>}
          </div>
        )}
      </div>
    </div>
  )
}
