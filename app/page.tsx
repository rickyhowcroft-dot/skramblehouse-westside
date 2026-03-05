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
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
        {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-zinc-800/80 border border-zinc-700 rounded-lg px-4 py-3.5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-400/60 focus:bg-zinc-800 transition-colors"
      />
    </div>
  )

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex flex-col">

      {/* Hero image — fixed height, shows top branding */}
      <div className="relative w-full h-[36vh] flex-shrink-0 overflow-hidden">
        <Image
          src="/hero.jpg"
          alt="Skramble West Side"
          fill
          priority
          className="object-cover object-top"
        />
        {/* Fade into background color at bottom */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-zinc-950 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col max-w-lg w-full mx-auto px-5 pt-2 pb-6">

        {/* Blurb + counter row */}
        <div className="flex items-start gap-4 mb-5">
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-cyan-400 uppercase tracking-widest mb-1">
              West Side is Coming
            </p>
            <p className="text-sm text-gray-300 leading-relaxed">
              You asked. We listened. Skramblehouse is building
              a new house on the West Side — and we&apos;re saving
              the first 100 spots for the people who made it happen.
            </p>
          </div>

          {/* Counter badge */}
          <div className="flex-shrink-0 text-center bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 min-w-[60px]">
            {remaining !== null ? (
              <>
                <div className="text-2xl font-black text-cyan-400 tabular-nums leading-none">{remaining}</div>
                <div className="text-[10px] text-gray-400 font-medium leading-tight mt-0.5">of 100<br/>spots</div>
              </>
            ) : (
              <div className="w-10 h-10 bg-zinc-700 rounded animate-pulse mx-auto" />
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800 mb-5" />

        {/* States */}
        {isFull ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-10 border border-zinc-700 rounded-2xl bg-zinc-900 w-full">
              <p className="text-xl font-bold mb-1">🎉 The list is full!</p>
              <p className="text-gray-400 text-sm">All 100 spots claimed. Follow us for updates.</p>
            </div>
          </div>
        ) : submitted ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center py-10 border border-cyan-500/30 rounded-2xl bg-cyan-500/5 w-full">
              <p className="text-3xl mb-3">✅</p>
              <p className="text-lg font-bold mb-1">You&apos;re on the list!</p>
              <p className="text-gray-400 text-sm">We&apos;ll be in touch with pre-sale details soon.</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              {field('First Name', 'firstName', 'text', 'First')}
              {field('Last Name', 'lastName', 'text', 'Last')}
            </div>
            {field('Email Address', 'email', 'email', 'your@email.com')}
            {field('Pre-Sale Code', 'presaleCode', 'text', 'Optional', false)}

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor="website">Website</label>
              <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>

            {error && <p className="text-red-400 text-xs text-center -mt-1">{error}</p>}

            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-cyan-400 text-black font-extrabold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-widest uppercase shadow-lg shadow-cyan-400/15 mt-1"
            >
              {loading ? 'Submitting…' : 'Learn More'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
