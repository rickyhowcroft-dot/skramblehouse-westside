import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'The Skramble House of Golf',
  description: "Rochester's premier indoor golf simulator experience. Coming soon to the West Side.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-950">
      <body className={`${inter.className} bg-zinc-950`}>{children}</body>
    </html>
  )
}
