import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendFloaterSignupNotification, sendFloaterSignupConfirmation } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const LIMIT    = 50

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

export async function POST(req: Request) {
  // ── Origin guard ──────────────────────────────────────────────────────────
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

  // ── Honeypot ──────────────────────────────────────────────────────────────
  if (sanitize(body.website)) {
    console.warn('[floater] honeypot triggered')
    return NextResponse.json({ success: true })
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

  // ── Check sold out ────────────────────────────────────────────────────────
  const { count: paidCount } = await supabaseAdmin
    .from('floater_signups')
    .select('*', { count: 'exact', head: true })
    .eq('paid', true)

  if ((paidCount ?? 0) >= LIMIT) {
    return NextResponse.json({ error: 'Sorry, this offer is sold out.' }, { status: 409 })
  }

  // ── Duplicate check ───────────────────────────────────────────────────────
  const { data: existing } = await supabaseAdmin
    .from('floater_signups')
    .select('id')
    .eq('email', email)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'This email is already signed up.' }, { status: 409 })
  }

  // ── Insert ────────────────────────────────────────────────────────────────
  const { error: insertErr } = await supabaseAdmin
    .from('floater_signups')
    .insert({ first_name: firstName, last_name: lastName, email, phone })

  if (insertErr) {
    if (insertErr.code === '23505') {
      return NextResponse.json({ error: 'This email is already signed up.' }, { status: 409 })
    }
    console.error('[floater] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // ── Emails (non-blocking) ─────────────────────────────────────────────────
  const payload = { firstName, lastName, email, phone }
  sendFloaterSignupNotification(payload)
    .catch(err => console.error('[floater] notification error', (err as Error).message))
  sendFloaterSignupConfirmation(payload)
    .catch(err => console.error('[floater] confirmation error', (err as Error).message))

  return NextResponse.json({ success: true })
}
