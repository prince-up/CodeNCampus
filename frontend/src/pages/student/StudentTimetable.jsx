import { useEffect, useState } from 'react'
import { getTimetable } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { Loader2 } from 'lucide-react'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const DAY_COLORS = { Monday:'bg-blue-50', Tuesday:'bg-purple-50', Wednesday:'bg-green-50', Thursday:'bg-orange-50', Friday:'bg-pink-50', Saturday:'bg-yellow-50' }

export default function StudentTimetable() {
  const profile = useAuthStore(s => s.profile)
  const [timetable, setTimetable] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?.class) return
    getTimetable(profile.class, profile.section || 'A')
      .then(r => setTimetable(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile])

  const getDayData = (day) => timetable.find(t => t.day === day)
  const today = new Date().toLocaleDateString('en-US', { weekday:'long' })

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">My Timetable</h1>
        <p className="text-slate-500 text-sm">Class {profile?.class}-{profile?.section}</p>
      </div>

      {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
        <div className="space-y-4">
          {DAYS.map(day => {
            const dayData = getDayData(day)
            const isToday = day === today
            return (
              <div key={day} className={`card ${isToday ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
                <div className="flex items-center gap-2 mb-3">
                  <h3 className={`font-semibold ${isToday?'text-blue-600':'text-slate-700'}`}>{day}</h3>
                  {isToday && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Today</span>}
                </div>
                {!dayData || dayData.periods?.length === 0 ? (
                  <p className="text-slate-300 text-sm">No classes</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {dayData.periods?.sort((a,b)=>a.periodNo-b.periodNo).map(p => (
                      <div key={p.periodNo} className={`${DAY_COLORS[day]||'bg-slate-50'} rounded-lg p-3 border border-white`}>
                        <p className="text-xs text-slate-400 mb-1">P{p.periodNo} · {p.startTime}-{p.endTime}</p>
                        <p className="text-sm font-semibold text-slate-700">{p.subject?.name}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{p.teacher?.user?.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
