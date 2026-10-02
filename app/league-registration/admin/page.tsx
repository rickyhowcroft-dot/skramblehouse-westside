'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Design tokens ────────────────────────────────────────────────────────────
const GRAY_1 = '#111827'
const GRAY_2 = '#374151'
const GRAY_3 = '#6B7280'
const GRAY_4 = '#E5E7EB'
const GRAY_5 = '#F9FAFB'
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const CYAN    = '#0891B2'
const CYAN_LT = '#ECFEFF'
const CYAN_BD = '#A5F3FC'

// ── Types ────────────────────────────────────────────────────────────────────
type Registration = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  ghin_number: string | null
  estimated_handicap: string | null
  league_nights: string[]
  time_slot: string
  sessions: string[]
  created_at: string
}

const SESSION_LABELS: Record<string, string> = {
  session1: 'Session 1 – Fall',
  session2: 'Session 2 – Winter',
  session3: 'Session 3 – Spring',
}
const NIGHT_LABELS: Record<string, string> = {
  tuesday:   'Tuesday',
  wednesday: 'Wednesday',
}

const NIGHTS   = ['all', 'tuesday', 'wednesday'] as const
const SESSIONS = ['all', 'session1', 'session2', 'session3'] as const

type NightFilter   = typeof NIGHTS[number]
type SessionFilter = typeof SESSIONS[number]

export default function LeagueAdminPage() {
  const [key,      setKey]       = useState('')
  const [authed,   setAuthed]    = useState(false)
  const [authErr,  setAuthErr]   = useState('')
  const [regs,     setRegs]      = useState<Registration[]>([])
  const [loading,  setLoading]   = useState(false)
  const [nightFil, setNightFil]  = useState<NightFilter>('all')
  const [sessFil,  setSessFil]   = useState<SessionFilter>('all')
  const [exporting,setExporting] = useState(false)
  const [exportMsg,setExportMsg] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/league-registration/admin', {
      headers: { 'x-admin-key': adminKey },
    })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setRegs(data.registrations ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/league-registration/admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true)
    setAuthErr('')
    const data = await res.json()
    setRegs(data.registrations ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  // Filter locally (fast)
  const displayed = regs.filter(r => {
    const nightOk = nightFil === 'all' || r.league_nights.includes(nightFil)
    const sessOk  = sessFil  === 'all' || r.sessions.includes(sessFil)
    return nightOk && sessOk
  })

  const handleExport = async () => {
    setExporting(true)
    setExportMsg('')
    try {
      const body: Record<string, string> = {}
      if (nightFil !== 'all') body.night   = nightFil
      if (sessFil  !== 'all') body.session = sessFil

      const res = await fetch('/api/league-registration/admin', {
        method: 'POST',
        headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) { setExportMsg('Export failed.'); return }

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const cd   = res.headers.get('content-disposition') ?? ''
      const match = cd.match(/filename="(.+?)"/)
      a.href     = url
      a.download = match ? match[1] : 'league-registrations.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportMsg('✓ CSV downloaded')
      setTimeout(() => setExportMsg(''), 4000)
    } catch { setExportMsg('Export failed.') }
    finally  { setExporting(false) }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  // ── Login ─────────────────────────────────────────────────────────────────
  if (!authed) {
    return (
      <main style={{ backgroundColor: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <form onSubmit={handleAuth} style={{ width: '100%', maxWidth: 440 }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: '50%', backgroundColor: CYAN_LT, border: `2px solid ${CYAN_BD}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: 24 }}>⛳</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>League Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse League Registrations</p>
          </div>
          <input
            type="password"
            placeholder="Admin key"
            value={key}
            onChange={e => setKey(e.target.value)}
            autoComplete="current-password"
            style={{ width: '100%', boxSizing: 'border-box', backgroundColor: GRAY_5, border: `1.5px solid ${GRAY_4}`, borderRadius: 14, padding: '16px 20px', fontSize: 16, color: GRAY_1, outline: 'none', marginBottom: 12 }}
          />
          {authErr && <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', margin: '0 0 12px' }}>{authErr}</p>}
          <button
            type="submit"
            style={{ width: '100%', backgroundColor: BLUE, color: '#fff', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', padding: '16px 24px', borderRadius: 14, border: 'none', cursor: 'pointer' }}
          >
            Enter
          </button>
        </form>
      </main>
    )
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: GRAY_1 }}>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 20px 80px' }}>

        {/* Header */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>League Registrations</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · skramblehouse.com/league-registration</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <Chip label="Total" count={regs.length} />
              <Chip label="Showing" count={displayed.length} accent />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {exportMsg && (
                <span style={{ fontSize: 13, color: exportMsg.startsWith('✓') ? '#16A34A' : '#B91C1C', fontWeight: 600 }}>
                  {exportMsg}
                </span>
              )}
              <button
                onClick={handleExport}
                disabled={exporting}
                style={{ backgroundColor: exporting ? GRAY_4 : BLUE_DK, color: exporting ? GRAY_3 : '#fff', fontWeight: 700, fontSize: 13, padding: '10px 18px', borderRadius: 10, border: 'none', cursor: exporting ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <span style={{ fontSize: 16 }}>⬇</span>
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, marginBottom: 28 }}>

          {/* Night filter */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>League Night</p>
            <div style={{ display: 'flex', gap: 6 }}>
              {NIGHTS.map(n => (
                <button key={n}
                  onClick={() => setNightFil(n)}
                  style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: nightFil === n ? 'none' : `1px solid ${BLUE_MID}`, backgroundColor: nightFil === n ? BLUE : 'transparent', color: nightFil === n ? '#fff' : GRAY_3, cursor: 'pointer', textTransform: 'capitalize' }}
                >
                  {n === 'all' ? 'All' : NIGHT_LABELS[n]}
                </button>
              ))}
            </div>
          </div>

          {/* Session filter */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: GRAY_3, textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 8px' }}>Session</p>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {SESSIONS.map(s => (
                <button key={s}
                  onClick={() => setSessFil(s)}
                  style={{ padding: '6px 14px', borderRadius: 999, fontSize: 12, fontWeight: 700, border: sessFil === s ? 'none' : `1px solid ${BLUE_MID}`, backgroundColor: sessFil === s ? BLUE : 'transparent', color: sessFil === s ? '#fff' : GRAY_3, cursor: 'pointer' }}
                >
                  {s === 'all' ? 'All Sessions' : SESSION_LABELS[s]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3 }}>Loading…</div>
        ) : displayed.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3, border: `1.5px solid ${GRAY_4}`, borderRadius: 16 }}>
            No registrations match the current filters.
          </div>
        ) : (
          <div style={{ border: `1.5px solid ${BLUE_MID}`, borderRadius: 20, overflow: 'hidden' }}>
            {displayed.map((r, i) => (
              <div key={r.id} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12, padding: '16px 22px',
                borderBottom: i < displayed.length - 1 ? `1px solid ${GRAY_4}` : 'none',
                backgroundColor: i % 2 === 0 ? '#fff' : GRAY_5,
              }}>
                {/* Left */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
                      {r.first_name} {r.last_name}
                    </span>
                    {/* Night badges */}
                    {r.league_nights.map(n => (
                      <span key={n} style={{ fontSize: 11, fontWeight: 700, backgroundColor: CYAN_LT, color: CYAN, border: `1px solid ${CYAN_BD}`, borderRadius: 999, padding: '1px 8px' }}>
                        {NIGHT_LABELS[n] ?? n}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                    <span style={{ fontSize: 13, color: GRAY_3 }}>{r.email}</span>
                    <span style={{ fontSize: 13, color: GRAY_3 }}>{r.phone}</span>
                    {r.ghin_number && <span style={{ fontSize: 13, color: GRAY_3 }}>GHIN: {r.ghin_number}</span>}
                    {!r.ghin_number && r.estimated_handicap && <span style={{ fontSize: 13, color: GRAY_3 }}>HCP: ~{r.estimated_handicap}</span>}
                  </div>
                  <div style={{ marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                    <span style={{ fontSize: 12, color: GRAY_3 }}>Time: <strong>{r.time_slot}</strong></span>
                    <span style={{ fontSize: 12, color: GRAY_3 }}>
                      {r.sessions.map(s => SESSION_LABELS[s] ?? s).join(' · ')}
                    </span>
                    <span style={{ fontSize: 12, color: GRAY_3 }}>{fmtDate(r.created_at)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, count, accent }: { label: string; count: number; accent?: boolean }) {
  return (
    <div style={{ backgroundColor: accent ? CYAN_LT : BLUE_LT, border: `1px solid ${accent ? CYAN_BD : BLUE_MID}`, borderRadius: 999, padding: '6px 16px', display: 'flex', alignItems: 'center', gap: 7 }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: accent ? CYAN : BLUE, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: accent ? CYAN : BLUE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}
