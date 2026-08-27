export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">SOS</h1>
      <p className="mt-1 text-sm text-muted">
        Emergency numbers on this phone. In Australia call 000. For trail
        rescue, also note your last hut or town: Nglang Boodja, Collie,
        Brockman Lake, or Dwellingup.
      </p>
      <a
        href="tel:000"
        className="mt-6 inline-block rounded-2xl bg-ink px-5 py-3 text-sand"
      >
        Call 000
      </a>
    </div>
  );
}
