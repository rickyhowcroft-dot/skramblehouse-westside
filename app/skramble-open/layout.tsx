import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Open House Skramble — Skramblehouse',
  description: 'Nov 21–22. 2-person teams. Members Free · Non-Members $50. Pick your tee time, pick your facility.',
}

export default function SkrambleOpenLayout({ children }: { children: React.ReactNode }) {
  return children
}
