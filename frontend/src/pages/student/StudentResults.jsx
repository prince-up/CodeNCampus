import { useEffect, useState } from 'react'
import { getStudentResults } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { FileText, Loader2 } from 'lucide-react'

const gradeColor = (g) => {
  if (g==='A+'||g==='A') return 'bg-green-100 text-green-700'
  if (g==='B+'||g==='B') return 'bg-blue-100 text-blue-700'
  if (g==='C') return 'bg-yellow-100 text-yellow-700'
  if (g==='D') return 'bg-orange-100 text-orange-700'
  return 'bg-red-100 text-red-700'
}

export default function StudentResults() {
  const profile = useAuthStore(s => s.profile)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)
  const [grouped, setGrouped] = useState({})

  useEffect(() => {
    if (!profile?._id) return
    getStudentResults(profile._id)
      .then(r => {
        const data = r.data.data || []
        setResults(data)
        // Group by exam
        const g = {}
        data.forEach(res => {
          const examName = `${res.exam?.name} (${res.exam?.term})`
          if (!g[examName]) g[examName] = []
          g[examName].push(res)
        })
        setGrouped(g)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile])

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div>

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-slate-800">My Results</h1></div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card text-center py-12">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-200"/>
          <p className="text-slate-400">No results available yet</p>
        </div>
      ) : (
        Object.entries(grouped).map(([examName, examResults]) => {
          const total = examResults.reduce((s,r) => s+r.marksObtained, 0)
          const maxTotal = examResults.reduce((s,r) => s+r.totalMarks, 0)
          const pct = maxTotal > 0 ? ((total/maxTotal)*100).toFixed(1) : 0
          return (
            <div key={examName} className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-slate-700">{examName}</h2>
                <div className="text-right">
                  <p className="text-lg font-bold text-blue-600">{total}/{maxTotal}</p>
                  <p className="text-xs text-slate-400">{pct}%</p>
                </div>
              </div>
              <table>
                <thead><tr><th>Subject</th><th>Marks</th><th>Total</th><th>%</th><th>Grade</th></tr></thead>
                <tbody>
                  {examResults.map(r => (
                    <tr key={r._id}>
                      <td className="font-medium">{r.subject?.name}</td>
                      <td className="font-semibold text-blue-700">{r.marksObtained}</td>
                      <td className="text-slate-400">{r.totalMarks}</td>
                      <td>{((r.marksObtained/r.totalMarks)*100).toFixed(0)}%</td>
                      <td><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${gradeColor(r.grade)}`}>{r.grade}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2">
                <div className="flex-1 bg-slate-100 rounded-full h-2">
                  <div className={`h-2 rounded-full ${parseFloat(pct)>=33?'bg-blue-500':'bg-red-500'}`} style={{width:`${Math.min(pct,100)}%`}}/>
                </div>
                <span className={`text-xs font-semibold ${parseFloat(pct)>=33?'text-blue-600':'text-red-600'}`}>
                  {parseFloat(pct)>=33?'PASS':'FAIL'}
                </span>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
