'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Brand tokens ────────────────────────────────────────────────────────────
const BLUE    = '#1D4ED8'   // Royal blue — matches Skramblehouse sign
const BLUE_DK = '#1E40AF'   // Darker hover state
const BLUE_LT = '#EFF6FF'   // Very light blue tint for subtle backgrounds
const BLUE_MID = '#BFDBFE'  // Light blue border/divider
const GRAY_1  = '#111827'   // Near-black for headlines
const GRAY_2  = '#374151'   // Body text
const GRAY_3  = '#6B7280'   // Muted / captions
const GRAY_4  = '#E5E7EB'   // Borders
const GRAY_5  = '#F9FAFB'   // Section backgrounds

const LOCATIONS       = ['Horsham', 'KOP', 'Rochester'] as const
const MEMBERSHIP_TYPES = ['Full Year', '5 Month'] as const
const OFFER_START     = 'June 1, 2026'
const OFFER_END       = 'August 31, 2026'

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
    const res  = await fetch('/api/membership-signup', {
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
            alt="Skramblehouse"
            width={1200}
            height={540}
            priority
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>
      </div>

      {/* ── Intro quote ──────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0' }}>
        <div style={{
          borderLeft: `4px solid ${BLUE}`,
          backgroundColor: BLUE_LT,
          borderRadius: '0 16px 16px 0',
          padding: '24px 28px',
        }}>
          <p style={{ color: GRAY_2, fontSize: 16, lineHeight: 1.75, margin: 0 }}>
            <strong style={{ color: GRAY_1 }}>&ldquo;Welcome to The Skramble Project.</strong>{' '}
            We&rsquo;re changing things up. Starting this summer, we are executing a strategic
            evolution to transform our club into a premier, year-round destination. This project
            is about more than just expanding our calendar&mdash;it&rsquo;s about elevating our
            programming, securing our facility&rsquo;s future, and giving you unparalleled access
            365 days a year. The next era of our club starts now.&rdquo;
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
          Reserve your membership now and lock in a discounted rate before the season opens to the public.
          Our team will follow up with next steps.
        </p>
      </div>

      {/* ── Offer details ─────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 0' }}>
        <SectionLabel>Offer Details</SectionLabel>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
          marginTop: 20,
        }}>
          {[
            { label: 'Offer Window',         value: `${OFFER_START} – ${OFFER_END}` },
            { label: 'Locations',            value: 'Horsham · KOP · Rochester' },
            { label: 'Full Year Membership', value: '12 months of unlimited access' },
            { label: '5 Month Membership',   value: 'December – April' },
          ].map(({ label, value }) => (
            <div key={label} style={{
              backgroundColor: GRAY_5,
              border: `1px solid ${GRAY_4}`,
              borderRadius: 16,
              padding: '20px 24px',
            }}>
              <p style={{ color: GRAY_3, fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 6px' }}>
                {label}
              </p>
              <p style={{ color: GRAY_1, fontSize: 15, fontWeight: 600, margin: 0 }}>
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Benefits ──────────────────────────────────────────────────────── */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 20px 0' }}>
        <SectionLabel>What You Get</SectionLabel>
        <div style={{
          backgroundColor: '#fff',
          border: `1px solid ${GRAY_4}`,
          borderRadius: 20,
          padding: '28px 32px',
          marginTop: 20,
          boxShadow: '0 2px 12px rgba(0,0,0,0.04)',
        }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[
              'Discounted rate locked in before public launch',
              'Priority access and early booking privileges',
              'Full simulator bay access at your chosen location',
              'Flexible options — Full Year or 5 Month membership',
              'Member-only events, leagues, and programming',
            ].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                <span style={{
                  width: 22, height: 22, borderRadius: '50%',
                  backgroundColor: BLUE_LT,
                  border: `1.5px solid ${BLUE_MID}`,
                  color: BLUE,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, fontWeight: 700, flexShrink: 0, marginTop: 1,
                }}>✓</span>
                <span style={{ color: GRAY_2, fontSize: 15, lineHeight: 1.55 }}>{item}</span>
              </li>
            ))}
          </ul>
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
                Thanks for signing up. Our team will be in touch with pricing details and next steps.
              </p>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: 32 }}>
                <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 8px', color: GRAY_1 }}>
                  Sign Up for Pre-Sale Access
                </h2>
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

                {/* Location + Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="name-grid">
                  <FormField label="Location">
                    <select required value={form.location}
                      onChange={e => set('location', e.target.value)}
                      style={{ ...inputStyle, color: form.location ? GRAY_1 : GRAY_3 }}>
                      <option value="" disabled>Select…</option>
                      {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </FormField>
                  <FormField label="Membership Type">
                    <select required value={form.membershipType}
                      onChange={e => set('membershipType', e.target.value)}
                      style={{ ...inputStyle, color: form.membershipType ? GRAY_1 : GRAY_3 }}>
                      <option value="" disabled>Select…</option>
                      {MEMBERSHIP_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </FormField>
                </div>

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

                <button type="submit" disabled={loading} style={{
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
        }
      `}</style>

    </main>
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

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: 11, fontWeight: 700,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color: GRAY_3,
        marginBottom: 8,
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
