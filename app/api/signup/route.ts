import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSignupNotification } from '@/lib/email'

const MAX_SPOTS = 100

// Strict field length limits
const LIMITS = {
  firstName: 60,
  lastName: 60,
  email: 254, // RFC 5321 max
  presaleCode: 50,
}

// Basic email format check — catches typos without being overly strict
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val
    .trim()
    .replace(/[\x00-\x1F\x7F]/g, '') // strip control characters
    .slice(0, 500) // hard upper limit before field-level checks
}

export async function POST(req: Request) {
  // ── Origin check ──────────────────────────────────────────────────────────
  // Accept requests from the expected host and localhost in dev.
  const origin = req.headers.get('origin') ?? ''
  const host = req.headers.get('host') ?? ''
  const allowedOrigins = [
    `https://${host}`,
    'https://skramblehouse-westside.vercel.app',
    'https://skramblehouse.com',
    'http://localhost:3000',
  ]
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // ── Parse body ─────────────────────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // ── Honeypot ───────────────────────────────────────────────────────────────
  // Hidden field that real users never fill in. Bots usually do.
  // Silently succeed to avoid leaking the check exists.
  if (sanitize(body.website)) {
    console.warn('[signup] honeypot triggered')
    return NextResponse.json({ success: true, count: 0 }) // fake success
  }

  // ── Input validation ───────────────────────────────────────────────────────
  const firstName   = sanitize(body.firstName)
  const lastName    = sanitize(body.lastName)
  const email       = sanitize(body.email).toLowerCase()
  const presaleCode = sanitize(body.presaleCode)

  if (!firstName || !lastName || !email) {
    return NextResponse.json(
      { error: 'First name, last name, and email are required.' },
      { status: 400 }
    )
  }
  if (firstName.length > LIMITS.firstName || lastName.length > LIMITS.lastName) {
    return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  }
  if (email.length > LIMITS.email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
  }
  if (presaleCode.length > LIMITS.presaleCode) {
    return NextResponse.json({ error: 'Pre-sale code is too long.' }, { status: 400 })
  }

  // ── Spot count check ───────────────────────────────────────────────────────
  const { count, error: countErr } = await supabaseAdmin
    .from('presale_signups')
    .select('*', { count: 'exact', head: true })

  if (countErr) {
    console.error('[signup] count error', countErr.message)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  if ((count ?? 0) >= MAX_SPOTS) {
    return NextResponse.json(
      { error: 'All 100 pre-sale spots have been claimed.', full: true },
      { status: 409 }
    )
  }

  // ── Duplicate email check ──────────────────────────────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('presale_signups')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      { error: 'This email is already on the pre-sale list.' },
      { status: 409 }
    )
  }

  // ── Insert ─────────────────────────────────────────────────────────────────
  const { error: insertErr } = await supabaseAdmin.from('presale_signups').insert({
    first_name:   firstName,
    last_name:    lastName,
    email,
    presale_code: presaleCode || null,
  })

  if (insertErr) {
    // Unique violation (race condition): treat as duplicate
    if (insertErr.code === '23505') {
      return NextResponse.json(
        { error: 'This email is already on the pre-sale list.' },
        { status: 409 }
      )
    }
    console.error('[signup] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // ── Get updated count ──────────────────────────────────────────────────────
  const { count: newCount } = await supabaseAdmin
    .from('presale_signups')
    .select('*', { count: 'exact', head: true })

  const spotNumber = newCount ?? (count ?? 0) + 1

  // ── Email notification (non-blocking) ─────────────────────────────────────
  sendSignupNotification({
    firstName,
    lastName,
    email,
    presaleCode: presaleCode || null,
    spotNumber,
  }).catch(err => console.error('[signup] email error', (err as Error).message))

  return NextResponse.json({ success: true, count: newCount ?? spotNumber })
}
