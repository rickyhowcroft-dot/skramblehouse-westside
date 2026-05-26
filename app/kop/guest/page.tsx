import GuestSigninForm from '@/components/GuestSigninForm'

export const metadata = { title: 'Guest Sign-In — KOP | Skramblehouse' }

export default function KOPGuestPage() {
  return <GuestSigninForm location="KOP" heroImage="/kop-hero.jpg" />
}
