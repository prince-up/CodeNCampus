import { useEffect, useState } from 'react'
import { getExams, createExam, deleteExam, getExamResults, getStudents } from '../../utils/api'
import { Plus, Trash2, Eye, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name:'', class:'', section:'A', term:'Term1', startDate:'', endDate:'', totalMarks:100, passingMarks:33 }

export default function Exams() {
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [resultsModal, setResultsModal] = useState(false)
  const [results, setResults] = useState([])
  const [selectedExam, setSelectedExam] = useState(null)

  const fetchExams = async () => {
    try { const r = await getExams(); setExams(r.data.data) }
    catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchExams() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await createExam(form)
      toast.success('Exam created!')
      setModal(false)
      setForm(EMPTY)
      fetchExams()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete exam?')) return
    try { await deleteExam(id); toast.success('Deleted'); fetchExams() }
    catch { toast.error('Failed') }
  }

  const viewResults = async (exam) => {
    setSelectedExam(exam)
    const r = await getExamResults(exam._id)
    setResults(r.data.data)
    setResultsModal(true)
  }

  const termColors = { Term1:'bg-blue-100 text-blue-700', Term2:'bg-purple-100 text-purple-700', Final:'bg-red-100 text-red-700', 'Unit Test':'bg-yellow-100 text-yellow-700' }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Exams & Results</h1></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/> Add Exam</button>
      </div>

      <div className="card">
        {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Exam Name</th><th>Class</th><th>Term</th><th>Date</th><th>Total Marks</th><th>Actions</th></tr></thead>
              <tbody>
                {exams.map(e => (
                  <tr key={e._id}>
                    <td className="font-medium text-slate-800">{e.name}</td>
                    <td>Class {e.class}-{e.section}</td>
                    <td><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${termColors[e.term]||'bg-slate-100 text-slate-600'}`}>{e.term}</span></td>
                    <td>{e.startDate ? new Date(e.startDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td>{e.totalMarks}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => viewResults(e)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Eye className="w-3.5 h-3.5"/></button>
                        <button onClick={() => handleDelete(e._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {exams.length === 0 && <p className="text-center py-8 text-slate-400">No exams created yet</p>}
          </div>
        )}
      </div>

      {/* Add Exam Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Create Exam</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-2"><label className="block text-sm font-medium text-slate-700 mb-1">Exam Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required/></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <select value={form.class} onChange={e=>setForm(p=>({...p,class:e.target.value}))} required>
                  <option value="">Select</option>
                  {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select value={form.section} onChange={e=>setForm(p=>({...p,section:e.target.value}))}>
                  {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Term *</label>
                <select value={form.term} onChange={e=>setForm(p=>({...p,term:e.target.value}))}>
                  {['Term1','Term2','Final','Unit Test'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Total Marks</label><input type="number" value={form.totalMarks} onChange={e=>setForm(p=>({...p,totalMarks:e.target.value}))}/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label><input type="date" value={form.startDate} onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">End Date</label><input type="date" value={form.endDate} onChange={e=>setForm(p=>({...p,endDate:e.target.value}))}/></div>
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">{saving&&<Loader2 className="w-4 h-4 animate-spin"/>}Create Exam</button>
                <button type="button" onClick={()=>setModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {resultsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
              <h2 className="text-lg font-semibold">Results — {selectedExam?.name}</h2>
              <button onClick={() => setResultsModal(false)}><X className="w-5 h-5"/></button>
            </div>
            <div className="p-6">
              {results.length === 0 ? <p className="text-center py-8 text-slate-400">No results entered yet</p> : (
                <table>
                  <thead><tr><th>Student</th><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead>
                  <tbody>
                    {results.map(r => (
                      <tr key={r._id}>
                        <td>{r.student?.user?.name}</td>
                        <td>{r.subject?.name}</td>
                        <td>{r.marksObtained}/{r.totalMarks}</td>
                        <td><span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                          r.grade==='A+'||r.grade==='A'?'bg-green-100 text-green-700':
                          r.grade==='B+'||r.grade==='B'?'bg-blue-100 text-blue-700':
                          r.grade==='C'||r.grade==='D'?'bg-yellow-100 text-yellow-700':
                          'bg-red-100 text-red-700'
                        }`}>{r.grade}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
