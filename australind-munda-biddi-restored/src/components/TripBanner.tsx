"use client";

import Link from "next/link";
import { useTrip } from "@/context/TripContext";
import { trips, type TripId } from "@/data/trips";

const order: TripId[] = ["australind", "e2e"];

export default function TripBanner() {
  const { tripId, setTripId } = useTrip();

  return (
    <div className="border-b border-slate-200 bg-emerald-50/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-emerald-800">
          Trip
        </span>
        <div className="flex flex-wrap gap-1">
          {order.map((id) => {
            const trip = trips[id];
            const active = tripId === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => setTripId(id)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                  active
                    ? "bg-emerald-700 text-white"
                    : "bg-white text-slate-700 hover:bg-emerald-100"
                }`}
              >
                {trip.shortName}
                <span className="ml-1.5 text-xs opacity-80">{trip.dateLabel}</span>
              </button>
            );
          })}
        </div>
        {tripId === "australind" && (
          <Link
            href="/australind"
            className="ml-auto text-sm font-medium text-emerald-800 hover:underline"
          >
            Australind trip details →
          </Link>
        )}
      </div>
    </div>
  );
}
