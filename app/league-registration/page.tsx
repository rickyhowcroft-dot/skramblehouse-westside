'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Constants ───────────────────────────────────────────────────────────────
const LEAGUE_NIGHTS = [
  { id: 'tuesday',   label: 'Tuesday',   sub: 'Different format each week' },
  { id: 'wednesday', label: 'Wednesday', sub: '2-man match play' },
]

const TIME_SLOTS = ['4pm', '6pm', '8pm']

const SESSIONS = [
  { id: 'session1', label: 'Session 1 – Fall',   dates: 'October 27 – December 16' },
  { id: 'session2', label: 'Session 2 – Winter', dates: 'January 5 – February 17' },
  { id: 'session3', label: 'Session 3 – Spring', dates: 'February 23 – April 7' },
]

type FormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  ghin: string
  estimatedHcp: string
  leagueNights: string[]
  timeSlot: string
  sessions: string[]
  website: string // honeypot
}

const EMPTY: FormState = {
  firstName: '', lastName: '', email: '', phone: '',
  ghin: '', estimatedHcp: '',
  leagueNights: [], timeSlot: '', sessions: [],
  website: '',
}

export default function LeagueRegistrationPage() {
  const [form, setForm]           = useState<FormState>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  // ── Helpers ─────────────────────────────────────────────────────────────
  const toggleArr = (key: 'leagueNights' | 'sessions', val: string) => {
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val)
        ? p[key].filter(v => v !== val)
        : [...p[key], val],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // Client-side guards
    if (form.leagueNights.length === 0) { setError('Please select at least one league night.'); return }
    if (!form.timeSlot) { setError('Please select a time slot.'); return }
    if (form.sessions.length === 0) { setError('Please select at least one session.'); return }

    setLoading(true)

    const res  = await fetch('/api/league-registration', {
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

  // ── Input field helper ──────────────────────────────────────────────────
  const textField = (
    label: string,
    key: keyof FormState,
    opts?: { type?: string; required?: boolean; placeholder?: string }
  ) => {
    const { type = 'text', required = true, placeholder = '' } = opts ?? {}
    return (
      <div>
        <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
          {label}{required && <span className="text-cyan-400 ml-0.5">*</span>}
        </label>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={form[key] as string}
          onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
          className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-400/70 focus:bg-zinc-700/60 transition-colors placeholder:text-zinc-600"
        />
      </div>
    )
  }

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <main className="bg-zinc-950 text-white">
      <div className="max-w-lg w-full mx-auto px-5 pt-6 pb-14 flex flex-col gap-6">

        {/* Hero banner */}
        <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          <Image
            src="/hero.jpg"
            alt="Skramblehouse League Registration"
            width={1200}
            height={630}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Headline */}
        <div>
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-2">
            Indoor Golf Leagues
          </p>
          <h1 className="text-2xl font-extrabold uppercase tracking-tight leading-tight text-white">
            Skramblehouse<br />League Registration
          </h1>
          <p className="text-sm text-gray-400 leading-relaxed mt-2">
            Sign up for one or more league nights and sessions. Playoff week runs 6–10pm for all registrants.
          </p>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Success state */}
        {submitted ? (
          <div className="text-center py-12 border border-cyan-500/30 rounded-2xl bg-cyan-500/5">
            <p className="text-4xl mb-3">✅</p>
            <p className="text-xl font-bold mb-1">You&apos;re registered!</p>
            <p className="text-zinc-400 text-sm">We&apos;ll be in touch with more details soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">

            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              {textField('First Name', 'firstName')}
              {textField('Last Name', 'lastName')}
            </div>

            {/* Contact */}
            {textField('Email Address', 'email', { type: 'email' })}
            {textField('Phone Number', 'phone', { type: 'tel' })}

            {/* Handicap block */}
            <div className="flex flex-col gap-3">
              {textField('GHIN #', 'ghin', { required: false, placeholder: 'Optional' })}
              <div>
                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                  Estimated Handicap Index <span className="text-zinc-600 font-normal normal-case tracking-normal text-[10px]">(if no GHIN)</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. 12.4"
                  value={form.estimatedHcp}
                  onChange={e => setForm(p => ({ ...p, estimatedHcp: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-4 text-white text-sm focus:outline-none focus:border-cyan-400/70 focus:bg-zinc-700/60 transition-colors placeholder:text-zinc-600"
                />
              </div>
            </div>

            {/* League night */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                League Night Choice <span className="text-cyan-400">*</span>
                <span className="text-zinc-600 font-normal normal-case tracking-normal text-[10px] ml-1">(select all that apply)</span>
              </label>
              <div className="flex flex-col gap-2">
                {LEAGUE_NIGHTS.map(n => {
                  const checked = form.leagueNights.includes(n.id)
                  return (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => toggleArr('leagueNights', n.id)}
                      className={`flex items-center gap-3 w-full text-left rounded-xl px-4 py-3.5 border transition-all ${
                        checked
                          ? 'border-cyan-400/60 bg-cyan-400/10'
                          : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-600'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                        checked ? 'bg-cyan-400 border-cyan-400' : 'border-zinc-600 bg-zinc-800'
                      }`}>
                        {checked && <span className="text-black text-xs font-black">✓</span>}
                      </span>
                      <span>
                        <span className="text-sm font-semibold text-white">{n.label}</span>
                        <span className="block text-[11px] text-zinc-500 mt-0.5">{n.sub}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Time slot */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Time Slot Each Week <span className="text-cyan-400">*</span>
                <span className="text-zinc-600 font-normal normal-case tracking-normal text-[10px] ml-1">(playoff week runs 6–10pm for all)</span>
              </label>
              <div className="flex gap-3">
                {TIME_SLOTS.map(slot => {
                  const selected = form.timeSlot === slot
                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, timeSlot: slot }))}
                      className={`flex-1 py-3.5 rounded-xl border text-sm font-bold transition-all ${
                        selected
                          ? 'border-cyan-400/60 bg-cyan-400/10 text-cyan-400'
                          : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:text-white'
                      }`}
                    >
                      {slot}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Sessions */}
            <div>
              <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-3">
                Session <span className="text-cyan-400">*</span>
                <span className="text-zinc-600 font-normal normal-case tracking-normal text-[10px] ml-1">(select all that apply)</span>
              </label>
              <div className="flex flex-col gap-2">
                {SESSIONS.map(s => {
                  const checked = form.sessions.includes(s.id)
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleArr('sessions', s.id)}
                      className={`flex items-center gap-3 w-full text-left rounded-xl px-4 py-3.5 border transition-all ${
                        checked
                          ? 'border-cyan-400/60 bg-cyan-400/10'
                          : 'border-zinc-700 bg-zinc-800/60 hover:border-zinc-600'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-all ${
                        checked ? 'bg-cyan-400 border-cyan-400' : 'border-zinc-600 bg-zinc-800'
                      }`}>
                        {checked && <span className="text-black text-xs font-black">✓</span>}
                      </span>
                      <span>
                        <span className="text-sm font-semibold text-white">{s.label}</span>
                        <span className="block text-[11px] text-zinc-500 mt-0.5">{s.dates}</span>
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Honeypot */}
            <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: '1px', height: '1px', overflow: 'hidden' }}>
              <label htmlFor="website_hp">Website</label>
              <input id="website_hp" name="website" type="text" tabIndex={-1} autoComplete="off"
                value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
            </div>

            {error && <p className="text-red-400 text-sm text-center font-medium">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-cyan-400 text-black font-extrabold py-4 rounded-xl hover:bg-cyan-300 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm tracking-widest uppercase shadow-lg shadow-cyan-400/15 mt-2"
            >
              {loading ? 'Submitting…' : 'Register Now'}
            </button>

          </form>
        )}
      </div>
    </main>
  )
}
