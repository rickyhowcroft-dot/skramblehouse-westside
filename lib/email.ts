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
  signupNumber: number
}

export async function sendMembershipSignupNotification(payload: MembershipSignupPayload) {
  if (!process.env.RESEND_API_KEY || !process.env.NOTIFY_EMAIL) {
    console.warn('[email] RESEND_API_KEY or NOTIFY_EMAIL not set — skipping notification')
    return
  }

  const { firstName, lastName, email, phone, location, membershipType, signupNumber } = payload
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
