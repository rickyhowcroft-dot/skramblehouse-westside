'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Brand tokens (matches /theproject-roc) ──────────────────────────────────
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GRAY_1  = '#111827'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'

const inputStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: GRAY_5,
  border: `1.5px solid ${GRAY_4}`,
  borderRadius: 12,
  padding: '13px 16px',
  fontSize: 15,
  color: GRAY_1,
  outline: 'none',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
  transition: 'border-color 0.15s',
}

// ── Constants ────────────────────────────────────────────────────────────────
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
  website: string
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

  const toggleArr = (key: 'leagueNights' | 'sessions', val: string) =>
    setForm(p => ({
      ...p,
      [key]: p[key].includes(val) ? p[key].filter(v => v !== val) : [...p[key], val],
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (form.leagueNights.length === 0) { setError('Please select at least one league night.'); return }
    if (!form.timeSlot)                 { setError('Please select a time slot.'); return }
    if (form.sessions.length === 0)     { setError('Please select at least one session.'); return }

    setLoading(true)
    const res  = await fetch('/api/league-registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{ backgroundColor: '#ffffff', color: GRAY_1, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/hero.jpg"
            alt="Skramblehouse League Registration"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: GRAY_1 }}>
          Skramblehouse League Registration
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          Register for Tuesday and/or Wednesday night leagues. Playoff week runs 6–10pm for all registrants regardless of time slot.
        </p>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Register Now
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 80px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${GRAY_4}`,
          borderRadius: 24,
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                You&rsquo;re registered!
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 320, margin: '0 auto' }}>
                Thanks for signing up. We&rsquo;ll be in touch with league details soon.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: GRAY_1 }}>
                  Sign Up
                </h2>
                <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>
                  Required fields marked <span style={{ color: BLUE, fontWeight: 700 }}>*</span>
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
                  <FormField label="First Name">
                    <input type="text" required maxLength={60} value={form.firstName}
                      onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))}
                      placeholder="Jane" style={inputStyle} />
                  </FormField>
                  <FormField label="Last Name">
                    <input type="text" required maxLength={60} value={form.lastName}
                      onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))}
                      placeholder="Smith" style={inputStyle} />
                  </FormField>
                </div>

                {/* Email */}
                <FormField label="Email Address">
                  <input type="email" required maxLength={254} value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="jane@example.com" autoComplete="email" style={inputStyle} />
                </FormField>

                {/* Phone */}
                <FormField label="Phone Number">
                  <input type="tel" required value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="(555) 555-5555" autoComplete="tel" style={inputStyle} />
                </FormField>

                {/* GHIN + Est Handicap */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
                  <FormField label="GHIN #" optional>
                    <input type="text" value={form.ghin}
                      onChange={e => setForm(p => ({ ...p, ghin: e.target.value }))}
                      placeholder="Optional" style={inputStyle} />
                  </FormField>
                  <FormField label="Est. Handicap Index" optional hint="if no GHIN">
                    <input type="text" value={form.estimatedHcp}
                      onChange={e => setForm(p => ({ ...p, estimatedHcp: e.target.value }))}
                      placeholder="e.g. 12.4" style={inputStyle} />
                  </FormField>
                </div>

                {/* League Night */}
                <SectionDivider label="League Night Choice" note="select all that apply" required />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: -8 }}>
                  {LEAGUE_NIGHTS.map(n => {
                    const checked = form.leagueNights.includes(n.id)
                    return (
                      <button key={n.id} type="button"
                        onClick={() => toggleArr('leagueNights', n.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          width: '100%', textAlign: 'left',
                          backgroundColor: checked ? BLUE_LT : GRAY_5,
                          border: `1.5px solid ${checked ? BLUE_MID : GRAY_4}`,
                          borderRadius: 12, padding: '14px 16px',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                          backgroundColor: checked ? BLUE : '#fff',
                          border: `2px solid ${checked ? BLUE : GRAY_4}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                        </span>
                        <span>
                          <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1, display: 'block' }}>{n.label}</span>
                          <span style={{ fontSize: 12, color: GRAY_3 }}>{n.sub}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Time Slot */}
                <SectionDivider label="Time Slot Each Week" note="playoff week runs 6–10pm for all" required />
                <div style={{ display: 'flex', gap: 12, marginTop: -8 }} className="name-grid">
                  {TIME_SLOTS.map(slot => {
                    const selected = form.timeSlot === slot
                    return (
                      <button key={slot} type="button"
                        onClick={() => setForm(p => ({ ...p, timeSlot: slot }))}
                        style={{
                          flex: 1, padding: '14px 8px',
                          borderRadius: 12, cursor: 'pointer',
                          fontWeight: 800, fontSize: 16,
                          backgroundColor: selected ? BLUE_LT : GRAY_5,
                          border: `1.5px solid ${selected ? BLUE_MID : GRAY_4}`,
                          color: selected ? BLUE : GRAY_3,
                          transition: 'all 0.15s',
                        }}>
                        {slot}
                      </button>
                    )
                  })}
                </div>

                {/* Sessions */}
                <SectionDivider label="Session" note="select all that apply" required />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: -8 }}>
                  {SESSIONS.map(s => {
                    const checked = form.sessions.includes(s.id)
                    return (
                      <button key={s.id} type="button"
                        onClick={() => toggleArr('sessions', s.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          width: '100%', textAlign: 'left',
                          backgroundColor: checked ? BLUE_LT : GRAY_5,
                          border: `1.5px solid ${checked ? BLUE_MID : GRAY_4}`,
                          borderRadius: 12, padding: '14px 16px',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}>
                        <span style={{
                          width: 20, height: 20, borderRadius: 5, flexShrink: 0,
                          backgroundColor: checked ? BLUE : '#fff',
                          border: `2px solid ${checked ? BLUE : GRAY_4}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          transition: 'all 0.15s',
                        }}>
                          {checked && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
                        </span>
                        <span>
                          <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1, display: 'block' }}>{s.label}</span>
                          <span style={{ fontSize: 12, color: GRAY_3 }}>{s.dates}</span>
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>

                {error && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 12, padding: '12px 16px',
                    color: '#B91C1C', fontSize: 14, textAlign: 'center',
                  }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#93C5FD' : BLUE,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 14,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '16px 24px',
                    borderRadius: 14,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s',
                    marginTop: 4,
                  }}
                  onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
                  onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
                >
                  {loading ? 'Submitting…' : 'Register Now →'}
                </button>

              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) {
          .name-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────
function FormField({ label, children, optional, hint }: {
  label: string
  children: React.ReactNode
  optional?: boolean
  hint?: string
}) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: GRAY_3, marginBottom: 8,
      }}>
        {label}{' '}
        {optional
          ? <span style={{ color: GRAY_3, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>{hint ? `(${hint})` : '(optional)'}</span>
          : <span style={{ color: BLUE }}>*</span>
        }
      </label>
      {children}
    </div>
  )
}

function SectionDivider({ label, note, required }: { label: string; note?: string; required?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 8 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: BLUE, flexShrink: 0 }} />
      <span style={{ color: GRAY_1, fontSize: 13, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {label}
        {required && <span style={{ color: BLUE, marginLeft: 3 }}>*</span>}
      </span>
      {note && <span style={{ color: GRAY_3, fontSize: 12, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>— {note}</span>}
    </div>
  )
}
