import { useEffect, useState } from 'react'
import { getFees, createFee, updateFee, getStudents, getFeeCollection } from '../../utils/api'
import { Plus, Loader2, X, CheckCircle, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'

const months = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function Fees() {
  const [fees, setFees] = useState([])
  const [students, setStudents] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ student:'', amount:'', month:months[new Date().getMonth()], year:new Date().getFullYear(), dueDate:'', feeType:'Tuition Fee' })

  const fetchAll = async () => {
    try {
      const [f, s, c] = await Promise.all([getFees(), getStudents(), getFeeCollection()])
      setFees(f.data.data)
      setStudents(s.data.data)
      setStats(c.data.stats)
    } catch { toast.error('Failed to load') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchAll() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try {
      await createFee({ ...form, student: form.student })
      toast.success('Fee record created!')
      setModal(false)
      fetchAll()
    } catch (err) { toast.error(err.response?.data?.message || 'Error') }
    finally { setSaving(false) }
  }

  const markPaid = async (fee) => {
    try {
      await updateFee(fee._id, { status:'paid', paidAmount: fee.amount, paidDate: new Date() })
      toast.success('Marked as paid!')
      fetchAll()
    } catch { toast.error('Failed') }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Fee Management</h1></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/> Add Fee Record</button>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label:'Total Fee', value:`₹${stats.total?.toLocaleString()}`, color:'text-slate-800' },
            { label:'Collected', value:`₹${stats.collected?.toLocaleString()}`, color:'text-green-600' },
            { label:'Pending', value:`₹${stats.pending?.toLocaleString()}`, color:'text-red-600' },
          ].map(s => (
            <div key={s.label} className="card text-center">
              <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      <div className="card">
        {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Student</th><th>Month</th><th>Amount</th><th>Fee Type</th><th>Due Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td className="font-medium">{f.student?.user?.name}</td>
                    <td>{f.month} {f.year}</td>
                    <td className="font-semibold">₹{f.amount?.toLocaleString()}</td>
                    <td>{f.feeType}</td>
                    <td>{f.dueDate ? new Date(f.dueDate).toLocaleDateString('en-IN') : '—'}</td>
                    <td><span className={`badge-${f.status} capitalize`}>{f.status}</span></td>
                    <td>
                      {f.status !== 'paid' && (
                        <button onClick={() => markPaid(f)} className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium">
                          <CheckCircle className="w-3.5 h-3.5"/> Mark Paid
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fees.length === 0 && <p className="text-center py-8 text-slate-400">No fee records</p>}
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Add Fee Record</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Student *</label>
                <select value={form.student} onChange={e=>setForm(p=>({...p,student:e.target.value}))} required>
                  <option value="">Select Student</option>
                  {students.map(s=><option key={s._id} value={s._id}>{s.user?.name} ({s.rollNo})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Month</label>
                  <select value={form.month} onChange={e=>setForm(p=>({...p,month:e.target.value}))}>
                    {months.map(m=><option key={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
                  <input type="number" value={form.year} onChange={e=>setForm(p=>({...p,year:e.target.value}))} />
                </div>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Amount (₹) *</label><input type="number" value={form.amount} onChange={e=>setForm(p=>({...p,amount:e.target.value}))} required/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Fee Type</label>
                <select value={form.feeType} onChange={e=>setForm(p=>({...p,feeType:e.target.value}))}>
                  {['Tuition Fee','Exam Fee','Lab Fee','Sports Fee','Transport Fee','Other'].map(t=><option key={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label><input type="date" value={form.dueDate} onChange={e=>setForm(p=>({...p,dueDate:e.target.value}))}/></div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">{saving&&<Loader2 className="w-4 h-4 animate-spin"/>}Add Record</button>
                <button type="button" onClick={()=>setModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
