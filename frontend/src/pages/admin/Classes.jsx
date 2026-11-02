import { useEffect, useState } from 'react'
import { getClasses, createClass, deleteClass, getTeachers } from '../../utils/api'
import { Plus, Trash2, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Classes() {
  const [classes, setClasses] = useState([])
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', section: 'A', capacity: 40 })
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    try {
      const [c, t] = await Promise.all([getClasses(), getTeachers()])
      setClasses(c.data.data)
      setTeachers(t.data.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await createClass(form)
      toast.success('Class created!')
      setForm({ name: '', section: 'A', capacity: 40 })
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete class?')) return
    try { await deleteClass(id); toast.success('Deleted'); fetchAll() }
    catch { toast.error('Delete failed') }
  }

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-slate-800">Classes & Sections</h1></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4">Add New Class</h2>
          <form onSubmit={handleCreate} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Class Name *</label>
              <select value={form.name} onChange={e => setForm(p=>({...p,name:e.target.value}))} required>
                <option value="">Select Class</option>
                {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
              <select value={form.section} onChange={e => setForm(p=>({...p,section:e.target.value}))}>
                {['A','B','C','D'].map(s=><option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Capacity</label>
              <input type="number" value={form.capacity} onChange={e=>setForm(p=>({...p,capacity:e.target.value}))} />
            </div>
            <button type="submit" disabled={saving} className="btn-primary w-full flex items-center justify-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Class
            </button>
          </form>
        </div>

        <div className="card lg:col-span-2">
          <h2 className="font-semibold text-slate-700 mb-4">All Classes ({classes.length})</h2>
          {loading ? <div className="py-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div> : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {classes.map(c => (
                <div key={c._id} className="border border-slate-200 rounded-xl p-4 hover:border-blue-300 transition-colors group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl font-bold text-blue-600">{c.name}</span>
                    <button onClick={() => handleDelete(c._id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm text-slate-600">Section {c.section}</p>
                  <p className="text-xs text-slate-400">Capacity: {c.capacity}</p>
                  {c.classTeacher && <p className="text-xs text-green-600 mt-1">CT: {c.classTeacher?.user?.name}</p>}
                </div>
              ))}
              {classes.length === 0 && <p className="col-span-3 text-center py-8 text-slate-400">No classes added yet</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
