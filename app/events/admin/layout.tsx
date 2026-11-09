import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events Admin — Skramblehouse',
  robots: { index: false, follow: false },
}

export default function EventsAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
