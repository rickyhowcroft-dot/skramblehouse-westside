import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Early Bird Admin — Skramblehouse',
  robots: { index: false, follow: false },
}

export default function EarlybirdAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
