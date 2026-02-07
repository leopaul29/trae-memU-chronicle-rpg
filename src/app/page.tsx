export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-6 md:py-10 space-y-6 md:space-y-8">
      <section className="image-placeholder h-64 md:h-96" />

      <section className="rounded-md border border-neutral-700 bg-neutral-900/50 shadow-gothic">
        <div className="p-4 md:p-6">
          <h1 className="font-gothic text-2xl md:text-3xl mb-3 md:mb-4">Narration</h1>
          <div className="h-60 md:h-72 overflow-y-auto pr-2 md:pr-3">
            <p className="text-neutral-200 leading-relaxed">
              The Grimoire whispers in a voice like rusted chains, telling of pathways that coil through shadowed halls. Candles gutter and the parchment breathes. Choices await below.
            </p>
            <p className="mt-4 text-neutral-300">
              Scroll for more. This window will hold the living story.
            </p>
            <div className="h-40" />
          </div>
        </div>
      </section>

      <section className="flex flex-col md:flex-row gap-4 md:gap-6">
        <button className="gothic-button flex-1">Approach the altar</button>
        <button className="gothic-button flex-1">Inspect the sigils</button>
        <button className="gothic-button flex-1">Turn back</button>
      </section>
    </main>
  )
}
