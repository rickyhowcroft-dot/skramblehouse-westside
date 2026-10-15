'use client'

import { useState, useEffect, useCallback } from 'react'

const GRAY_1 = '#111827'
const GRAY_3 = '#6B7280'
const GRAY_4 = '#E5E7EB'
const GRAY_5 = '#F9FAFB'
const BLUE   = '#1D4ED8'
const BLUE_DK= '#1E40AF'
const BLUE_LT= '#EFF6FF'
const BLUE_MID='#BFDBFE'
const GREEN  = '#16A34A'
const GREEN_LT='#F0FDF4'
const GREEN_BD='#BBF7D0'

const LOCATION_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Horsham: { bg: BLUE_LT,   border: BLUE_MID, text: BLUE   },
  KOP:     { bg: GREEN_LT,  border: GREEN_BD,  text: GREEN  },
}

type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  location: string
  created_at: string
}

type LocationFilter = 'all' | 'Horsham' | 'KOP'
const LOCATIONS: LocationFilter[] = ['all', 'Horsham', 'KOP']

export default function PhillyAdminPage() {
  const [key,       setKey]       = useState('')
  const [authed,    setAuthed]    = useState(false)
  const [authErr,   setAuthErr]   = useState('')
  const [signups,   setSignups]   = useState<Signup[]>([])
  const [loading,   setLoading]   = useState(false)
  const [locFil,    setLocFil]    = useState<LocationFilter>('all')
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/philly/admin', { headers: { 'x-admin-key': adminKey } })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setSignups(data.signups ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/philly/admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true); setAuthErr('')
    const data = await res.json()
    setSignups(data.signups ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  const displayed = signups.filter(s => locFil === 'all' || s.location === locFil)

  const handleExport = async () => {
    setExporting(true); setExportMsg('')
    try {
      const res = await fetch('/api/philly/admin', {
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
      a.href = url; a.download = m ? m[1] : 'philly-signups.csv'
      document.body.appendChild(a); a.click(); document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportMsg('✓ CSV downloaded')
      setTimeout(() => setExportMsg(''), 4000)
    } catch { setExportMsg('Export failed.') }
    finally  { setExporting(false) }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

  const horshamCount = signups.filter(s => s.location === 'Horsham').length
  const kopCount     = signups.filter(s => s.location === 'KOP').length

  // ── Login ──────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: BLUE_LT, border: `2px solid ${BLUE_MID}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>🏌️</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>Philly Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · Horsham &amp; KOP Sign-Ups</p>
          </div>
          <input type="password" placeholder="Admin key" value={key} onChange={e => setKey(e.target.value)} autoComplete="current-password"
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`, borderRadius: 14, padding: '16px 20px', fontSize: 16, color: GRAY_1, outline: 'none', marginBottom: 12 }} />
          {authErr && <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', margin: '0 0 12px' }}>{authErr}</p>}
          <button type="submit" style={{ width: '100%', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 24px', borderRadius: 14, border: 'none', cursor: 'pointer' }}>
            Enter
          </button>
        </form>
      </main>
    )
  }

  // ── Dashboard ──────────────────────────────────────────────────────────────
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: GRAY_1 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 28 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>Philly Sign-Ups</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · Horsham &amp; KOP · November 10% Off</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Chip label="Total"   count={signups.length} />
              <Chip label="Horsham" count={horshamCount} color={BLUE} />
              <Chip label="KOP"     count={kopCount} color={GREEN} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {exportMsg && (
                <span style={{ fontSize: 13, color: exportMsg.startsWith('✓') ? GREEN : '#B91C1C', fontWeight: 600 }}>
                  {exportMsg}
                </span>
              )}
              <button onClick={handleExport} disabled={exporting}
                style={{ backgroundColor: exporting ? GRAY_4 : BLUE_DK, color: exporting ? GRAY_3 : '#fff', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 10, border: 'none', cursor: exporting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>⬇</span>
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Location filter */}
        <div style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Location</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {LOCATIONS.map(l => (
              <button key={l} onClick={() => setLocFil(l)}
                style={{ padding: '7px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, border: locFil === l ? 'none' : `1px solid ${BLUE_MID}`, backgroundColor: locFil === l ? BLUE : 'transparent', color: locFil === l ? '#fff' : GRAY_3, cursor: 'pointer' }}>
                {l === 'all' ? 'All' : l}
                {l !== 'all' && <span style={{ marginLeft: 6, opacity: 0.75 }}>({l === 'Horsham' ? horshamCount : kopCount})</span>}
              </button>
            ))}
          </div>
        </div>

        {/* List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3 }}>Loading…</div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3, border: `1.5px solid ${GRAY_4}`, borderRadius: 16 }}>
            No sign-ups yet.
          </div>
        ) : (
          <div style={{ border: `1.5px solid ${BLUE_MID}`, borderRadius: 20, overflow: 'hidden' }}>
            {displayed.map((s, i) => {
              const colors = LOCATION_COLORS[s.location] ?? LOCATION_COLORS['Horsham']
              return (
                <div key={s.id} style={{
                  display: 'flex', alignItems: 'flex-start', gap: 14, padding: '16px 22px',
                  borderBottom: i < displayed.length - 1 ? `1px solid ${GRAY_4}` : 'none',
                  backgroundColor: i % 2 === 0 ? '#fff' : GRAY_5,
                }}>
                  {/* Spot # */}
                  <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: BLUE_LT, border: `1.5px solid ${BLUE_MID}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                    <span style={{ fontSize: 12, fontWeight: 800, color: BLUE }}>{i + 1}</span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
                        {s.first_name} {s.last_name}
                      </span>
                      <span style={{ fontSize: 11, fontWeight: 700, backgroundColor: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 999, padding: '2px 9px' }}>
                        {s.location}
                      </span>
                    </div>
                    <div style={{ marginTop: 2, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                      <span style={{ fontSize: 13, color: GRAY_3 }}>{s.email}</span>
                      <span style={{ fontSize: 13, color: GRAY_3 }}>{s.phone}</span>
                    </div>
                    <div style={{ marginTop: 2 }}>
                      <span style={{ fontSize: 12, color: GRAY_3 }}>{fmtDate(s.created_at)}</span>
                    </div>
                  </div>
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
    <div style={{ backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`, borderRadius: 999, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: c, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: c, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}
