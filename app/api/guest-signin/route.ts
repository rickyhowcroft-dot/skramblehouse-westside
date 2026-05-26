import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendGuestCapNotification } from '@/lib/email'

const GUEST_CAP  = 14
const VALID_LOCS = ['Horsham', 'KOP', 'Rochester'] as const
const EMAIL_RE   = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

export async function POST(req: Request) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const location   = sanitize(body.location)
  const memberFirst = sanitize(body.memberFirst)
  const memberLast  = sanitize(body.memberLast)
  const guestFirst  = sanitize(body.guestFirst)
  const guestLast   = sanitize(body.guestLast)
  const guestEmail  = sanitize(body.guestEmail).toLowerCase()

  if (!VALID_LOCS.includes(location as typeof VALID_LOCS[number])) {
    return NextResponse.json({ error: 'Invalid location.' }, { status: 400 })
  }
  if (!memberFirst || !memberLast || !guestFirst || !guestLast || !guestEmail) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }
  if (!EMAIL_RE.test(guestEmail)) {
    return NextResponse.json({ error: 'Invalid guest email address.' }, { status: 400 })
  }

  // Cap check — track by member first + last name (case-insensitive)
  const { count, error: countErr } = await supabaseAdmin
    .from('guest_signins')
    .select('*', { count: 'exact', head: true })
    .ilike('member_first_name', memberFirst)
    .ilike('member_last_name', memberLast)

  if (countErr) {
    console.error('[guest-signin] count error', countErr.message)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  const currentCount = count ?? 0

  if (currentCount >= GUEST_CAP) {
    return NextResponse.json({
      error: `You've reached your ${GUEST_CAP}-guest limit. Please contact Skramblehouse for assistance.`,
      capped: true,
    }, { status: 422 })
  }

  // Insert
  const { error: insertErr } = await supabaseAdmin
    .from('guest_signins')
    .insert({
      location,
      member_first_name: memberFirst,
      member_last_name: memberLast,
      member_email: null,
      guest_first_name: guestFirst,
      guest_last_name: guestLast,
      guest_email: guestEmail,
      guest_phone: null,
    })

  if (insertErr) {
    console.error('[guest-signin] insert error', insertErr.message)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  const newCount = currentCount + 1

  if (newCount >= GUEST_CAP) {
    sendGuestCapNotification({
      memberFirst, memberLast, memberEmail: '', location, totalGuests: newCount,
    }).catch(err => console.error('[guest-signin] cap email error', (err as Error).message))
  }

  return NextResponse.json({ success: true, guestsUsed: newCount, guestsRemaining: GUEST_CAP - newCount })
}
