'use client'

import { useState, useEffect } from 'react'
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
const RED     = '#DC2626'
const RED_LT  = '#FEF2F2'
const RED_BD  = '#FECACA'

const LIMIT = 50

type Form = {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  website:   string
}

const EMPTY: Form = { firstName: '', lastName: '', email: '', phone: '', website: '' }

export default function FloaterPage() {
  const [form,       setForm]       = useState<Form>(EMPTY)
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [paidCount,  setPaidCount]  = useState<number | null>(null)
  const [soldOut,    setSoldOut]    = useState(false)

  const set = (key: keyof Form, val: string) => setForm(p => ({ ...p, [key]: val }))

  // ── Fetch paid ticker ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCount = async () => {
      try {
        const res  = await fetch('/api/floater/count')
        const data = await res.json()
        setPaidCount(data.paid_count ?? 0)
        setSoldOut(data.sold_out ?? false)
      } catch { /* silent */ }
    }
    fetchCount()
    const interval = setInterval(fetchCount, 30_000)
    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (soldOut) { setError('Sorry, this offer is sold out.'); return }
    setLoading(true)
    try {
      const res  = await fetch('/api/floater', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
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

  const spotsLeft = paidCount !== null ? Math.max(0, LIMIT - paidCount) : null

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/rochester-hero.jpg"
            alt="Skramblehouse — Floater Membership"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(28px, 6vw, 44px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 16px',
          lineHeight: 1.15,
        }}>
          Floater Membership
        </h1>
      </div>

      {/* ── Ticker ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '8px auto 0', padding: '0 20px' }}>
        {soldOut ? (
          <div style={{
            textAlign: 'center',
            backgroundColor: RED_LT,
            border: `2px solid ${RED_BD}`,
            borderRadius: 16,
            padding: '18px 24px',
          }}>
            <span style={{
              fontSize: 28,
              fontWeight: 900,
              color: RED,
              letterSpacing: '0.04em',
            }}>
              SOLD OUT
            </span>
            <p style={{ margin: '6px 0 0', color: RED, fontSize: 14, fontWeight: 600 }}>
              All 50 spots have been claimed.
            </p>
          </div>
        ) : (
          <div style={{
            textAlign: 'center',
            backgroundColor: BLUE_LT,
            border: `1.5px solid ${BLUE_MID}`,
            borderRadius: 16,
            padding: '16px 24px',
          }}>
            {paidCount !== null ? (
              <>
                {/* Progress bar */}
                <div style={{ maxWidth: 320, margin: '0 auto 10px', height: 8, backgroundColor: BLUE_MID, borderRadius: 999, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%',
                    width: `${Math.min(100, (paidCount / LIMIT) * 100)}%`,
                    backgroundColor: BLUE,
                    borderRadius: 999,
                    transition: 'width 0.5s ease',
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: GRAY_1 }}>
                  <span style={{ fontSize: 22, fontWeight: 900, color: BLUE }}>{paidCount}</span>
                  <span style={{ color: GRAY_3, fontWeight: 500 }}> / {LIMIT} spots claimed</span>
                </p>
                {spotsLeft !== null && spotsLeft <= 10 && spotsLeft > 0 && (
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: RED, fontWeight: 700 }}>
                    Only {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left!
                  </p>
                )}
              </>
            ) : (
              <p style={{ margin: 0, fontSize: 14, color: GRAY_3 }}>Loading availability…</p>
            )}
          </div>
        )}
      </div>

      {/* ── Copy ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '32px auto 0', padding: '0 20px' }}>
        <div style={{
          backgroundColor: GRAY_5,
          border: `1px solid ${GRAY_4}`,
          borderRadius: 20,
          padding: 'clamp(20px, 5vw, 36px)',
        }}>
          <p style={{ fontSize: 16, color: GRAY_1, lineHeight: 1.75, margin: '0 0 20px' }}>
            Not sure an Annual or Winter membership is for you?
          </p>
          <p style={{ fontSize: 16, color: GRAY_1, lineHeight: 1.75, margin: '0 0 20px' }}>
            We are offering a new membership tier, the <strong>Floater</strong>.
          </p>

          <div style={{
            backgroundColor: '#fff',
            border: `1.5px solid ${BLUE_MID}`,
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 20,
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE, margin: '0 0 14px' }}>
              Details
            </p>
            {[
              { label: 'Initiation Fee', value: '$100' },
              { label: 'One Day Pass', value: 'Included' },
              { label: 'Coaching Session', value: 'Included' },
              { label: 'Additional Visits', value: '$50 per visit' },
            ].map(({ label, value }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderBottom: `1px solid ${BLUE_MID}`, padding: '8px 0', gap: 12 }}>
                <span style={{ fontSize: 14, color: GRAY_3, fontWeight: 500 }}>{label}</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: GRAY_1 }}>{value}</span>
              </div>
            ))}
          </div>

          <p style={{ fontSize: 16, color: GRAY_1, lineHeight: 1.75, margin: '0 0 12px' }}>
            Want to bring a guest?
          </p>
          <p style={{ fontSize: 16, color: GRAY_1, lineHeight: 1.75, margin: '0 0 20px' }}>
            The guest fee is <strong>$50 per guest, per visit.</strong>
          </p>
          <p style={{ fontSize: 15, color: GRAY_1, lineHeight: 1.7, margin: 0, fontWeight: 600 }}>
            This offer is limited to {LIMIT} people. Sign-up below.
          </p>
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '40px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Sign Up
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 80px' }}>
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${GRAY_4}`,
          borderRadius: 24,
          padding: 'clamp(24px, 5vw, 48px)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.07)',
        }}>
          {soldOut ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: RED_LT, border: `2px solid ${RED_BD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>🚫</div>
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: '0 0 10px', color: RED }}>
                Sold Out
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 320, margin: '0 auto' }}>
                All 50 Floater spots have been claimed. Check back or contact us for future availability.
              </p>
            </div>
          ) : submitted ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                You&rsquo;re signed up!
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 340, margin: '0 auto' }}>
                Check your email for confirmation. We&rsquo;ll be in touch with next steps to get your Floater membership locked in.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: GRAY_1 }}>
                  Claim Your Spot
                </h2>
                <p style={{ color: GRAY_3, fontSize: 13, margin: 0 }}>
                  Fields marked <span style={{ color: BLUE, fontWeight: 700 }}>*</span> are required.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* Name */}
                <div className="two-col">
                  <FormField label="First Name">
                    <input type="text" required maxLength={60} placeholder="Jane"
                      value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                  </FormField>
                  <FormField label="Last Name">
                    <input type="text" required maxLength={60} placeholder="Smith"
                      value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                  </FormField>
                </div>

                {/* Email */}
                <FormField label="Email Address">
                  <input type="email" required maxLength={254} placeholder="jane@example.com"
                    autoComplete="email"
                    value={form.email} onChange={e => set('email', e.target.value)} />
                </FormField>

                {/* Phone */}
                <FormField label="Phone Number">
                  <input type="tel" required placeholder="(555) 555-5555"
                    autoComplete="tel"
                    value={form.phone} onChange={e => set('phone', e.target.value)} />
                </FormField>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => set('website', e.target.value)} />
                </div>

                {error && (
                  <div style={{
                    backgroundColor: RED_LT, border: `1px solid ${RED_BD}`,
                    borderRadius: 12, padding: '13px 16px',
                    color: RED, fontSize: 14, textAlign: 'center', fontWeight: 500,
                  }}>
                    {error}
                  </div>
                )}

                <button type="submit" disabled={loading || soldOut}
                  style={{
                    width: '100%',
                    backgroundColor: loading || soldOut ? '#93C5FD' : BLUE,
                    color: '#fff',
                    fontWeight: 800,
                    fontSize: 15,
                    letterSpacing: '0.07em',
                    textTransform: 'uppercase',
                    padding: '17px 24px',
                    borderRadius: 14,
                    border: 'none',
                    cursor: loading || soldOut ? 'not-allowed' : 'pointer',
                    transition: 'background-color 0.15s',
                    marginTop: 6,
                    fontFamily: 'inherit',
                  }}
                  onMouseEnter={e => { if (!loading && !soldOut) (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
                  onMouseLeave={e => { if (!loading && !soldOut) (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
                >
                  {loading ? 'Submitting…' : 'Claim My Spot →'}
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

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_3 }}>
        {label} <span style={{ color: BLUE }}>*</span>
      </label>
      {children}
    </div>
  )
}
