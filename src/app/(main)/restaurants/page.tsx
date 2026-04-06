import RestaurantsMap from '@/components/RestaurantsMap'

export default function RestaurantsPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">
      <section className="border-b-[6px] border-black pb-6">
        <div className="flex justify-between items-end">
          <div>
            <p className="font-mono text-xs uppercase font-black text-black/40 mb-1">Restaurant Locator · MAP_VIEW</p>
            <h1 className="font-headline font-black text-6xl uppercase tracking-tighter leading-[0.85]">
              Nearby<br />
              <span className="bg-[#363cff] text-white px-2 border-[3px] border-black">Restaurants</span>
            </h1>
          </div>
          <div className="text-right hidden sm:block">
            <p className="font-mono font-black text-xl uppercase">RESTAURANT_MAP</p>
            <p className="font-mono text-sm uppercase text-black/50">10 Locations Found</p>
          </div>
        </div>
      </section>

      <RestaurantsMap />
    </div>
  )
}
