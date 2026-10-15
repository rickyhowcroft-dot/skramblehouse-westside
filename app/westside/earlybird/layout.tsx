import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Early Bird Special — Skramblehouse West Side',
  description:
    'Lock in your Early Bird spot at Skramblehouse West Side (Perinton Square Mall). $400 gets you 15 passes + a full credit toward your membership.',
}

export default function EarlybirdLayout({ children }: { children: React.ReactNode }) {
  return children
}
