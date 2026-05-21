'use client'

import { useState } from 'react'
import Image from 'next/image'

const LOCATIONS      = ['Horsham', 'KOP', 'Rochester'] as const
const MEMBERSHIP_TYPES = ['Full Year', '5 Month'] as const

const OFFER_START = 'June 1, 2026'
const OFFER_END   = 'August 31, 2026'

export default function MembershipPresalePage() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    location: '', membershipType: '', website: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const set = (key: keyof typeof form, val: string) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/membership-signup', {
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

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="bg-zinc-950 text-white min-h-screen">
      <div className="max-w-2xl w-full mx-auto px-5 pt-6 pb-16">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60 mb-8">
          <Image
            src="/hero.jpg"
            alt="Skramblehouse"
            width={1200}
            height={540}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* ── Intro copy ────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 px-6 py-5 mb-8">
          <p className="text-zinc-200 text-sm sm:text-base leading-relaxed">
            <span className="font-bold text-white">&#8220;Welcome to The Skramble Project.</span>{' '}
            We&apos;re changing things up. Starting this summer, we are executing a strategic evolution
            to transform our club into a premier, year-round destination. This project is about more
            than just expanding our calendar&#8212;it&apos;s about elevating our programming, securing
            our facility&apos;s future, and giving you unparalleled access 365 days a year.
            The next era of our club starts now.&#8221;
          </p>
        </div>

        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="mb-8">
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
            2026–2027 Season
          </p>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-3">
            Membership Pre-Sale
          </h1>
          <p className="text-zinc-300 leading-relaxed text-sm sm:text-base">
            Lock in your membership at a discounted rate before the season begins.
            This exclusive pre-sale offer is available for a limited time only.
          </p>
        </div>

        {/* ── Offer details ─────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 mb-8 space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400">
            Pre-Sale Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <Detail label="Offer Window" value={`${OFFER_START} – ${OFFER_END}`} />
            <Detail label="Locations" value="Horsham · KOP · Rochester" />
            <Detail label="Full Year Membership" value="12 months of access" />
            <Detail label="5 Month Membership" value="Seasonal access" />
          </div>
          <p className="text-zinc-400 text-xs leading-relaxed pt-1 border-t border-zinc-800">
            Pre-sale pricing is exclusively available to members who sign up during the offer window.
            Our team will follow up with pricing details and next steps after you register.
          </p>
        </div>

        {/* ── Benefits ──────────────────────────────────────────────────── */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-4">
            What You Get
          </h2>
          <ul className="space-y-2.5 text-sm text-zinc-300">
            {[
              'Discounted rate locked in before public launch',
              'Priority access and early booking privileges',
              'Full access to simulator bays at your chosen location',
              'Flexible options — choose Full Year or 5 Month',
              'Member-only events and leagues',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 text-cyan-400 flex-shrink-0">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 border-t border-zinc-800" />
          <span className="text-zinc-600 text-xs uppercase tracking-widest">Sign Up</span>
          <div className="flex-1 border-t border-zinc-800" />
        </div>

        {/* ── Form / Success ─────────────────────────────────────────────── */}
        {submitted ? (
          <div className="text-center py-14 border border-cyan-500/30 rounded-2xl bg-cyan-500/5">
            <p className="text-4xl mb-4">✅</p>
            <p className="text-xl font-bold mb-2">You&apos;re on the list!</p>
            <p className="text-zinc-400 text-sm leading-relaxed max-w-xs mx-auto">
              Thanks for signing up. Our team will be in touch with pricing details and next steps.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" required>
                <input
                  type="text" required maxLength={60}
                  value={form.firstName} onChange={e => set('firstName', e.target.value)}
                  className={inputCls}
                  placeholder="Jane"
                />
              </Field>
              <Field label="Last Name" required>
                <input
                  type="text" required maxLength={60}
                  value={form.lastName} onChange={e => set('lastName', e.target.value)}
                  className={inputCls}
                  placeholder="Smith"
                />
              </Field>
            </div>

            {/* Email */}
            <Field label="Email Address" required>
              <input
                type="email" required maxLength={254}
                value={form.email} onChange={e => set('email', e.target.value)}
                className={inputCls}
                placeholder="jane@example.com"
                autoComplete="email"
              />
            </Field>

            {/* Phone */}
            <Field label="Phone Number" required>
              <input
                type="tel" required
                inputMode="numeric"
                pattern="[\d\s\-\(\)\+\.]{7,20}"
                value={form.phone} onChange={e => set('phone', e.target.value)}
                className={inputCls}
                placeholder="(555) 555-5555"
                autoComplete="tel"
              />
            </Field>

            {/* Location + Membership type row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Location" required>
                <select
                  required
                  value={form.location} onChange={e => set('location', e.target.value)}
                  className={selectCls}
                >
                  <option value="" disabled>Select location…</option>
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </Field>
              <Field label="Membership Type" required>
                <select
                  required
                  value={form.membershipType} onChange={e => set('membershipType', e.target.value)}
                  className={selectCls}
                >
                  <option value="" disabled>Select type…</option>
                  {MEMBERSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </Field>
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <input name="website" type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => set('website', e.target.value)} />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 border border-red-400/20 rounded-xl py-3 px-4">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-black font-extrabold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-widest uppercase shadow-lg shadow-cyan-400/15 mt-2"
            >
              {loading ? 'Submitting…' : 'Reserve My Spot'}
            </button>

            <p className="text-center text-zinc-600 text-xs">
              Offer valid {OFFER_START} – {OFFER_END}. No payment required to register.
            </p>
          </form>
        )}
      </div>
    </main>
  )
}

// ── Shared styles ──────────────────────────────────────────────────────────────
const inputCls = [
  'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5',
  'text-white text-sm placeholder:text-zinc-600',
  'focus:outline-none focus:border-cyan-400/70 focus:bg-zinc-700/60 transition-colors',
].join(' ')

const selectCls = [
  'w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3.5',
  'text-white text-sm appearance-none',
  'focus:outline-none focus:border-cyan-400/70 focus:bg-zinc-700/60 transition-colors',
].join(' ')

// ── Sub-components ──────────────────────────────────────────────────────────────
function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">
        {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-0.5">{label}</p>
      <p className="text-zinc-200 font-medium">{value}</p>
    </div>
  )
}
