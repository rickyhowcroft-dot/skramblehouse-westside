'use client'

import { useState, useEffect, useCallback } from 'react'

const GRAY_1  = '#111827'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GREEN   = '#16A34A'
const GREEN_LT= '#F0FDF4'
const GREEN_BD= '#BBF7D0'
const RED     = '#DC2626'
const RED_LT  = '#FEF2F2'
const RED_BD  = '#FECACA'

const LIMIT = 50

type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  paid: boolean
  paid_at: string | null
  created_at: string
}

export default function FloaterAdminPage() {
  const [key,       setKey]       = useState('')
  const [authed,    setAuthed]    = useState(false)
  const [authErr,   setAuthErr]   = useState('')
  const [signups,   setSignups]   = useState<Signup[]>([])
  const [loading,   setLoading]   = useState(false)
  const [toggling,  setToggling]  = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/floater/admin', { headers: { 'x-admin-key': adminKey } })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setSignups(data.signups ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/floater/admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true); setAuthErr('')
    const data = await res.json()
    setSignups(data.signups ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  const togglePaid = async (id: string, currentPaid: boolean) => {
    setToggling(id)
    try {
      const res = await fetch('/api/floater/admin', {
        method: 'PATCH',
        headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, paid: !currentPaid }),
      })
      if (res.ok) {
        setSignups(prev => prev.map(s =>
          s.id === id
            ? { ...s, paid: !currentPaid, paid_at: !currentPaid ? new Date().toISOString() : null }
            : s
        ))
      }
    } finally {
      setToggling(null)
    }
  }

  const handleExport = async () => {
    setExporting(true); setExportMsg('')
    try {
      const res = await fetch('/api/floater/admin', {
        method: 'POST',
        headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) { setExportMsg('Export failed.'); return }
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const cd   = res.headers.get('content-disposition') ?? ''
      const m    = cd.match(/filename="(.+?)"/)
      a.href = url; a.download = m ? m[1] : 'floater-signups.csv'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportMsg('✓ CSV downloaded')
      setTimeout(() => setExportMsg(''), 4000)
    } catch { setExportMsg('Export failed.') }
    finally  { setExporting(false) }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit',
    })

  const paidCount = signups.filter(s => s.paid).length
  const soldOut   = paidCount >= LIMIT

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24,
            }}>🏌️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>Floater Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · Rochester</p>
          </div>
          <input
            type="password" placeholder="Admin key" value={key}
            onChange={e => setKey(e.target.value)} autoComplete="current-password"
            style={{
              width: '100%', boxSizing: 'border-box',
              backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`,
              borderRadius: 14, padding: '16px 20px',
              fontSize: 16, color: GRAY_1, outline: 'none', marginBottom: 12,
            }}
          />
          {authErr && <p style={{ color: RED, fontSize: 13, textAlign: 'center', margin: '0 0 12px' }}>{authErr}</p>}
          <button type="submit" style={{
            width: '100%', backgroundColor: BLUE, color: '#fff',
            fontWeight: 800, fontSize: 14, letterSpacing: '0.08em',
            textTransform: 'uppercase', padding: '16px 24px',
            borderRadius: 14, border: 'none', cursor: 'pointer',
          }}>
            Enter
          </button>
        </form>
      </main>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: GRAY_1 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Floater Sign-Ups</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · Rochester · Limited to {LIMIT} paid spots</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Chip label="Total"     count={signups.length} color={BLUE} />
              <Chip label="Paid"      count={paidCount}      color={GREEN} />
              <Chip label="Remaining" count={Math.max(0, LIMIT - paidCount)} color={soldOut ? RED : GRAY_3} />
            </div>
            {/* Progress bar */}
            <div style={{ width: 220, height: 6, backgroundColor: BLUE_MID, borderRadius: 999, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.min(100, (paidCount / LIMIT) * 100)}%`,
                backgroundColor: soldOut ? RED : GREEN,
                borderRadius: 999,
                transition: 'width 0.4s ease',
              }} />
            </div>
            {soldOut && (
              <span style={{ fontSize: 13, fontWeight: 800, color: RED, letterSpacing: '0.05em' }}>SOLD OUT</span>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {exportMsg && (
                <span style={{ fontSize: 13, color: exportMsg.startsWith('✓') ? GREEN : RED, fontWeight: 600 }}>
                  {exportMsg}
                </span>
              )}
              <button onClick={handleExport} disabled={exporting}
                style={{
                  backgroundColor: exporting ? GRAY_4 : BLUE_DK, color: exporting ? GRAY_3 : '#fff',
                  fontWeight: 700, fontSize: 13, padding: '10px 18px',
                  borderRadius: 10, border: 'none', cursor: exporting ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                <span style={{ fontSize: 16 }}>⬇</span>
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3 }}>Loading…</div>
        ) : signups.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3, border: `1.5px solid ${GRAY_4}`, borderRadius: 16 }}>
            No sign-ups yet.
          </div>
        ) : (
          <div style={{ border: `1.5px solid ${BLUE_MID}`, borderRadius: 20, overflow: 'hidden' }}>
            {signups.map((s, i) => {
              const isPending = toggling === s.id
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px',
                  borderBottom: i < signups.length - 1 ? `1px solid ${GRAY_4}` : 'none',
                  backgroundColor: s.paid
                    ? (i % 2 === 0 ? GREEN_LT : '#e8faf0')
                    : (i % 2 === 0 ? '#fff' : GRAY_5),
                }}>
                  {/* Row # */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    backgroundColor: s.paid ? GREEN_LT : BLUE_LT,
                    border: `1.5px solid ${s.paid ? GREEN_BD : BLUE_MID}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, marginTop: 2,
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: s.paid ? GREEN : BLUE }}>{i + 1}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
                        {s.first_name} {s.last_name}
                      </span>
                      {s.paid && (
                        <span style={{
                          fontSize: 11, fontWeight: 700,
                          backgroundColor: GREEN_LT, color: GREEN,
                          border: `1px solid ${GREEN_BD}`,
                          borderRadius: 999, padding: '2px 9px',
                        }}>
                          ✓ Paid
                        </span>
                      )}
                    </div>
                    <div style={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                      <span style={{ fontSize: 13, color: GRAY_3 }}>{s.email}</span>
                      <span style={{ fontSize: 13, color: GRAY_3 }}>{s.phone}</span>
                    </div>
                    <div style={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                      <span style={{ fontSize: 12, color: GRAY_3 }}>Signed up: {fmtDate(s.created_at)}</span>
                      {s.paid && s.paid_at && (
                        <span style={{ fontSize: 12, color: GREEN }}>Paid: {fmtDate(s.paid_at)}</span>
                      )}
                    </div>
                  </div>

                  {/* Mark Paid / Unpaid button */}
                  <button
                    disabled={isPending}
                    onClick={() => togglePaid(s.id, s.paid)}
                    style={{
                      flexShrink: 0,
                      backgroundColor: isPending ? GRAY_4 : (s.paid ? RED_LT : GREEN_LT),
                      color: isPending ? GRAY_3 : (s.paid ? RED : GREEN),
                      border: `1.5px solid ${isPending ? GRAY_4 : (s.paid ? RED_BD : GREEN_BD)}`,
                      borderRadius: 10,
                      padding: '8px 14px',
                      fontSize: 12,
                      fontWeight: 700,
                      cursor: isPending ? 'default' : 'pointer',
                      transition: 'all 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {isPending ? '…' : (s.paid ? 'Mark Unpaid' : 'Mark Paid')}
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

function Chip({ label, count, color }: { label: string; count: number; color?: string }) {
  const c = color ?? BLUE
  return (
    <div style={{
      backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`,
      borderRadius: 999, padding: '6px 16px',
      display: 'flex', alignItems: 'center', gap: 7,
    }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: c, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}
