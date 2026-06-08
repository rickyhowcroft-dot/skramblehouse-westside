import 'server-only'
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { Resend } from 'resend'

function isAdmin(req: NextRequest) {
  const key = req.headers.get('x-admin-key') ?? ''
  const env = process.env.MEMBERSHIP_ADMIN_KEY?.trim() ?? ''
  return env.length > 0 && key === env
}

function escapeCsv(val: string | null | undefined): string {
  if (val == null) return ''
  const str = String(val)
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function fmtDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/New_York',
  })
}

// POST /api/membership-admin/export
// — Generates CSV, downloads to browser, sends email with attachment
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // ── Fetch all signups ──────────────────────────────────────────────────────
  const { data: signups, error } = await supabaseAdmin
    .from('membership_presale_signups')
    .select('id, first_name, last_name, email, phone, location, membership_type, plan_type, payment_method, created_at')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: paid } = await supabaseAdmin
    .from('membership_presale_paid')
    .select('signup_id, membership_type, notes, paid_at')

  const paidMap = new Map((paid ?? []).map(p => [p.signup_id, p]))

  // ── Build CSV ─────────────────────────────────────────────────────────────
  const headers = [
    'First Name', 'Last Name', 'Email', 'Phone',
    'Location', 'Membership Type', 'Plan', 'Payment Method',
    'Signed Up At', 'Paid', 'Paid At', 'Paid Membership Type', 'Notes',
  ]

  const rows = (signups ?? []).map(s => {
    const p = paidMap.get(s.id)
    return [
      s.first_name, s.last_name, s.email, s.phone,
      s.location, s.membership_type, s.plan_type ?? '', s.payment_method ?? '',
      fmtDate(s.created_at),
      p ? 'Yes' : 'No',
      p ? fmtDate(p.paid_at) : '',
      p ? p.membership_type : '',
      p?.notes ?? '',
    ].map(escapeCsv).join(',')
  })

  const csv = [headers.join(','), ...rows].join('\n')
  const total   = (signups ?? []).length
  const paidCnt = paidMap.size
  const now     = new Date().toLocaleString('en-US', {
    month: '2-digit', day: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
    timeZone: 'America/New_York',
  })
  const filename = `skramblehouse-presale-${new Date().toISOString().slice(0, 10)}.csv`

  // ── Send email with attachment ─────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY
  const notifyTo  = (process.env.NOTIFY_EMAIL ?? '').split(',').map(e => e.trim()).filter(Boolean)

  if (resendKey && notifyTo.length) {
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: process.env.EMAIL_FROM ?? 'Skramblehouse <noreply@skramblehouse.com>',
      to: notifyTo,
      subject: `📋 Skramblehouse Pre-Sale Export — ${total} signups (${paidCnt} paid) — ${now}`,
      html: `
        <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:24px">
          <h2 style="margin:0 0 8px;color:#1D4ED8">Skramblehouse Pre-Sale Export</h2>
          <p style="color:#6B7280;margin:0 0 20px;font-size:14px">Exported ${now} (ET)</p>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px">
            <tr>
              <td style="padding:8px 12px;background:#EFF6FF;border:1px solid #BFDBFE;font-size:14px;color:#1E40AF;font-weight:600;width:50%;text-align:center">
                ${total} Total Signups
              </td>
              <td style="padding:8px 12px;background:#F0FDF4;border:1px solid #BBF7D0;font-size:14px;color:#15803D;font-weight:600;width:50%;text-align:center">
                ${paidCnt} Confirmed Paid
              </td>
            </tr>
          </table>
          <p style="color:#374151;font-size:14px">Full member list attached as <strong>${filename}</strong>.</p>
          <p style="margin-top:24px;color:#9CA3AF;font-size:12px">Skramblehouse West Side · 2026–2027 Membership Pre-Sale</p>
        </div>
      `,
      attachments: [
        {
          filename,
          content: Buffer.from(csv, 'utf-8'),
        },
      ],
    }).catch(err => console.error('[export] Resend error:', err))
  }

  // ── Return CSV for browser download ──────────────────────────────────────
  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
