'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ── Carousel images ──────────────────────────────────────────
// Drop images into /public/carousel/ and add filenames here
const CAROUSEL_IMAGES: string[] = [
  // e.g. '/carousel/photo1.jpg',
]

export default function WestSidePage() {
  const [count, setCount] = useState<number | null>(null)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', presaleCode: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [slide, setSlide] = useState(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch('/api/count')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => setCount(0))
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    if (CAROUSEL_IMAGES.length < 2) return
    intervalRef.current = setInterval(() => {
      setSlide(s => (s + 1) % CAROUSEL_IMAGES.length)
    }, 3500)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
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
      <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        required={required}
        value={form[key]}
        onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-5 text-white text-sm placeholder-zinc-500 focus:outline-none focus:border-cyan-400/70 focus:bg-zinc-700/60 transition-colors"
      />
    </div>
  )

  return (
    <main className="bg-zinc-950 text-white">
      <div className="max-w-lg w-full mx-auto px-5 pt-6 pb-10 flex flex-col gap-5">

        {/* Image — small portrait card, centered */}
        <div className="flex justify-center">
          <div className="relative w-44 h-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
            <Image
              src="/hero.jpg"
              alt="Skramble West Side"
              fill
              priority
              className="object-cover object-center"
            />
          </div>
        </div>

        {/* Blurb */}
        <div>
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
            West Side is Coming
          </p>
          <p className="text-sm text-gray-300 leading-relaxed">
            You asked. We listened.
          </p>
          <p className="text-sm text-white font-semibold leading-relaxed mt-1">
            Skramblehouse is planting its flag on the West Side.
          </p>
        </div>

        {/* Spots pill */}
        <div className="flex justify-center">
          {remaining !== null ? (
            <div className="flex items-center gap-2 bg-zinc-800 border border-zinc-700 rounded-full px-5 py-2.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
              <span className="text-sm font-semibold text-white tabular-nums">
                {remaining} <span className="text-zinc-400 font-normal">of 100 spots available</span>
              </span>
            </div>
          ) : (
            <div className="h-9 w-52 bg-zinc-800 rounded-full animate-pulse" />
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-zinc-800" />

        {/* Form / States */}
        {isFull ? (
          <div className="text-center py-10 border border-zinc-700 rounded-2xl bg-zinc-900">
            <p className="text-xl font-bold mb-1">🎉 The list is full!</p>
            <p className="text-zinc-400 text-sm">All 100 spots claimed. Follow us for updates.</p>
          </div>
        ) : submitted ? (
          <div className="text-center py-10 border border-cyan-500/30 rounded-2xl bg-cyan-500/5">
            <p className="text-3xl mb-3">✅</p>
            <p className="text-lg font-bold mb-1">You&apos;re on the list!</p>
            <p className="text-zinc-400 text-sm">We&apos;ll be in touch with pre-sale details soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
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

            {error && <p className="text-red-400 text-xs text-center">{error}</p>}

            <button
              type="submit"
              disabled={loading || isFull}
              className="w-full bg-cyan-400 text-black font-extrabold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-widest uppercase shadow-lg shadow-cyan-400/15 mt-3"
            >
              {loading ? 'Submitting…' : 'Learn More'}
            </button>
          </form>
        )}

        {/* Carousel — shows once images are added to /public/carousel/ */}
        {CAROUSEL_IMAGES.length > 0 && (
          <div className="mt-2">
            <div className="border-t border-zinc-800 mb-5" />
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-xl shadow-black/40">
              {CAROUSEL_IMAGES.map((src, i) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-700 ${i === slide ? 'opacity-100' : 'opacity-0'}`}
                >
                  <Image src={src} alt={`Skramblehouse ${i + 1}`} fill className="object-cover" />
                </div>
              ))}
            </div>
            {/* Dot indicators */}
            {CAROUSEL_IMAGES.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-3">
                {CAROUSEL_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setSlide(i)}
                    className={`w-1.5 h-1.5 rounded-full transition-colors ${i === slide ? 'bg-cyan-400' : 'bg-zinc-600'}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}
