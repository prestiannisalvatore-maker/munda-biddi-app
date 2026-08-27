import { useState } from "react";
import { days, routeLocations } from "../data/trip";
import RouteMap from "../components/RouteMap";

export default function TrackPage() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">Track</h1>
      <p className="mt-1 text-sm text-muted">
        Six riding days, Bunbury to Mandurah. ~269 km total via the Munda Biddi trail.
      </p>

      <div className="mt-6">
        <RouteMap selectedDay={selectedDay ?? undefined} height="350px" />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedDay(null)}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
            selectedDay === null
              ? "bg-bush text-sand"
              : "bg-surface border border-line text-muted hover:text-ink"
          }`}
        >
          All Days
        </button>
        {[1, 2, 3, 4, 5, 6].map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
              selectedDay === day
                ? "bg-bush text-sand"
                : "bg-surface border border-line text-muted hover:text-ink"
            }`}
          >
            Day {day}
          </button>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-4">
        <h2 className="font-serif text-lg text-ink">Route Legend</h2>
        <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-green-600"></span>
            <span className="text-muted">Start (Bunbury)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-red-600"></span>
            <span className="text-muted">End (Mandurah)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-amber-600"></span>
            <span className="text-muted">Hut</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-blue-600"></span>
            <span className="text-muted">Town</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-3 w-3 rounded-full bg-purple-600"></span>
            <span className="text-muted">Bush Camp</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-block h-1 w-6 bg-warn rounded"></span>
            <span className="text-muted">Long Day (Day 6)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4 py-4">
        <h2 className="font-serif text-lg text-ink">Key Locations</h2>
        <ul className="mt-3 space-y-3">
          {routeLocations.map((loc, idx) => (
            <li key={loc.name} className="flex gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-bush-soft text-xs font-bold text-bush">
                {idx + 1}
              </div>
              <div>
                <p className="font-medium text-ink">{loc.name}</p>
                <p className="text-sm text-muted">{loc.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <h2 className="mt-8 font-serif text-xl text-ink">Daily Distances</h2>
      <ol className="mt-4 space-y-3">
        {days.map((day) => (
          <li
            key={day.id}
            onClick={() => setSelectedDay(day.id)}
            className={`cursor-pointer rounded-2xl border bg-surface px-4 py-3 transition hover:border-bush/40 ${
              selectedDay === day.id ? "border-bush" : "border-line"
            } ${day.amber ? "border-warn/40" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-ocean">
                  Day {day.id}
                </p>
                <p className="font-serif text-lg text-ink">{day.label}</p>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${day.amber ? "text-warn" : "text-ink"}`}>
                  {day.distanceKm} km
                </p>
                {day.amber && (
                  <p className="text-xs font-medium text-warn">Long day</p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 rounded-2xl border border-line bg-surface-2 px-4 py-4">
        <p className="text-sm text-muted">
          <strong className="text-ink">Total:</strong> ~269 km over 6 riding days. 
          Stopping at Yarri campsite breaks up the long stretch between Collie and Brockman Lake.
        </p>
      </div>
    </div>
  );
}
