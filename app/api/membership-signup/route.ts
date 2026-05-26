import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendMembershipSignupNotification } from '@/lib/email'

const VALID_LOCATIONS = ['Horsham', 'KOP', 'Rochester'] as const
const VALID_TYPES     = ['Full Year', '5 Month'] as const
const EMAIL_RE        = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE        = /^[\d\s\-\(\)\+\.]{7,20}$/

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

export async function POST(req: Request) {
  // Origin check
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
    console.warn('[membership-signup] honeypot triggered')
    return NextResponse.json({ success: true })
  }

  const firstName      = sanitize(body.firstName)
  const lastName       = sanitize(body.lastName)
  const email          = sanitize(body.email).toLowerCase()
  const phone          = sanitize(body.phone)
  const location       = sanitize(body.location)
  const membershipType  = sanitize(body.membershipType)
  const planType        = sanitize(body.planType)
  const paymentMethod   = sanitize(body.paymentMethod)

  if (!firstName || !lastName || !email || !phone || !location || !membershipType || !planType || !paymentMethod) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (firstName.length > 60 || lastName.length > 60) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  }
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (!PHONE_RE.test(phone)) {
    return NextResponse.json({ error: 'Please enter a valid phone number.' }, { status: 400 })
  }
  if (!(VALID_LOCATIONS as readonly string[]).includes(location)) {
    return NextResponse.json({ error: 'Please select a valid location.' }, { status: 400 })
  }
  if (!(VALID_TYPES as readonly string[]).includes(membershipType)) {
    return NextResponse.json({ error: 'Please select a valid membership type.' }, { status: 400 })
  }

  // Duplicate check
  const { data: existing } = await supabaseAdmin
    .from('membership_presale_signups')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'This email is already registered for the pre-sale.' },
      { status: 409 }
    )
  }

  // Insert
  const { error: insertErr } = await supabaseAdmin
    .from('membership_presale_signups')
    .insert({ first_name: firstName, last_name: lastName, email, phone, location, membership_type: membershipType, plan_type: planType, payment_method: paymentMethod })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json({ error: 'This email is already registered for the pre-sale.' }, { status: 409 })
    }
    console.error('[membership-signup] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // Get signup number
  const { count } = await supabaseAdmin
    .from('membership_presale_signups')
    .select('*', { count: 'exact', head: true })

  const signupNumber = count ?? 1

  // Email notification (non-blocking)
  sendMembershipSignupNotification({
    firstName, lastName, email, phone, location, membershipType, planType, paymentMethod, signupNumber,
  }).catch(err => console.error('[membership-signup] email error', (err as Error).message))

  return NextResponse.json({ success: true, signupNumber })
}
