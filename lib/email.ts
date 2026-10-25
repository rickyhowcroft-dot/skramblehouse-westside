import 'server-only'
import { Resend } from 'resend'

interface SignupPayload {
  firstName: string
  lastName: string
  email: string
  presaleCode?: string | null
  spotNumber: number
}

export async function sendSignupNotification(payload: SignupPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification')
    return
  }

  const { firstName, lastName, email, presaleCode, spotNumber } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `🎉 Pre-Sale Signup #${spotNumber} — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px">New Pre-Sale Signup</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Spot</td><td style="padding:8px 0;font-weight:600">#${spotNumber} / 100</td></tr>
          <tr><td style="padding:8px 0;color:#666">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Pre-Sale Code</td><td style="padding:8px 0">${presaleCode ?? '(none)'}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse West Side Pre-Sale</p>
      </div>
    `,
  })
}

interface MembershipSignupPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  membershipType: string
  planType: string
  paymentMethod: string
  signupNumber: number
}

export async function sendMembershipSignupNotification(payload: MembershipSignupPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification')
    return
  }

  const { firstName, lastName, email, phone, location, membershipType, planType, paymentMethod, signupNumber } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `🏌️ Membership Pre-Sale Signup #${signupNumber} — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px">New Membership Pre-Sale Signup</h2>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:160px">Signup #</td><td style="padding:8px 0;font-weight:600">#${signupNumber}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Location</td><td style="padding:8px 0">${location}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Membership Type</td><td style="padding:8px 0">${membershipType}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Plan</td><td style="padding:8px 0"><strong>${planType}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Payment Method</td><td style="padding:8px 0">${paymentMethod}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse 2026–2027 Membership Pre-Sale</p>
      </div>
    `,
  })
}

interface InvestorInquiryPayload {
  firstName: string
  lastName: string
  email: string
}

export async function sendInvestorInquiryNotification(payload: InvestorInquiryPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping investor notification')
    return
  }

  const { firstName, lastName, email } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `💰 Investor Inquiry — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 8px">New Investor Inquiry</h2>
        <p style="color:#666;margin:0 0 20px;font-size:14px">Via skramblehouse.com/investors</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:100px">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse West Side Investor Page</p>
      </div>
    `,
  })
}

// ── League Registration Notification ────────────────────────────────────────
interface LeagueRegistrationPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  ghin: string | null
  estimatedHcp: string | null
  leagueNights: string[]
  timeSlot: string
  sessions: string[]
  teammateFirstName: string | null
  teammateLastName: string | null
  registrationId: string
}

export async function sendLeagueRegistrationNotification(payload: LeagueRegistrationPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping league registration notification')
    return
  }

  const { firstName, lastName, email, phone, ghin, estimatedHcp, leagueNights, timeSlot, sessions, teammateFirstName, teammateLastName } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)
  const recipients = (process.env.LEAGUE_NOTIFY_EMAIL ?? process.env.NOTIFY_EMAIL ?? '')
    .split(',').map(e => e.trim()).filter(Boolean)
  const teammateName = (teammateFirstName || teammateLastName)
    ? `${teammateFirstName ?? ''} ${teammateLastName ?? ''}`.trim()
    : '—'

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: recipients,
    subject: `⛳ League Registration — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:520px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px">New League Registration</h2>
        <p style="margin:0 0 20px;color:#666;font-size:14px">skramblehouse.com/league-registration</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:180px;vertical-align:top">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Teammate</td><td style="padding:8px 0;font-weight:600">${teammateName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Phone</td><td style="padding:8px 0">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">GHIN #</td><td style="padding:8px 0">${ghin ?? '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Est. Handicap</td><td style="padding:8px 0">${estimatedHcp ?? '—'}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">League Nights</td><td style="padding:8px 0;font-weight:600">${leagueNights.join('<br/>')}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Time Slot</td><td style="padding:8px 0;font-weight:600">${timeSlot}</td></tr>
          <tr><td style="padding:8px 0;color:#666;vertical-align:top">Sessions</td><td style="padding:8px 0;font-weight:600">${sessions.join('<br/>')}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse League Registration</p>
      </div>
    `,
  })
}

export async function sendLeagueRegistrationConfirmation(payload: LeagueRegistrationPayload) {
  if (!process.env.RESEND_API_KEY) {
    console.warn('[email] RESEND_API_KEY not set — skipping league registration confirmation')
    return
  }

  const { firstName, lastName, email, timeSlot, teammateFirstName, teammateLastName } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)
  const registrantName = `${firstName} ${lastName}`
  const teammateName   = (teammateFirstName || teammateLastName)
    ? `${teammateFirstName ?? ''} ${teammateLastName ?? ''}`.trim()
    : '—'
  const TEE_TIME_LABELS: Record<string, string> = { '4pm': '4:00 PM', '6pm': '6:00 PM', '8pm': '8:00 PM' }
  const teeTime = TEE_TIME_LABELS[timeSlot] ?? timeSlot

  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: email,
    subject: `Registration Confirmed — Tuesday Night League at Skramble House of Golf ROC`,
    html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:Arial,Helvetica,sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:32px 16px">
    <tr><td align="center">
      <table width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 2px 16px rgba(0,0,0,0.08)">

        <!-- Header -->
        <tr>
          <td style="background:#111827;padding:28px 36px;text-align:center">
            <p style="margin:0;color:#9ca3af;font-size:12px;letter-spacing:0.12em;text-transform:uppercase">Skramble House of Golf ROC</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:800">Tuesday Night League</h1>
            <p style="margin:6px 0 0;color:#6b7280;font-size:13px">2026–2027 Winter League · Session I</p>
          </td>
        </tr>

        <!-- Intro -->
        <tr>
          <td style="padding:32px 36px 0">
            <p style="margin:0 0 12px;font-size:15px;color:#111827">Your registration is confirmed for the Tuesday Night League at Skramble House of Golf ROC!</p>
            <p style="margin:0;font-size:15px;color:#374151;line-height:1.6">Welcome to the <strong>Skramble House of Golf ROC Tuesday Night League!</strong> Your team is officially registered for Session I of our 2026–2027 Winter League.</p>
          </td>
        </tr>

        <!-- League details -->
        <tr>
          <td style="padding:24px 36px 0">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px">
              <tr><td style="padding:12px 18px;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;border-bottom:1px solid #e5e7eb">League Details</td></tr>
              <tr><td style="padding:12px 18px 4px;font-size:14px;font-weight:700;color:#111827">Tuesday Night — Format League</td></tr>
              <tr><td style="padding:0 18px 12px;font-size:14px;color:#374151">2-Person Teams &nbsp;·&nbsp; 9 Holes Every Week &nbsp;·&nbsp; Playoff Round 18 Holes</td></tr>
            </table>
          </td>
        </tr>

        <!-- Registration -->
        <tr>
          <td style="padding:16px 36px 0">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:10px">
              <tr><td colspan="2" style="padding:12px 18px;color:#1d4ed8;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;border-bottom:1px solid #bfdbfe">Your Registration</td></tr>
              <tr>
                <td style="padding:10px 18px 4px;font-size:13px;color:#6b7280;width:140px">Name 1</td>
                <td style="padding:10px 18px 4px;font-size:14px;font-weight:700;color:#111827">${registrantName}</td>
              </tr>
              <tr>
                <td style="padding:4px 18px;font-size:13px;color:#6b7280">Name 2</td>
                <td style="padding:4px 18px;font-size:14px;font-weight:700;color:#111827">${teammateName}</td>
              </tr>
              <tr>
                <td style="padding:4px 18px 14px;font-size:13px;color:#6b7280">Weekly Tee Time</td>
                <td style="padding:4px 18px 14px;font-size:14px;font-weight:700;color:#1d4ed8">${teeTime}</td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Tee time note -->
        <tr>
          <td style="padding:16px 36px 0">
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.65">Your tee time is <strong>fixed for the regular season</strong>, so you'll play at the same time each Tuesday. In the event you need to request a time change or move the time slot for one week we can accommodate! Please email Brandon Gingher at <a href="mailto:skramblerocbrandon@gmail.com" style="color:#1d4ed8;text-decoration:none">skramblerocbrandon@gmail.com</a> for any changes.</p>
          </td>
        </tr>

        <!-- Schedule -->
        <tr>
          <td style="padding:20px 36px 0">
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;border-collapse:collapse">
              <tr><td colspan="2" style="padding:12px 18px;color:#6b7280;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;border-bottom:1px solid #e5e7eb">Session I Schedule</td></tr>
              <tr><td style="padding:9px 18px 4px;font-size:13px;color:#6b7280;width:80px">Week 1</td><td style="padding:9px 18px 4px;font-size:14px;font-weight:600;color:#111827">November 10</td></tr>
              <tr><td style="padding:4px 18px;font-size:13px;color:#6b7280">Week 2</td><td style="padding:4px 18px;font-size:14px;font-weight:600;color:#111827">November 17</td></tr>
              <tr><td style="padding:4px 18px;font-size:13px;color:#6b7280">Week 3</td><td style="padding:4px 18px;font-size:14px;font-weight:600;color:#111827">November 24</td></tr>
              <tr><td style="padding:4px 18px;font-size:13px;color:#6b7280">Week 4</td><td style="padding:4px 18px;font-size:14px;font-weight:600;color:#111827">December 1</td></tr>
              <tr><td style="padding:4px 18px;font-size:13px;color:#6b7280">Week 5</td><td style="padding:4px 18px;font-size:14px;font-weight:600;color:#111827">December 8</td></tr>
              <tr><td style="padding:4px 18px;font-size:13px;color:#6b7280">Week 6</td><td style="padding:4px 18px;font-size:14px;font-weight:600;color:#111827">December 15</td></tr>
              <tr style="background:#111827">
                <td style="padding:10px 18px;font-size:13px;color:#9ca3af;border-radius:0 0 0 9px">Playoffs</td>
                <td style="padding:10px 18px;font-size:14px;font-weight:700;color:#ffffff">December 22 — 18 Holes &nbsp;(6pm &amp; 8pm Tee Times)</td>
              </tr>
            </table>
            <p style="margin:10px 0 0;font-size:13px;color:#6b7280">Regular-season rounds are <strong>9 holes</strong>. The playoff round will be <strong>18 holes</strong>.</p>
          </td>
        </tr>

        <!-- What's next -->
        <tr>
          <td style="padding:24px 36px 0">
            <p style="margin:0 0 8px;font-size:11px;font-weight:700;letter-spacing:0.10em;text-transform:uppercase;color:#111827">What's Next?</p>
            <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.65">We'll use <strong>Golf Genius for live scoring and league results</strong>, so you'll be able to follow the competition throughout the season.</p>
            <p style="margin:0 0 12px;font-size:14px;color:#374151;line-height:1.65">We'll send additional information regarding weekly formats, league standings, and playoff details as we get closer to the start of the session.</p>
            <p style="margin:0;font-size:14px;color:#374151;line-height:1.65">In the meantime, get your partner ready and get ready to <strong>play a different game every week.</strong></p>
          </td>
        </tr>

        <!-- Sign-off -->
        <tr>
          <td style="padding:24px 36px 36px">
            <p style="margin:0 0 16px;font-size:14px;color:#374151">We're excited to have you competing with us this winter!</p>
            <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#111827">Skramble House of Golf ROC</p>
            <p style="margin:0 0 4px;font-size:13px;color:#6b7280">24/7 Indoor Golf &nbsp;•&nbsp; Practice &nbsp;•&nbsp; Competition &nbsp;•&nbsp; Community</p>
            <p style="margin:0"><a href="https://www.skrambleroc.com" style="font-size:13px;color:#1d4ed8;text-decoration:none">www.skrambleroc.com</a></p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

// ── Philly Signup Notification ─────────────────────────────────────────────
interface PhillySignupPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
}

export async function sendPhillySignupNotification(payload: PhillySignupPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping philly notification')
    return
  }
  const { firstName, lastName, email, phone, location } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `🏌️ Philly Sign-Up (${location}) — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px">New Philly Sign-Up</h2>
        <p style="margin:0 0 20px;color:#666;font-size:14px">skramblehouse.com/philly — 10% Off November</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:120px">Location</td><td style="padding:8px 0;font-weight:700">${location}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse Philly — 10% Off New Member Special (Nov 1–30)</p>
      </div>
    `,
  })
}

// ── Early Bird Signup Notification ─────────────────────────────────────────
interface EarlybirdSignupPayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  spotNumber: number
}

export async function sendEarlybirdSignupNotification(payload: EarlybirdSignupPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping earlybird notification')
    return
  }
  const { firstName, lastName, email, phone, spotNumber } = payload
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `🏌️ Early Bird Sign-Up #${spotNumber} — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 4px">New Early Bird Sign-Up</h2>
        <p style="margin:0 0 20px;color:#666;font-size:14px">skramblehouse.com/westside/earlybird</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Spot</td><td style="padding:8px 0;font-weight:600">#${spotNumber} / 50</td></tr>
          <tr><td style="padding:8px 0;color:#666">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse West Side Early Bird — $400 / 15 passes + membership credit</p>
      </div>
    `,
  })
}

// ── Guest Cap Notification ────────────────────────────────────────────────────
interface GuestCapPayload {
  memberFirst: string
  memberLast: string
  memberEmail: string
  location: string
  totalGuests: number
}

export async function sendGuestCapNotification(payload: GuestCapPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification')
    return
  }
  const { memberFirst, memberLast, memberEmail, location, totalGuests } = payload
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `⚠️ Guest Cap Reached — ${memberFirst} ${memberLast} (${location})`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px;color:#1D4ED8">Guest Cap Reached</h2>
        <p style="margin:0 0 16px;color:#374151">A member has used all ${totalGuests} of their allotted guest passes.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Member</td><td style="padding:8px 0"><strong>${memberFirst} ${memberLast}</strong></td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${memberEmail}">${memberEmail}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Location</td><td style="padding:8px 0">${location}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Total Guests Used</td><td style="padding:8px 0"><strong>${totalGuests} / 14</strong></td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse Guest Sign-In</p>
      </div>
    `,
  })
}

interface RocExperiencePayload {
  firstName: string
  lastName: string
  email: string
  phone: string
  interests: string[]
  signupId: string
}

const ROC_INTEREST_LABELS: Record<string, string> = {
  coaching: 'Get better / Coaching',
  leagues:  'Leagues / Events',
  access:   '24/7/365 Access',
  fun:      'Have Fun',
}

export async function sendRocExperienceNotification(payload: RocExperiencePayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification')
    return
  }
  const { firstName, lastName, email, phone, interests, signupId } = payload
  const { Resend } = await import('resend')
  const resend = new Resend(process.env.RESEND_API_KEY)
  const interestsList = interests.map(i => ROC_INTEREST_LABELS[i] ?? i).join(', ') || 'None selected'
  await resend.emails.send({
    from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
    to: (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean),
    subject: `⛳ ROC Experience Signup — ${firstName} ${lastName}`,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:24px">
        <h2 style="margin:0 0 16px;color:#1D4ED8">New ROC Experience Signup</h2>
        <p style="margin:0 0 16px;color:#374151">Someone signed up for free 72-hour access at Skramblehouse Rochester.</p>
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:8px 0;color:#666;width:140px">Name</td><td style="padding:8px 0;font-weight:600">${firstName} ${lastName}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Email</td><td style="padding:8px 0"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:8px 0;color:#666">Phone</td><td style="padding:8px 0">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#666">Interests</td><td style="padding:8px 0">${interestsList}</td></tr>
          <tr><td style="padding:8px 0;color:#666">ID</td><td style="padding:8px 0;font-size:12px;color:#999">${signupId}</td></tr>
        </table>
        <p style="margin-top:24px;color:#999;font-size:12px">Skramblehouse Rochester · Free 72-Hour Access</p>
      </div>
    `,
  })
}
