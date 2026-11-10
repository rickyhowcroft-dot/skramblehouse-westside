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
const GOLD    = '#B45309'
const GOLD_LT = '#FFFBEB'
const GOLD_MID= '#FDE68A'

// ── Event definitions ─────────────────────────────────────────────────────────
const EVENTS = [
  {
    slug: 'baller-league',
    title: 'Baller League',
    dates: 'Starts week of 11/22',
    membersOnly: true,
    teamFormat: false,
    details: [
      { icon: '🧑', text: 'Singles format' },
      { icon: '📏', text: '6,800 yards +' },
      { icon: '⛳', text: "4' gimmes" },
      { icon: '💨', text: 'Wind / elements on' },
      { icon: '📊', text: 'Gross scoring' },
      { icon: '🗓️', text: '12 weeks — Top 8 scores count' },
      { icon: '📅', text: 'Starts week of 11/22' },
    ],
    divisions: [],
    pricing: [
      { label: 'Members', price: '$100', sub: 'per person' },
    ],
    prizePool: '$1,000 Prize Pool',
    cta: 'Register Now',
  },
  {
    slug: 'skramble-tour',
    title: 'Skramble Tour',
    dates: 'Starts week of 11/22',
    membersOnly: true,
    teamFormat: false,
    details: [
      { icon: '🧑', text: 'Singles format' },
      { icon: '🎯', text: 'Handicapped' },
      { icon: "⛳", text: "8' gimmes" },
      { icon: '🗓️', text: '12 weeks — Top 8 scores count' },
      { icon: '📅', text: 'Starts week of 11/22' },
      { icon: '🕐', text: 'Play whenever — set your own time' },
    ],
    divisions: [],
    pricing: [
      { label: 'Members', price: '$50', sub: 'per person' },
    ],
    prizePool: '$1,000 Prize Pool',
    cta: 'Register Now',
  },
]

// ── Form types ────────────────────────────────────────────────────────────────
const LOCATIONS = [
  { id: 'horsham',   label: 'Horsham' },
  { id: 'kop',       label: 'King of Prussia (KOP)' },
  { id: 'west-side', label: 'Rochester' },
]

const DIVISIONS = [
  { id: 'hcp-20-plus',  label: 'Division A — Team handicap 20+' },
  { id: 'hcp-under-20', label: 'Division B — Team handicap under 20' },
]

type RegistrationForm = {
  firstName: string
  lastName: string
  email: string
  phone: string
  ghin: string
  estimatedHcp: string
  location: string
  division: string
  teammateFirstName: string
  teammateLastName: string
  teammateGhin: string
  teammateEstimatedHcp: string
  website: string // honeypot
}

const EMPTY_FORM: RegistrationForm = {
  firstName: '', lastName: '', email: '', phone: '',
  ghin: '', estimatedHcp: '',
  location: '', division: '',
  teammateFirstName: '', teammateLastName: '',
  teammateGhin: '', teammateEstimatedHcp: '',
  website: '',
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [activeEvent, setActiveEvent] = useState<string | null>(null)
  const activeEventDef = EVENTS.find(e => e.slug === activeEvent) ?? null

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/rochester-hero.jpg"
            alt="Skramblehouse Events"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 16px 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 42px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 10px',
          lineHeight: 1.15,
        }}>
          Events
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.65, margin: '0 auto', maxWidth: 400 }}>
          Leagues, scrambles &amp; tournaments across all three Skramblehouse locations.
        </p>
      </div>

      {/* ── Event Cards ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '36px auto 72px', padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {EVENTS.map(event => (
          <EventCard
            key={event.slug}
            event={event}
            onRegister={() => setActiveEvent(event.slug)}
          />
        ))}
      </div>

      {/* ── Registration Modal ────────────────────────────────────────────── */}
      {activeEvent && activeEventDef && (
        <RegistrationModal
          event={activeEventDef}
          onClose={() => setActiveEvent(null)}
        />
      )}

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
        select option { color: ${GRAY_1}; }
      `}</style>
    </main>
  )
}

// ── EventCard ─────────────────────────────────────────────────────────────────
function EventCard({ event, onRegister }: {
  event: typeof EVENTS[0]
  onRegister: () => void
}) {
  const hasPrize = 'prizePool' in event && event.prizePool

  return (
    <div style={{
      backgroundColor: '#fff',
      border: `1px solid ${GRAY_4}`,
      borderRadius: 22,
      padding: 'clamp(20px, 5vw, 32px)',
      boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
    }}>

      {/* Title row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h2 style={{ fontSize: 'clamp(18px, 4vw, 24px)', fontWeight: 800, margin: '0 0 4px', color: GRAY_1 }}>
            {event.title}
          </h2>
          <p style={{ fontSize: 13, color: GRAY_3, margin: 0 }}>{event.dates}</p>
        </div>
        {event.membersOnly && (
          <span style={{
            backgroundColor: GOLD_LT,
            border: `1px solid ${GOLD_MID}`,
            color: GOLD,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            padding: '4px 10px',
            borderRadius: 20,
            flexShrink: 0,
          }}>
            Members Only
          </span>
        )}
      </div>

      {/* Detail chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginBottom: 16 }}>
        {event.details.map(d => (
          <div key={d.text} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 14 }}>{d.icon}</span>
            <span style={{ fontSize: 13, color: GRAY_3 }}>{d.text}</span>
          </div>
        ))}
      </div>

      {/* Divisions */}
      {event.divisions.length > 0 && (
        <div style={{
          backgroundColor: BLUE_LT,
          border: `1px solid ${BLUE_MID}`,
          borderRadius: 12,
          padding: '12px 16px',
          marginBottom: 16,
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE, margin: '0 0 8px' }}>
            2 Divisions
          </p>
          {event.divisions.map(d => (
            <p key={d} style={{ fontSize: 13, color: GRAY_1, margin: '0 0 4px', fontWeight: 500 }}>
              {d}
            </p>
          ))}
        </div>
      )}

      {/* Prize pool */}
      {hasPrize && (
        <div style={{
          backgroundColor: GOLD_LT,
          border: `1px solid ${GOLD_MID}`,
          borderRadius: 12,
          padding: '10px 16px',
          marginBottom: 16,
          display: 'inline-block',
        }}>
          <span style={{ fontSize: 14, fontWeight: 800, color: GOLD }}>🏆 {event.prizePool}</span>
        </div>
      )}

      {/* Pricing + CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexWrap: 'wrap', marginTop: 4 }}>
        {event.pricing.map(p => (
          <div key={p.label} style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 11, color: GRAY_3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              {p.label}
            </span>
            <span style={{ fontSize: 20, fontWeight: 900, color: p.price === 'FREE' ? '#065F46' : GRAY_1 }}>
              {p.price}
            </span>
            {p.sub && <span style={{ fontSize: 12, color: GRAY_3 }}>{p.sub}</span>}
          </div>
        ))}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onRegister}
            style={{
              backgroundColor: BLUE,
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '13px 24px',
              borderRadius: 12,
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'inherit',
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
            onMouseLeave={e => { (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
          >
            {event.cta} →
          </button>
        </div>
      </div>

    </div>
  )
}

// ── RegistrationModal ─────────────────────────────────────────────────────────
function RegistrationModal({ event, onClose }: {
  event: typeof EVENTS[0]
  onClose: () => void
}) {
  const [form, setForm]       = useState<RegistrationForm>(EMPTY_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const isTeam = event.teamFormat

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.location)                       return setError('Please select a location.')
    if (!form.ghin && !form.estimatedHcp)     return setError('Please enter your GHIN # or Estimated Handicap Index.')
    if (isTeam && !form.division)             return setError('Please select a division.')

    const hasTeammate = form.teammateFirstName || form.teammateLastName
    if (isTeam && hasTeammate && !form.teammateGhin && !form.teammateEstimatedHcp) {
      return setError("Please enter your teammate's GHIN # or Estimated Handicap Index.")
    }

    setLoading(true)
    try {
      const res  = await fetch('/api/event-registration', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, eventSlug: event.slug }),
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
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(0,0,0,0.55)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0',
        pointerEvents: 'none',
      }}>
        <div style={{
          backgroundColor: '#fff',
          borderRadius: '22px 22px 0 0',
          width: '100%',
          maxWidth: 680,
          maxHeight: '92dvh',
          overflowY: 'auto',
          padding: 'clamp(20px, 5vw, 36px)',
          pointerEvents: 'all',
          boxShadow: '0 -8px 40px rgba(0,0,0,0.18)',
        }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 4px', color: GRAY_1 }}>
                {event.title}
              </h2>
              <p style={{ color: GRAY_3, fontSize: 13, margin: 0 }}>{event.dates}</p>
            </div>
            <button
              onClick={onClose}
              style={{
                background: GRAY_5, border: `1px solid ${GRAY_4}`,
                borderRadius: '50%', width: 36, height: 36,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', fontSize: 18, color: GRAY_3,
                fontFamily: 'inherit', flexShrink: 0,
              }}
            >
              ✕
            </button>
          </div>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 18px', fontSize: 26,
              }}>✅</div>
              <h3 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                You&rsquo;re registered!
              </h3>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 280, margin: '0 auto 24px' }}>
                We&rsquo;ll be in touch with all the details.
              </p>
              <button
                onClick={onClose}
                style={{
                  backgroundColor: GRAY_5, border: `1px solid ${GRAY_4}`,
                  color: GRAY_1, fontWeight: 700, fontSize: 14,
                  padding: '12px 24px', borderRadius: 12, cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                Close
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

              {/* ── Location ── */}
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

              {/* ── Division (team events only) ── */}
              {isTeam && (
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
              )}

              {/* ── Your Info ── */}
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

              {/* ── Teammate (team events only) ── */}
              {isTeam && (
                <>
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
                </>
              )}

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
                  marginTop: 4,
                  fontFamily: 'inherit',
                }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
                onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
              >
                {loading ? 'Submitting…' : `${event.cta} →`}
              </button>

            </form>
          )}
        </div>
      </div>
    </>
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
