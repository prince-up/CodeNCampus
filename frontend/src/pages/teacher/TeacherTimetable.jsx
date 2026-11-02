import { useEffect, useState } from 'react'
import { getTimetable } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { Calendar, Loader2 } from 'lucide-react'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export default function TeacherTimetable() {
  const profile = useAuthStore(s => s.profile)
  const [cls, setCls] = useState(profile?.classes?.[0] || '10')
  const [section, setSection] = useState('A')
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getTimetable(cls, section)
      .then(r => setTimetable(r.data.data))
      .catch(() => setTimetable([]))
      .finally(() => setLoading(false))
  }, [cls, section])

  const getDayData = (day) => timetable.find(t => t.day === day)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Class Timetable</h1>
      </div>
      <div className="flex gap-3">
        <select value={cls} onChange={e=>setCls(e.target.value)} className="w-32">
          {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
        </select>
        <select value={section} onChange={e=>setSection(e.target.value)} className="w-24">
          {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
        <div className="card overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                {[1,2,3,4,5,6,7,8].map(p=><th key={p}>Period {p}</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(day => {
                const dayData = getDayData(day)
                return (
                  <tr key={day}>
                    <td className="font-semibold text-slate-700 whitespace-nowrap">{day}</td>
                    {[1,2,3,4,5,6,7,8].map(pNo => {
                      const period = dayData?.periods?.find(p=>p.periodNo===pNo)
                      return (
                        <td key={pNo}>
                          {period?.subject ? (
                            <div className="min-w-[90px]">
                              <p className="text-xs font-semibold text-blue-700">{period.subject?.name || 'Subject'}</p>
                              <p className="text-xs text-slate-400">{period.startTime}-{period.endTime}</p>
                            </div>
                          ) : <span className="text-slate-200 text-xs">—</span>}
                        </td>
                      )
                    })}
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
