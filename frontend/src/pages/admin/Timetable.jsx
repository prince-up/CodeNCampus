import { useEffect, useState } from 'react'
import { getTimetable, saveTimetable, getSubjects, getTeachers } from '../../utils/api'
import { Save, Loader2, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
const PERIODS = [
  { no:1, start:'08:00', end:'08:45' },
  { no:2, start:'08:45', end:'09:30' },
  { no:3, start:'09:30', end:'10:15' },
  { no:4, start:'10:30', end:'11:15' },
  { no:5, start:'11:15', end:'12:00' },
  { no:6, start:'12:00', end:'12:45' },
  { no:7, start:'13:30', end:'14:15' },
  { no:8, start:'14:15', end:'15:00' },
]

export default function Timetable() {
  const [cls, setCls] = useState('10')
  const [section, setSection] = useState('A')
  const [timetable, setTimetable] = useState({})
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(null)

  useEffect(() => {
    Promise.all([getSubjects(), getTeachers()])
      .then(([s,t]) => { setSubjects(s.data.data); setTeachers(t.data.data) })
  }, [])

  const loadTimetable = async () => {
    setLoading(true)
    try {
      const r = await getTimetable(cls, section)
      const map = {}
      r.data.data.forEach(day => {
        map[day.day] = {}
        day.periods.forEach(p => { map[day.day][p.periodNo] = { subject: p.subject?._id||'', teacher: p.teacher?._id||'' } })
      })
      setTimetable(map)
    } catch { setTimetable({}) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadTimetable() }, [cls, section])

  const getCell = (day, pNo) => timetable[day]?.[pNo] || { subject:'', teacher:'' }
  const setCell = (day, pNo, field, val) => {
    setTimetable(prev => ({
      ...prev,
      [day]: { ...prev[day], [pNo]: { ...getCell(day, pNo), [field]: val } }
    }))
  }

  const saveDay = async (day) => {
    setSaving(day)
    const periods = PERIODS.map(p => {
      const cell = getCell(day, p.no)
      return { periodNo: p.no, startTime: p.start, endTime: p.end, subject: cell.subject||undefined, teacher: cell.teacher||undefined }
    }).filter(p => p.subject)
    try {
      await saveTimetable({ class: cls, section, day, periods })
      toast.success(`${day} timetable saved!`)
    } catch { toast.error('Save failed') }
    finally { setSaving(null) }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-bold text-slate-800">Timetable</h1></div>
        <div className="flex items-center gap-3">
          <select value={cls} onChange={e=>setCls(e.target.value)} className="w-32">
            {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
          </select>
          <select value={section} onChange={e=>setSection(e.target.value)} className="w-24">
            {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
        <div className="space-y-4">
          {DAYS.map(day => (
            <div key={day} className="card">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-slate-700 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-500"/> {day}
                </h3>
                <button onClick={() => saveDay(day)} disabled={saving===day} className="btn-primary text-xs px-3 py-1.5 flex items-center gap-1">
                  {saving===day ? <Loader2 className="w-3 h-3 animate-spin"/> : <Save className="w-3 h-3"/>} Save
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {PERIODS.map(p => (
                  <div key={p.no} className="border border-slate-100 rounded-lg p-2 bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 mb-1">P{p.no} · {p.start}-{p.end}</p>
                    <select value={getCell(day,p.no).subject} onChange={e=>setCell(day,p.no,'subject',e.target.value)} className="text-xs mb-1 py-1">
                      <option value="">— Subject —</option>
                      {subjects.filter(s=>s.class===cls).map(s=><option key={s._id} value={s._id}>{s.name}</option>)}
                    </select>
                    <select value={getCell(day,p.no).teacher} onChange={e=>setCell(day,p.no,'teacher',e.target.value)} className="text-xs py-1">
                      <option value="">— Teacher —</option>
                      {teachers.map(t=><option key={t._id} value={t._id}>{t.user?.name}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
