import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../utils/api'
import useAuthStore from '../store/authStore'
import toast from 'react-hot-toast'
import { School, Eye, EyeOff, Loader2 } from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login(form)
      setAuth(data.user, data.token, data.profile)
      toast.success(`Welcome, ${data.user.name}!`)
      if (data.user.role === 'admin') navigate('/admin')
      else if (data.user.role === 'teacher') navigate('/teacher')
      else navigate('/student')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const demoLogin = (email, password) => {
    setForm({ email, password })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <School className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">CodeNCampus</h1>
          <p className="text-blue-200 mt-1">School Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">Sign In</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  className="pr-10"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-xs text-slate-500 text-center mb-3 font-medium">DEMO CREDENTIALS</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Admin', email: 'admin@codencampus.com', password: 'Admin@123', color: 'bg-purple-50 border-purple-200 text-purple-700' },
                { label: 'Teacher', email: 'rajesh@codencampus.com', password: 'Teacher@123', color: 'bg-green-50 border-green-200 text-green-700' },
                { label: 'Student', email: 'aarav@student.com', password: 'Student@123', color: 'bg-blue-50 border-blue-200 text-blue-700' },
              ].map((d) => (
                <button key={d.label} onClick={() => demoLogin(d.email, d.password)}
                  className={`border rounded-lg p-2 text-center text-xs font-semibold hover:opacity-80 transition-opacity ${d.color}`}>
                  {d.label}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-400 text-center mt-2">Click to auto-fill credentials</p>
          </div>
        </div>

        <p className="text-center text-blue-200 text-xs mt-6">
          © 2024 CodeNCampus — School Management System
        </p>
      </div>
    </div>
  )
}
