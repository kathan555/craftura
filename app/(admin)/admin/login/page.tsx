'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Login failed')
      } else {
        router.push('/admin')
      }
    } catch {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-charcoal-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-wood-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none">
              <rect x="3" y="14" width="14" height="2" rx="1" fill="white"/>
              <rect x="5" y="6" width="10" height="8" rx="1" fill="white" opacity="0.7"/>
              <rect x="7" y="3" width="6" height="3" rx="1" fill="white" opacity="0.5"/>
            </svg>
          </div>
          <h1 className="font-display text-2xl text-white">Craftura Admin</h1>
          <p className="text-stone-400 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Card */}
        <div className="bg-charcoal-800 rounded-2xl border border-white/8 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-2">Email Address</label>
              <input
                type="email" required
                className="admin-input"
                placeholder="admin@craftura.com"
                value={form.email}
                onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-2">Password</label>
              <input
                type="password" required
                className="admin-input"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
              />
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-wood-600 hover:bg-wood-700 text-white font-medium rounded-lg transition-colors text-sm flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-white/5 text-center">
            <p className="text-stone-500 text-xs">Default: admin@craftura.com / admin123</p>
          </div>
        </div>

        <div className="text-center mt-5">
          <Link href="/" className="text-stone-500 text-xs hover:text-stone-400 transition-colors">← Back to website</Link>
        </div>
      </div>
    </div>
  )
}
