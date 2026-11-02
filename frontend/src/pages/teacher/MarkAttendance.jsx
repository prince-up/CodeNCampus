import { useEffect, useState } from 'react'
import { getStudents, getSubjects, markAttendance } from '../../utils/api'
import { CheckCircle, XCircle, Clock, Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function MarkAttendance() {
  const [cls, setCls] = useState('10')
  const [section, setSection] = useState('A')
  const [subjectId, setSubjectId] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [subjects, setSubjects] = useState([])
  const [attendance, setAttendance] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    getSubjects(cls).then(r => { setSubjects(r.data.data); setSubjectId(r.data.data[0]?._id||'') })
  }, [cls])

  useEffect(() => {
    getStudents().then(r => {
      const classStudents = r.data.data.filter(s => s.class === cls && s.section === section)
      setStudents(classStudents)
      const init = {}
      classStudents.forEach(s => { init[s._id] = 'present' })
      setAttendance(init)
    })
  }, [cls, section])

  const toggle = (id, status) => setAttendance(p => ({ ...p, [id]: status }))

  const handleSubmit = async () => {
    if (!subjectId) return toast.error('Select a subject')
    setSaving(true)
    try {
      const records = students.map(s => ({ studentId: s._id, status: attendance[s._id] || 'present' }))
      await markAttendance({ records, subjectId, class: cls, section, date })
      toast.success('Attendance marked successfully!')
    } catch { toast.error('Failed to mark attendance') }
    finally { setSaving(false) }
  }

  const presentCount = Object.values(attendance).filter(v => v === 'present').length
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Mark Attendance</h1>
        <p className="text-slate-500 text-sm">Mark daily attendance for your class</p>
      </div>

      <div className="card">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
            <select value={cls} onChange={e => setCls(e.target.value)}>
              {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
            <select value={section} onChange={e => setSection(e.target.value)}>
              {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <select value={subjectId} onChange={e => setSubjectId(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
        </div>

        {/* Stats bar */}
        <div className="flex items-center gap-4 mb-4 p-3 bg-slate-50 rounded-lg">
          <span className="text-sm text-slate-600">Total: <b>{students.length}</b></span>
          <span className="text-sm text-green-600">Present: <b>{presentCount}</b></span>
          <span className="text-sm text-red-600">Absent: <b>{absentCount}</b></span>
          <button onClick={() => { const all={}; students.forEach(s=>{all[s._id]='present'}); setAttendance(all) }}
            className="ml-auto text-xs text-blue-600 hover:underline">Mark All Present</button>
        </div>

        {students.length === 0 ? (
          <p className="text-center py-8 text-slate-400">No students found for Class {cls}-{section}</p>
        ) : (
          <div className="space-y-2">
            {students.map((s, i) => {
              const status = attendance[s._id] || 'present'
              return (
                <div key={s._id} className={`flex items-center gap-4 p-3 rounded-lg border transition-colors ${
                  status==='present' ? 'border-green-200 bg-green-50' :
                  status==='absent' ? 'border-red-200 bg-red-50' :
                  'border-yellow-200 bg-yellow-50'
                }`}>
                  <span className="text-sm text-slate-500 w-6">{i+1}.</span>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 text-sm">{s.user?.name}</p>
                    <p className="text-xs text-slate-400">{s.rollNo}</p>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { val:'present', icon: CheckCircle, label:'P', color:'text-green-600 bg-green-100' },
                      { val:'absent', icon: XCircle, label:'A', color:'text-red-600 bg-red-100' },
                      { val:'late', icon: Clock, label:'L', color:'text-yellow-600 bg-yellow-100' },
                    ].map(btn => (
                      <button key={btn.val} onClick={() => toggle(s._id, btn.val)}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          status === btn.val ? btn.color + ' ring-2 ring-offset-1 ring-current' : 'bg-white text-slate-400 border border-slate-200 hover:border-slate-300'
                        }`}>
                        <btn.icon className="w-3.5 h-3.5"/> {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {students.length > 0 && (
          <button onClick={handleSubmit} disabled={saving}
            className="btn-primary mt-6 w-full flex items-center justify-center gap-2 py-3">
            {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
            Submit Attendance
          </button>
        )}
      </div>
    </div>
  )
}
