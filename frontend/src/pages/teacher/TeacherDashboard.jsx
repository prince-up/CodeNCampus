import { useEffect, useState } from 'react'
import { getNotices, getExams } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { Bell, FileText, Users, Calendar } from 'lucide-react'

export default function TeacherDashboard() {
  const user = useAuthStore(s => s.user)
  const profile = useAuthStore(s => s.profile)
  const [notices, setNotices] = useState([])
  const [exams, setExams] = useState([])

  useEffect(() => {
    getNotices({ role: 'teacher' }).then(r => setNotices(r.data.data?.slice(0,5)||[]))
    getExams().then(r => setExams(r.data.data?.slice(0,5)||[]))
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Welcome, {user?.name}!</h1>
        <p className="text-slate-500 text-sm">{profile?.designation} · {new Date().toLocaleDateString('en-IN', { weekday:'long', day:'numeric', month:'long' })}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label:'My Subjects', value: profile?.subjects?.length||0, icon: FileText, color:'bg-green-500' },
          { label:'My Classes', value: profile?.classes?.length||0, icon: Users, color:'bg-blue-500' },
          { label:'Notices', value: notices.length, icon: Bell, color:'bg-orange-500' },
          { label:'Upcoming Exams', value: exams.length, icon: Calendar, color:'bg-purple-500' },
        ].map(s => (
          <div key={s.label} className="card flex items-center gap-4">
            <div className={`w-10 h-10 ${s.color} rounded-lg flex items-center justify-center`}>
              <s.icon className="w-5 h-5 text-white"/>
            </div>
            <div>
              <p className="text-xl font-bold text-slate-800">{s.value}</p>
              <p className="text-xs text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Bell className="w-4 h-4 text-orange-500"/> Recent Notices</h2>
          {notices.length === 0 ? <p className="text-slate-400 text-sm py-4 text-center">No notices</p> : (
            <div className="space-y-3">
              {notices.map(n => (
                <div key={n._id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.priority==='urgent'?'bg-red-500':'bg-blue-400'}`}/>
                  <div>
                    <p className="text-sm font-medium text-slate-700">{n.title}</p>
                    <p className="text-xs text-slate-400">{new Date(n.date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="font-semibold text-slate-700 mb-4 flex items-center gap-2"><Calendar className="w-4 h-4 text-purple-500"/> Upcoming Exams</h2>
          {exams.length === 0 ? <p className="text-slate-400 text-sm py-4 text-center">No exams scheduled</p> : (
            <div className="space-y-3">
              {exams.map(e => (
                <div key={e._id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-slate-700">{e.name}</p>
                    <p className="text-xs text-slate-400">Class {e.class}-{e.section} · {e.term}</p>
                  </div>
                  {e.startDate && <span className="text-xs text-slate-500">{new Date(e.startDate).toLocaleDateString('en-IN')}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
