'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function WestSidePage() {
  const [count, setCount] = useState<number | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', presaleCode: '', website: '' })
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
        {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-cyan-400/60 focus:bg-white/8 transition-colors"
      />
    </div>
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* Hero image — portrait, centered */}
      <div className="flex justify-center pt-8 pb-2 px-6">
        <div className="w-full max-w-sm">
          <Image
            src="/hero.jpg"
            alt="Skramble West Side"
            width={480}
            height={720}
            priority
            className="w-full h-auto rounded-2xl shadow-2xl shadow-black/60"
            style={{ objectFit: 'cover', objectPosition: 'center' }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 pt-8 pb-20">
        <p className="text-base text-gray-300 text-center mb-6 leading-relaxed">
          We have exciting news — we are limiting the presale to the first{' '}
          <strong className="text-white">100 people</strong>. Enter your information
          now to get on the pre-sale list.
        </p>

        {/* Spots counter */}
        <div className="flex justify-center mb-8">
          {remaining !== null ? (
            <div className="flex items-baseline gap-1.5 bg-cyan-400/10 border border-cyan-400/25 rounded-full px-6 py-2.5">
              <span className="text-3xl font-black text-cyan-400 tabular-nums">{remaining}</span>
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
          <div className="text-center py-10 border border-cyan-500/30 rounded-2xl bg-cyan-500/5">
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

            {/* Honeypot — hidden from real users */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor="website">Website</label>
              <input
                id="website"
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={form.website}
                onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center py-1">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-cyan-400 text-black font-bold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base mt-2"
            >
              {loading ? 'Submitting…' : 'Reserve My Spot →'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
