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
    to: process.env.NOTIFY_EMAIL,
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
