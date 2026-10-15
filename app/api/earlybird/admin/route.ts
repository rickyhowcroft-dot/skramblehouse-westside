import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = process.env.EARLYBIRD_ADMIN_KEY?.trim() ?? ''
  return env.length > 0 && key === env
}

type Signup = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  created_at: string
}

// GET — list all signups
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('earlybird_signups')
    .select('id, first_name, last_name, email, phone, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ signups: data ?? [] })
}

// POST — export CSV
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // consume body (even if unused)
  try { await req.json() } catch { /* ignore */ }

  const { data, error } = await supabaseAdmin
    .from('earlybird_signups')
    .select('id, first_name, last_name, email, phone, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows: Signup[] = data ?? []

  const headers = ['#', 'First Name', 'Last Name', 'Email', 'Phone', 'Signed Up At']
  const escape  = (v: string | null | undefined) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s
  }

  const csvLines = [
    headers.join(','),
    ...rows.map((r, i) => [
      i + 1,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      new Date(r.created_at).toLocaleString('en-US', { timeZone: 'America/New_York' }),
    ].map(escape).join(',')),
  ]

  const csv      = csvLines.join('\n')
  const filename = `skramblehouse-earlybird-signups-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
