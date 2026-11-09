import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events — Skramblehouse',
  description: 'Leagues, tournaments, and events at all Skramblehouse locations. Register for the Opening Weekend Skramble, Baller League, and Skramble Tour.',
}

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return children
}
