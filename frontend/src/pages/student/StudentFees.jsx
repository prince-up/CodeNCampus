import { useEffect, useState } from 'react'
import { getStudentFees } from '../../utils/api'
import useAuthStore from '../../store/authStore'
import { DollarSign, Loader2 } from 'lucide-react'

export default function StudentFees() {
  const profile = useAuthStore(s => s.profile)
  const [fees, setFees] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!profile?._id) return
    getStudentFees(profile._id)
      .then(r => { setFees(r.data.data); setStats(r.data.stats) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [profile])

  return (
    <div className="space-y-5">
      <div><h1 className="text-2xl font-bold text-slate-800">Fee Status</h1></div>

      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center"><p className="text-2xl font-bold text-slate-700">₹{stats.totalDue?.toLocaleString()}</p><p className="text-xs text-slate-500 mt-1">Total Fees</p></div>
          <div className="card text-center"><p className="text-2xl font-bold text-green-600">₹{stats.totalPaid?.toLocaleString()}</p><p className="text-xs text-slate-500 mt-1">Paid</p></div>
          <div className="card text-center"><p className="text-2xl font-bold text-red-500">₹{stats.balance?.toLocaleString()}</p><p className="text-xs text-slate-500 mt-1">Balance Due</p></div>
        </div>
      )}

      <div className="card">
        {loading ? <div className="py-8 flex justify-center"><Loader2 className="w-5 h-5 animate-spin text-blue-500"/></div> : (
          <div className="overflow-x-auto">
            <table>
              <thead><tr><th>Month</th><th>Fee Type</th><th>Amount</th><th>Paid</th><th>Due Date</th><th>Status</th><th>Receipt</th></tr></thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f._id}>
                    <td className="font-medium">{f.month} {f.year}</td>
                    <td>{f.feeType}</td>
                    <td>₹{f.amount?.toLocaleString()}</td>
                    <td className="text-green-600 font-semibold">₹{f.paidAmount?.toLocaleString()}</td>
                    <td>{f.dueDate?new Date(f.dueDate).toLocaleDateString('en-IN'):'—'}</td>
                    <td><span className={`badge-${f.status} capitalize`}>{f.status}</span></td>
                    <td>{f.receiptNo&&<span className="font-mono text-xs text-slate-500">{f.receiptNo}</span>}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {fees.length === 0 && (
              <div className="text-center py-12">
                <DollarSign className="w-12 h-12 mx-auto mb-3 text-slate-200"/>
                <p className="text-slate-400">No fee records found</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
