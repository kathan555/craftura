'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const statuses = ['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'DELIVERED', 'CANCELLED']

export default function OrderStatusUpdater({
  orderId, currentStatus
}: { orderId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  const handleChange = async (newStatus: string) => {
    setSaving(true)
    setStatus(newStatus)
    await fetch(`/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    router.refresh()
    setSaving(false)
  }

  return (
    <div className="relative">
      <select
        value={status}
        onChange={e => handleChange(e.target.value)}
        disabled={saving}
        className={`text-xs font-semibold px-3 py-1.5 rounded-lg border appearance-none cursor-pointer pr-7 transition-all ${
          status === 'PENDING' ? 'bg-amber-50 border-amber-200 text-amber-800' :
          status === 'CONFIRMED' ? 'bg-blue-50 border-blue-200 text-blue-800' :
          status === 'IN_PRODUCTION' ? 'bg-indigo-50 border-indigo-200 text-indigo-800' :
          status === 'DELIVERED' ? 'bg-green-50 border-green-200 text-green-800' :
          'bg-red-50 border-red-200 text-red-700'
        }`}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s.replace('_', ' ')}</option>
        ))}
      </select>
      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
        {saving ? (
          <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin block" />
        ) : (
          <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor"><path d="M2 3l3 4 3-4H2z"/></svg>
        )}
      </div>
    </div>
  )
}
