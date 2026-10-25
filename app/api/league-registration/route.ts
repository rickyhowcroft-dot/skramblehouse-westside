import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendLeagueRegistrationNotification, sendLeagueRegistrationConfirmation } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const VALID_NIGHTS  = new Set(['tuesday'])
const VALID_SLOTS   = new Set(['4pm', '6pm', '8pm'])
const VALID_SESSIONS = new Set(['session1'])

const SESSION_LABELS: Record<string, string> = {
  session1: 'Session 1 (Nov 10 – Dec 22)',
}
const NIGHT_LABELS: Record<string, string> = {
  tuesday: 'Tuesday Night Simulator League',
}

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
    console.warn('[league-reg] honeypot triggered')
    return NextResponse.json({ success: true })
  }

  // ── Validate fields ───────────────────────────────────────────────────────
  const firstName          = sanitize(body.firstName)
  const lastName           = sanitize(body.lastName)
  const email              = sanitize(body.email).toLowerCase()
  const phone              = sanitize(body.phone)
  const ghin               = sanitize(body.ghin)
  const estimatedHcp       = sanitize(body.estimatedHcp)
  const leagueNights       = sanitizeArr(body.leagueNights)
  const timeSlot           = sanitize(body.timeSlot)
  const sessions           = sanitizeArr(body.sessions)
  const teammateFirstName   = sanitize(body.teammateFirstName)
  const teammateLastName    = sanitize(body.teammateLastName)
  const teammateGhin        = sanitize(body.teammateGhin)
  const teammateEstimatedHcp = sanitize(body.teammateEstimatedHcp)

  // Required
  if (!firstName || !lastName)       return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  if (!email || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  if (!phone)                         return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
  if (leagueNights.length === 0)      return NextResponse.json({ error: 'Please select at least one league night.' }, { status: 400 })
  if (!timeSlot)                      return NextResponse.json({ error: 'Please select a time slot.' }, { status: 400 })
  if (sessions.length === 0)          return NextResponse.json({ error: 'Please select at least one session.' }, { status: 400 })

  // Allowlist values
  if (!leagueNights.every(n => VALID_NIGHTS.has(n)))  return NextResponse.json({ error: 'Invalid league night selection.' }, { status: 400 })
  if (!VALID_SLOTS.has(timeSlot))                      return NextResponse.json({ error: 'Invalid time slot.' }, { status: 400 })
  if (!sessions.every(s => VALID_SESSIONS.has(s)))     return NextResponse.json({ error: 'Invalid session selection.' }, { status: 400 })

  // Lengths
  if (firstName.length > 60 || lastName.length > 60)  return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  if (email.length > 254)                              return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
  if (phone.length > 30)                               return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })

  // ── Insert ────────────────────────────────────────────────────────────────
  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from('league_registrations')
    .insert({
      first_name:            firstName,
      last_name:             lastName,
      email,
      phone,
      ghin_number:           ghin || null,
      estimated_handicap:    estimatedHcp || null,
      league_nights:         leagueNights,
      time_slot:             timeSlot,
      sessions,
      teammate_first_name:    teammateFirstName || null,
      teammate_last_name:     teammateLastName || null,
      teammate_ghin_number:   teammateGhin || null,
      teammate_estimated_hcp: teammateEstimatedHcp || null,
    })
    .select('id')
    .single()

  if (insertErr) {
    console.error('[league-reg] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // ── Email (non-blocking) ──────────────────────────────────────────────────
  const emailPayload = {
    firstName,
    lastName,
    email,
    phone,
    ghin:              ghin || null,
    estimatedHcp:      estimatedHcp || null,
    leagueNights:      leagueNights.map(n => NIGHT_LABELS[n] ?? n),
    timeSlot,
    sessions:          sessions.map(s => SESSION_LABELS[s] ?? s),
    teammateFirstName:    teammateFirstName || null,
    teammateLastName:     teammateLastName || null,
    teammateGhin:         teammateGhin || null,
    teammateEstimatedHcp: teammateEstimatedHcp || null,
    registrationId:       inserted?.id ?? '',
  }
  sendLeagueRegistrationNotification(emailPayload)
    .catch(err => console.error('[league-reg] admin email error', (err as Error).message))
  sendLeagueRegistrationConfirmation(emailPayload)
    .catch(err => console.error('[league-reg] confirmation email error', (err as Error).message))

  return NextResponse.json({ success: true })
}
