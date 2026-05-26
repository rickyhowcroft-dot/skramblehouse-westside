import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = process.env.MEMBERSHIP_ADMIN_KEY?.trim() ?? ''
  return env.length > 0 && key === env
}

// GET /api/membership-admin — list all signups with paid status
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: signups, error } = await supabaseAdmin
    .from('membership_presale_signups')
    .select('id, first_name, last_name, email, phone, location, membership_type, plan_type, payment_method, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: paid } = await supabaseAdmin
    .from('membership_presale_paid')
    .select('signup_id, membership_type, notes, paid_at')

  const paidMap = new Map((paid ?? []).map(p => [p.signup_id, p]))

  const result = (signups ?? []).map(s => ({
    ...s,
    paid: paidMap.has(s.id) ? {
      membership_type: paidMap.get(s.id)!.membership_type,
      notes:           paidMap.get(s.id)!.notes,
      paid_at:         paidMap.get(s.id)!.paid_at,
    } : null,
  }))

  return NextResponse.json({ signups: result })
}

// POST /api/membership-admin — mark a signup as paid (or update)
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: { signupId: string; membershipType: string; notes?: string; unpay?: boolean }
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const { signupId, membershipType, notes, unpay } = body

  if (unpay) {
    await supabaseAdmin.from('membership_presale_paid').delete().eq('signup_id', signupId)
    return NextResponse.json({ ok: true, unpaid: true })
  }

  if (!signupId || !membershipType) {
    return NextResponse.json({ error: 'signupId and membershipType required.' }, { status: 400 })
  }

  // Upsert — insert or update if already exists
  const { error } = await supabaseAdmin
    .from('membership_presale_paid')
    .upsert(
      { signup_id: signupId, membership_type: membershipType, notes: notes ?? null, paid_at: new Date().toISOString() },
      { onConflict: 'signup_id' }
    )

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
