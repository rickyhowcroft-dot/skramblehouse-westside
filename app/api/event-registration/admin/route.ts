import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = (process.env.LEAGUE_ADMIN_KEY ?? '').trim()
  return env.length > 0 && key === env
}

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

const SELECT_COLS = [
  'id', 'event_slug', 'location',
  'first_name', 'last_name', 'email', 'phone',
  'ghin_number', 'estimated_handicap',
  'division',
  'teammate_first_name', 'teammate_last_name',
  'teammate_ghin_number', 'teammate_estimated_hcp',
  'created_at',
].join(', ')

// GET — list all registrations
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('event_registrations')
    .select(SELECT_COLS)
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ registrations: data ?? [] })
}

// POST — export CSV
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let filter: { event?: string; location?: string } = {}
  try { filter = await req.json() } catch { /* no body = all */ }

  const { data, error } = await supabaseAdmin
    .from('event_registrations')
    .select(SELECT_COLS)
    .order('event_slug', { ascending: true })
    .order('location', { ascending: true })
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let rows = (data ?? []) as unknown as EventReg[]
  if (filter.event)    rows = rows.filter(r => r.event_slug === filter.event)
  if (filter.location) rows = rows.filter(r => r.location   === filter.location)

  const headers = [
    'ID', 'Event', 'Location', 'Division',
    'First Name', 'Last Name', 'Email', 'Phone',
    'GHIN #', 'Est. Handicap',
    'Teammate First', 'Teammate Last', 'Teammate GHIN', 'Teammate Est. HC',
    'Registered At',
  ]

  const escape = (v: string | null | undefined) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }

  const EVENT_LABELS: Record<string, string> = {
    'skramble-open': 'Open House Skramble',
    'baller-league': 'Baller League',
    'skramble-tour': 'Skramble Tour',
  }
  const LOC_LABELS: Record<string, string> = {
    'west-side': 'Rochester',
    'horsham':   'Horsham',
    'kop':       'KOP',
  }
  const DIV_LABELS: Record<string, string> = {
    'hcp-20-plus':  'Division A (20+)',
    'hcp-under-20': 'Division B (under 20)',
  }

  const csvLines = [
    headers.join(','),
    ...rows.map(r => [
      r.id,
      EVENT_LABELS[r.event_slug] ?? r.event_slug,
      LOC_LABELS[r.location] ?? r.location,
      r.division ? (DIV_LABELS[r.division] ?? r.division) : '',
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.ghin_number ?? '',
      r.estimated_handicap ?? '',
      r.teammate_first_name ?? '',
      r.teammate_last_name ?? '',
      r.teammate_ghin_number ?? '',
      r.teammate_estimated_hcp ?? '',
      new Date(r.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    ].map(escape).join(',')),
  ]

  const suffix = filter.event ? `-${filter.event}` : ''
  const filename = `skramblehouse-events${suffix}-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csvLines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
