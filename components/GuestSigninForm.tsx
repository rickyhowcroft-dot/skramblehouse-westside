'use client'

import { useState } from 'react'
import Image from 'next/image'

const BLUE     = '#1D4ED8'
const BLUE_DK  = '#1E40AF'
const BLUE_LT  = '#EFF6FF'
const BLUE_MID = '#BFDBFE'
const GRAY_1   = '#111827'
const GRAY_2   = '#374151'
const GRAY_3   = '#6B7280'
const GRAY_4   = '#E5E7EB'
const GRAY_5   = '#F9FAFB'

interface Props {
  location: 'Horsham' | 'KOP' | 'Rochester'
  heroImage: string
}

export default function GuestSigninForm({ location, heroImage }: Props) {
  const [form, setForm] = useState({
    memberFirst: '', memberLast: '',
    guestFirst: '',  guestLast: '',  guestEmail: '',
  })
  const [submitted,  setSubmitted]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const [error,      setError]      = useState('')
  const [guestsUsed, setGuestsUsed] = useState<number | null>(null)

  const set = (key: keyof typeof form, val: string) =>
    setForm(p => ({ ...p, [key]: val }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/guest-signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, location }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setGuestsUsed(data.guestsUsed)
    setSubmitted(true)
    setLoading(false)
  }

  const reset = () => {
    setForm({ memberFirst:'', memberLast:'', guestFirst:'', guestLast:'', guestEmail:'' })
    setSubmitted(false)
    setGuestsUsed(null)
  }

  return (
    <main style={{ backgroundColor: '#fff', color: GRAY_1, fontFamily: 'system-ui, -apple-system, sans-serif' }}>

      {/* Hero */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 20px 0' }}>
        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 8px 40px rgba(0,0,0,0.14)' }}>
          <Image src={heroImage} alt={`Skramblehouse ${location}`} width={1200} height={540} priority
            style={{ width: '100%', height: 'auto', display: 'block' }} />
        </div>
      </div>

      {/* Header */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 0', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`, borderRadius: 999, padding: '6px 20px', marginBottom: 16 }}>
          <span style={{ color: BLUE, fontWeight: 700, fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase' }}>{location}</span>
        </div>
        <h1 style={{ fontSize: 'clamp(24px, 5vw, 36px)', fontWeight: 800, letterSpacing: '-0.02em', margin: '0 0 12px', color: GRAY_1 }}>
          Member Guest Sign-In
        </h1>
        <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 480, margin: '0 auto' }}>
          Fill out both sections below to check in your guest.
        </p>
      </div>

      {/* Form card */}
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 20px 80px' }}>
        <div style={{ backgroundColor: '#fff', border: `1px solid ${GRAY_4}`, borderRadius: 24, padding: 'clamp(24px, 5vw, 48px)', boxShadow: '0 4px 24px rgba(0,0,0,0.07)' }}>

          {submitted ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: '#F0FDF4', border: '2px solid #BBF7D0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28 }}>✅</div>
              <h2 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 10px', color: GRAY_1 }}>Guest checked in!</h2>
              <p style={{ color: GRAY_3, fontSize: 15, lineHeight: 1.65, maxWidth: 340, margin: '0 auto 8px' }}>
                {form.guestFirst} {form.guestLast} has been signed in as your guest at {location}.
              </p>
              {guestsUsed !== null && (
                <p style={{ color: GRAY_3, fontSize: 13, margin: '8px 0 0' }}>
                  You&apos;ve used <strong style={{ color: GRAY_1 }}>{guestsUsed}</strong> of your 14 guest passes.
                </p>
              )}
              <button onClick={reset} style={{ marginTop: 24, backgroundColor: BLUE, color: '#fff', fontWeight: 700, fontSize: 13, padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                Check In Another Guest
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

              {/* Member section */}
              <div>
                <SectionDivider label="Member" color={BLUE} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 20 }} className="two-col">
                  <FormField label="First Name">
                    <input type="text" required maxLength={60} value={form.memberFirst}
                      onChange={e => set('memberFirst', e.target.value)}
                      placeholder="Jane" style={inputStyle} />
                  </FormField>
                  <FormField label="Last Name">
                    <input type="text" required maxLength={60} value={form.memberLast}
                      onChange={e => set('memberLast', e.target.value)}
                      placeholder="Smith" style={inputStyle} />
                  </FormField>
                </div>
              </div>

              {/* Guest section */}
              <div>
                <SectionDivider label="Guest" color={GRAY_2} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 20 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="two-col">
                    <FormField label="First Name">
                      <input type="text" required maxLength={60} value={form.guestFirst}
                        onChange={e => set('guestFirst', e.target.value)}
                        placeholder="Alex" style={inputStyle} />
                    </FormField>
                    <FormField label="Last Name">
                      <input type="text" required maxLength={60} value={form.guestLast}
                        onChange={e => set('guestLast', e.target.value)}
                        placeholder="Johnson" style={inputStyle} />
                    </FormField>
                  </div>
                  <FormField label="Email Address">
                    <input type="email" required maxLength={254} value={form.guestEmail}
                      onChange={e => set('guestEmail', e.target.value)}
                      placeholder="alex@example.com" style={inputStyle} />
                  </FormField>
                </div>
              </div>

              {error && (
                <div style={{ backgroundColor: '#FEF2F2', border: '1px solid #FECACA', borderRadius: 12, padding: '12px 16px', color: '#B91C1C', fontSize: 14, textAlign: 'center' }}>
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading} style={{
                width: '100%', backgroundColor: loading ? '#93C5FD' : BLUE,
                color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em',
                textTransform: 'uppercase', padding: '16px 24px', borderRadius: 14,
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              }}
                onMouseEnter={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE_DK }}
                onMouseLeave={e => { if (!loading) (e.target as HTMLButtonElement).style.backgroundColor = BLUE }}
              >
                {loading ? 'Signing In…' : 'Sign In Guest →'}
              </button>

            </form>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 480px) { .two-col { grid-template-columns: 1fr !important; } }
      `}</style>
    </main>
  )
}

function SectionDivider({ label, color }: { label: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: color, flexShrink: 0 }} />
      <span style={{ fontSize: 14, fontWeight: 800, color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{label}</span>
      <div style={{ flex: 1, height: 1, backgroundColor: GRAY_4 }} />
    </div>
  )
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_3, marginBottom: 8 }}>
        {label} <span style={{ color: BLUE }}>*</span>
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%', backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`,
  borderRadius: 12, padding: '13px 16px', fontSize: 15, color: GRAY_1,
  outline: 'none', boxSizing: 'border-box', appearance: 'none',
  WebkitAppearance: 'none', transition: 'border-color 0.15s',
}
