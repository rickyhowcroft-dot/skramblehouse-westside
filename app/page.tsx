import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen flex flex-col">

      {/* Hero — top half of screen, text overlaid on image */}
      <div className="relative w-full flex-shrink-0" style={{ height: '52vh', minHeight: 260 }}>
        <Image
          src="/storefront.jpg"
          alt="The Skramble House of Golf"
          fill
          priority
          sizes="100vw"
          className="object-cover object-top"
        />
        {/* Gradient overlay so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/70" />

        {/* Text on image */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <p className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest mb-1">
            The Skramble House of Golf
          </p>
          <h1 className="text-2xl font-extrabold text-white leading-tight">
            More content<br />coming soon.
          </h1>
        </div>
      </div>

      {/* Bottom section — contact */}
      <div className="flex-1 flex flex-col justify-center px-6 py-8 max-w-lg w-full mx-auto gap-5">

        <p className="text-zinc-400 text-sm leading-relaxed">
          We&apos;re working on something great. Reach out to us directly in the meantime.
        </p>

        <div className="flex flex-col gap-3">
          <a
            href="tel:+15856903494"
            className="flex items-center justify-center gap-3 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.99] text-white font-semibold py-5 rounded-xl transition-colors text-sm"
          >
            <span className="text-xl">📞</span>
            +1 (585) 690-3494
          </a>

          <a
            href="mailto:Theskamblehouseofgolfroc@gmail.com"
            className="flex items-center justify-center gap-3 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 active:scale-[0.99] text-white font-semibold py-5 rounded-xl transition-colors text-sm break-all"
          >
            <span className="text-xl flex-shrink-0">✉️</span>
            Theskamblehouseofgolfroc@gmail.com
          </a>
        </div>

      </div>
    </main>
  )
}
