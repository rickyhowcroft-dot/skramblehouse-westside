import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Floater Membership — Skramblehouse',
  description: 'A new membership tier for Skramblehouse Rochester. $100 initiation fee, one day pass + coaching session included. Limited to 50 people.',
  openGraph: {
    title: 'Floater Membership — Skramblehouse',
    description: 'A new membership tier. $100 initiation, one day pass + coaching. Limited to 50 spots.',
    images: [
      {
        url: '/rochester-hero.jpg',
        width: 1200,
        height: 540,
        alt: 'Skramblehouse Rochester',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Floater Membership — Skramblehouse',
    description: 'A new membership tier. $100 initiation, one day pass + coaching. Limited to 50 spots.',
    images: ['/rochester-hero.jpg'],
  },
}

export default function FloaterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
