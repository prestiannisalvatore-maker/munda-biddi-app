import { logisticsGates } from "@/data/trip";

export default function LogisticsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Logistics</h1>
      <p className="mt-1 text-sm text-muted">
        Bookings and gates for the six riding days. The Mandurah train is the
        same Saturday as Day 6.
      </p>
      <ul className="mt-8 space-y-4">
        {logisticsGates.map((gate) => (
          <li
            key={gate.title}
            className="rounded-2xl border border-line bg-surface px-4 py-4"
          >
            <h2 className="font-serif text-lg text-ink">{gate.title}</h2>
            <p className="mt-1 text-sm text-muted">{gate.detail}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
