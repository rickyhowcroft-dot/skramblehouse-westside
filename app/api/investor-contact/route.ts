import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { sendInvestorInquiryNotification } from '@/lib/email'

const LIMITS = { firstName: 60, lastName: 60, email: 254 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function sanitize(val: unknown): string {
  if (typeof val !== 'string') return ''
  return val.trim().replace(/[\x00-\x1F\x7F]/g, '').slice(0, 500)
}

export async function POST(req: Request) {
  const origin = req.headers.get('origin') ?? ''
  const host = req.headers.get('host') ?? ''
  const allowedOrigins = [
    `https://${host}`,
    'https://skramblehouse.com',
    'https://www.skramblehouse.com',
    'https://skramblehouse-westside.vercel.app',
    'http://localhost:3000',
  ]
  if (origin && !allowedOrigins.includes(origin)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let body: Record<string, unknown>
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  // Honeypot
  if (body.website) return NextResponse.json({ ok: true })

  const firstName = sanitize(body.firstName).slice(0, LIMITS.firstName)
  const lastName  = sanitize(body.lastName).slice(0, LIMITS.lastName)
  const email     = sanitize(body.email).slice(0, LIMITS.email)

  if (!firstName || !lastName) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })
  if (!EMAIL_RE.test(email))   return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })

  const { error: dbError } = await supabaseAdmin
    .from('investor_inquiries')
    .insert({ first_name: firstName, last_name: lastName, email })

  if (dbError) {
    console.error('[investor-contact] DB error:', dbError)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }

  try {
    await sendInvestorInquiryNotification({ firstName, lastName, email })
  } catch (e) {
    console.error('[investor-contact] Email error:', e)
    // Don't fail the request — the lead is saved in DB
  }

  return NextResponse.json({ ok: true })
}
