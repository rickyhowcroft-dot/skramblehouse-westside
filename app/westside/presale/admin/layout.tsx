import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Presale Admin — Skramblehouse West Side',
  robots: { index: false, follow: false },
}

export default function PresaleAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
