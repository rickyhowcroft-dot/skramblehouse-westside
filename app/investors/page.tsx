import type { Metadata } from 'next'
import Image from 'next/image'
import { supabaseAdmin } from '@/lib/supabase'
import InvestorForm from './InvestorForm'

export const metadata: Metadata = {
  title: 'Invest in Skramblehouse | West Side Location 4',
  description: 'Join the movement. Skramblehouse is expanding to its 4th location and opening a limited investment opportunity.',
}

export const revalidate = 300

const TIERS = [
  { amount: '$10,000', interestOnly: '$100 / mo',     payment: '$240.38 / mo',   totalInterest: '$3,580',  highlight: false, perk: null },
  { amount: '$25,000', interestOnly: '$250 / mo',     payment: '$600.94 / mo',   totalInterest: '$8,951',  highlight: true,  perk: 'Free membership for the life of the loan' },
  { amount: '$40,000', interestOnly: '$400 / mo',     payment: '$961.50 / mo',   totalInterest: '$14,321', highlight: false, perk: 'Free membership for the life of the loan' },
  { amount: '$50,000', interestOnly: '$500 / mo',     payment: '$1,201.88 / mo', totalInterest: '$17,901', highlight: false, perk: 'Free membership for the life of the loan' },
]

const PHOTOS = [
  { src: '/investors/facility.jpg',  caption: 'Simulator Bays + Putting Green' },
  { src: '/investors/vibe.jpg',      caption: 'The Skramblehouse Community' },
  { src: '/investors/floorplan.jpg', caption: 'West Side Floor Plan · 8,289 sq ft' },
]

async function getPresaleCount(): Promise<number> {
  try {
    const { count } = await supabaseAdmin
      .from('presale_signups')
      .select('*', { count: 'exact', head: true })
    return count ?? 0
  } catch {
    return 0
  }
}

/** Consistent section label + heading block */
function SectionHeader({ eyebrow, heading }: { eyebrow: string; heading: React.ReactNode }) {
  return (
    <div className="text-center mb-12 md:mb-16">
      <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-4">
        {eyebrow}
      </p>
      <h2 className="text-3xl sm:text-4xl font-bold leading-snug">{heading}</h2>
    </div>
  )
}

export default async function InvestorsPage() {
  const presaleCount = await getPresaleCount()

  const STATS = [
    { value: '3',               label: 'Locations Operating' },
    { value: String(presaleCount), label: 'Presales Before Launch' },
    { value: '18 mo',           label: 'Free Rent Secured' },
    { value: '12%',             label: 'Annual Return' },
  ]

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ── Hero ───────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 sm:px-10 lg:px-16 pt-16 pb-24 max-w-screen-xl mx-auto">
        <div className="relative w-full max-w-4xl rounded-2xl overflow-hidden aspect-[16/9] mb-14">
          <Image src="/investors/hero.jpg" alt="Skramblehouse facility" fill className="object-cover" priority />
        </div>
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">
          Skramblehouse · West Side · Location 4
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-8">
          Own a Piece of<br />What&apos;s Next.
        </h1>
        <div className="max-w-2xl space-y-4">
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
            Skramblehouse is Rochester&apos;s fastest-growing indoor golf and entertainment brand.
          </p>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
            We&apos;re opening our 4th location — and giving a small group of people the chance to grow with us.
          </p>
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 lg:gap-6">
            {STATS.map(s => (
              <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:p-8 flex flex-col items-center justify-center text-center gap-3">
                <span className="text-4xl lg:text-5xl font-bold text-emerald-400">{s.value}</span>
                <span className="text-zinc-400 text-sm leading-snug">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Photos ─────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-screen-xl mx-auto">
          <SectionHeader eyebrow="The Experience" heading={<>Three Locations.<br />One More on the Way.</>} />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PHOTOS.map(img => (
              <div key={img.src} className="flex flex-col gap-3">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                  <Image src={img.src} alt={img.caption} fill className="object-cover" />
                </div>
                <p className="text-zinc-400 text-sm text-center">{img.caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Opportunity ────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-screen-lg mx-auto">
          <SectionHeader eyebrow="The Opportunity" heading="Simple Terms. Real Returns." />

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12 space-y-6 text-center mb-6">
            <p className="text-white text-lg font-medium leading-relaxed">
              We&apos;re raising $400,000 to build out Skramblehouse West Side.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              This is a fixed-return private loan at{' '}
              <span className="text-emerald-400 font-semibold">12% annually</span> —
              simple, transparent, and investor-friendly.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              You&apos;re not buying equity. You&apos;re lending to a proven, operating business
              with real revenue, real members, and {presaleCount} of 100 presale memberships already sold.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              18 months of free rent locked in. Payments start July 1, 2026.
              The loan can get paid off sooner with no penalty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 lg:p-10 text-center">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Jul – Dec 2026</p>
              <p className="text-white text-xl font-bold mb-3">Interest Only</p>
              <p className="text-zinc-400 text-sm leading-relaxed">6 months of interest-only payments while we build and launch.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 lg:p-10 text-center">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Jan 2027 – Jun 2031</p>
              <p className="text-white text-xl font-bold mb-3">Principal + Interest</p>
              <p className="text-zinc-400 text-sm leading-relaxed">54 monthly payments. Early payoff welcome — zero penalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Investment Tiers ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-screen-xl mx-auto">
          <SectionHeader eyebrow="Investment Tiers" heading="Four Levels. All at 12%." />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {TIERS.map(tier => (
              <div
                key={tier.amount}
                className={`rounded-2xl border p-8 lg:p-10 flex flex-col items-center text-center gap-5 ${
                  tier.highlight ? 'bg-emerald-950 border-emerald-600' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {tier.highlight && (
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Most Popular</p>
                )}
                <p className="text-4xl font-bold">{tier.amount}</p>
                <div className="w-full space-y-5 text-center">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-2">First 6 Months</p>
                    <p className="text-white text-base font-semibold">{tier.interestOnly}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-2">Months 7 – 60</p>
                    <p className="text-white text-base font-semibold">{tier.payment}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-2">Total Interest Earned</p>
                    <p className="text-emerald-400 text-2xl font-bold">{tier.totalInterest}</p>
                  </div>
                </div>
                {tier.perk && (
                  <p className="text-emerald-300 text-xs font-medium mt-auto pt-2">🏌️ {tier.perk}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Now ────────────────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeader eyebrow="Why Now" heading={<>Why Skramblehouse?<br />Why Now?</>} />
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed -mt-4">
            West Side of Rochester is our next target location, and the demand is already there,
            long before we have broken ground.{' '}
            <span className="text-white font-semibold">{presaleCount} of 100 memberships sold and counting.</span>
          </p>
        </div>
      </section>

      {/* ── Express Interest ───────────────────────────────────────────── */}
      <section className="px-6 sm:px-10 lg:px-16 pb-28">
        <div className="max-w-xl lg:max-w-2xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">

          {/* Card header */}
          <div className="px-8 sm:px-12 lg:px-16 pt-12 pb-10 text-center border-b border-zinc-800">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-5">Get Involved</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">Interested?</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Share your information and we&apos;ll reach out personally to walk you through the details.
            </p>
            <p className="text-zinc-500 text-sm mt-3">
              No commitment — just a conversation.
            </p>
          </div>

          {/* Form body */}
          <div className="px-8 sm:px-12 lg:px-16 py-10">
            <InvestorForm />
          </div>

          {/* Direct contact footer */}
          <div className="px-8 sm:px-12 lg:px-16 py-10 border-t border-zinc-800 text-center space-y-3">
            <p className="text-zinc-500 text-sm uppercase tracking-widest mb-6">Or reach out directly</p>
            <a href="mailto:Theskamblehouseofgolfroc@gmail.com" className="block text-white text-base font-medium hover:text-emerald-400 transition-colors">
              Theskamblehouseofgolfroc@gmail.com
            </a>
            <a href="tel:+15856903494" className="block text-white text-base font-medium hover:text-emerald-400 transition-colors">
              (585) 690-3494
            </a>
          </div>

        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 px-6 py-10 text-center space-y-2">
        <p className="text-zinc-600 text-xs">© 2026 Skramblehouse. All rights reserved.</p>
        <p className="text-zinc-700 text-xs">This page is for informational purposes and does not constitute a public securities offering.</p>
      </footer>

    </main>
  )
}
