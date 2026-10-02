import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'League Registration — Skramblehouse',
  description: 'Register for Skramblehouse indoor golf leagues. Tuesday and Wednesday nights, multiple sessions available.',
}

export default function LeagueRegistrationLayout({ children }: { children: React.ReactNode }) {
  return children
}
