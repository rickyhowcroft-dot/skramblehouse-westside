import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Max caps per membership type for ROC pre-sale
const CAPS: Record<string, number> = {
  'Full Year': 200,
  '5 Month':   50,
  'Junior':    20,
}

// Base counts for signups that pre-date this system (added manually / before type existed)
const BASE_COUNTS: Record<string, number> = {
  'Junior': 12,
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from('membership_presale_signups')
    .select('membership_type')
    .eq('location', 'Rochester')

  if (error) {
    console.error('[membership-count-roc]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Count per type
  const counts: Record<string, number> = {}
  for (const row of data ?? []) {
    counts[row.membership_type] = (counts[row.membership_type] ?? 0) + 1
  }

  const result = Object.entries(CAPS).map(([type, max]) => {
    const live  = counts[type] ?? 0
    const base  = BASE_COUNTS[type] ?? 0
    const total = live + base
    return {
      type,
      count:     total,
      max,
      remaining: Math.max(0, max - total),
      isFull:    total >= max,
    }
  })

  return NextResponse.json({ tiers: result }, {
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}
