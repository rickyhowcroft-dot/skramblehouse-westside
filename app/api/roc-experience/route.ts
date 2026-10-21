import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendRocExperienceNotification } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const VALID_INTERESTS = new Set(['coaching', 'leagues', 'access', 'fun'])

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

function sanitizeArr(val: unknown): string[] {
  if (!Array.isArray(val)) return []
  return val.map(v => sanitize(v)).filter(Boolean)
}

export async function POST(req: Request) {
  // ── Origin check ──────────────────────────────────────────────────────────
  const origin = req.headers.get('origin') ?? ''
  const host   = req.headers.get('host') ?? ''
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

  // ── Parse ─────────────────────────────────────────────────────────────────
  let body: Record<string, unknown>
  try { body = await req.json() }
  catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  // ── Honeypot ──────────────────────────────────────────────────────────────
  if (sanitize(body.website)) {
    console.warn('[roc-experience] honeypot triggered')
    return NextResponse.json({ success: true })
  }

  // ── Validate fields ───────────────────────────────────────────────────────
  const firstName = sanitize(body.firstName)
  const lastName  = sanitize(body.lastName)
  const email     = sanitize(body.email).toLowerCase()
  const phone     = sanitize(body.phone)
  const interests = sanitizeArr(body.interests)

  // Required
  if (!firstName || !lastName)         return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  if (!phone)                          return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })

  // Lengths
  if (firstName.length > 60 || lastName.length > 60) return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  if (email.length > 254)                             return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
  if (phone.length > 30)                              return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })

  // Allowlist interests (optional field — just filter unknowns)
  const safeInterests = interests.filter(i => VALID_INTERESTS.has(i))

  // ── Insert ────────────────────────────────────────────────────────────────
  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from('roc_experience_signups')
    .insert({
      first_name: firstName,
      last_name:  lastName,
      email,
      phone,
      interests:  safeInterests,
    })
    .select('id')
    .single()

  if (insertErr) {
    console.error('[roc-experience] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // ── Email (non-blocking) ──────────────────────────────────────────────────
  sendRocExperienceNotification({
    firstName,
    lastName,
    email,
    phone,
    interests: safeInterests,
    signupId:  inserted?.id ?? '',
  }).catch(err => console.error('[roc-experience] email error', (err as Error).message))

  return NextResponse.json({ success: true })
}
