import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendSignupNotification } from '@/lib/email'

const MAX_SPOTS = 100

export async function POST(req: Request) {
  const { firstName, lastName, email, presaleCode } = await req.json()

  if (!firstName?.trim() || !lastName?.trim() || !email?.trim()) {
    return NextResponse.json({ error: 'First name, last name, and email are required.' }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Check current count
  const { count, error: countErr } = await supabaseAdmin
    .from('presale_signups')
    .select('*', { count: 'exact', head: true })

  if (countErr) {
    console.error('count error', countErr)
    return NextResponse.json({ error: 'Server error. Please try again.' }, { status: 500 })
  }

  if ((count ?? 0) >= MAX_SPOTS) {
    return NextResponse.json({ error: 'Sorry — all 100 pre-sale spots have been claimed!', full: true }, { status: 409 })
  }

  // Duplicate check
  const { data: existing } = await supabaseAdmin
    .from('presale_signups')
    .select('id')
    .eq('email', normalizedEmail)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'This email is already on the pre-sale list.' }, { status: 409 })
  }

  // Insert
  const { error: insertErr } = await supabaseAdmin.from('presale_signups').insert({
    first_name: firstName.trim(),
    last_name: lastName.trim(),
    email: normalizedEmail,
    presale_code: presaleCode?.trim() || null,
  })

  if (insertErr) {
    console.error('insert error', insertErr)
    return NextResponse.json({ error: 'Failed to save your info. Please try again.' }, { status: 500 })
  }

  // Get new count
  const { count: newCount } = await supabaseAdmin
    .from('presale_signups')
    .select('*', { count: 'exact', head: true })

  const spotNumber = newCount ?? (count ?? 0) + 1

  // Send notification email — non-blocking
  sendSignupNotification({
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    email: normalizedEmail,
    presaleCode: presaleCode?.trim() || null,
    spotNumber,
  }).catch(err => console.error('email error', err))

  return NextResponse.json({ success: true, count: newCount ?? spotNumber })
}
