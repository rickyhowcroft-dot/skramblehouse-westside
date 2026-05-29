'use client'

import { useState } from 'react'

export default function InvestorForm() {
  const [form, setForm]           = useState({ firstName: '', lastName: '', email: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/investor-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <p className="text-5xl mb-5">🏌️</p>
        <p className="text-white text-xl font-bold mb-2">You&apos;re on our radar.</p>
        <p className="text-zinc-400 text-base">We&apos;ll be in touch shortly.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <input type="text" name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid grid-cols-2 gap-5">
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">First Name</label>
          <input
            type="text" required value={form.firstName}
            onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
            placeholder="First"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Last Name</label>
          <input
            type="text" required value={form.lastName}
            onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
            placeholder="Last"
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-zinc-400 text-xs uppercase tracking-widest font-semibold">Email Address</label>
        <input
          type="email" required value={form.email}
          onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          placeholder="you@example.com"
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-base placeholder-zinc-600 focus:outline-none focus:border-emerald-500 transition-colors"
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center pt-1">{error}</p>}

      <button
        type="submit" disabled={loading}
        className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-5 rounded-full text-base uppercase tracking-widest transition-colors mt-2"
      >
        {loading ? 'Sending…' : 'Learn More'}
      </button>
    </form>
  )
}
