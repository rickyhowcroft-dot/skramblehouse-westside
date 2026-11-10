import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const LIMIT = 50

// Public endpoint — returns paid count + sold_out flag for the ticker
export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('floater_signups')
    .select('*', { count: 'exact', head: true })
    .eq('paid', true)

  if (error) {
    console.error('[floater/count] error', error.message)
    return NextResponse.json({ paid_count: 0, sold_out: false }, { status: 200 })
  }

  const paid_count = count ?? 0
  return NextResponse.json(
    { paid_count, sold_out: paid_count >= LIMIT },
    {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    }
  )
}
