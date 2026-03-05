'use client'

import { useState, useEffect } from 'react'

export default function WestSidePage() {
  const [count, setCount] = useState<number | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', presaleCode: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/count')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(0))
  }, [])

  const remaining = count !== null ? Math.max(0, 100 - count) : null
  const isFull = count !== null && count >= 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setCount(data.count)
    setSubmitted(true)
    setLoading(false)
  }

  const field = (
    label: string,
    key: keyof typeof form,
    type = 'text',
    placeholder = '',
    required = true
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-400 mb-1.5">
        {label}{required && <span className="text-yellow-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-yellow-400/70 focus:bg-white/8 transition-colors"
      />
    </div>
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative min-h-[55vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url(/hero.jpg)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-zinc-950" />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto pt-12 pb-8">
          {/* swap /logo.png for your actual logo */}
          <img
            src="/logo.png"
            alt="Skramblehouse"
            className="h-14 mx-auto mb-8 opacity-90"
            onError={e => (e.currentTarget.style.display = 'none')}
          />
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4">
            Skramblehouse is coming to the{' '}
            <span className="text-yellow-400">West Side!</span>
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 pb-20 -mt-4">
        <p className="text-base text-gray-300 text-center mb-6 leading-relaxed">
          We have exciting news — we are limiting the presale to the first{' '}
          <strong className="text-white">100 people</strong>. Enter your information
          now to get on the pre-sale list.
        </p>

        {/* Spots counter */}
        <div className="flex justify-center mb-8">
          {remaining !== null ? (
            <div className="flex items-baseline gap-1.5 bg-yellow-400/10 border border-yellow-400/25 rounded-full px-6 py-2.5">
              <span className="text-3xl font-black text-yellow-400 tabular-nums">{remaining}</span>
              <span className="text-gray-400 text-sm font-medium">/ 100 spots remain</span>
            </div>
          ) : (
            <div className="h-11 w-44 bg-white/5 rounded-full animate-pulse" />
          )}
        </div>

        {/* States */}
        {isFull ? (
          <div className="text-center py-10 border border-gray-700 rounded-2xl bg-white/3">
            <p className="text-2xl font-bold mb-2">🎉 The list is full!</p>
            <p className="text-gray-400">All 100 pre-sale spots have been claimed. Follow us for updates.</p>
          </div>
        ) : submitted ? (
          <div className="text-center py-10 border border-green-500/30 rounded-2xl bg-green-500/5">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-xl font-bold mb-1">You&apos;re on the list!</p>
            <p className="text-gray-400 text-sm">We&apos;ll be in touch with pre-sale details soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {field('First Name', 'firstName', 'text', 'Jane')}
              {field('Last Name', 'lastName', 'text', 'Smith')}
            </div>
            {field('Email Address', 'email', 'email', 'jane@example.com')}
            {field('Pre-Sale Code', 'presaleCode', 'text', 'Optional', false)}

            {error && (
              <p className="text-red-400 text-sm text-center py-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-yellow-400 text-black font-bold py-4 rounded-xl hover:bg-yellow-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base mt-2"
            >
              {loading ? 'Submitting…' : 'Reserve My Spot →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
