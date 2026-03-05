import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'West Side Pre-Sale | The Skramble House of Golf',
  description: 'Get on the pre-sale list for Skramblehouse West Side. Limited to the first 100 spots.',
}

export default function PresaleLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
