import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEarlybirdSignupNotification } from '@/lib/email'

const MAX_SPOTS = 50
const EMAIL_RE  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

// GET — public count for the ticker
export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('earlybird_signups')
    .select('*', { count: 'exact', head: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ count: count ?? 0, max: MAX_SPOTS })
}

// POST — submit signup
export async function POST(req: Request) {
  // Origin guard
  const origin  = req.headers.get('origin') ?? ''
  const host    = req.headers.get('host') ?? ''
  const allowed = [
    `https://${host}`,
    'https://skramblehouse.com',
    'https://www.skramblehouse.com',
    'https://skramblehouse-westside.vercel.app',
    'http://localhost:3000',
  ]
  if (origin && !allowed.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  // Honeypot
  if (sanitize(body.website)) {
    console.warn('[earlybird] honeypot triggered')
    return NextResponse.json({ success: true, count: 0 })
  }

  const firstName = sanitize(body.firstName)
  const lastName  = sanitize(body.lastName)
  const email     = sanitize(body.email).toLowerCase()
  const phone     = sanitize(body.phone)

  if (!firstName || !lastName)         return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  if (!phone)                          return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
  if (firstName.length > 60 || lastName.length > 60) return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  if (email.length > 254)              return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
  if (phone.length > 30)               return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })

  // Spot cap check
  const { count, error: countErr } = await supabaseAdmin
    .from('earlybird_signups')
    .select('*', { count: 'exact', head: true })

  if (countErr) {
    console.error('[earlybird] count error', countErr.message)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  if ((count ?? 0) >= MAX_SPOTS) {
    return NextResponse.json(
      { error: 'All 50 early bird spots have been claimed.', full: true },
      { status: 409 }
    )
  }

  // Duplicate email check
  const { data: existing } = await supabaseAdmin
    .from('earlybird_signups')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'This email is already signed up.' },
      { status: 409 }
    )
  }

  // Insert
  const { error: insertErr } = await supabaseAdmin
    .from('earlybird_signups')
    .insert({ first_name: firstName, last_name: lastName, email, phone })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json({ error: 'This email is already signed up.' }, { status: 409 })
    }
    console.error('[earlybird] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // Return fresh count
  const { count: newCount } = await supabaseAdmin
    .from('earlybird_signups')
    .select('*', { count: 'exact', head: true })

  const spotNumber = newCount ?? (count ?? 0) + 1

  sendEarlybirdSignupNotification({
    firstName, lastName, email, phone, spotNumber,
  }).catch(err => console.error('[earlybird] email error', (err as Error).message))

  return NextResponse.json({ success: true, count: newCount ?? spotNumber })
}
