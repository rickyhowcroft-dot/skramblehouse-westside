'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

// ── Brand tokens ────────────────────────────────────────────────────────────
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID = '#BFDBFE'
const GRAY_1  = '#111827'
const GRAY_2  = '#374151'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'

const MEMBERSHIP_TYPES = ['Full Year', '5 Month', 'Junior'] as const

const PAYMENT_METHODS = ['Cash/Check', 'Card (+ 3% service fee)'] as const

const PLAN_OPTIONS: Record<string, string[]> = {
  'Full Year': [
    'Annual — $1,600',
    'Monthly — $165/mo (12 months)',
    'Family Add-On — $600',
    'Double — $2,200',
  ],
  '5 Month': [
    'Full Payment — $1,100',
    'Monthly — $250/mo (5 months)',
    'Family Add-On — $400',
  ],
  'Junior': [
    'Annual — $1,600',
    'Monthly — $165/mo (12 months)',
    'Family Add-On — $600',
    'Double — $2,200',
  ],
}

const OFFER_START = 'June 1, 2026'
const OFFER_END   = 'October 31, 2026'

// ── Ticker config: membership type → max pre-sale cap ───────────────────────
interface TierData {
  type: string
  count: number
  max: number
  remaining: number
  isFull: boolean
}

const TICKER_CONFIG = [
  { type: 'Full Year', label: 'Full Year Memberships' },
  { type: '5 Month',  label: 'Winter (5 Month) Memberships' },
  { type: 'Junior',   label: 'Junior Memberships' },
]

export default function RocPresalePage() {
  const [tiers, setTiers]     = useState<TierData[] | null>(null)
  const [form, setForm]       = useState({
    firstName: '', lastName: '', email: '', phone: '',
    membershipType: '', planType: '', paymentMethod: '', website: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  // ── Live ticker polling ──────────────────────────────────────────────────
  const fetchCounts = () => {
    fetch('/api/membership-count-roc')
      .then(r => r.json())
      .then(d => setTiers(d.tiers ?? null))
      .catch(() => setTiers(null))
  }

  useEffect(() => {
    fetchCounts()
    const id = setInterval(fetchCounts, 30_000) // refresh every 30 s
    return () => clearInterval(id)
  }, [])

  const set = (key: keyof typeof form, val: string) =>
    setForm(p => ({
      ...p,
      [key]: val,
      ...(key === 'membershipType' ? { planType: '', paymentMethod: '' } : {}),
    }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/membership-signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Location is always Rochester for this page
      body: JSON.stringify({ ...form, location: 'Rochester' }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
    fetchCounts() // refresh ticker after signup
  }

  // Determine if the selected membership type is full
  const selectedTier = tiers?.find(t => t.type === form.membershipType)
  const selectedFull = selectedTier?.isFull ?? false

  return (
    <main style={{ backgroundColor: '#ffffff', color: GRAY_1, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image
            src="/rochester-hero.jpg"
            alt="Skramblehouse Rochester"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Location badge ───────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '24px 20px 0', textAlign: 'center' }}>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          backgroundColor: BLUE,
          color: '#fff',
          fontWeight: 800,
          fontSize: 12,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          padding: '8px 20px',
          borderRadius: 999,
        }}>
          📍 Rochester
        </span>
      </div>

      {/* ── Intro quote ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{
          borderLeft: `4px solid ${BLUE}`,
          backgroundColor: BLUE_LT,
          borderRadius: '0 16px 16px 0',
          padding: '24px 28px',
        }}>
          <p style={{ color: GRAY_2, fontSize: 16, lineHeight: 1.75, margin: 0 }}>
            We&rsquo;re evolving &mdash; and that&rsquo;s by design. As we deepen our roots in
            the Rochester market, your feedback is directly shaping how we operate. We&rsquo;ve
            extended the pre-sale through October 31st to better match the seasonality here, and
            we&rsquo;re giving you full visibility into exactly how many spots remain.
          </p>
          <p style={{ color: GRAY_2, fontSize: 16, lineHeight: 1.75, margin: '12px 0 0' }}>
            If spots fill before October 31st, the pre-sale closes early and updated pricing goes
            into effect &mdash; no surprises, no fine print.
          </p>
          <p style={{ color: GRAY_1, fontSize: 16, lineHeight: 1.75, margin: '12px 0 0', fontWeight: 700 }}>
            Keep the feedback coming. We&rsquo;re committed to building the best experience in
            the industry, and your voice is what shapes that.
          </p>
        </div>
      </div>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 0', textAlign: 'center' }}>
        <div style={{
          backgroundColor: BLUE_LT,
          border: `1px solid ${BLUE_MID}`,
          borderRadius: 999,
          padding: '14px 24px',
          marginBottom: 20,
          width: '100%',
        }}>
          <span style={{ color: BLUE, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', fontSize: 11, display: 'block' }}>
            Limited Time Offer
          </span>
          <span style={{ color: BLUE, fontWeight: 600, fontSize: 13, display: 'block', marginTop: 4, letterSpacing: '0.02em' }}>
            {OFFER_START} – {OFFER_END}
          </span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 38px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 16px', color: GRAY_1, wordBreak: 'keep-all' }}>
          2026–2027 Membership Pre&#8209;Sale
        </h1>
        <p style={{ color: GRAY_3, fontSize: 16, lineHeight: 1.7, maxWidth: 520, margin: '0 auto' }}>
          Reserve your Rochester membership now and lock in a discounted rate before the season opens to the public.
        </p>
      </div>

      {/* ── Live Ticker ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0' }}>
        <SectionLabel>Live Pre-Sale Availability — Rochester</SectionLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 20 }}>
          {TICKER_CONFIG.map(({ type, label }) => {
            const tier = tiers?.find(t => t.type === type)
            return <AvailabilityTicker key={type} label={label} tier={tier ?? null} />
          })}
        </div>
      </div>

      {/* ── Pricing Comparison ───────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 0' }}>
        <SectionLabel>Membership Pricing</SectionLabel>

        <div style={{
          marginTop: 16,
          backgroundColor: '#FEF9C3',
          border: '1px solid #FDE68A',
          borderRadius: 12,
          padding: '12px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{ fontSize: 16 }}>⏰</span>
          <div style={{ color: '#92400E', fontSize: 13, fontWeight: 600 }}>
            <p style={{ margin: 0 }}>Early Wave runs <strong>through October 31, 2026</strong> only.</p>
            <p style={{ margin: '4px 0 0' }}>Prices increase after the pre-sale closes.</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 24 }}>

          {/* ── Full Year ── */}
          <PricingCard
            name="Full Year Membership"
            subtitle="12 months · through Sept 2027"
            early={{
              label: 'The Early Wave',
              dates: 'Jun 1 – Oct 31',
              rows: [
                { item: 'Annual',        price: '$1,600' },
                { item: 'Monthly',       price: '$165/mo × 12 months' },
                { item: 'Family Add-On', price: '$600' },
                { item: 'Double',        price: '$2,200' },
              ],
              perks: ['14 Guest Fees included', '2 Lessons included', '$550 value'],
            }}
            after={{
              label: 'After Oct 31',
              rows: [
                { item: 'Annual',        price: '$2,000' },
                { item: 'Monthly',       price: '$185/mo × 12 months' },
                { item: 'Family Add-On', price: '$800' },
              ],
            }}
          />

          {/* ── 5 Month Winter ── */}
          <PricingCard
            name="5 Month Winter Membership"
            subtitle="December – April"
            early={{
              label: 'The Early Wave',
              dates: 'Jun 1 – Oct 31',
              rows: [
                { item: 'Full Payment',  price: '$1,100' },
                { item: 'Monthly',       price: '$250/mo × 5 months' },
                { item: 'Family Add-On', price: '$400' },
              ],
              perks: ['Guests $25/person', '$50 – 30 min lesson'],
            }}
            after={{
              label: 'After Oct 31',
              rows: [
                { item: 'Full Payment',  price: '$1,300' },
                { item: 'Monthly',       price: '$300/mo × 5 months' },
                { item: 'Family Add-On', price: '$400' },
              ],
              perks: ['Guests $25/person', '$50 – 30 min lessons'],
            }}
          />

          {/* ── Junior ── */}
          <PricingCard
            name="Junior Membership"
            subtitle="12 months · through Sept 2027"
            early={{
              label: 'The Early Wave',
              dates: 'Jun 1 – Oct 31',
              rows: [
                { item: 'Annual',        price: '$1,600' },
                { item: 'Monthly',       price: '$165/mo × 12 months' },
                { item: 'Family Add-On', price: '$600' },
                { item: 'Double',        price: '$2,200' },
              ],
              perks: ['14 Guest Fees included', '2 Lessons included', '$550 value'],
            }}
            after={{
              label: 'After Oct 31',
              rows: [
                { item: 'Annual',        price: '$2,000' },
                { item: 'Monthly',       price: '$185/mo × 12 months' },
                { item: 'Family Add-On', price: '$800' },
              ],
            }}
          />
        </div>
      </div>

      {/* ── Divider ───────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '56px auto 0', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Reserve Your Spot
          </span>
          <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
        </div>
      </div>

      {/* ── Form ──────────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
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
                You&rsquo;re on the list!
              </h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 320, margin: '0 auto' }}>
                Thanks for signing up for the Rochester pre-sale. Our team will be in touch with next steps.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: GRAY_1 }}>
                  Sign Up — Rochester Pre-Sale
                </h2>
                {/* Static location badge */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  backgroundColor: BLUE_LT,
                  border: `1px solid ${BLUE_MID}`,
                  borderRadius: 8,
                  padding: '5px 12px',
                  marginTop: 8,
                  marginBottom: 8,
                }}>
                  <span style={{ fontSize: 13 }}>📍</span>
                  <span style={{ color: BLUE, fontWeight: 700, fontSize: 13 }}>Rochester</span>
                </div>
                <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>
                  All fields required.
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                {/* Name */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
                  <FormField label="First Name">
                    <input type="text" required maxLength={60} value={form.firstName}
                      onChange={e => set('firstName', e.target.value)}
                      placeholder="Jane" style={inputStyle} />
                  </FormField>
                  <FormField label="Last Name">
                    <input type="text" required maxLength={60} value={form.lastName}
                      onChange={e => set('lastName', e.target.value)}
                      placeholder="Smith" style={inputStyle} />
                  </FormField>
                </div>

                {/* Email */}
                <FormField label="Email Address">
                  <input type="email" required maxLength={254} value={form.email}
                    onChange={e => set('email', e.target.value)}
                    placeholder="jane@example.com" autoComplete="email" style={inputStyle} />
                </FormField>

                {/* Phone */}
                <FormField label="Phone Number">
                  <input type="tel" required inputMode="numeric"
                    pattern="[\d\s\-\(\)\+\.]{7,20}"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                    placeholder="(555) 555-5555" autoComplete="tel" style={inputStyle} />
                </FormField>

                {/* Membership Type */}
                <FormField label="Membership Type">
                  <select required value={form.membershipType}
                    onChange={e => set('membershipType', e.target.value)}
                    style={{ ...inputStyle, color: form.membershipType ? GRAY_1 : GRAY_3 }}>
                    <option value="" disabled>Select…</option>
                    {MEMBERSHIP_TYPES.map(t => {
                      const tier = tiers?.find(ti => ti.type === t)
                      const isFull = tier?.isFull ?? false
                      return (
                        <option key={t} value={t} disabled={isFull}>
                          {t}{isFull ? ' — SOLD OUT' : ''}
                        </option>
                      )
                    })}
                  </select>
                </FormField>

                {/* Plan + Payment */}
                {form.membershipType && !selectedFull && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
                    <FormField label="Plan / Payment Option">
                      <select required value={form.planType}
                        onChange={e => set('planType', e.target.value)}
                        style={{ ...inputStyle, color: form.planType ? GRAY_1 : GRAY_3 }}>
                        <option value="" disabled>Select a plan…</option>
                        {(PLAN_OPTIONS[form.membershipType] ?? []).map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </FormField>
                    <FormField label="Payment Method">
                      <select required value={form.paymentMethod}
                        onChange={e => set('paymentMethod', e.target.value)}
                        style={{ ...inputStyle, color: form.paymentMethod ? GRAY_1 : GRAY_3 }}>
                        <option value="" disabled>Select…</option>
                        {PAYMENT_METHODS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>
                )}

                {/* Sold-out warning for selected type */}
                {selectedFull && (
                  <div style={{
                    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
                    borderRadius: 12, padding: '12px 16px',
                    color: '#B91C1C', fontSize: 14, textAlign: 'center',
                  }}>
                    This membership tier is sold out for the pre-sale.
                  </div>
                )}

                {/* Honeypot */}
                <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
                  <input name="website" type="text" tabIndex={-1} autoComplete="off"
                    value={form.website} onChange={e => set('website', e.target.value)} />
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

                <button type="submit" disabled={loading || selectedFull} style={{
                  width: '100%',
                  backgroundColor: (loading || selectedFull) ? '#93C5FD' : BLUE,
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: 14,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '16px 24px',
                  borderRadius: 14,
                  border: 'none',
                  cursor: (loading || selectedFull) ? 'not-allowed' : 'pointer',
                  transition: 'background-color 0.15s',
                  marginTop: 4,
                }}
                  onMouseEnter={e => { if (!loading && !selectedFull) (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
                  onMouseLeave={e => { if (!loading && !selectedFull) (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
                >
                  {loading ? 'Submitting…' : 'Reserve My Spot →'}
                </button>

                <p style={{ color: GRAY_3, fontSize: 12, textAlign: 'center', margin: 0 }}>
                  Offer valid {OFFER_START} – {OFFER_END}
                </p>
              </form>
            </>
          )}
        </div>
      </div>

      {/* ── Responsive grid fix ───────────────────────────────────────────── */}
      <style>{`
        @media (max-width: 480px) {
          .name-grid { grid-template-columns: 1fr !important; }
          .pricing-grid { grid-template-columns: 1fr !important; }
          .pricing-grid > div:first-child { border-right: none !important; border-bottom: 1px solid #BFDBFE; }
        }
      `}</style>

    </main>
  )
}

// ── AvailabilityTicker ─────────────────────────────────────────────────────
function AvailabilityTicker({ label, tier }: { label: string; tier: TierData | null }) {
  const isLoading = tier === null
  const pct       = tier ? Math.min(100, Math.round((tier.count / tier.max) * 100)) : 0
  const isFull    = tier?.isFull ?? false

  return (
    <div style={{
      backgroundColor: isFull ? '#FEF2F2' : BLUE_LT,
      border: `1px solid ${isFull ? '#FECACA' : BLUE_MID}`,
      borderRadius: 14,
      padding: '16px 20px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        {/* Label + pulsing dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {isLoading ? (
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: GRAY_4 }} />
          ) : isFull ? (
            <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#EF4444' }} />
          ) : (
            <PulsingDot />
          )}
          <span style={{ fontWeight: 700, fontSize: 13, color: GRAY_1 }}>{label}</span>
        </div>
        {/* Count badge */}
        {isLoading ? (
          <div style={{ width: 60, height: 20, borderRadius: 6, backgroundColor: GRAY_4 }} />
        ) : (
          <span style={{
            fontWeight: 800,
            fontSize: 13,
            color: isFull ? '#B91C1C' : BLUE,
            tabularNums: true,
          } as React.CSSProperties}>
            {isFull ? 'SOLD OUT' : `${tier!.count} / ${tier!.max}`}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        height: 8,
        borderRadius: 4,
        backgroundColor: isFull ? '#FECACA' : BLUE_MID,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          width: isLoading ? '0%' : `${pct}%`,
          borderRadius: 4,
          backgroundColor: isFull ? '#EF4444' : BLUE,
          transition: 'width 0.6s ease',
        }} />
      </div>

      {!isLoading && !isFull && (
        <p style={{ margin: '8px 0 0', fontSize: 12, color: GRAY_3 }}>
          <strong style={{ color: GRAY_2 }}>{tier!.remaining}</strong> spot{tier!.remaining !== 1 ? 's' : ''} remaining
        </p>
      )}
    </div>
  )
}

// Pulsing dot (CSS animation via style tag)
function PulsingDot() {
  return (
    <>
      <div className="roc-pulse-dot" style={{
        width: 8, height: 8, borderRadius: '50%', backgroundColor: BLUE, flexShrink: 0,
      }} />
      <style>{`
        @keyframes roc-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50%       { opacity: 0.4; transform: scale(1.4); }
        }
        .roc-pulse-dot { animation: roc-pulse 2s ease-in-out infinite; }
      `}</style>
    </>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────
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

interface PriceRow  { item: string; price: string }
interface PriceSide { label: string; dates?: string; rows: PriceRow[]; perks?: string[] }
function PricingCard({
  name, subtitle, early, after,
}: { name: string; subtitle: string; early: PriceSide; after: PriceSide }) {
  return (
    <div style={{
      border: `1.5px solid ${BLUE_MID}`,
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
    }}>
      <div style={{ backgroundColor: BLUE_LT, padding: '14px 20px', borderBottom: `1px solid ${BLUE_MID}` }}>
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: GRAY_1 }}>{name}</p>
        <p style={{ margin: '2px 0 0', fontSize: 12, color: GRAY_3, fontWeight: 500 }}>{subtitle}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }} className="pricing-grid">
        <div style={{ backgroundColor: '#fff', borderRight: `1px solid ${BLUE_MID}`, padding: '18px 20px' }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{
              display: 'inline-block', backgroundColor: BLUE, color: '#fff',
              fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              borderRadius: 6, padding: '3px 8px', marginBottom: 4,
            }}>{early.label}</span>
            {early.dates && (
              <p style={{ margin: '2px 0 0', fontSize: 11, color: GRAY_3, fontWeight: 500 }}>{early.dates}</p>
            )}
          </div>
          {early.rows.map(({ item, price }) => (
            <div key={item} style={{ marginBottom: 12 }}>
              <p style={{ margin: 0, fontSize: 11, color: GRAY_3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item}</p>
              <p style={{ margin: '2px 0 0', fontSize: 16, fontWeight: 800, color: BLUE }}>{price}</p>
            </div>
          ))}
          {early.perks && early.perks.length > 0 && (
            <div style={{ marginTop: 14, paddingTop: 14, borderTop: `2px solid ${BLUE_MID}` }}>
              <p style={{ margin: '0 0 8px', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', color: BLUE }}>
                Included
              </p>
              {early.perks.map(perk => (
                <div key={perk} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`,
                  borderRadius: 8, padding: '8px 12px', marginBottom: 6,
                }}>
                  <span style={{
                    width: 20, height: 20, borderRadius: '50%',
                    backgroundColor: BLUE, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 800, flexShrink: 0,
                  }}>✓</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: GRAY_1 }}>{perk}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ backgroundColor: GRAY_5, padding: '18px 20px' }}>
          <div style={{ marginBottom: 14 }}>
            <span style={{
              display: 'inline-block', backgroundColor: GRAY_4, color: GRAY_3,
              fontSize: 10, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase',
              borderRadius: 6, padding: '3px 8px', marginBottom: 4,
            }}>{after.label}</span>
            <p style={{ margin: '2px 0 0', fontSize: 11, color: GRAY_3, fontWeight: 500 }}>~20% more</p>
          </div>
          {after.rows.map(({ item, price }) => (
            <div key={item} style={{ marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 11, color: GRAY_3, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item}</p>
              <p style={{ margin: '1px 0 0', fontSize: 14, fontWeight: 700, color: GRAY_3 }}>{price}</p>
            </div>
          ))}
          {after.perks && after.perks.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `1px solid ${GRAY_4}` }}>
              {after.perks.map(perk => (
                <p key={perk} style={{ margin: '0 0 4px', fontSize: 12, color: GRAY_3, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700 }}>✓</span> {perk}
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: GRAY_3, marginBottom: 8,
      }}>
        {label} <span style={{ color: BLUE }}>*</span>
      </label>
      {children}
    </div>
  )
}

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
