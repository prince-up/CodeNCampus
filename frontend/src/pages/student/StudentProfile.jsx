import useAuthStore from '../../store/authStore'
import { User, Phone, Mail, MapPin, Calendar, BookOpen } from 'lucide-react'

export default function StudentProfile() {
  const user = useAuthStore(s => s.user)
  const profile = useAuthStore(s => s.profile)

  return (
    <div className="space-y-5 max-w-2xl">
      <div><h1 className="text-2xl font-bold text-slate-800">My Profile</h1></div>

      <div className="card">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{user?.name}</h2>
            <p className="text-sm text-slate-500">Roll No: {profile?.rollNo} · Class {profile?.class}-{profile?.section}</p>
            <span className="inline-block mt-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active Student</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 text-sm">
          <div className="flex items-center gap-3 text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Email</p><p className="font-medium text-slate-800">{user?.email}</p></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Phone</p><p className="font-medium text-slate-800">{user?.phone || '—'}</p></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <User className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Parent Name</p><p className="font-medium text-slate-800">{profile?.parentName || '—'}</p></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Phone className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Parent Phone</p><p className="font-medium text-slate-800">{profile?.parentPhone || '—'}</p></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Date of Birth</p><p className="font-medium text-slate-800">{profile?.dob ? new Date(profile.dob).toLocaleDateString('en-IN') : '—'}</p></div>
          </div>
          <div className="flex items-center gap-3 text-slate-600">
            <BookOpen className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Blood Group</p><p className="font-medium text-slate-800">{profile?.bloodGroup || '—'}</p></div>
          </div>
          <div className="col-span-2 flex items-center gap-3 text-slate-600">
            <MapPin className="w-4 h-4 text-slate-400" />
            <div><p className="text-xs text-slate-400">Address</p><p className="font-medium text-slate-800">{profile?.address || '—'}</p></div>
          </div>
        </div>
      </div>
    </div>
  )
}
