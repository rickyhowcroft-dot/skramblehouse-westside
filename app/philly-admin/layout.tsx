import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Philly Admin — Skramblehouse',
  robots: { index: false, follow: false },
}

export default function PhillyAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
