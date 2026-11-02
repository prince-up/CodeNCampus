import { useEffect, useState } from 'react'
import { getNotices, createNotice, deleteNotice } from '../../utils/api'
import { Plus, Trash2, Bell, Loader2, X } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Notices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({ title:'', body:'', targetRole:'all', priority:'normal', targetClass:'' })

  const fetchNotices = async () => {
    try { const r = await getNotices(); setNotices(r.data.data) }
    catch { toast.error('Failed') }
    finally { setLoading(false) }
  }
  useEffect(() => { fetchNotices() }, [])

  const handleCreate = async (e) => {
    e.preventDefault(); setSaving(true)
    try { await createNotice(form); toast.success('Notice posted!'); setModal(false); setForm({ title:'', body:'', targetRole:'all', priority:'normal', targetClass:'' }); fetchNotices() }
    catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete notice?')) return
    try { await deleteNotice(id); toast.success('Deleted'); fetchNotices() }
    catch { toast.error('Failed') }
  }

  const priorityColor = (p) => p === 'urgent' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-slate-800">Notice Board</h1></div>
        <button onClick={() => setModal(true)} className="btn-primary flex items-center gap-2"><Plus className="w-4 h-4"/> Post Notice</button>
      </div>

      {loading ? <div className="py-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-500"/></div> : (
        <div className="space-y-3">
          {notices.map(n => (
            <div key={n._id} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${n.priority === 'urgent' ? 'bg-red-500' : 'bg-blue-400'}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-slate-800">{n.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColor(n.priority)}`}>{n.priority}</span>
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full capitalize">{n.targetRole}</span>
                      {n.targetClass && <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full">Class {n.targetClass}</span>}
                    </div>
                    <p className="text-sm text-slate-600">{n.body}</p>
                    <p className="text-xs text-slate-400 mt-2">{new Date(n.date).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })} · by {n.createdBy?.name}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(n._id)} className="text-red-400 hover:text-red-600 ml-4 shrink-0"><Trash2 className="w-4 h-4"/></button>
              </div>
            </div>
          ))}
          {notices.length === 0 && (
            <div className="card text-center py-12">
              <Bell className="w-12 h-12 mx-auto mb-3 text-slate-200"/>
              <p className="text-slate-400">No notices posted yet</p>
            </div>
          )}
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-lg font-semibold">Post Notice</h2>
              <button onClick={() => setModal(false)}><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Title *</label><input value={form.title} onChange={e=>setForm(p=>({...p,title:e.target.value}))} required/></div>
              <div><label className="block text-sm font-medium text-slate-700 mb-1">Message *</label><textarea rows={4} value={form.body} onChange={e=>setForm(p=>({...p,body:e.target.value}))} className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full" required/></div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Audience</label>
                  <select value={form.targetRole} onChange={e=>setForm(p=>({...p,targetRole:e.target.value}))}>
                    <option value="all">All</option>
                    <option value="student">Students Only</option>
                    <option value="teacher">Teachers Only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={e=>setForm(p=>({...p,priority:e.target.value}))}>
                    <option value="normal">Normal</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Specific Class (optional)</label>
                <select value={form.targetClass} onChange={e=>setForm(p=>({...p,targetClass:e.target.value}))}>
                  <option value="">All Classes</option>
                  {Array.from({length:12},(_,i)=>i+1).map(c=><option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex items-center gap-2">{saving&&<Loader2 className="w-4 h-4 animate-spin"/>}Post</button>
                <button type="button" onClick={()=>setModal(false)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
