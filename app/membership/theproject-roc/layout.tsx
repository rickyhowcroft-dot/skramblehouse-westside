import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rochester Membership Pre-Sale 2026–2027 | Skramblehouse',
  description: 'Lock in your discounted Skramblehouse Rochester membership for 2026–2027. Limited pre-sale spots available — offer valid through October 31, 2026.',
}

export default function RocPresaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
