import { useEffect, useState } from 'react'
import { getExams, getStudents, getSubjects, saveResults } from '../../utils/api'
import { Save, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function EnterMarks() {
  const [exams, setExams] = useState([])
  const [subjects, setSubjects] = useState([])
  const [students, setStudents] = useState([])
  const [selectedExam, setSelectedExam] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [cls, setCls] = useState('10')
  const [marks, setMarks] = useState({})
  const [saving, setSaving] = useState(false)
  const [totalMarks, setTotalMarks] = useState(100)

  useEffect(() => {
    getExams(cls).then(r => setExams(r.data.data))
    getSubjects(cls).then(r => setSubjects(r.data.data))
    getStudents().then(r => setStudents(r.data.data.filter(s => s.class === cls)))
  }, [cls])

  useEffect(() => {
    if (selectedExam) {
      const exam = exams.find(e => e._id === selectedExam)
      if (exam) setTotalMarks(exam.totalMarks)
    }
  }, [selectedExam, exams])

  const handleSave = async () => {
    if (!selectedExam || !selectedSubject) return toast.error('Select exam and subject')
    setSaving(true)
    try {
      const results = Object.entries(marks)
        .filter(([,v]) => v !== '')
        .map(([studentId, m]) => ({
          studentId, examId: selectedExam, subjectId: selectedSubject,
          marksObtained: parseFloat(m), totalMarks
        }))
      if (results.length === 0) return toast.error('Enter at least one mark')
      await saveResults({ results })
      toast.success('Marks saved successfully!')
    } catch { toast.error('Failed to save') }
    finally { setSaving(false) }
  }

  const getGrade = (m) => {
    const pct = (m / totalMarks) * 100
    if (pct >= 90) return { g:'A+', c:'text-green-600' }
    if (pct >= 80) return { g:'A', c:'text-green-600' }
    if (pct >= 70) return { g:'B+', c:'text-blue-600' }
    if (pct >= 60) return { g:'B', c:'text-blue-600' }
    if (pct >= 50) return { g:'C', c:'text-yellow-600' }
    if (pct >= 33) return { g:'D', c:'text-orange-600' }
    return { g:'F', c:'text-red-600' }
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Enter Marks</h1>
        <p className="text-slate-500 text-sm">Enter exam marks for students</p>
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
            <label className="block text-sm font-medium text-slate-700 mb-1">Exam</label>
            <select value={selectedExam} onChange={e => setSelectedExam(e.target.value)}>
              <option value="">Select Exam</option>
              {exams.map(e=><option key={e._id} value={e._id}>{e.name} ({e.term})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <select value={selectedSubject} onChange={e => setSelectedSubject(e.target.value)}>
              <option value="">Select Subject</option>
              {subjects.map(s=><option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label>
            <input type="number" value={totalMarks} onChange={e=>setTotalMarks(parseInt(e.target.value))} readOnly/>
          </div>
        </div>

        {students.length === 0 ? (
          <p className="text-center py-8 text-slate-400">No students in Class {cls}</p>
        ) : (
          <>
            <table>
              <thead><tr><th>#</th><th>Student</th><th>Roll No</th><th>Marks Obtained (/{totalMarks})</th><th>Grade</th></tr></thead>
              <tbody>
                {students.map((s, i) => {
                  const m = marks[s._id]
                  const grade = m !== undefined && m !== '' ? getGrade(parseFloat(m)) : null
                  return (
                    <tr key={s._id}>
                      <td className="text-slate-400">{i+1}</td>
                      <td className="font-medium text-slate-800">{s.user?.name}</td>
                      <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{s.rollNo}</span></td>
                      <td>
                        <input type="number" min="0" max={totalMarks} value={marks[s._id]||''}
                          onChange={e=>setMarks(p=>({...p,[s._id]:e.target.value}))}
                          placeholder="Enter marks" className="w-28 text-center" />
                      </td>
                      <td>
                        {grade && <span className={`font-bold text-sm ${grade.c}`}>{grade.g}</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <button onClick={handleSave} disabled={saving} className="btn-primary mt-4 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
              Save All Marks
            </button>
          </>
        )}
      </div>
    </div>
  )
}
