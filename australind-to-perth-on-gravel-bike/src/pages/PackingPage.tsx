export default function PackingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Packing</h1>
      <p className="mt-1 text-sm text-muted">
        Six days, one hut, two bush camps, two town nights, train home Saturday.
      </p>
      
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Essential Gear</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/80">
            <li>Food for Days 3-4 (Collie → Yarri Hut → Lake Brockman).</li>
            <li>Hut kit for Nglang Boodja and Yarri. Lake Brockman has cabins available.</li>
            <li>Town clothes for Collie and Dwellingup.</li>
            <li>Transwa / Transperth bike-on-train confirmation.</li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Bike Setup</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/80">
            <li>Frame bag or bikepacking bags</li>
            <li>Spare tubes and puncture kit</li>
            <li>Multi-tool and chain breaker</li>
            <li>Front and rear lights (strong for Day 3)</li>
            <li>Water bottles or hydration pack (3L+ capacity)</li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Camping</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/80">
            <li>Lightweight sleeping bag (3-season)</li>
            <li>Sleeping mat</li>
            <li>Tent or bivvy (huts have shelters but may be full)</li>
            <li>Cooking stove and fuel</li>
            <li>Food for 3 camp nights (Nglang Boodja Hut, Yarri Hut, Lake Brockman)</li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Navigation & Safety</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-ink/80">
            <li>Phone with offline maps downloaded</li>
            <li>Portable charger / battery pack</li>
            <li>First aid kit</li>
            <li>Emergency whistle</li>
            <li>Paper map backup</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
