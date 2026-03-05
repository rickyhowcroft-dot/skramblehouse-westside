import Image from 'next/image'

export default function HomePage() {
  return (
    <main className="bg-zinc-950 text-white min-h-screen flex flex-col">

      {/* Hero banner */}
      <div className="relative w-full aspect-[16/9] max-h-[60vh] overflow-hidden flex-shrink-0">
        <Image
          src="/storefront.jpg"
          alt="The Skramble House of Golf"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-zinc-950" />
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center max-w-lg mx-auto w-full">

        <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-3">
          The Skramble House of Golf
        </p>

        <h1 className="text-2xl font-extrabold text-white mb-2">
          More content coming soon.
        </h1>

        <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
          In the meantime, reach out to us directly — we&apos;d love to hear from you.
        </p>

        {/* Contact buttons */}
        <div className="flex flex-col gap-3 w-full">
          <a
            href="tel:+15856903494"
            className="flex items-center justify-center gap-2.5 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl transition-colors text-sm"
          >
            <span className="text-lg">📞</span>
            +1 (585) 690-3494
          </a>

          <a
            href="mailto:Theskamblehouseofgolfroc@gmail.com"
            className="flex items-center justify-center gap-2.5 w-full bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-semibold py-4 rounded-xl transition-colors text-sm"
          >
            <span className="text-lg">✉️</span>
            Theskamblehouseofgolfroc@gmail.com
          </a>
        </div>

      </div>
    </main>
  )
}
