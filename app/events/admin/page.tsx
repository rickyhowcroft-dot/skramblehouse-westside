'use client'

import { useState, useEffect, useCallback } from 'react'

// ── Design tokens ────────────────────────────────────────────────────────────
const GRAY_1  = '#111827'
const GRAY_3  = '#6B7280'
const GRAY_4  = '#E5E7EB'
const GRAY_5  = '#F9FAFB'
const BLUE    = '#1D4ED8'
const BLUE_DK = '#1E40AF'
const BLUE_LT = '#EFF6FF'
const BLUE_MID= '#BFDBFE'
const GOLD    = '#B45309'
const GOLD_LT = '#FFFBEB'
const GOLD_MID= '#FDE68A'
const GREEN   = '#065F46'
const GREEN_LT= '#ECFDF5'
const GREEN_BD= '#6EE7B7'

// ── Types ────────────────────────────────────────────────────────────────────
type EventReg = {
  id: string
  event_slug: string
  location: string
  first_name: string
  last_name: string
  email: string
  phone: string
  ghin_number: string | null
  estimated_handicap: string | null
  division: string | null
  teammate_first_name: string | null
  teammate_last_name: string | null
  teammate_ghin_number: string | null
  teammate_estimated_hcp: string | null
  created_at: string
}

// ── Constants ─────────────────────────────────────────────────────────────────
const EVENTS = [
  { slug: 'opening-weekend', label: 'Opening Weekend Skramble', dates: 'Sat 11/21 & Sun 11/22', teamFormat: true },
  { slug: 'baller-league',   label: 'Baller League',            dates: 'Starts week of 11/22',  teamFormat: false },
  { slug: 'skramble-tour',   label: 'Skramble Tour',            dates: 'Starts week of 11/22',  teamFormat: false },
]

const LOCATIONS = [
  { id: 'west-side', label: 'West Side (Rochester)' },
  { id: 'horsham',   label: 'Horsham' },
  { id: 'kop',       label: 'King of Prussia (KOP)' },
]

const DIVISION_LABELS: Record<string, string> = {
  'hcp-20-plus':  'Div A — 20+',
  'hcp-under-20': 'Div B — under 20',
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function EventsAdminPage() {
  const [key,     setKey]     = useState('')
  const [authed,  setAuthed]  = useState(false)
  const [authErr, setAuthErr] = useState('')
  const [regs,    setRegs]    = useState<EventReg[]>([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState<string | null>(null) // slug or 'all'
  const [exportMsg, setExportMsg] = useState('')

  const load = useCallback(async (adminKey: string) => {
    setLoading(true)
    const res  = await fetch('/api/event-registration/admin', { headers: { 'x-admin-key': adminKey } })
    if (res.status === 401) { setAuthed(false); setLoading(false); return }
    const data = await res.json()
    setRegs(data.registrations ?? [])
    setLoading(false)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch('/api/event-registration/admin', { headers: { 'x-admin-key': key } })
    if (res.status === 401) { setAuthErr('Invalid key.'); return }
    setAuthed(true)
    setAuthErr('')
    const data = await res.json()
    setRegs(data.registrations ?? [])
  }

  useEffect(() => { if (authed) load(key) }, [authed, key, load])

  const handleExport = async (eventSlug?: string) => {
    const tag = eventSlug ?? 'all'
    setExporting(tag)
    setExportMsg('')
    try {
      const body = eventSlug ? { event: eventSlug } : {}
      const res = await fetch('/api/event-registration/admin', {
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
      a.href = url
      a.download = match ? match[1] : 'events.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      setExportMsg('✓ Downloaded')
      setTimeout(() => setExportMsg(''), 3500)
    } catch { setExportMsg('Export failed.') }
    finally  { setExporting(null) }
  }

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })

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
            }}>⛳</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: GRAY_1, margin: '0 0 6px' }}>Events Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · All Locations</p>
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
              fontSize: 16, color: GRAY_1, outline: 'none', marginBottom: 12,
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
  const totalRegs = regs.length

  return (
    <main style={{ backgroundColor: '#fff', minHeight: '100vh', color: GRAY_1 }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 20px 100px' }}>

        {/* ── Page header ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 36 }}>
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 4px' }}>Events Admin</h1>
            <p style={{ color: GRAY_3, fontSize: 14, margin: 0 }}>Skramblehouse · All Locations</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
            <Chip label="Total Registrations" count={totalRegs} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {exportMsg && (
                <span style={{ fontSize: 13, color: exportMsg.startsWith('✓') ? '#16A34A' : '#B91C1C', fontWeight: 600 }}>
                  {exportMsg}
                </span>
              )}
              <ExportBtn
                label="Export All CSV"
                loading={exporting === 'all'}
                onClick={() => handleExport()}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: GRAY_3 }}>Loading…</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {EVENTS.map(event => {
              const eventRegs = regs.filter(r => r.event_slug === event.slug)
              return (
                <EventSection
                  key={event.slug}
                  event={event}
                  regs={eventRegs}
                  exporting={exporting === event.slug}
                  onExport={() => handleExport(event.slug)}
                  fmtDate={fmtDate}
                />
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}

// ── EventSection ──────────────────────────────────────────────────────────────
function EventSection({ event, regs, exporting, onExport, fmtDate }: {
  event: { slug: string; label: string; dates: string; teamFormat: boolean }
  regs: EventReg[]
  exporting: boolean
  onExport: () => void
  fmtDate: (iso: string) => string
}) {
  return (
    <section>
      {/* Event header */}
      <div style={{
        backgroundColor: BLUE_LT,
        border: `1.5px solid ${BLUE_MID}`,
        borderRadius: 18,
        padding: '20px 24px',
        marginBottom: 20,
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, color: GRAY_1, margin: '0 0 3px' }}>{event.label}</h2>
          <p style={{ fontSize: 13, color: GRAY_3, margin: 0 }}>{event.dates}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Chip label="Registered" count={regs.length} />
          <ExportBtn label="CSV" loading={exporting} onClick={onExport} small />
        </div>
      </div>

      {regs.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '32px 0', color: GRAY_3,
          border: `1.5px dashed ${GRAY_4}`, borderRadius: 14, fontSize: 14,
        }}>
          No registrations yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {LOCATIONS.map(loc => {
            const locRegs = regs.filter(r => r.location === loc.id)
            if (locRegs.length === 0) return null
            return (
              <LocationGroup
                key={loc.id}
                location={loc}
                regs={locRegs}
                teamFormat={event.teamFormat}
                fmtDate={fmtDate}
              />
            )
          })}
        </div>
      )}
    </section>
  )
}

// ── LocationGroup ─────────────────────────────────────────────────────────────
function LocationGroup({ location, regs, teamFormat, fmtDate }: {
  location: { id: string; label: string }
  regs: EventReg[]
  teamFormat: boolean
  fmtDate: (iso: string) => string
}) {
  return (
    <div>
      {/* Location label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 4, height: 20, borderRadius: 2, backgroundColor: GOLD, flexShrink: 0 }} />
        <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: GOLD }}>
          {location.label}
        </span>
        <span style={{
          fontSize: 11, fontWeight: 700, backgroundColor: GOLD_LT, border: `1px solid ${GOLD_MID}`,
          color: GOLD, borderRadius: 999, padding: '2px 10px',
        }}>
          {regs.length}
        </span>
      </div>

      {/* Rows */}
      <div style={{ border: `1.5px solid ${GRAY_4}`, borderRadius: 16, overflow: 'hidden' }}>
        {regs.map((r, i) => (
          <RegRow
            key={r.id}
            reg={r}
            isLast={i === regs.length - 1}
            isEven={i % 2 === 0}
            teamFormat={teamFormat}
            fmtDate={fmtDate}
          />
        ))}
      </div>
    </div>
  )
}

// ── RegRow ────────────────────────────────────────────────────────────────────
function RegRow({ reg, isLast, isEven, teamFormat, fmtDate }: {
  reg: EventReg
  isLast: boolean
  isEven: boolean
  teamFormat: boolean
  fmtDate: (iso: string) => string
}) {
  const teammateName = reg.teammate_first_name || reg.teammate_last_name
    ? `${reg.teammate_first_name ?? ''} ${reg.teammate_last_name ?? ''}`.trim()
    : null

  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: isLast ? 'none' : `1px solid ${GRAY_4}`,
      backgroundColor: isEven ? '#fff' : GRAY_5,
    }}>
      {/* Primary player row */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Name + division */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 }}>
            <span style={{ fontWeight: 700, fontSize: 15, color: GRAY_1 }}>
              {reg.first_name} {reg.last_name}
            </span>
            {reg.division && (
              <span style={{
                fontSize: 11, fontWeight: 700,
                backgroundColor: GREEN_LT, border: `1px solid ${GREEN_BD}`,
                color: GREEN, borderRadius: 999, padding: '1px 8px',
              }}>
                {DIVISION_LABELS[reg.division] ?? reg.division}
              </span>
            )}
          </div>
          {/* Contact */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px', marginBottom: 2 }}>
            <span style={{ fontSize: 13, color: GRAY_3 }}>{reg.email}</span>
            <span style={{ fontSize: 13, color: GRAY_3 }}>{reg.phone}</span>
          </div>
          {/* Handicap */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2px 14px' }}>
            {reg.ghin_number && (
              <span style={{ fontSize: 12, color: GRAY_3 }}>GHIN: <strong>{reg.ghin_number}</strong></span>
            )}
            {!reg.ghin_number && reg.estimated_handicap && (
              <span style={{ fontSize: 12, color: GRAY_3 }}>HCP: ~<strong>{reg.estimated_handicap}</strong></span>
            )}
            {/* Teammate (team events) */}
            {teamFormat && teammateName && (
              <span style={{ fontSize: 12, color: GRAY_3 }}>
                Partner: <strong>{teammateName}</strong>
                {reg.teammate_ghin_number && ` (GHIN: ${reg.teammate_ghin_number})`}
                {!reg.teammate_ghin_number && reg.teammate_estimated_hcp && ` (~${reg.teammate_estimated_hcp})`}
              </span>
            )}
          </div>
        </div>
        {/* Date */}
        <span style={{ fontSize: 11, color: GRAY_3, whiteSpace: 'nowrap', paddingTop: 2 }}>
          {fmtDate(reg.created_at)}
        </span>
      </div>
    </div>
  )
}

// ── Chip ──────────────────────────────────────────────────────────────────────
function Chip({ label, count }: { label: string; count: number }) {
  return (
    <div style={{
      backgroundColor: BLUE_LT, border: `1px solid ${BLUE_MID}`,
      borderRadius: 999, padding: '6px 16px',
      display: 'flex', alignItems: 'center', gap: 7,
    }}>
      <span style={{ fontSize: 18, fontWeight: 900, color: BLUE, lineHeight: 1 }}>{count}</span>
      <span style={{ fontSize: 11, fontWeight: 700, color: BLUE, textTransform: 'uppercase', letterSpacing: '0.07em' }}>{label}</span>
    </div>
  )
}

// ── ExportBtn ─────────────────────────────────────────────────────────────────
function ExportBtn({ label, loading, onClick, small }: {
  label: string; loading: boolean; onClick: () => void; small?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        backgroundColor: loading ? GRAY_4 : BLUE_DK,
        color: loading ? GRAY_3 : '#fff',
        fontWeight: 700,
        fontSize: small ? 12 : 13,
        padding: small ? '8px 14px' : '10px 18px',
        borderRadius: 10,
        border: 'none',
        cursor: loading ? 'default' : 'pointer',
        display: 'flex', alignItems: 'center', gap: 5,
        fontFamily: 'inherit',
      }}
    >
      <span style={{ fontSize: small ? 13 : 15 }}>⬇</span>
      {loading ? 'Exporting…' : label}
    </button>
  )
}
