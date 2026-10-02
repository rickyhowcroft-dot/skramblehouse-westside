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

// ── Constants ────────────────────────────────────────────────────────────────
const LEAGUE_NIGHTS = [
  { id: 'tuesday',   label: 'Tuesday',   sub: 'Different format each week' },
  { id: 'wednesday', label: 'Wednesday', sub: '2-man match play' },
]

const TIME_SLOTS = [
  { id: '4pm',  label: '4pm' },
  { id: '6pm',  label: '6pm' },
  { id: '8pm',  label: '8pm' },
]

const SESSIONS = [
  { id: 'session1', label: 'Session 1 — Fall',   dates: 'Oct 27 – Dec 16' },
  { id: 'session2', label: 'Session 2 — Winter', dates: 'Jan 5 – Feb 17' },
  { id: 'session3', label: 'Session 3 — Spring', dates: 'Feb 23 – Apr 7' },
]

type Form = {
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

const EMPTY: Form = {
  firstName: '', lastName: '', email: '', phone: '',
  ghin: '', estimatedHcp: '',
  leagueNights: [], timeSlot: '', sessions: [],
  website: '',
}

export default function LeagueRegistrationPage() {
  const [form, setForm]           = useState<Form>(EMPTY)
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
    if (form.leagueNights.length === 0) return setError('Please select at least one league night.')
    if (!form.timeSlot)                 return setError('Please select a time slot.')
    if (form.sessions.length === 0)     return setError('Please select at least one session.')
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
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/rochester-hero.jpg"
            alt="Skramblehouse League Registration"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 16px 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(26px, 6vw, 40px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 12px',
          lineHeight: 1.15,
        }}>
          Skramblehouse<br />League Registration
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
          Sign up for Tuesday and/or Wednesday night leagues. Playoff week runs 6–10pm for all registrants.
        </p>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '36px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Register Now
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 72px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${GRAY_4}`,
          borderRadius: 22,
          padding: 'clamp(20px, 5vw, 44px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>

          {submitted ? (
            /* ── Success ── */
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
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 300, margin: '0 auto' }}>
                We&rsquo;ll be in touch soon with all the league details.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: GRAY_1 }}>Sign Up</h2>
                <p style={{ color: GRAY_3, fontSize: 13, margin: 0 }}>
                  Fields marked <span style={{ color: BLUE, fontWeight: 700 }}>*</span> are required
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* ── Name ── */}
                <div className="two-col">
                  <Field label="First Name"><input type="text" required maxLength={60} placeholder="Jane"
                    value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} /></Field>
                  <Field label="Last Name"><input type="text" required maxLength={60} placeholder="Smith"
                    value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} /></Field>
                </div>

                {/* ── Contact ── */}
                <Field label="Email Address"><input type="email" required maxLength={254} placeholder="jane@example.com"
                  autoComplete="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} /></Field>

                <Field label="Phone Number"><input type="tel" required placeholder="(555) 555-5555"
                  autoComplete="tel" value={form.phone}
                  onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} /></Field>

                {/* ── Handicap ── */}
                <div className="two-col">
                  <Field label="GHIN #" optional><input type="text" placeholder="Optional"
                    value={form.ghin} onChange={e => setForm(p => ({ ...p, ghin: e.target.value }))} /></Field>
                  <Field label="Est. Handicap Index" optional hint="if no GHIN">
                    <input type="text" placeholder="e.g. 12.4"
                      value={form.estimatedHcp} onChange={e => setForm(p => ({ ...p, estimatedHcp: e.target.value }))} />
                  </Field>
                </div>

                {/* ── League Night ── */}
                <GroupLabel label="League Night" note="select all you wish to play" required />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: -6 }}>
                  {LEAGUE_NIGHTS.map(n => (
                    <CheckRow key={n.id}
                      checked={form.leagueNights.includes(n.id)}
                      label={n.label} sub={n.sub}
                      onClick={() => toggleArr('leagueNights', n.id)} />
                  ))}
                </div>

                {/* ── Time Slot ── */}
                <GroupLabel label="Time Slot Each Week" note="playoff week 6–10pm for all" required />
                <div style={{ display: 'flex', gap: 10, marginTop: -6 }}>
                  {TIME_SLOTS.map(s => {
                    const on = form.timeSlot === s.id
                    return (
                      <button key={s.id} type="button"
                        onClick={() => setForm(p => ({ ...p, timeSlot: s.id }))}
                        style={{
                          flex: 1, padding: '14px 8px',
                          borderRadius: 12, cursor: 'pointer',
                          fontWeight: 800, fontSize: 17,
                          fontFamily: 'inherit',
                          backgroundColor: on ? BLUE_LT : GRAY_5,
                          border: `2px solid ${on ? BLUE : GRAY_4}`,
                          color: on ? BLUE : GRAY_3,
                          transition: 'all 0.15s',
                        }}>
                        {s.label}
                      </button>
                    )
                  })}
                </div>

                {/* ── Sessions ── */}
                <GroupLabel label="Session" note="select all you wish to play" required />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: -6 }}>
                  {SESSIONS.map(s => (
                    <CheckRow key={s.id}
                      checked={form.sessions.includes(s.id)}
                      label={s.label} sub={s.dates}
                      onClick={() => toggleArr('sessions', s.id)} />
                  ))}
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>

                {/* ── Error ── */}
                {error && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 12, padding: '13px 16px',
                    color: '#B91C1C', fontSize: 14, textAlign: 'center', fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}

                {/* ── Submit ── */}
                <button type="submit" disabled={loading}
                  style={{
                    width: '100%',
                    backgroundColor: loading ? '#93C5FD' : BLUE,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    padding: '17px 24px',
                    borderRadius: 14,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s',
                    marginTop: 6,
                    fontFamily: 'inherit',
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
        /* ── Scoped styles ── */

        /* Mobile-first: everything full width */
        .two-col { display: flex; flex-direction: column; gap: 14px; }

        /* ≥ 520px: side-by-side */
        @media (min-width: 520px) {
          .two-col { flex-direction: row; }
          .two-col > * { flex: 1; }
        }

        /* Input base */
        main input, main select, main textarea {
          display: block;
          width: 100%;
          background-color: ${GRAY_5};
          border: 1.5px solid ${GRAY_4};
          border-radius: 12px;
          padding: 13px 16px;
          font-size: 15px;
          font-family: inherit;
          color: ${GRAY_1};
          outline: none;
          box-sizing: border-box;
          -webkit-appearance: none;
          appearance: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        main input::placeholder { color: #9CA3AF; }
        main input:focus, main select:focus {
          border-color: ${BLUE};
          box-shadow: 0 0 0 3px ${BLUE_LT};
        }
      `}</style>

    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children, optional, hint }: {
  label: string
  children: React.ReactNode
  optional?: boolean
  hint?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: GRAY_3,
      }}>
        {label}{' '}
        {optional
          ? <span style={{ color: GRAY_3, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
              {hint ? `(${hint})` : '(optional)'}
            </span>
          : <span style={{ color: BLUE }}>*</span>
        }
      </label>
      {children}
    </div>
  )
}

function GroupLabel({ label, note, required }: { label: string; note?: string; required?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: BLUE, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_1 }}>
        {label}
        {required && <span style={{ color: BLUE, marginLeft: 3 }}>*</span>}
      </span>
      {note && (
        <span style={{ color: GRAY_3, fontSize: 12, fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>
          — {note}
        </span>
      )}
    </div>
  )
}

function CheckRow({ checked, label, sub, onClick }: {
  checked: boolean
  label: string
  sub: string
  onClick: () => void
}) {
  return (
    <button type="button" onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        width: '100%', textAlign: 'left',
        backgroundColor: checked ? BLUE_LT : GRAY_5,
        border: `2px solid ${checked ? BLUE : GRAY_4}`,
        borderRadius: 14, padding: '14px 16px',
        cursor: 'pointer', transition: 'all 0.15s',
        fontFamily: 'inherit',
      }}>
      {/* Checkbox */}
      <span style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        backgroundColor: checked ? BLUE : '#fff',
        border: `2px solid ${checked ? BLUE : '#D1D5DB'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#fff', fontSize: 13, fontWeight: 900, lineHeight: 1 }}>✓</span>}
      </span>
      {/* Text */}
      <span>
        <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1, display: 'block' }}>{label}</span>
        <span style={{ fontSize: 12, color: GRAY_3, marginTop: 2, display: 'block' }}>{sub}</span>
      </span>
    </button>
  )
}
