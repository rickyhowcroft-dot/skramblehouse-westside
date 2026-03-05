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
      <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest mb-1">
        {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-4 text-white text-base placeholder-gray-500 focus:outline-none focus:border-cyan-400/70 focus:bg-black/60 backdrop-blur-sm transition-colors"
      />
    </div>
  )

  return (
    <main className="relative min-h-screen flex flex-col overflow-hidden">

      {/* Full-bleed background image */}
      <Image
        src="/hero.jpg"
        alt="Skramble West Side"
        fill
        priority
        className="object-cover object-center"
      />

      {/* Dark overlay — heavier at bottom so form is readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/55 to-black/85" />

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen px-5 pb-8 pt-6">

        {/* Spacer — pushes form toward bottom where overlay is darkest */}
        <div className="flex-1" />

        {/* Tagline + counter */}
        <div className="flex items-end justify-between gap-3 mb-4">
          <p className="text-sm text-gray-200 leading-snug flex-1 drop-shadow">
            Presale limited to the first <strong className="text-white">100 people.</strong><br />
            Enter your info to secure your spot.
          </p>
          <div className="flex-shrink-0">
            {remaining !== null ? (
              <div className="flex flex-col items-center bg-black/50 border border-cyan-400/30 rounded-xl px-3 py-2 min-w-[62px] backdrop-blur-sm">
                <span className="text-2xl font-black text-cyan-400 tabular-nums leading-none">{remaining}</span>
                <span className="text-gray-400 text-[10px] font-medium leading-tight text-center mt-0.5">of 100<br/>remain</span>
              </div>
            ) : (
              <div className="w-16 h-14 bg-white/10 rounded-xl animate-pulse" />
            )}
          </div>
        </div>

        {/* States */}
        {isFull ? (
          <div className="text-center py-8 border border-white/20 rounded-2xl bg-black/50 backdrop-blur-sm">
            <p className="text-xl font-bold mb-1">🎉 The list is full!</p>
            <p className="text-gray-300 text-sm">All 100 spots claimed. Follow us for updates.</p>
          </div>
        ) : submitted ? (
          <div className="text-center py-8 border border-cyan-500/40 rounded-2xl bg-black/50 backdrop-blur-sm">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-lg font-bold mb-1">You&apos;re on the list!</p>
            <p className="text-gray-300 text-sm">We&apos;ll be in touch with pre-sale details soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {field('First Name', 'firstName', 'text', 'Jane')}
              {field('Last Name', 'lastName', 'text', 'Smith')}
            </div>
            {field('Email Address', 'email', 'email', 'jane@example.com')}
            {field('Pre-Sale Code', 'presaleCode', 'text', 'Optional', false)}

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-cyan-400 text-black font-extrabold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-base tracking-wide shadow-lg shadow-cyan-400/20 mt-1"
            >
              {loading ? 'Submitting…' : 'Learn More'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
