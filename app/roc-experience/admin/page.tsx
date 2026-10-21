'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Design tokens ────────────────────────────────────────────────────────────
const GRAY_1 = '#111827'
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
type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  interests: string[]
  created_at: string
}

const INTEREST_LABELS: Record<string, string> = {
  coaching: 'Get better / Coaching',
  leagues:  'Leagues / Events',
  access:   '24/7/365 Access',
  fun:      'Have Fun',
}

export default function RocExperienceAdminPage() {
  const [key,       setKey]       = useState('')
  const [authed,    setAuthed]    = useState(false)
  const [authErr,   setAuthErr]   = useState('')
  const [signups,   setSignups]   = useState<Signup[]>([])
  const [loading,   setLoading]   = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportMsg, setExportMsg] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/roc-experience/admin', {
      headers: { 'x-admin-key': adminKey },
    })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setSignups(data.signups ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/roc-experience/admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true)
    setAuthErr('')
    const data = await res.json()
    setSignups(data.signups ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  const handleExport = async () => {
    setExporting(true)
    setExportMsg('')
    try {
      const res = await fetch('/api/roc-experience/admin', {
        method: 'POST',
        headers: { 'x-admin-key': key, 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      })
      if (!res.ok) { setExportMsg('Export failed.'); return }

      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      const cd   = res.headers.get('content-disposition') ?? ''
      const match = cd.match(/filename="(.+?)"/)
      a.href     = url
      a.download = match ? match[1] : 'roc-experience-signups.csv'
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
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              backgroundColor: CYAN_LT, border: `2px solid ${CYAN_BD}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px', fontSize: 24,
            }}>⛳</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>ROC Experience Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse Rochester · Free Access Signups</p>
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
              borderRadius: 14, padding: '16px 20px', fontSize: 16, color: GRAY_1,
              outline: 'none', marginBottom: 12,
            }}
          />
          {authErr && <p style={{ color: '#B91C1C', fontSize: 13, textAlign: 'center', margin: '0 0 12px' }}>{authErr}</p>}
          <button
            type="submit"
            style={{
              width: '100%', backgroundColor: BLUE, color: '#fff',
              fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '16px 24px', borderRadius: 14, border: 'none', cursor: 'pointer',
            }}
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
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start',
          justifyContent: 'space-between', gap: 16, marginBottom: 32,
        }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 4px' }}>ROC Experience Signups</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse Rochester · Free 72-Hour Access</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <Chip label="Total" count={signups.length} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {exportMsg && (
                <span style={{ fontSize: 13, color: exportMsg.startsWith('✓') ? '#16A34A' : '#B91C1C', fontWeight: 600 }}>
                  {exportMsg}
                </span>
              )}
              <button
                onClick={handleExport}
                disabled={exporting}
                style={{
                  backgroundColor: exporting ? GRAY_4 : BLUE_DK,
                  color: exporting ? GRAY_3 : '#fff',
                  fontWeight: 700, fontSize: 13,
                  padding: '10px 18px', borderRadius: 10, border: 'none',
                  cursor: exporting ? 'default' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <span style={{ fontSize: 16 }}>⬇</span>
                {exporting ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: GRAY_3 }}>Loading…</div>
        ) : signups.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '60px 0', color: GRAY_3,
            border: `1.5px solid ${GRAY_4}`, borderRadius: 16,
          }}>
            No signups yet.
          </div>
        ) : (
          <div style={{ border: `1.5px solid ${BLUE_MID}`, borderRadius: 20, overflow: 'hidden' }}>
            {signups.map((s, i) => (
              <div key={s.id} style={{
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                gap: 12, padding: '16px 22px',
                borderBottom: i < signups.length - 1 ? `1px solid ${GRAY_4}` : 'none',
                backgroundColor: i % 2 === 0 ? '#fff' : GRAY_5,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
                      {s.first_name} {s.last_name}
                    </span>
                    <span style={{ fontSize: 12, color: GRAY_3 }}>{fmtDate(s.created_at)}</span>
                  </div>
                  <div style={{ marginTop: 3, display: 'flex', flexWrap: 'wrap', gap: '2px 12px' }}>
                    <span style={{ fontSize: 13, color: GRAY_3 }}>{s.email}</span>
                    <span style={{ fontSize: 13, color: GRAY_3 }}>{s.phone}</span>
                  </div>
                  {s.interests.length > 0 && (
                    <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {s.interests.map(int => (
                        <span key={int} style={{
                          fontSize: 11, fontWeight: 700,
                          backgroundColor: CYAN_LT, color: CYAN,
                          border: `1px solid ${CYAN_BD}`,
                          borderRadius: 999, padding: '2px 10px',
                        }}>
                          {INTEREST_LABELS[int] ?? int}
                        </span>
                      ))}
                    </div>
                  )}
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
    <div style={{
      backgroundColor: accent ? CYAN_LT : BLUE_LT,
      border: `1px solid ${accent ? CYAN_BD : BLUE_MID}`,
      borderRadius: 999, padding: '6px 16px',
      display: 'flex', alignItems: 'center', gap: 7,
    }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: accent ? CYAN : BLUE, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: accent ? CYAN : BLUE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}
