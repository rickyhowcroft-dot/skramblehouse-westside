'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Brand tokens ─────────────────────────────────────────────────────────────
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GRAY_1  = '#111827'
const GRAY_2  = '#374151'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'
const GREEN   = '#16A34A'
const GREEN_LT= '#F0FDF4'
const GREEN_BD= '#BBF7D0'

const OFFER_START = 'November 1, 2026'
const OFFER_END   = 'November 30, 2026'
const DISCOUNT    = 10 // %

// ── Pricing data (pre-discount) ───────────────────────────────────────────────
const PLANS = [
  {
    name: 'Full Year Membership',
    subtitle: '12 months · through Sept 2027',
    icon: '🏌️',
    rows: [
      { item: 'Annual',        original: '$1,600', discounted: '$1,440' },
      { item: 'Monthly',       original: '$165/mo', discounted: '$148.50/mo', note: '× 12 months' },
      { item: 'Family Add-On', original: '$600',   discounted: '$540' },
      { item: 'Double',        original: '$2,200', discounted: '$1,980' },
    ],
    perks: ['14 Guest Fees included', '2 Lessons included', '$550 value'],
  },
  {
    name: '5 Month Winter Membership',
    subtitle: 'December – April',
    icon: '❄️',
    rows: [
      { item: 'Full Payment',  original: '$1,100', discounted: '$990' },
      { item: 'Monthly',       original: '$250/mo', discounted: '$225/mo', note: '× 5 months' },
      { item: 'Family Add-On', original: '$400',   discounted: '$360' },
    ],
    perks: ['Guests $25/person', '$50 – 30 min lesson'],
  },
  {
    name: 'Junior Membership',
    subtitle: '12 months · through Sept 2027',
    icon: '⛳',
    rows: [
      { item: 'Annual',        original: '$1,600', discounted: '$1,440' },
      { item: 'Monthly',       original: '$165/mo', discounted: '$148.50/mo', note: '× 12 months' },
      { item: 'Family Add-On', original: '$600',   discounted: '$540' },
      { item: 'Double',        original: '$2,200', discounted: '$1,980' },
    ],
    perks: ['14 Guest Fees included', '2 Lessons included', '$550 value'],
  },
]

type Form = {
  firstName: string
  lastName:  string
  email:     string
  phone:     string
  location:  string
  website:   string
}

const EMPTY: Form = { firstName: '', lastName: '', email: '', phone: '', location: '', website: '' }

export default function PhillyPage() {
  const [form,      setForm]      = useState<Form>(EMPTY)
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const set = (key: keyof Form, val: string) => setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!form.location) { setError('Please select a location.'); return }
    setLoading(true)
    const res  = await fetch('/api/philly', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1 }}>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/hero.jpg"
            alt="Skramblehouse — November New Member Special"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0', textAlign: 'center' }}>
        <div style={{
          backgroundColor: GREEN_LT,
          border: `1px solid ${GREEN_BD}`,
          borderRadius: 999,
          padding: '14px 24px',
          marginBottom: 20,
          display: 'inline-block',
        }}>
          <span style={{ color: GREEN, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, display: 'block' }}>
            Limited Time — New Members Only
          </span>
          <span style={{ color: GREEN, fontWeight: 600, fontSize: 13, display: 'block', marginTop: 4 }}>
            {OFFER_START} – {OFFER_END}
          </span>
        </div>

        <h1 style={{
          fontSize: 'clamp(26px, 6vw, 42px)',
          fontWeight: 800,
          letterSpacing: '-0.02em',
          color: GRAY_1,
          margin: '0 0 16px',
          lineHeight: 1.12,
        }}>
          {DISCOUNT}% Off — New Member Special<br />Horsham &amp; KOP
        </h1>

        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
          New to Skramblehouse? Join us this November and save {DISCOUNT}% on any membership.<br />
          Sign up below and our team will follow up with next steps.
        </p>
      </div>

      {/* ── Offer callout ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '32px auto 0', padding: '0 20px' }}>
        <div style={{
          backgroundColor: GREEN_LT,
          border: `1.5px solid ${GREEN_BD}`,
          borderRadius: 16,
          padding: '18px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}>
          <span style={{ fontSize: 28, flexShrink: 0 }}>🎉</span>
          <div>
            <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: GRAY_1 }}>
              {DISCOUNT}% off all new memberships this November
            </p>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: GRAY_2, lineHeight: 1.5 }}>
              Valid for new members only at our Horsham and KOP locations.<br />
              Offer expires November 30, 2026 — don&rsquo;t miss it.
            </p>
          </div>
        </div>
      </div>

      {/* ── Pricing cards ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 0' }}>
        <SectionLabel>Membership Options — {DISCOUNT}% Off in November</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 20 }}>
          {PLANS.map(plan => (
            <PricingCard key={plan.name} plan={plan} />
          ))}
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Sign Up Now
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form card ─────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 80px' }}>
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
                backgroundColor: GREEN_LT, border: `2px solid ${GREEN_BD}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px', fontSize: 28,
              }}>🎉</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>
                You&rsquo;re on the list!
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 340, margin: '0 auto' }}>
                Thanks for signing up. Our team will reach out with next steps<br />
                and lock in your {DISCOUNT}% discount.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, margin: '0 0 6px', color: GRAY_1 }}>
                  Claim Your {DISCOUNT}% Discount
                </h2>
                <p style={{ color: GRAY_3, fontSize: 13, margin: 0 }}>
                  Fields marked <span style={{ color: BLUE, fontWeight: 700 }}>*</span> are required.<br />
                  We&rsquo;ll follow up to confirm your membership and apply your discount.
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

                {/* Location */}
                <FormField label="Location">
                  <select required value={form.location} onChange={e => set('location', e.target.value)}
                    style={{ color: form.location ? GRAY_1 : GRAY_3 }}>
                    <option value="" disabled>Select your location…</option>
                    <option value="Horsham">Horsham</option>
                    <option value="KOP">King of Prussia (KOP)</option>
                  </select>
                </FormField>

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => set('website', e.target.value)} />
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
                  {loading ? 'Submitting…' : `Claim My ${DISCOUNT}% Discount →`}
                </button>

                <p style={{ fontSize: 12, color: GRAY_3, textAlign: 'center', margin: '4px 0 0' }}>
                  Offer valid for new members only.<br />
                  Expires November 30, 2026.
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

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: BLUE, flexShrink: 0 }} />
      <span style={{ color: GRAY_1, fontSize: 13, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
        {children}
      </span>
    </div>
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

type PlanRow = { item: string; original: string; discounted: string; note?: string }
type Plan    = { name: string; subtitle: string; icon: string; rows: PlanRow[]; perks: string[] }

function PricingCard({ plan }: { plan: Plan }) {
  return (
    <div style={{
      border: `1.5px solid ${BLUE_MID}`,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      {/* Header */}
      <div style={{ backgroundColor: BLUE_LT, padding: '14px 20px', borderBottom: `1px solid ${BLUE_MID}`, display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 20 }}>{plan.icon}</span>
        <div>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: GRAY_1 }}>{plan.name}</p>
          <p style={{ margin: '2px 0 0', fontSize: 12, color: GRAY_3 }}>{plan.subtitle}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span style={{
            backgroundColor: '#16A34A', color: '#fff',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.06em',
            borderRadius: 8, padding: '4px 10px',
          }}>
            10% OFF
          </span>
        </div>
      </div>

      {/* Pricing rows */}
      <div style={{ backgroundColor: '#fff', padding: '20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px 24px' }}>
          {plan.rows.map(({ item, original, discounted, note }) => (
            <div key={item}>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: GRAY_3 }}>
                {item}
              </p>
              <p style={{ margin: '3px 0 0', fontSize: 13, color: GRAY_3, textDecoration: 'line-through' }}>
                {original}
              </p>
              <p style={{ margin: '1px 0 0', fontSize: 18, fontWeight: 800, color: BLUE }}>
                {discounted}
              </p>
              {note && <p style={{ margin: '1px 0 0', fontSize: 11, color: GRAY_3 }}>{note}</p>}
            </div>
          ))}
        </div>

        {/* Perks */}
        {plan.perks.length > 0 && (
          <div style={{ marginTop: 18, paddingTop: 16, borderTop: `1px solid ${BLUE_MID}` }}>
            <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE }}>
              Included
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {plan.perks.map(perk => (
                <div key={perk} style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`,
                  borderRadius: 8, padding: '6px 12px',
                }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    backgroundColor: BLUE, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 10, fontWeight: 800, flexShrink: 0,
                  }}>✓</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: GRAY_1 }}>{perk}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
