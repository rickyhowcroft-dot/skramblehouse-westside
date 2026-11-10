'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Brand tokens ──────────────────────────────────────────────────────────────
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GRAY_1  = '#111827'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'
const GREEN   = '#065F46'
const GREEN_LT= '#ECFDF5'
const GREEN_BD= '#6EE7B7'

// ── Constants ─────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { id: 'horsham',   label: 'Horsham' },
  { id: 'kop',       label: 'King of Prussia (KOP)' },
  { id: 'west-side', label: 'Rochester' },
]

const DIVISIONS = [
  { id: 'hcp-20-plus',  label: 'Division A — Team handicap 20+' },
  { id: 'hcp-under-20', label: 'Division B — Team handicap under 20' },
]

type Form = {
  firstName: string
  lastName: string
  email: string
  phone: string
  ghin: string
  estimatedHcp: string
  location: string
  preferredTeeTimes: string
  division: string
  teammateFirstName: string
  teammateLastName: string
  teammateGhin: string
  teammateEstimatedHcp: string
  website: string
}

const EMPTY: Form = {
  firstName: '', lastName: '', email: '', phone: '',
  ghin: '', estimatedHcp: '',
  location: '', preferredTeeTimes: '', division: '',
  teammateFirstName: '', teammateLastName: '',
  teammateGhin: '', teammateEstimatedHcp: '',
  website: '',
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SkrambleOpenPage() {
  const [form, setForm]       = useState<Form>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.location)                   return setError('Please select a location.')
    if (!form.division)                   return setError('Please select a division.')
    if (!form.ghin && !form.estimatedHcp) return setError('Please enter your GHIN # or Estimated Handicap Index.')
    const hasTeammate = form.teammateFirstName || form.teammateLastName
    if (hasTeammate && !form.teammateGhin && !form.teammateEstimatedHcp)
      return setError("Please enter your teammate's GHIN # or Estimated Handicap Index.")
    setLoading(true)
    try {
      const res  = await fetch('/api/event-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventSlug: 'skramble-open' }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); return }
      setSubmitted(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Promo image ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.18)' }}>
          <Image
            src="/skramble-open-promo.jpg"
            alt="Open House Skramble — Nov 21–22"
            width={900}
            height={900}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '32px 16px 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(26px, 6vw, 40px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 12px',
          lineHeight: 1.15,
        }}>
          Open House Skramble
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.7, maxWidth: 440, margin: '0 auto' }}>
          2-person teams · Pick your tee time · Pick your facility
        </p>
      </div>

      {/* ── Detail strip ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '24px auto 0', padding: '0 16px' }}>
        <div style={{
          backgroundColor: GRAY_5,
          border: `1px solid ${GRAY_4}`,
          borderRadius: 14,
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '10px 28px',
        }}>
          {[
            { icon: '📅', text: 'Sat Nov 21 & Sun Nov 22' },
            { icon: '👥', text: '2-person teams' },
            { icon: '🕐', text: 'Pick your tee time' },
            { icon: '📍', text: 'Pick your facility' },
          ].map(({ icon, text }) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>{icon}</span>
              <span style={{ fontSize: 13, color: GRAY_3, fontWeight: 500 }}>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Divisions ────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '16px auto 0', padding: '0 16px' }}>
        <div style={{
          backgroundColor: BLUE_LT,
          border: `1.5px solid ${BLUE_MID}`,
          borderRadius: 14,
          padding: '14px 20px',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE, margin: '0 0 8px' }}>
            2 Divisions
          </p>
          <p style={{ fontSize: 13, color: GRAY_1, margin: '0 0 4px', fontWeight: 500 }}>Division A — Team handicap total 20 or higher</p>
          <p style={{ fontSize: 13, color: GRAY_1, margin: 0, fontWeight: 500 }}>Division B — Team handicap total 20 or lower</p>
        </div>
      </div>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '16px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <div style={{
            flex: 1,
            backgroundColor: GREEN_LT,
            border: `1.5px solid ${GREEN_BD}`,
            borderRadius: 18,
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: GREEN, margin: '0 0 6px' }}>
              Members
            </p>
            <p style={{ fontSize: 34, fontWeight: 900, color: GREEN, margin: '0 0 2px', lineHeight: 1 }}>FREE</p>
            <p style={{ fontSize: 13, color: GRAY_3, margin: 0 }}>per team</p>
          </div>
          <div style={{
            flex: 1,
            backgroundColor: GRAY_5,
            border: `1.5px solid ${GRAY_4}`,
            borderRadius: 18,
            padding: '20px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: GRAY_3, margin: '0 0 6px' }}>
              Non-Members
            </p>
            <p style={{ fontSize: 34, fontWeight: 900, color: GRAY_1, margin: '0 0 2px', lineHeight: 1 }}>$50</p>
            <p style={{ fontSize: 13, color: GRAY_3, margin: 0 }}>per team</p>
          </div>
        </div>
      </div>

      {/* ── Divider ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '32px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Register Your Team
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '24px 16px 72px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${GRAY_4}`,
          borderRadius: 22,
          padding: 'clamp(20px, 5vw, 44px)',
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
                Check your email for confirmation. We&rsquo;ll be in touch with all the details.
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

                {/* Location */}
                <Field label="Location">
                  <select
                    required
                    value={form.location}
                    onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                    style={{ color: form.location ? GRAY_1 : '#9CA3AF' }}
                  >
                    <option value="" disabled>Select a location…</option>
                    {LOCATIONS.map(l => (
                      <option key={l.id} value={l.id}>{l.label}</option>
                    ))}
                  </select>
                </Field>

                {/* Preferred Tee Time */}
                <Field label="Preferred Tee Time">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Saturday morning, any time Sunday…"
                    maxLength={300}
                    value={form.preferredTeeTimes}
                    onChange={e => setForm(p => ({ ...p, preferredTeeTimes: e.target.value }))}
                  />
                </Field>

                {/* Division */}
                <Field label="Division">
                  <select
                    required
                    value={form.division}
                    onChange={e => setForm(p => ({ ...p, division: e.target.value }))}
                    style={{ color: form.division ? GRAY_1 : '#9CA3AF' }}
                  >
                    <option value="" disabled>Select a division…</option>
                    {DIVISIONS.map(d => (
                      <option key={d.id} value={d.id}>{d.label}</option>
                    ))}
                  </select>
                </Field>

                {/* Your Info */}
                <GroupLabel label="Your Info" required />
                <div className="two-col" style={{ marginTop: -6 }}>
                  <Field label="First Name">
                    <input type="text" required maxLength={60} placeholder="Jane"
                      value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                  </Field>
                  <Field label="Last Name">
                    <input type="text" required maxLength={60} placeholder="Smith"
                      value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                  </Field>
                </div>
                <div className="two-col">
                  <Field label="GHIN #" optional>
                    <input type="text" placeholder="Optional"
                      value={form.ghin} onChange={e => setForm(p => ({ ...p, ghin: e.target.value }))} />
                  </Field>
                  <Field label="Est. Handicap Index" optional={!!form.ghin} hint={form.ghin ? undefined : 'required if no GHIN'}>
                    <input type="text" placeholder="e.g. 12.4"
                      value={form.estimatedHcp} onChange={e => setForm(p => ({ ...p, estimatedHcp: e.target.value }))} />
                  </Field>
                </div>
                <Field label="Email Address">
                  <input type="email" required maxLength={254} placeholder="jane@example.com"
                    autoComplete="email" value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </Field>
                <Field label="Phone Number">
                  <input type="tel" required placeholder="(555) 555-5555"
                    autoComplete="tel" value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </Field>

                {/* Teammate */}
                <GroupLabel label="Teammate" />
                <div className="two-col" style={{ marginTop: -6 }}>
                  <Field label="First Name" optional>
                    <input type="text" maxLength={60} placeholder="Alex"
                      value={form.teammateFirstName} onChange={e => setForm(p => ({ ...p, teammateFirstName: e.target.value }))} />
                  </Field>
                  <Field label="Last Name" optional>
                    <input type="text" maxLength={60} placeholder="Johnson"
                      value={form.teammateLastName} onChange={e => setForm(p => ({ ...p, teammateLastName: e.target.value }))} />
                  </Field>
                </div>
                <div className="two-col">
                  <Field label="GHIN #" optional>
                    <input type="text" placeholder="Optional"
                      value={form.teammateGhin} onChange={e => setForm(p => ({ ...p, teammateGhin: e.target.value }))} />
                  </Field>
                  <Field label="Est. Handicap Index" optional={!!form.teammateGhin} hint={form.teammateGhin ? undefined : 'required if no GHIN'}>
                    <input type="text" placeholder="e.g. 12.4"
                      value={form.teammateEstimatedHcp} onChange={e => setForm(p => ({ ...p, teammateEstimatedHcp: e.target.value }))} />
                  </Field>
                </div>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>

                {error && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 12, padding: '13px 16px',
                    color: '#B91C1C', fontSize: 14, textAlign: 'center', fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
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
                  {loading ? 'Submitting…' : 'Register Your Team →'}
                </button>

              </form>
            </>
          )}
        </div>
      </div>

      <style>{`
        .two-col { display: flex; flex-direction: column; gap: 14px; }
        @media (min-width: 520px) {
          .two-col { flex-direction: row; }
          .two-col > * { flex: 1; }
        }
        main input, main select {
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
  label: string; children: React.ReactNode; optional?: boolean; hint?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_3 }}>
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

function GroupLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: BLUE, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_1 }}>
        {label}
        {required && <span style={{ color: BLUE, marginLeft: 3 }}>*</span>}
      </span>
    </div>
  )
}
