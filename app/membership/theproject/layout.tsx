import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Membership Pre-Sale 2026–2027 | Skramblehouse',
  description: 'Lock in your discounted Skramblehouse membership rate for 2026–2027. Limited-time offer valid June 1 – August 31, 2026.',
}

export default function MembershipPresaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
