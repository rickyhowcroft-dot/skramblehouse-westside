import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'The Skramble House of Golf',
  description: "Rochester's premier indoor golf simulator experience. Coming soon to the West Side.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-zinc-950">
      <body className={`${jakarta.className} bg-zinc-950`}>{children}</body>
    </html>
  )
}
