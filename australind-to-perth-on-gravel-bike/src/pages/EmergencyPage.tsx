export default function EmergencyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">SOS</h1>
      <p className="mt-1 text-sm text-muted">
        Emergency numbers on this phone. In Australia call 000. For trail
        rescue, also note your last hut or town: Nglang Boodja, Collie,
        Yarri, Brockman Lake, or Dwellingup.
      </p>
      
      <a
        href="tel:000"
        className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-red-700"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
        Call 000
      </a>
      
      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border-2 border-warn/40 bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Trail Rescue Info</h2>
          <p className="mt-2 text-sm text-muted">
            When calling emergency services, provide:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
            <li>Your location (last hut, km marker, or GPS coordinates)</li>
            <li>Nature of emergency</li>
            <li>Number of people in your group</li>
            <li>Any injuries or medical conditions</li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Key Locations</h2>
          <ul className="mt-2 space-y-2 text-sm text-muted">
            <li><strong className="text-ink">Nglang Boodja Hut:</strong> Wellington National Park</li>
            <li><strong className="text-ink">Collie:</strong> Town with hospital</li>
            <li><strong className="text-ink">Yarri Hut:</strong> Munda Biddi hut in jarrah forest</li>
            <li><strong className="text-ink">Lake Brockman:</strong> Campsites, cabins, café</li>
            <li><strong className="text-ink">Dwellingup:</strong> Town with medical centre</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
