'use client'

import { useState } from 'react'
import Image from 'next/image'

const TIERS = [
  {
    amount: '$10,000',
    interestOnly: '$100 / mo',
    payment: '$240.38 / mo',
    totalInterest: '$3,580',
    highlight: false,
    perk: null,
  },
  {
    amount: '$25,000',
    interestOnly: '$250 / mo',
    payment: '$600.94 / mo',
    totalInterest: '$8,951',
    highlight: true,
    perk: 'Free membership for the life of the loan',
  },
  {
    amount: '$40,000',
    interestOnly: '$400 / mo',
    payment: '$961.50 / mo',
    totalInterest: '$14,321',
    highlight: false,
    perk: 'Free membership for the life of the loan',
  },
  {
    amount: '$50,000',
    interestOnly: '$500 / mo',
    payment: '$1,201.88 / mo',
    totalInterest: '$17,901',
    highlight: false,
    perk: 'Free membership for the life of the loan',
  },
]

export default function InvestorsPage() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', website: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/investor-contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error || 'Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setSubmitted(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-20 pb-16">
        <p className="text-emerald-400 uppercase tracking-widest text-xs font-semibold mb-5">
          Skramblehouse · West Side · Location 4
        </p>
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6 leading-tight">
          Own a Piece of<br className="hidden sm:block" /> What&apos;s Next.
        </h1>
        <p className="text-zinc-400 text-lg sm:text-xl max-w-2xl leading-relaxed">
          Skramble is Rochester&apos;s fastest-growing indoor golf and entertainment brand.
          We&apos;re opening our 4th location — and giving a small group of people the chance to grow with us.
        </p>
      </section>

      {/* ── Traction Stats ────────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: '3', label: 'Locations Already Operating' },
            { value: '52', label: 'Presales Before Launch' },
            { value: '18 mo', label: 'Free Rent Secured' },
            { value: '12%', label: 'Annual Rate of Return' },
          ].map(stat => (
            <div key={stat.label} className="bg-zinc-900 rounded-2xl p-5 text-center border border-zinc-800">
              <p className="text-3xl sm:text-4xl font-bold text-emerald-400 mb-1">{stat.value}</p>
              <p className="text-zinc-400 text-xs leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Photo Gallery ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">The Experience</h2>
          <p className="text-zinc-500 text-center text-sm mb-8">Three thriving locations. One more on the way.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { src: '/investors/facility.jpg',  caption: 'Simulator Bays + Putting Green' },
              { src: '/investors/vibe.jpg',       caption: 'The Skramble Community' },
              { src: '/investors/floorplan.jpg',  caption: 'West Side Floor Plan — 8,289 sq ft' },
            ].map(img => (
              <div key={img.src} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
                <Image src={img.src} alt={img.caption} fill className="object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent px-4 py-3">
                  <p className="text-white text-xs font-medium">{img.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The Opportunity ──────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto bg-zinc-900 rounded-3xl border border-zinc-800 p-8 sm:p-12">
          <h2 className="text-2xl font-bold mb-6">The Opportunity</h2>
          <div className="space-y-4 text-zinc-300 leading-relaxed">
            <p>
              We&apos;re raising <span className="text-white font-semibold">$400,000</span> to build out Skramble West Side —
              our largest and most ambitious location yet. This is a{' '}
              <span className="text-white font-semibold">fixed-return private loan</span> at{' '}
              <span className="text-emerald-400 font-semibold">12% annually</span>, structured to keep things simple
              and transparent.
            </p>
            <p>
              You&apos;re not buying equity — you&apos;re lending to a proven, operating business
              with real revenue and a community that&apos;s already sold out 52 of 100 presale memberships
              before we&apos;ve opened a single door.
            </p>
            <p>
              We&apos;ve locked in 18 months of free rent at the West Side space.
              Payments start July 1, 2026 — and the loan can be paid off early with no penalties.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700">
              <p className="text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-2">Jul – Dec 2026</p>
              <p className="text-white font-bold text-lg mb-1">Interest Only</p>
              <p className="text-zinc-400 text-sm">6 months of interest-only payments while we build and launch.</p>
            </div>
            <div className="bg-zinc-800/60 rounded-2xl p-5 border border-zinc-700">
              <p className="text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-2">Jan 2027 – Jun 2031</p>
              <p className="text-white font-bold text-lg mb-1">Principal + Interest</p>
              <p className="text-zinc-400 text-sm">54 monthly payments. Early payoff welcome — zero penalty.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Investment Tiers ─────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-2">Investment Tiers</h2>
          <p className="text-zinc-500 text-center text-sm mb-8">Four levels. All at 12% annual return.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIERS.map(tier => (
              <div
                key={tier.amount}
                className={`rounded-2xl border p-6 flex flex-col gap-3 ${
                  tier.highlight
                    ? 'bg-emerald-950 border-emerald-600'
                    : 'bg-zinc-900 border-zinc-800'
                }`}
              >
                {tier.highlight && (
                  <p className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Most Popular</p>
                )}
                <p className="text-3xl font-bold">{tier.amount}</p>

                <div className="border-t border-zinc-700/50 pt-3 space-y-2.5">
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-0.5">First 6 months</p>
                    <p className="text-white font-semibold">{tier.interestOnly}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-0.5">Months 7–60</p>
                    <p className="text-white font-semibold">{tier.payment}</p>
                  </div>
                  <div>
                    <p className="text-zinc-500 text-xs uppercase tracking-wide mb-0.5">Total interest earned</p>
                    <p className="text-emerald-400 font-bold text-lg">{tier.totalInterest}</p>
                  </div>
                </div>

                {tier.perk && (
                  <div className="mt-auto pt-3 border-t border-zinc-700/50">
                    <p className="text-emerald-300 text-xs font-medium">🏌️ {tier.perk}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Now ──────────────────────────────────────────────────────── */}
      <section className="px-6 pb-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Why Skramble. Why Now.</h2>
          <p className="text-zinc-400 leading-relaxed">
            Indoor golf is one of the fastest-growing entertainment categories in the country.
            We&apos;ve built something people genuinely love — members, leagues, events, and a culture
            that keeps people coming back. West Side is our biggest footprint yet, and the demand was
            already there before we broke ground.{' '}
            <span className="text-white font-semibold">52 of 100 memberships sold before opening day.</span>{' '}
            The momentum is real. This is your chance to be part of it from the beginning.
          </p>
        </div>
      </section>

      {/* ── Contact Form ─────────────────────────────────────────────────── */}
      <section className="px-6 pb-24">
        <div className="max-w-md mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-8 sm:p-10">
          <h2 className="text-2xl font-bold mb-2 text-center">Express Interest</h2>
          <p className="text-zinc-400 text-sm text-center mb-8 leading-relaxed">
            Drop your info and we&apos;ll reach out personally to walk you through the details.
            No commitment — just a conversation.
          </p>

          {submitted ? (
            <div className="text-center py-6">
              <p className="text-4xl mb-4">🏌️</p>
              <p className="text-white font-bold text-lg mb-2">You&apos;re on our radar.</p>
              <p className="text-zinc-400 text-sm">We&apos;ll be in touch shortly to walk you through everything.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Honeypot */}
              <input type="text" name="website" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="hidden" tabIndex={-1} autoComplete="off" />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5">First Name</label>
                  <input
                    type="text"
                    required
                    value={form.firstName}
                    onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                    placeholder="Dan"
                  />
                </div>
                <div>
                  <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5">Last Name</label>
                  <input
                    type="text"
                    required
                    value={form.lastName}
                    onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                    placeholder="Hallimen"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-zinc-400 uppercase tracking-wide mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-emerald-500 text-sm"
                  placeholder="you@email.com"
                />
              </div>

              {error && <p className="text-red-400 text-sm">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-bold py-4 rounded-full text-sm uppercase tracking-wide transition-colors mt-2"
              >
                {loading ? 'Sending…' : 'Count Me In'}
              </button>
            </form>
          )}

          <p className="text-zinc-600 text-xs text-center mt-6">
            Or reach out directly — Theskamblehouseofgolfroc@gmail.com · (585) 690-3494
          </p>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-800 px-6 py-8 text-center text-zinc-600 text-xs">
        <p>© 2026 Skramblehouse. All rights reserved.</p>
        <p className="mt-1">This page is for informational purposes and does not constitute a public securities offering.</p>
      </footer>

    </main>
  )
}
