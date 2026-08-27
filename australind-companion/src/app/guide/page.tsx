import { days } from "@/data/trip";

export default function GuidePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Guide</h1>
      <p className="mt-1 text-sm text-muted">
        Short notes for each of the five riding days.
      </p>
      <ul className="mt-8 space-y-4">
        {days.map((day) => (
          <li
            key={day.id}
            className="rounded-2xl border border-line bg-surface px-4 py-4"
          >
            <h2 className="font-serif text-lg text-ink">
              Day {day.id} · {day.label}
            </h2>
            <p className="mt-2 text-sm text-muted">{day.notes}</p>
            <p className="mt-2 text-sm text-ink/80">{day.highlight}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
