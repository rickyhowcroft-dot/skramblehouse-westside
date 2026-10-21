import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'ROC Experience Admin — Skramblehouse',
  robots: { index: false, follow: false },
}

export default function RocExperienceAdminLayout({ children }: { children: React.ReactNode }) {
  return children
}
