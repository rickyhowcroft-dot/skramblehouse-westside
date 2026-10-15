'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'

// ── Brand tokens (matches /league-registration) ─────────────────────────────
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GRAY_1  = '#111827'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'
const GREEN   = '#16A34A'
const GREEN_LT= '#F0FDF4'
const GREEN_BD= '#BBF7D0'

const MAX_SPOTS = 50

type Form = {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  website:   string // honeypot
}

const EMPTY: Form = { firstName: '', lastName: '', email: '', phone: '', website: '' }

// ── Animated counter ─────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0)
  const raf  = useRef<number | null>(null)
  const prev = useRef(0)

  useEffect(() => {
    if (target === 0) { setValue(0); return }
    const start = Date.now()
    const from  = prev.current
    const delta = target - from
    if (raf.current) cancelAnimationFrame(raf.current)
    const tick = () => {
      const elapsed = Date.now() - start
      const t = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3)
      setValue(Math.round(from + delta * eased))
      if (t < 1) raf.current = requestAnimationFrame(tick)
      else { prev.current = target }
    }
    raf.current = requestAnimationFrame(tick)
    return () => { if (raf.current) cancelAnimationFrame(raf.current) }
  }, [target, duration])

  return value
}

export default function EarlybirdPage() {
  const [count,     setCount]     = useState<number | null>(null)
  const [form,      setForm]      = useState<Form>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const animated = useCountUp(count ?? 0)
  const remaining = MAX_SPOTS - (count ?? 0)
  const pct       = Math.min(((count ?? 0) / MAX_SPOTS) * 100, 100)
  const isFull    = (count ?? 0) >= MAX_SPOTS

  // Fetch current count on mount
  useEffect(() => {
    fetch('/api/earlybird')
      .then(r => r.json())
      .then(d => setCount(d.count ?? 0))
      .catch(() => setCount(0))
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res  = await fetch('/api/earlybird', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }
    if (typeof data.count === 'number') setCount(data.count)
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ borderRadius: 18, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/rochester-hero.jpg"
            alt="Skramblehouse West Side — Early Bird Special"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '36px 16px 0', textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          backgroundColor: BLUE_LT,
          border: `1px solid ${BLUE_MID}`,
          borderRadius: 999,
          padding: '5px 16px',
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          color: BLUE,
          marginBottom: 16,
        }}>
          Limited — 50 Spots Only
        </div>
        <h1 style={{
          fontSize: 'clamp(26px, 6vw, 42px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 16px',
          lineHeight: 1.12,
        }}>
          Skramblehouse West Side<br />Early Bird Special
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          Awaiting the opening of our <strong style={{ color: GRAY_1 }}>Westside location</strong>?<br />
          Lock in your spot now and get immediate access to our Rochester location while you wait.
        </p>
      </div>

      {/* ── Offer cards ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '32px auto 0', padding: '0 16px' }}>
        <div style={{
          backgroundColor: BLUE_LT,
          border: `1.5px solid ${BLUE_MID}`,
          borderRadius: 20,
          padding: 'clamp(20px, 5vw, 36px)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ fontSize: 28 }}>🏌️</span>
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.10em', textTransform: 'uppercase', color: BLUE, margin: 0 }}>Early Bird Offer</p>
              <p style={{ fontSize: 28, fontWeight: 900, color: GRAY_1, margin: 0, lineHeight: 1.1 }}>$400</p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: '✅', text: 'Access to Skramblehouse — Rochester (Perinton Square Mall) immediately' },
              { icon: '🎟️', text: '15 passes to use anytime, 24/7' },
              { icon: '💳', text: 'Your $400 becomes a full credit toward membership dues when the Westside location opens' },
              { icon: '🔒', text: 'Spots are limited to 50 — lock yours in today' },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0, marginTop: 1 }}>{icon}</span>
                <span style={{ fontSize: 15, color: GRAY_1, lineHeight: 1.55 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Spot ticker ───────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '28px auto 0', padding: '0 16px' }}>
        <div style={{
          border: `1.5px solid ${GRAY_4}`,
          borderRadius: 20,
          padding: '28px 32px',
          textAlign: 'center',
          boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
        }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: GRAY_3, margin: '0 0 10px' }}>
            Spots Claimed
          </p>

          {/* Big number */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 8, marginBottom: 16 }}>
            <span style={{
              fontSize: 'clamp(52px, 12vw, 80px)',
              fontWeight: 900,
              lineHeight: 1,
              color: count === null ? GRAY_4 : isFull ? '#B91C1C' : BLUE,
              transition: 'color 0.3s',
              fontVariantNumeric: 'tabular-nums',
            }}>
              {count === null ? '—' : animated}
            </span>
            <span style={{ fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 700, color: GRAY_3 }}>
              / {MAX_SPOTS}
            </span>
          </div>

          {/* Progress bar */}
          <div style={{
            height: 12,
            backgroundColor: GRAY_4,
            borderRadius: 999,
            overflow: 'hidden',
            marginBottom: 12,
          }}>
            <div style={{
              height: '100%',
              width: `${pct}%`,
              backgroundColor: isFull ? '#EF4444' : BLUE,
              borderRadius: 999,
              transition: 'width 0.6s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.3s',
            }} />
          </div>

          <p style={{
            fontSize: 14,
            fontWeight: 700,
            color: isFull ? '#B91C1C' : remaining <= 10 ? '#D97706' : GREEN,
            margin: 0,
          }}>
            {count === null
              ? 'Loading…'
              : isFull
              ? '🚫 All spots have been claimed'
              : remaining <= 10
              ? `⚡ Only ${remaining} spot${remaining === 1 ? '' : 's'} left!`
              : `✅ ${remaining} spot${remaining === 1 ? '' : 's'} remaining`
            }
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '32px auto 0', padding: '0 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Sign Up Now
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 16px 80px' }}>
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
                backgroundColor: GREEN_LT, border: `2px solid ${GREEN_BD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                You&rsquo;re locked in!
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 340, margin: '0 auto' }}>
                Thanks for grabbing your Early Bird spot. We&rsquo;ll be in touch with next steps
                and payment details shortly.
              </p>
            </div>
          ) : isFull ? (
            /* ── Full ── */
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>😔</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                All spots are claimed
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 320, margin: '0 auto' }}>
                All 50 Early Bird spots have been taken. Stay tuned — we&rsquo;ll announce when
                the Westside location opens.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: GRAY_1 }}>Reserve Your Spot</h2>
                <p style={{ color: GRAY_3, fontSize: 13, margin: 0 }}>
                  Fields marked <span style={{ color: BLUE, fontWeight: 700 }}>*</span> are required.
                  We&rsquo;ll follow up with payment details.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <div className="two-col">
                  <Field label="First Name">
                    <input type="text" required maxLength={60} placeholder="Jane"
                      value={form.firstName} onChange={e => setForm(p => ({ ...p, firstName: e.target.value }))} />
                  </Field>
                  <Field label="Last Name">
                    <input type="text" required maxLength={60} placeholder="Smith"
                      value={form.lastName} onChange={e => setForm(p => ({ ...p, lastName: e.target.value }))} />
                  </Field>
                </div>

                {/* Email */}
                <Field label="Email Address">
                  <input type="email" required maxLength={254} placeholder="jane@example.com"
                    autoComplete="email"
                    value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
                </Field>

                {/* Phone */}
                <Field label="Phone Number">
                  <input type="tel" required placeholder="(555) 555-5555"
                    autoComplete="tel"
                    value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </Field>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))} />
                </div>

                {/* Error */}
                {error && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 12, padding: '13px 16px',
                    color: '#B91C1C', fontSize: 14, textAlign: 'center', fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}

                {/* Submit */}
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
                  {loading ? 'Locking in your spot…' : 'Lock In My Spot →'}
                </button>

                <p style={{ fontSize: 12, color: GRAY_3, textAlign: 'center', margin: '4px 0 0', lineHeight: 1.5 }}>
                  We&rsquo;ll reach out with payment info. Your spot is reserved once payment is received.
                </p>

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
        main input {
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
        main input:focus {
          border-color: ${BLUE};
          box-shadow: 0 0 0 3px ${BLUE_LT};
        }
      `}</style>

    </main>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{
        fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: GRAY_3,
      }}>
        {label} <span style={{ color: BLUE }}>*</span>
      </label>
      {children}
    </div>
  )
}
