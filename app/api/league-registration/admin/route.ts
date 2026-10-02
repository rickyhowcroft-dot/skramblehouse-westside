import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = process.env.MEMBERSHIP_ADMIN_KEY?.trim() ?? ''
  return env.length > 0 && key === env
}

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

// GET — list all registrations
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('league_registrations')
    .select('id, first_name, last_name, email, phone, ghin_number, estimated_handicap, league_nights, time_slot, sessions, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ registrations: data ?? [] })
}

// POST — export CSV (downloads via response stream)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let filter: { night?: string; session?: string } = {}
  try { filter = await req.json() } catch { /* no body = all */ }

  let query = supabaseAdmin
    .from('league_registrations')
    .select('id, first_name, last_name, email, phone, ghin_number, estimated_handicap, league_nights, time_slot, sessions, created_at')
    .order('created_at', { ascending: true })

  const { data, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  let rows: Registration[] = data ?? []

  // Filter in-app (array columns don't easily filter server-side in PostgREST)
  if (filter.night) {
    rows = rows.filter(r => r.league_nights.includes(filter.night!))
  }
  if (filter.session) {
    rows = rows.filter(r => r.sessions.includes(filter.session!))
  }

  // Build CSV
  const headers = [
    'ID', 'First Name', 'Last Name', 'Email', 'Phone',
    'GHIN #', 'Est. Handicap', 'League Nights', 'Time Slot', 'Sessions', 'Registered At',
  ]

  const escape = (v: string | null | undefined) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }

  const csvLines = [
    headers.join(','),
    ...rows.map(r => [
      r.id,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.ghin_number ?? '',
      r.estimated_handicap ?? '',
      r.league_nights.join(' & '),
      r.time_slot,
      r.sessions.join(' & '),
      new Date(r.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    ].map(escape).join(',')),
  ]

  const csv = csvLines.join('\n')

  const suffix = filter.night ? `-${filter.night}` : filter.session ? `-${filter.session}` : ''
  const filename = `skramblehouse-league-registrations${suffix}-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
