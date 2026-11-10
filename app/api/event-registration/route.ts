import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendEventRegistrationNotification, sendEventRegistrationConfirmation } from '@/lib/email'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const VALID_EVENTS    = new Set(['skramble-open', 'baller-league', 'skramble-tour'])
const VALID_LOCATIONS = new Set(['west-side', 'horsham', 'kop'])
const VALID_DIVISIONS = new Set(['hcp-20-plus', 'hcp-under-20'])
const TEAM_EVENTS     = new Set(['opening-weekend'])

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
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
    console.warn('[event-reg] honeypot triggered')
    return NextResponse.json({ success: true })
  }

  // ── Sanitize fields ───────────────────────────────────────────────────────
  const eventSlug            = sanitize(body.eventSlug)
  const location             = sanitize(body.location)
  const firstName            = sanitize(body.firstName)
  const lastName             = sanitize(body.lastName)
  const email                = sanitize(body.email).toLowerCase()
  const phone                = sanitize(body.phone)
  const ghin                 = sanitize(body.ghin)
  const estimatedHcp         = sanitize(body.estimatedHcp)
  const division             = sanitize(body.division)
  const teammateFirstName    = sanitize(body.teammateFirstName)
  const teammateLastName     = sanitize(body.teammateLastName)
  const teammateGhin         = sanitize(body.teammateGhin)
  const teammateEstimatedHcp = sanitize(body.teammateEstimatedHcp)

  // ── Required field validation ─────────────────────────────────────────────
  if (!VALID_EVENTS.has(eventSlug))     return NextResponse.json({ error: 'Invalid event.' }, { status: 400 })
  if (!VALID_LOCATIONS.has(location))   return NextResponse.json({ error: 'Please select a location.' }, { status: 400 })
  if (!firstName || !lastName)          return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  if (!email || !EMAIL_RE.test(email))  return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  if (!phone)                           return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
  if (!ghin && !estimatedHcp)           return NextResponse.json({ error: 'Please enter your GHIN # or Estimated Handicap Index.' }, { status: 400 })

  // Team-event-specific validation
  if (TEAM_EVENTS.has(eventSlug)) {
    if (!division || !VALID_DIVISIONS.has(division)) {
      return NextResponse.json({ error: 'Please select a division.' }, { status: 400 })
    }
  }

  // Length guards
  if (firstName.length > 60 || lastName.length > 60) return NextResponse.json({ error: 'Name is too long.' }, { status: 400 })
  if (email.length > 254)                              return NextResponse.json({ error: 'Email is too long.' }, { status: 400 })
  if (phone.length > 30)                               return NextResponse.json({ error: 'Phone number is too long.' }, { status: 400 })

  // ── Insert ────────────────────────────────────────────────────────────────
  const { data: inserted, error: insertErr } = await supabaseAdmin
    .from('event_registrations')
    .insert({
      event_slug:              eventSlug,
      location,
      first_name:              firstName,
      last_name:               lastName,
      email,
      phone,
      ghin_number:             ghin || null,
      estimated_handicap:      estimatedHcp || null,
      division:                division || null,
      teammate_first_name:     teammateFirstName || null,
      teammate_last_name:      teammateLastName || null,
      teammate_ghin_number:    teammateGhin || null,
      teammate_estimated_hcp:  teammateEstimatedHcp || null,
    })
    .select('id')
    .single()

  if (insertErr) {
    console.error('[event-reg] insert error', insertErr.message)
    return NextResponse.json({ error: 'Failed to save. Please try again.' }, { status: 500 })
  }

  // ── Email (non-blocking) ──────────────────────────────────────────────────
  const emailPayload = {
    eventSlug,
    location,
    firstName,
    lastName,
    email,
    phone,
    ghin:                 ghin || null,
    estimatedHcp:         estimatedHcp || null,
    division:             division || null,
    teammateFirstName:    teammateFirstName || null,
    teammateLastName:     teammateLastName || null,
    teammateGhin:         teammateGhin || null,
    teammateEstimatedHcp: teammateEstimatedHcp || null,
    registrationId:       inserted?.id ?? '',
  }
  sendEventRegistrationNotification(emailPayload)
    .catch(err => console.error('[event-reg] notification error', (err as Error).message))
  sendEventRegistrationConfirmation(emailPayload)
    .catch(err => console.error('[event-reg] confirmation error', (err as Error).message))

  return NextResponse.json({ success: true })
}
