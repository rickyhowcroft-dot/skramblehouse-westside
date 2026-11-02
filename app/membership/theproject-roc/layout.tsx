import type { Metadata } from 'next'
import Script from 'next/script'

export const metadata: Metadata = {
  title: 'Rochester Membership Pre-Sale 2026–2027 | Skramblehouse',
  description: 'Lock in your discounted Skramblehouse Rochester membership for 2026–2027. Limited pre-sale spots available — offer valid through October 31, 2026.',
}

export default function RocPresaleLayout({ children }: { children: React.ReactNode }) {
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
