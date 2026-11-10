import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = process.env.FLOATER_ADMIN_KEY?.trim() ?? ''
  return env.length > 0 && key === env
}

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

// GET — list all signups
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('floater_signups')
    .select('id, first_name, last_name, email, phone, paid, paid_at, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ signups: data ?? [] })
}

// PATCH — toggle paid status
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { id?: string; paid?: boolean }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const { id, paid } = body
  if (!id || typeof paid !== 'boolean') {
    return NextResponse.json({ error: 'id and paid are required.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('floater_signups')
    .update({
      paid,
      paid_at: paid ? new Date().toISOString() : null,
    })
    .eq('id', id)

  if (error) {
    console.error('[floater/admin] patch error', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

// POST — export CSV
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try { await req.json() } catch { /* ignore */ }

  const { data, error } = await supabaseAdmin
    .from('floater_signups')
    .select('id, first_name, last_name, email, phone, paid, paid_at, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const rows: Signup[] = data ?? []

  const escape = (v: string | number | boolean | null | undefined) => {
    const s = String(v ?? '')
    return s.includes(',') || s.includes('"') || s.includes('\n')
      ? `"${s.replace(/"/g, '""')}"`
      : s
  }

  const tz = 'America/New_York'
  const fmtDate = (iso: string | null) =>
    iso ? new Date(iso).toLocaleString('en-US', { timeZone: tz }) : ''

  const headers = ['#', 'First Name', 'Last Name', 'Email', 'Phone', 'Paid', 'Paid At', 'Signed Up At']
  const csvLines = [
    headers.join(','),
    ...rows.map((r, i) => [
      i + 1,
      r.first_name,
      r.last_name,
      r.email,
      r.phone,
      r.paid ? 'Yes' : 'No',
      fmtDate(r.paid_at),
      fmtDate(r.created_at),
    ].map(escape).join(',')),
  ]

  const csv      = csvLines.join('\n')
  const filename = `skramblehouse-floater-signups-${new Date().toISOString().slice(0, 10)}.csv`

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
