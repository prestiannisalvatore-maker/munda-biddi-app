import { days } from "../data/trip";

function formatDate(date: string, dayOfWeek: string) {
  const day = Number(date.slice(8, 10));
  return `${dayOfWeek.slice(0, 3)} ${day} Sep 2026`;
}

export default function ItineraryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Itinerary</h1>
      <p className="mt-1 text-sm text-muted">
        21–26 Sep 2026 · six days · ~269 km. Trains bookend the trip on Day 1 and Day 6.
      </p>

      <ul className="mt-8 space-y-5">
        {days.map((leg) => (
          <li
            key={leg.id}
            id={`day-${leg.id}`}
            className={`overflow-hidden rounded-2xl border-2 bg-surface shadow-sm ${
              leg.amber ? "border-warn/40" : "border-line"
            }`}
          >
            <div className="flex gap-3 px-4 py-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-ink text-sand">
                <span className="text-[9px] font-semibold uppercase tracking-wide">
                  Day
                </span>
                <span className="text-sm font-bold leading-none">{leg.id}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-lg font-bold leading-tight text-ink">
                  {leg.label}
                </h2>
                <p className="mt-0.5 text-sm text-muted">
                  {formatDate(leg.date, leg.dayOfWeek)}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-muted">
                  {leg.section}
                </p>
                <p className="mt-2 text-sm text-ink/80">{leg.route}</p>
                <p className="mt-2 text-sm font-medium capitalize text-ink">
                  {leg.distanceKm} km · {leg.overnightKind} · {leg.bookingStatus}
                </p>
                {leg.amber && (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-warn">
                    Long day
                  </p>
                )}
                {leg.logistics && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">
                    {leg.logistics.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
