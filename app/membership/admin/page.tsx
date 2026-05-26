'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Brand tokens (matches presale page) ─────────────────────────────────────
const BLUE     = '#1D4ED8'
const BLUE_DK  = '#1E40AF'
const BLUE_LT  = '#EFF6FF'
const BLUE_MID = '#BFDBFE'
const GRAY_1   = '#111827'
const GRAY_2   = '#374151'
const GRAY_3   = '#6B7280'
const GRAY_4   = '#E5E7EB'
const GRAY_5   = '#F9FAFB'
const GREEN    = '#16A34A'
const GREEN_LT = '#F0FDF4'
const GREEN_BD = '#BBF7D0'
const AMBER    = '#D97706'
const AMBER_LT = '#FFFBEB'

const LOCATIONS = ['Horsham', 'KOP', 'Rochester'] as const

type Paid   = { membership_type: string; notes: string | null; paid_at: string }
type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  membership_type: string
  plan_type: string | null
  payment_method: string | null
  created_at: string
  paid: Paid | null
}

export default function MembershipAdminPage() {
  const [key,      setKey]      = useState('')
  const [authed,   setAuthed]   = useState(false)
  const [authErr,  setAuthErr]  = useState('')
  const [signups,  setSignups]  = useState<Signup[]>([])
  const [loading,  setLoading]  = useState(false)
  const [modal,    setModal]    = useState<Signup | null>(null)
  const [payType,  setPayType]  = useState('')
  const [payNotes, setPayNotes] = useState('')
  const [saving,   setSaving]   = useState(false)
  // Per-location filter state
  const [locFilters, setLocFilters] = useState<Record<string, 'all'|'paid'|'unpaid'>>({
    Horsham: 'all', KOP: 'all', Rochester: 'all',
  })

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/membership-admin', { headers: { 'x-admin-key': adminKey } })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setSignups(data.signups ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/membership-admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true)
    setAuthErr('')
    const data = await res.json()
    setSignups(data.signups ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  const openModal = (s: Signup) => {
    setModal(s)
    setPayType(s.paid?.membership_type ?? s.membership_type)
    setPayNotes(s.paid?.notes ?? '')
  }

  const markPaid = async () => {
    if (!modal) return
    setSaving(true)
    await fetch('/api/membership-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ signupId: modal.id, membershipType: payType, notes: payNotes }),
    })
    await load(key)
    setModal(null)
    setSaving(false)
  }

  const markUnpaid = async (signupId: string) => {
    await fetch('/api/membership-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
      body: JSON.stringify({ signupId, unpay: true }),
    })
    await load(key)
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const totalPaid   = signups.filter(s => s.paid).length
  const totalSignups = signups.length

  // ── Login screen ───────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
        <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 22 }}>🏌️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>Membership Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>The Skramble Project — 2026–2027</p>
          </div>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            autoComplete="current-password"
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`,
              borderRadius: 14, padding: '16px 20px',
              fontSize: 16, color: GRAY_1, outline: 'none',
              marginBottom: 12,
            }}
          />
          {authErr && <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', margin: '0 0 12px' }}>{authErr}</p>}
          <button
            type="submit"
            style={{
              width: '100%', backgroundColor: BLUE, color: '#fff',
              fontWeight: 800, fontSize: 14, letterSpacing: '0.08em',
              textTransform: 'uppercase', padding: '16px 24px',
              borderRadius: 14, border: 'none', cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = BLUE_DK)}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = BLUE)}
          >
            Enter
          </button>
        </form>
      </main>
    )
  }

  // ── Authenticated view ─────────────────────────────────────────────────────
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif', color: GRAY_1 }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Page header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 40 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Membership Pre-Sale</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>The Skramble Project · 2026–2027</p>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <CountChip label="Total" count={totalSignups} color="blue" />
            <CountChip label="Paid" count={totalPaid} color="green" />
            <CountChip label="Pending" count={totalSignups - totalPaid} color="amber" />
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3 }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
            {LOCATIONS.map(loc => {
              const locSignups = signups.filter(s => s.location === loc)
              const locFilter  = locFilters[loc]
              const displayed  = locSignups.filter(s =>
                locFilter === 'all'    ? true :
                locFilter === 'paid'   ? !!s.paid :
                                         !s.paid
              )
              const paidHere   = locSignups.filter(s => s.paid).length

              return (
                <div key={loc} style={{ border: `1.5px solid ${BLUE_MID}`, borderRadius: 20, overflow: 'hidden' }}>

                  {/* Location header */}
                  <div style={{ backgroundColor: BLUE_LT, borderBottom: `1px solid ${BLUE_MID}`, padding: '16px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: GRAY_1 }}>{loc}</h2>
                      <span style={{
                        backgroundColor: BLUE, color: '#fff',
                        fontWeight: 800, fontSize: 13, borderRadius: 999,
                        padding: '2px 12px', minWidth: 28, textAlign: 'center',
                      }}>
                        {locSignups.length}
                      </span>
                      {paidHere > 0 && (
                        <span style={{
                          backgroundColor: GREEN_LT, color: GREEN,
                          border: `1px solid ${GREEN_BD}`,
                          fontWeight: 700, fontSize: 12, borderRadius: 999,
                          padding: '2px 10px',
                        }}>
                          {paidHere} paid
                        </span>
                      )}
                    </div>

                    {/* Per-location filter */}
                    <div style={{ display: 'flex', gap: 6 }}>
                      {(['all', 'paid', 'unpaid'] as const).map(f => (
                        <button key={f}
                          onClick={() => setLocFilters(p => ({ ...p, [loc]: f }))}
                          style={{
                            padding: '5px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700,
                            border: locFilter === f ? 'none' : `1px solid ${BLUE_MID}`,
                            backgroundColor: locFilter === f ? BLUE : 'transparent',
                            color: locFilter === f ? '#fff' : GRAY_3,
                            cursor: 'pointer', textTransform: 'capitalize',
                          }}>
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Member list */}
                  {displayed.length === 0 ? (
                    <div style={{ padding: '28px 22px', color: GRAY_3, fontSize: 14, textAlign: 'center' }}>
                      No {locFilter !== 'all' ? locFilter : ''} signups for {loc}.
                    </div>
                  ) : (
                    <div>
                      {displayed.map((s, i) => (
                        <div key={s.id} style={{
                          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                          gap: 12, padding: '16px 22px',
                          borderBottom: i < displayed.length - 1 ? `1px solid ${GRAY_4}` : 'none',
                          backgroundColor: i % 2 === 0 ? '#fff' : GRAY_5,
                        }}>
                          {/* Left: name + details */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                              {s.paid && (
                                <span style={{
                                  width: 22, height: 22, borderRadius: '50%',
                                  backgroundColor: GREEN, color: '#fff',
                                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: 12, fontWeight: 800, flexShrink: 0,
                                }}>✓</span>
                              )}
                              <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
                                {s.first_name} {s.last_name}
                              </span>
                              {!s.paid && (
                                <span style={{
                                  fontSize: 11, fontWeight: 700, color: AMBER,
                                  backgroundColor: AMBER_LT,
                                  border: `1px solid #FDE68A`,
                                  borderRadius: 999, padding: '1px 8px',
                                }}>Pending</span>
                              )}
                            </div>
                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '2px 10px' }}>
                              <span style={{ fontSize: 13, color: GRAY_3 }}>{s.email}</span>
                              <span style={{ fontSize: 13, color: GRAY_3 }}>{s.phone}</span>
                            </div>
                            <div style={{ marginTop: 4, display: 'flex', flexWrap: 'wrap', gap: '2px 10px' }}>
                              <span style={{ fontSize: 12, color: GRAY_3 }}>{s.membership_type}</span>
                              {s.plan_type && <><span style={{ color: GRAY_4 }}>·</span><span style={{ fontSize: 12, color: GRAY_3 }}>{s.plan_type}</span></>}
                              {s.payment_method && <><span style={{ color: GRAY_4 }}>·</span><span style={{ fontSize: 12, color: GRAY_3 }}>{s.payment_method}</span></>}
                              <span style={{ color: GRAY_4 }}>·</span>
                              <span style={{ fontSize: 12, color: GRAY_3 }}>{fmtDate(s.created_at)}</span>
                            </div>
                            {s.paid?.notes && (
                              <p style={{ margin: '4px 0 0', fontSize: 12, color: GRAY_3, fontStyle: 'italic' }}>{s.paid.notes}</p>
                            )}
                          </div>

                          {/* Right: action buttons */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                            <button onClick={() => openModal(s)} style={{
                              backgroundColor: s.paid ? GRAY_5 : BLUE,
                              color: s.paid ? GRAY_2 : '#fff',
                              border: s.paid ? `1px solid ${GRAY_4}` : 'none',
                              borderRadius: 10, padding: '7px 14px',
                              fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}>
                              {s.paid ? 'Edit' : 'Mark Paid'}
                            </button>
                            {s.paid && (
                              <button onClick={() => markUnpaid(s.id)} style={{
                                backgroundColor: 'transparent',
                                color: '#DC2626', border: '1px solid #FECACA',
                                borderRadius: 10, padding: '7px 14px',
                                fontSize: 12, fontWeight: 700, cursor: 'pointer',
                              }}>
                                Unpay
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* ── Mark Paid Modal ─────────────────────────────────────────────────── */}
      {modal && (
        <div
          style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 50 }}
          onClick={() => setModal(null)}
        >
          <div
            style={{ backgroundColor: '#fff', borderRadius: 20, padding: 28, width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 18 }}
            onClick={e => e.stopPropagation()}
          >
            <div>
              <h2 style={{ margin: '0 0 4px', fontSize: 17, fontWeight: 800, color: GRAY_1 }}>
                {modal.paid ? 'Edit Payment' : 'Mark as Paid'}
              </h2>
              <p style={{ margin: 0, fontSize: 13, color: GRAY_3 }}>
                {modal.first_name} {modal.last_name} · {modal.location}
              </p>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_3, marginBottom: 8 }}>
                Membership Type
              </label>
              <select value={payType} onChange={e => setPayType(e.target.value)}
                style={{ width: '100%', backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`, borderRadius: 12, padding: '12px 16px', fontSize: 14, color: GRAY_1, outline: 'none', appearance: 'none', boxSizing: 'border-box' }}>
                <option value="Full Year">Full Year</option>
                <option value="5 Month">5 Month</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: GRAY_3, marginBottom: 8 }}>
                Notes <span style={{ color: GRAY_4, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11 }}>(optional)</span>
              </label>
              <textarea value={payNotes} onChange={e => setPayNotes(e.target.value)}
                rows={2} placeholder="e.g. Paid via Venmo"
                style={{ width: '100%', boxSizing: 'border-box', backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`, borderRadius: 12, padding: '12px 16px', fontSize: 14, color: GRAY_1, outline: 'none', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setModal(null)}
                style={{ flex: 1, padding: '13px', borderRadius: 12, fontSize: 13, fontWeight: 700, backgroundColor: GRAY_5, border: `1px solid ${GRAY_4}`, color: GRAY_2, cursor: 'pointer' }}>
                Cancel
              </button>
              <button onClick={markPaid} disabled={saving}
                style={{ flex: 1, padding: '13px', borderRadius: 12, fontSize: 13, fontWeight: 800, backgroundColor: BLUE, color: '#fff', border: 'none', cursor: 'pointer', opacity: saving ? 0.6 : 1 }}>
                {saving ? 'Saving…' : modal.paid ? 'Update' : 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}

// ── CountChip ─────────────────────────────────────────────────────────────────
function CountChip({ label, count, color }: { label: string; count: number; color: 'blue'|'green'|'amber' }) {
  const styles = {
    blue:  { bg: BLUE_LT,  border: BLUE_MID, text: BLUE  },
    green: { bg: GREEN_LT, border: GREEN_BD, text: GREEN  },
    amber: { bg: AMBER_LT, border: '#FDE68A', text: AMBER },
  }[color]
  return (
    <div style={{ backgroundColor: styles.bg, border: `1px solid ${styles.border}`, borderRadius: 999, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: styles.text, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: styles.text, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}
