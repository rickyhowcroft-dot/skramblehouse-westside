import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="bg-zinc-950 text-white">
      <div className="max-w-lg w-full mx-auto px-5 pt-6 pb-10 flex flex-col gap-5">

        {/* Hero image card */}
        <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl shadow-black/60">
          <Image
            src="/storefront.jpg"
            alt="The Skramble House of Golf"
            width={1080}
            height={1080}
            priority
            className="w-full h-auto"
          />
        </div>

        {/* Blurb */}
        <div>
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-1.5">
            The Skramble House of Golf
          </p>
          <h1 className="text-xl font-extrabold text-white mb-1">
            More content coming soon.
          </h1>
          <p className="text-sm text-zinc-400 leading-relaxed">
            In the meantime, reach out to us directly.
          </p>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Contact buttons */}
        <div className="flex flex-col gap-3">
          <a
            href="tel:+15856903494"
            className="flex items-center justify-center gap-2.5 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.99] text-white font-semibold py-5 rounded-xl transition-colors text-sm"
          >
            <span className="text-lg">📞</span>
            +1 (585) 690-3494
          </a>

          <a
            href="mailto:Theskamblehouseofgolfroc@gmail.com"
            className="flex items-center justify-center gap-2.5 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.99] text-white font-semibold py-5 rounded-xl transition-colors text-sm"
          >
            <span className="text-lg">✉️</span>
            Theskamblehouseofgolfroc@gmail.com
          </a>
        </div>

      </div>
    </main>
  )
}
