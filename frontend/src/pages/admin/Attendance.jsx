import { useEffect, useState } from 'react'
import { getAttendanceReport, getClassAttendance, getStudents, getSubjects } from '../../utils/api'
import { Loader2, BarChart2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Attendance() {
  const [report, setReport] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAttendanceReport()
      .then(r => setReport(r.data.data))
      .catch(() => toast.error('Failed to load'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Attendance Report</h1>
        <p className="text-slate-500 text-sm">Student-wise attendance overview</p>
      </div>
      <div className="card">
        {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Roll No</th><th>Student</th><th>Class</th><th>Total Classes</th><th>Present</th><th>Attendance %</th><th>Status</th></tr></thead>
              <tbody>
                {report.map((r, i) => {
                  const pct = parseFloat(r.percentage)
                  return (
                    <tr key={i}>
                      <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.student?.rollNo}</span></td>
                      <td className="font-medium">{r.student?.user?.name}</td>
                      <td>Class {r.student?.class}-{r.student?.section}</td>
                      <td>{r.totalClasses}</td>
                      <td>{r.present}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-slate-100 rounded-full h-2 w-20">
                            <div className={`h-2 rounded-full ${pct >= 75 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${Math.min(pct,100)}%` }} />
                          </div>
                          <span className={`text-xs font-semibold ${pct >= 75 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {pct}%
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          pct >= 75 ? 'bg-green-100 text-green-700' :
                          pct >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {pct >= 75 ? 'Good' : pct >= 60 ? 'Average' : 'Low ⚠️'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {report.length === 0 && (
              <div className="text-center py-12 text-slate-400">
                <BarChart2 className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                <p>No attendance data yet. Teachers need to mark attendance first.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
