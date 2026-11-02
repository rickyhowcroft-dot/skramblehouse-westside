import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Free 72-Hour Access — Skramblehouse Rochester',
  description: 'Sign up and get FREE 72-hour access to our Rochester facility at Perinton Square Mall.',
}

export default function RocExperienceLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtm.js?id=GTM-N526QL43"
        strategy="afterInteractive"
      />
      <Script id="gtm-init" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      `}</Script>
      {children}
    </>
  )
}
