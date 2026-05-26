import GuestSigninForm from '@/components/GuestSigninForm'

export const metadata = { title: 'Guest Sign-In — Horsham | Skramblehouse' }

export default function HorshamGuestPage() {
  return <GuestSigninForm location="Horsham" heroImage="/horsham-hero.jpg" />
}
