'use client'

import { useState } from 'react'
import Image from 'next/image'

// ── Design tokens (applied consistently throughout) ──────────────────────────
// bg:        zinc-950 (page) / zinc-900 (cards)
// text:      white (headings) / zinc-400 (body) / zinc-500 (labels)
// accent:    emerald-400 (numbers, highlights) / emerald-500 (buttons)
// cards:     rounded-2xl border border-zinc-800
// spacing:   py-24 per section, max-w-2xl/4xl/5xl content widths
// inputs:    rounded-2xl px-5 py-5 text-lg

const TIERS = [
  { amount: '$10,000', interestOnly: '$100 / mo',     payment: '$240.38 / mo',   totalInterest: '$3,580',  highlight: false, perk: null },
  { amount: '$25,000', interestOnly: '$250 / mo',     payment: '$600.94 / mo',   totalInterest: '$8,951',  highlight: true,  perk: 'Free membership for the life of the loan' },
  { amount: '$40,000', interestOnly: '$400 / mo',     payment: '$961.50 / mo',   totalInterest: '$14,321', highlight: false, perk: 'Free membership for the life of the loan' },
  { amount: '$50,000', interestOnly: '$500 / mo',     payment: '$1,201.88 / mo', totalInterest: '$17,901', highlight: false, perk: 'Free membership for the life of the loan' },
]

const STATS = [
  { value: '3',     label: 'Locations Operating' },
  { value: '52',    label: 'Presales Before Launch' },
  { value: '18 mo', label: 'Free Rent Secured' },
  { value: '12%',   label: 'Annual Return' },
]

const PHOTOS = [
  { src: '/investors/facility.jpg',  caption: 'Simulator Bays + Putting Green' },
  { src: '/investors/vibe.jpg',      caption: 'The Skramblehouse Community' },
  { src: '/investors/floorplan.jpg', caption: 'West Side Floor Plan · 8,289 sq ft' },
]

export default function InvestorsPage() {
  const [form, setForm]           = useState({ firstName: '', lastName: '', email: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res  = await fetch('/api/investor-contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const data = await res.json()
    if (!res.ok) { setError(data.error || 'Something went wrong. Please try again.'); setLoading(false); return }
    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center text-center px-6 pt-28 pb-24">
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-6">
          Skramblehouse · West Side · Location 4
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight leading-tight mb-8">
          Own a Piece of<br />What&apos;s Next.
        </h1>
        <div className="max-w-xl space-y-4">
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
            Skramblehouse is Rochester&apos;s fastest-growing indoor golf and entertainment brand.
          </p>
          <p className="text-zinc-400 text-lg sm:text-xl leading-relaxed">
            We&apos;re opening our 4th location — and giving a small group of people the chance to grow with us.
          </p>
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STATS.map(s => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-4xl font-bold text-emerald-400">{s.value}</span>
              <span className="text-zinc-400 text-sm leading-snug">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Photos ───────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">The Experience</p>
            <h2 className="text-3xl font-bold">Three Locations.<br />One More on the Way.</h2>
          </div>
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

      {/* ── The Opportunity ──────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">The Opportunity</p>
            <h2 className="text-3xl font-bold">Simple Terms. Real Returns.</h2>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-10 space-y-6 text-center">
            <p className="text-white text-lg font-medium leading-relaxed">
              We&apos;re raising $400,000 to build out Skramblehouse West Side.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              This is a fixed-return private loan at{' '}
              <span className="text-emerald-400 font-semibold">12% annually</span> —
              structured to be simple, transparent, and investor-friendly.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              You&apos;re not buying equity. You&apos;re lending to a proven, operating business
              with real revenue, real members, and 52 of 100 presale memberships already sold.
            </p>
            <p className="text-zinc-400 text-base leading-relaxed">
              18 months of free rent locked in. Payments start July 1, 2026.
              The loan can get paid off sooner with no penalty.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Jul – Dec 2026</p>
              <p className="text-white text-xl font-bold mb-2">Interest Only</p>
              <p className="text-zinc-400 text-sm leading-relaxed">6 months of interest-only payments while we build and launch.</p>
            </div>
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest mb-3">Jan 2027 – Jun 2031</p>
              <p className="text-white text-xl font-bold mb-2">Principal + Interest</p>
              <p className="text-zinc-400 text-sm leading-relaxed">54 monthly payments. Early payoff welcome — zero penalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Investment Tiers ─────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Investment Tiers</p>
            <h2 className="text-3xl font-bold">Four Levels. All at 12%.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map(tier => (
              <div
                key={tier.amount}
                className={`rounded-2xl border p-8 flex flex-col items-center text-center gap-4 ${
                  tier.highlight ? 'bg-emerald-950 border-emerald-600' : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {tier.highlight && (
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Most Popular</p>
                )}
                <p className="text-4xl font-bold">{tier.amount}</p>

                <div className="w-full space-y-4 text-center">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">First 6 Months</p>
                    <p className="text-white text-base font-semibold">{tier.interestOnly}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Months 7 – 60</p>
                    <p className="text-white text-base font-semibold">{tier.payment}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-1">Total Interest Earned</p>
                    <p className="text-emerald-400 text-2xl font-bold">{tier.totalInterest}</p>
                  </div>
                </div>

                {tier.perk && (
                  <p className="text-emerald-300 text-xs font-medium mt-auto">🏌️ {tier.perk}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Now ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Why Now</p>
          <h2 className="text-3xl font-bold mb-8">Why Skramblehouse?<br />Why Now?</h2>
          <p className="text-zinc-400 text-base sm:text-lg leading-relaxed">
            West Side of Rochester is our next target location, and the demand is already there,
            long before we have broken ground.{' '}
            <span className="text-white font-semibold">52 of 100 memberships sold and counting.</span>
          </p>
        </div>
      </section>

      {/* ── Express Interest ─────────────────────────────────────────────── */}
      <section className="px-6 pb-28">
        <div className="max-w-xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8 sm:p-12">
          <div className="text-center mb-8">
            <p className="text-zinc-500 text-xs uppercase tracking-widest mb-3">Get Involved</p>
            <h2 className="text-3xl font-bold mb-4">Interested?</h2>
            <p className="text-zinc-400 text-base leading-relaxed">
              Share your information and we&apos;ll reach out personally to walk you through the details.
            </p>
            <p className="text-zinc-400 text-base mt-3">
              No commitment — just a conversation.
            </p>
          </div>

          {submitted ? (
            <div className="text-center py-10">
              <p className="text-5xl mb-5">🏌️</p>
              <p className="text-white text-xl font-bold mb-2">You&apos;re on our radar.</p>
              <p className="text-zinc-400 text-base">We&apos;ll be in touch shortly.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="text" name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text" required value={form.firstName}
                  onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                  placeholder="First Name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-5 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="text" required value={form.lastName}
                  onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                  placeholder="Last Name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-5 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <input
                type="email" required value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="Email Address"
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-5 py-5 text-white text-lg placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
              />

              {error && <p className="text-red-400 text-sm text-center">{error}</p>}

              <button
                type="submit" disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-5 rounded-full text-base uppercase tracking-widest transition-colors"
              >
                {loading ? 'Sending…' : 'Learn More'}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-zinc-800 text-center space-y-3">
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Or reach out directly</p>
            <a href="mailto:Theskamblehouseofgolfroc@gmail.com" className="block text-white text-base font-medium hover:text-emerald-400 transition-colors">
              Theskamblehouseofgolfroc@gmail.com
            </a>
            <a href="tel:+15856903494" className="block text-white text-base font-medium hover:text-emerald-400 transition-colors">
              (585) 690-3494
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 px-6 py-10 text-center space-y-1">
        <p className="text-zinc-600 text-xs">© 2026 Skramblehouse. All rights reserved.</p>
        <p className="text-zinc-700 text-xs">This page is for informational purposes and does not constitute a public securities offering.</p>
      </footer>

    </main>
  )
}
