import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export const revalidate = 0 // always fresh

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('presale_signups')
    .select('*', { count: 'exact', head: true })

  if (error) {
    return NextResponse.json({ count: 0 })
  }

  return NextResponse.json({ count: count ?? 0 })
}
