export default function FamilyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Family</h1>
      <p className="mt-1 text-sm text-muted">
        Agree daily check-ins. Collie (Day 2) and Dwellingup (Day 4) are good
        anchors. Live family-share links from the earlier companion are not in
        this source yet.
      </p>
      
      <div className="mt-8 space-y-4">
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Check-in Schedule</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted">
            <li><strong className="text-ink">Day 1:</strong> Text when arriving at Nglang Boodja Hut</li>
            <li><strong className="text-ink">Day 2:</strong> Call from Collie (good signal)</li>
            <li><strong className="text-ink">Day 3:</strong> Text from Yarri (limited signal)</li>
            <li><strong className="text-ink">Day 4:</strong> Text from Brockman Lake</li>
            <li><strong className="text-ink">Day 5:</strong> Call from Dwellingup</li>
            <li><strong className="text-ink">Day 6:</strong> Text from Mandurah Station</li>
          </ul>
        </div>
        
        <div className="rounded-2xl border border-line bg-surface px-4 py-4">
          <h2 className="font-serif text-lg text-ink">Emergency Contact</h2>
          <p className="mt-2 text-sm text-muted">
            If no check-in by expected time, wait 2 hours then contact emergency services.
            Reference last known location from this app.
          </p>
        </div>
      </div>
    </div>
  );
}
