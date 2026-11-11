import type { NextConfig } from 'next'

const securityHeaders = [
  // Prevent clickjacking — nobody can embed this in an iframe
  { key: 'X-Frame-Options', value: 'DENY' },
  // Prevent MIME sniffing
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  // Stop sending referrer outside the same origin
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // Disable browser features we don't use
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  // Force HTTPS for 1 year (Vercel already does this, belt-and-suspenders)
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  // Content Security Policy
  // - default: same origin only
  // - scripts: same origin + Next.js inline (unsafe-inline needed for Next.js hydration)
  // - styles: same origin + inline (Tailwind inlines styles)
  // - fonts: Google Fonts
  // - connect: Supabase API
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://connect.facebook.net", // Next.js requires these; GTM + Meta Pixel
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      `connect-src 'self' https://*.supabase.co https://www.googletagmanager.com https://*.google-analytics.com https://analytics.google.com https://www.facebook.com`,
      "img-src 'self' data: blob: https://www.googletagmanager.com https://www.facebook.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: '/membership/presale',
      destination: '/membership/theproject',
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders,
    },
  ],
}

export default nextConfig
