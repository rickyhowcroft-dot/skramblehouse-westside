import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'November Member Special — Skramblehouse Philly',
  description:
    'New members at Skramblehouse Horsham and KOP get 10% off any membership — November 1–30 only. Sign up to lock in your rate.',
}

export default function PhillyLayout({ children }: { children: React.ReactNode }) {
  return children
}
