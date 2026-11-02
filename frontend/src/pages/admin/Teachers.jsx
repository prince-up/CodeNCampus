import { useEffect, useState } from 'react'
import { getTeachers, createTeacher, updateTeacher, deleteTeacher, getSubjects } from '../../utils/api'
import { Plus, Pencil, Trash2, Search, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name:'', email:'', phone:'', employeeId:'', qualification:'', gender:'male', designation:'Teacher', salary:'', subjects:[], classes:[] }

export default function Teachers() {
  const [teachers, setTeachers] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [allSubjects, setAllSubjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchAll = async () => {
    try {
      const [t, s] = await Promise.all([getTeachers(), getSubjects()])
      setTeachers(t.data.data)
      setFiltered(t.data.data)
      setAllSubjects(s.data.data)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchAll() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(teachers.filter(t =>
      t.user?.name?.toLowerCase().includes(q) ||
      t.employeeId?.toLowerCase().includes(q) ||
      t.designation?.toLowerCase().includes(q)
    ))
  }, [search, teachers])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }
  const openEdit = (t) => {
    setEditing(t._id)
    setForm({
      name: t.user?.name||'', email: t.user?.email||'', phone: t.user?.phone||'',
      employeeId: t.employeeId||'', qualification: t.qualification||'',
      gender: t.gender||'male', designation: t.designation||'Teacher',
      salary: t.salary||'', subjects: t.subjects?.map(s=>s._id)||[],
      classes: t.classes||[]
    })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) { await updateTeacher(editing, form); toast.success('Updated!') }
      else { await createTeacher(form); toast.success('Teacher added!') }
      setModal(false); fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this teacher?')) return
    try { await deleteTeacher(id); toast.success('Deleted!'); fetchAll() }
    catch { toast.error('Delete failed') }
  }

  const toggleClass = (cls) => {
    setForm(p => ({ ...p, classes: p.classes.includes(cls) ? p.classes.filter(c=>c!==cls) : [...p.classes, cls] }))
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Teachers</h1>
          <p className="text-slate-500 text-sm">{teachers.length} teachers on staff</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Teacher
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr>
                <th>Employee ID</th><th>Name</th><th>Designation</th><th>Subjects</th><th>Phone</th><th>Salary</th><th>Actions</th>
              </tr></thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t._id}>
                    <td><span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{t.employeeId}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center text-green-700 text-xs font-bold">
                          {t.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{t.user?.name}</p>
                          <p className="text-xs text-slate-400">{t.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td>{t.designation}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        {t.subjects?.slice(0,3).map(s => (
                          <span key={s._id} className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-xs">{s.name}</span>
                        ))}
                        {t.subjects?.length > 3 && <span className="text-xs text-slate-400">+{t.subjects.length - 3}</span>}
                      </div>
                    </td>
                    <td>{t.user?.phone || '—'}</td>
                    <td>{t.salary ? `₹${t.salary.toLocaleString()}` : '—'}</td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(t)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(t._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center py-8 text-slate-400">No teachers found</p>}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Teacher' : 'Add Teacher'}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              {[
                ['Name','name','text',true],['Email','email','email',!editing],
                ['Phone','phone','tel'],['Employee ID','employeeId','text',true],
                ['Qualification','qualification','text'],['Salary (₹)','salary','number'],
              ].map(([label,key,type,req]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}{req&&' *'}</label>
                  <input type={type} value={form[key]} onChange={e => setForm(p=>({...p,[key]:e.target.value}))} required={!!req} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select value={form.gender} onChange={e => setForm(p=>({...p,gender:e.target.value}))}>
                  <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Designation</label>
                <select value={form.designation} onChange={e => setForm(p=>({...p,designation:e.target.value}))}>
                  {['Teacher','Senior Teacher','HOD','Principal','Vice Principal'].map(d => <option key={d}>{d}</option>)}
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-2">Classes</label>
                <div className="flex flex-wrap gap-2">
                  {Array.from({length:12},(_,i)=>i+1).map(c => (
                    <button key={c} type="button" onClick={() => toggleClass(c.toString())}
                      className={`px-3 py-1 rounded-full text-xs border font-medium transition-colors ${
                        form.classes.includes(c.toString()) ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-600 hover:border-blue-300'
                      }`}>
                      Class {c}
                    </button>
                  ))}
                </div>
              </div>
              {!editing && (
                <div className="col-span-2 bg-green-50 border border-green-100 rounded-lg p-3 text-xs text-green-700">
                  Default password: <strong>Teacher@123</strong>
                </div>
              )}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Update' : 'Add Teacher'}
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
