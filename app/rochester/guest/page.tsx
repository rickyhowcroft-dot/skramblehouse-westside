import GuestSigninForm from '@/components/GuestSigninForm'

export const metadata = { title: 'Guest Sign-In — Rochester | Skramblehouse' }

export default function RochesterGuestPage() {
  return <GuestSigninForm location="Rochester" heroImage="/rochester-hero.jpg" />
}
