import { useEffect, useState } from 'react'
import { getSubjects, createSubject, updateSubject, deleteSubject, getTeachers } from '../../utils/api'
import { Plus, Pencil, Trash2, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name:'', code:'', class:'', teacher:'' }

export default function Subjects() {
  const [subjects, setSubjects] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [filterClass, setFilterClass] = useState('')

  const fetchAll = async () => {
    try {
      const [s, t] = await Promise.all([getSubjects(), getTeachers()])
      setSubjects(s.data.data)
      setTeachers(t.data.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const filtered = filterClass ? subjects.filter(s => s.class === filterClass) : subjects

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      if (editing) { await updateSubject(editing, form); toast.success('Updated!') }
      else { await createSubject(form); toast.success('Subject added!') }
      setModal(false); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete subject?')) return
    try { await deleteSubject(id); toast.success('Deleted'); fetchAll() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Subjects</h1></div>
        <button onClick={() => { setEditing(null); setForm(EMPTY); setModal(true) }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Subject
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="w-40">
            <option value="">All Classes</option>
            {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
          </select>
          <span className="text-sm text-slate-400">{filtered.length} subjects</span>
        </div>
        {loading ? <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Code</th><th>Subject</th><th>Class</th><th>Teacher</th><th>Actions</th></tr></thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{s.code}</span></td>
                    <td className="font-medium text-slate-800">{s.name}</td>
                    <td><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs">Class {s.class}</span></td>
                    <td>{s.teacher?.user?.name || <span className="text-slate-400">Not assigned</span>}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditing(s._id); setForm({name:s.name,code:s.code,class:s.class,teacher:s.teacher?._id||''}); setModal(true) }} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-3.5 h-3.5"/></button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5"/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center py-8 text-slate-400">No subjects found</p>}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Subject' : 'Add Subject'}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Subject Name *</label><input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required /></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Subject Code *</label><input value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value}))} required /></div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <select value={form.class} onChange={e=>setForm(p=>({...p,class:e.target.value}))} required>
                  <option value="">Select Class</option>
                  {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Assign Teacher</label>
                <select value={form.teacher} onChange={e=>setForm(p=>({...p,teacher:e.target.value}))}>
                  <option value="">None</option>
                  {teachers.map(t=><option key={t._id} value={t._id}>{t.user?.name}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin"/>} Save
                </button>
                <button type="button" onClick={() => setModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
