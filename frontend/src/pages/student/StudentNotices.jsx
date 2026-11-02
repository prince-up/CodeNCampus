import { useEffect, useState } from 'react'
import { getNotices } from '../../utils/api'
import { Bell } from 'lucide-react'

export default function StudentNotices() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getNotices({ role:'student' })
      .then(r => setNotices(r.data.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-slate-800">Notice Board</h1></div>
      <div className="space-y-3">
        {notices.map(n => (
          <div key={n._id} className={`card border-l-4 ${n.priority==='urgent'?'border-l-red-500':'border-l-blue-400'}`}>
            <div className="flex items-start gap-2 flex-wrap mb-1">
              <h3 className="font-semibold text-slate-800">{n.title}</h3>
              {n.priority==='urgent'&&<span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full">Urgent</span>}
            </div>
            <p className="text-sm text-slate-600">{n.body}</p>
            <p className="text-xs text-slate-400 mt-2">{new Date(n.date).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})} · {n.createdBy?.name}</p>
          </div>
        ))}
        {notices.length === 0 && !loading && (
          <div className="card text-center py-12">
            <Bell className="w-12 h-12 mx-auto mb-3 text-slate-200"/>
            <p className="text-slate-400">No notices at this time</p>
          </div>
        )}
      </div>
    </div>
  )
}
