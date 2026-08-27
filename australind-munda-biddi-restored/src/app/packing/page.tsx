export default function PackingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Packing</h1>
      <p className="mt-1 text-sm text-muted">
        Five days, one hut, one bush camp, two town nights, train home Friday.
      </p>
      <ul className="mt-8 list-disc space-y-2 pl-5 text-sm text-ink/80">
        <li>Lights and extra food for Day 3 (Collie → Brockman Lake).</li>
        <li>Hut and bush-camp kit for Nglang Boodja and Brockman.</li>
        <li>Town clothes for Collie and Dwellingup.</li>
        <li>Transwa / Transperth bike-on-train confirmation.</li>
      </ul>
    </div>
  );
}
