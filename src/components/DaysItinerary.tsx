import { australindLegs } from "@/data/australindTrip";

function formatLegDate(date: string, dayOfWeek: string) {
  const day = Number(date.slice(8, 10));
  return `${dayOfWeek.slice(0, 3)} ${day} Sep 2026`;
}

export default function DaysItinerary() {
  return (
    <div className="mx-auto max-w-3xl">
      <div>
        <h1 className="font-[family-name:var(--font-fraunces),Georgia,serif] text-3xl text-slate-900">
          Itinerary
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          21–25 Sep 2026 · five days · ~259 km. No Day 6, 7, or 8.
        </p>
      </div>

      <ul className="mt-8 space-y-5">
        {australindLegs.map((leg) => (
          <li
            key={leg.id}
            id={`day-${leg.id}`}
            className={`scroll-mt-24 overflow-hidden rounded-2xl border-2 bg-white shadow-sm ${
              leg.amber ? "border-amber-300" : "border-slate-200"
            }`}
          >
            <div className="flex gap-3 px-4 py-4">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl bg-slate-900 text-amber-50">
                <span className="text-[9px] font-semibold uppercase tracking-wide">
                  Day
                </span>
                <span className="text-sm font-bold leading-none">{leg.id}</span>
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-[family-name:var(--font-fraunces),Georgia,serif] text-lg font-bold leading-tight text-slate-900">
                  {leg.label}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  {formatLegDate(leg.date, leg.dayOfWeek)}
                </p>
                <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  {leg.section}
                </p>
                <p className="mt-2 text-sm text-slate-700">{leg.route}</p>
                <p className="mt-2 text-sm font-medium capitalize text-slate-800">
                  {leg.distanceKm} km · {leg.overnightKind} · {leg.bookingStatus}
                </p>
                {leg.logistics && (
                  <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600">
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
