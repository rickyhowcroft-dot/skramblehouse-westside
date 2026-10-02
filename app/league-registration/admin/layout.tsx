import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'League Admin — Skramblehouse',
  robots: { index: false, follow: false },
}

export default function LeagueAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
