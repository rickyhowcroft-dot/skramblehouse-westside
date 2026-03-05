import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Skramblehouse West Side — Pre-Sale',
  description: 'Get on the pre-sale list. Limited to the first 100 people.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-950">
      <body className={`${inter.className} bg-zinc-950`}>{children}</body>
    </html>
  )
}
