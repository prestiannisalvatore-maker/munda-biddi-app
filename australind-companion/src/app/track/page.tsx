import { days } from "@/data/trip";

export default function TrackPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Track</h1>
      <p className="mt-1 text-sm text-muted">
        Five riding days, Bunbury to Mandurah. Live GPS from the earlier
        companion build is not in this source yet — use the day list below on
        the trail for now.
      </p>
      <ol className="mt-8 space-y-3">
        {days.map((day) => (
          <li
            key={day.id}
            className="rounded-2xl border border-line bg-surface px-4 py-3"
          >
            <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
              Day {day.id}
            </p>
            <p className="font-serif text-lg text-ink">{day.label}</p>
            <p className="text-sm text-muted">{day.distanceKm} km</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
