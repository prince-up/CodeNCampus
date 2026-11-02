import { useEffect, useState } from 'react'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../utils/api'
import { Plus, Pencil, Trash2, Search, X, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

const EMPTY = { name:'', email:'', phone:'', rollNo:'', class:'', section:'A', gender:'male', dob:'', address:'', parentName:'', parentPhone:'', bloodGroup:'' }

export default function Students() {
  const [students, setStudents] = useState([])
  const [filtered, setFiltered] = useState([])
  const [search, setSearch] = useState('')
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchStudents = async () => {
    try {
      const { data } = await getStudents()
      setStudents(data.data)
      setFiltered(data.data)
    } catch { toast.error('Failed to load students') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchStudents() }, [])

  useEffect(() => {
    const q = search.toLowerCase()
    setFiltered(students.filter(s =>
      s.user?.name?.toLowerCase().includes(q) ||
      s.rollNo?.toLowerCase().includes(q) ||
      s.class?.toString().includes(q)
    ))
  }, [search, students])

  const openAdd = () => { setEditing(null); setForm(EMPTY); setModal(true) }

  const openEdit = (s) => {
    setEditing(s._id)
    setForm({
      name: s.user?.name || '', email: s.user?.email || '', phone: s.user?.phone || '',
      rollNo: s.rollNo || '', class: s.class || '', section: s.section || 'A',
      gender: s.gender || 'male', dob: s.dob ? s.dob.split('T')[0] : '',
      address: s.address || '', parentName: s.parentName || '',
      parentPhone: s.parentPhone || '', bloodGroup: s.bloodGroup || ''
    })
    setModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      if (editing) {
        await updateStudent(editing, form)
        toast.success('Student updated!')
      } else {
        await createStudent(form)
        toast.success('Student added!')
      }
      setModal(false)
      fetchStudents()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error saving')
    } finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this student?')) return
    try {
      await deleteStudent(id)
      toast.success('Deleted!')
      fetchStudents()
    } catch { toast.error('Delete failed') }
  }

  const f = (k, v) => setForm(p => ({ ...p, [k]: v }))

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Students</h1>
          <p className="text-slate-500 text-sm">{students.length} students enrolled</p>
        </div>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Student
        </button>
      </div>

      <div className="card">
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input placeholder="Search by name, roll no..." value={search}
              onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
        </div>

        {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500" /></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead>
                <tr>
                  <th>Roll No</th><th>Name</th><th>Class</th><th>Parent</th><th>Phone</th><th>Gender</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(s => (
                  <tr key={s._id}>
                    <td><span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-xs">{s.rollNo}</span></td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 text-xs font-bold">
                          {s.user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{s.user?.name}</p>
                          <p className="text-xs text-slate-400">{s.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded text-xs font-medium">Class {s.class}-{s.section}</span></td>
                    <td>{s.parentName || '—'}</td>
                    <td>{s.parentPhone || '—'}</td>
                    <td className="capitalize">{s.gender}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-blue-50 text-blue-600"><Pencil className="w-3.5 h-3.5" /></button>
                        <button onClick={() => handleDelete(s._id)} className="p-1.5 rounded hover:bg-red-50 text-red-500"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="text-center py-8 text-slate-400">No students found</p>}
          </div>
        )}
      </div>

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">{editing ? 'Edit Student' : 'Add New Student'}</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 grid grid-cols-2 gap-4">
              {[
                ['Name', 'name', 'text', true], ['Email', 'email', 'email', !editing],
                ['Phone', 'phone', 'tel'], ['Roll No', 'rollNo', 'text', true],
                ['Date of Birth', 'dob', 'date'], ['Parent Name', 'parentName', 'text'],
                ['Parent Phone', 'parentPhone', 'tel'], ['Blood Group', 'bloodGroup', 'text'],
              ].map(([label, key, type, req]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}{req && ' *'}</label>
                  <input type={type} value={form[key]} onChange={(e) => f(key, e.target.value)} required={!!req} />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                <select value={form.class} onChange={e => f('class', e.target.value)} required>
                  <option value="">Select Class</option>
                  {Array.from({length:12},(_,i)=>i+1).map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                <select value={form.section} onChange={e => f('section', e.target.value)}>
                  {['A','B','C','D'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender</label>
                <select value={form.gender} onChange={e => f('gender', e.target.value)}>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <input value={form.address} onChange={e => f('address', e.target.value)} placeholder="Full address" />
              </div>
              {!editing && (
                <div className="col-span-2 bg-blue-50 border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                  Default password: <strong>Student@123</strong>
                </div>
              )}
              <div className="col-span-2 flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editing ? 'Update Student' : 'Add Student'}
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
