"use client";

import Link from "next/link";
import { useEffect } from "react";
import { format, parseISO } from "date-fns";
import { useTrip } from "@/context/TripContext";
import {
  AUSTRALIND_COMPANION_URL,
  australindLegs,
  australindLogistics,
  australindMeta,
} from "@/data/australindTrip";

export default function AustralindTripPage() {
  const { setTripId } = useTrip();

  useEffect(() => {
    setTripId("australind");
  }, [setTripId]);

  return (
    <div className="space-y-10 max-w-4xl">
      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
          21–25 Sep 2026 · Australind · Munda Biddi · Mandurah line
        </p>
        <h1 className="text-4xl font-bold text-slate-800">
          Australind Munda Biddi
        </h1>
        <p className="text-lg text-slate-600">
          Train to Bunbury, five days of gravel north through hut nights and
          quiet forest, then off the scarp to Mandurah and home by rail. Built
          for Zino &amp; Sam — 21–25 Sep 2026.
        </p>
        <p className="text-sm text-slate-500">
          {australindMeta.riders.join(" & ")} · ~{australindMeta.totalKm} km ·{" "}
          {australindMeta.ridingDays} days
        </p>
        <a
          href={AUSTRALIND_COMPANION_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center rounded-xl bg-emerald-700 px-5 py-3 text-white font-semibold shadow-sm hover:bg-emerald-800"
        >
          Open GPS companion (tracking only)
        </a>
      </header>

      <section className="grid sm:grid-cols-3 gap-4">
        <Link
          href="/schedule"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"
        >
          <h2 className="font-semibold text-slate-800">Schedule</h2>
          <p className="mt-1 text-sm text-slate-600">
            Five days with times and overnight stops
          </p>
        </Link>
        <Link
          href="/map"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"
        >
          <h2 className="font-semibold text-slate-800">Map</h2>
          <p className="mt-1 text-sm text-slate-600">
            Bunbury → Mandurah on the northern Munda Biddi
          </p>
        </Link>
        <Link
          href="/calendar"
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:border-emerald-300"
        >
          <h2 className="font-semibold text-slate-800">Calendar</h2>
          <p className="mt-1 text-sm text-slate-600">21–25 September 2026</p>
        </Link>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-800">Itinerary</h2>
        <p className="text-sm text-slate-600">
          Five calendar days. Friday 25 September is one day: ride to Mandurah,
          then the train home that evening.
        </p>
        <div className="space-y-4">
          {australindLegs.map((leg) => {
            const dayGates = australindLogistics.filter(
              (gate) => gate.dayId === leg.id
            );
            return (
              <article
                key={leg.date}
                className={`rounded-xl border bg-white shadow-sm overflow-hidden ${
                  leg.amber ? "border-amber-300" : "border-slate-200"
                }`}
              >
                <div className="px-5 py-4 border-b border-slate-100 bg-slate-50">
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    {leg.section}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold text-slate-800">
                    {format(parseISO(leg.date), "EEEE d MMMM yyyy")}
                  </h3>
                  <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-medium text-slate-800">
                      {leg.label}
                    </span>
                    <span className="text-sm font-medium text-emerald-700">
                      {leg.distanceKm} km riding
                    </span>
                    {leg.amber && (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-800">
                        Amber day
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 space-y-2 text-sm text-slate-700">
                  <p>{leg.route}</p>
                  {leg.logistics && leg.logistics.length > 0 && (
                    <ul className="list-disc pl-5 text-slate-600 space-y-1">
                      {leg.logistics.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  <p className="text-slate-600">{leg.highlight}</p>
                  <p>
                    <span className="font-medium">Overnight:</span>{" "}
                    {leg.endType === "hut" || leg.overnight === "camp"
                      ? leg.camping !== "n/a"
                        ? leg.camping
                        : leg.end
                      : leg.motel !== "n/a"
                        ? leg.motel
                        : leg.end}
                  </p>
                  <p className="text-slate-600">{leg.notes}</p>
                  {dayGates.length > 0 && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3 space-y-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Same day — prep
                      </p>
                      {dayGates.map((gate) => (
                        <p key={gate.id} className="text-slate-600">
                          <span className="font-medium text-slate-800">
                            {gate.title}.
                          </span>{" "}
                          {gate.detail}
                        </p>
                      ))}
                    </div>
                  )}
                  {leg.googleMapsDirections && (
                    <a
                      href={leg.googleMapsDirections}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block text-emerald-700 font-medium hover:underline"
                    >
                      Directions
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-xl bg-slate-100 p-6 space-y-3">
        <h2 className="font-semibold text-slate-800">Trail notes</h2>
        <p className="text-sm text-slate-700">
          Quiet mid-winter scout on this section found more singletrack than
          previous years, a new river crossing before the Dwellingup climb, and
          stronger anti-vehicle gates. Day 3 is the commitment day — carry more
          water and calories than you think, a strong light, and a way to call
          for help in the forest. Town nights in Collie and Dwellingup are the
          recharge points.
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <a
            href="https://mundabiddi.org.au/pages/route-updates"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-800 font-medium hover:underline"
          >
            Route updates
          </a>
          <a
            href="https://alerts.dbca.wa.gov.au/"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-800 font-medium hover:underline"
          >
            DBCA Park Alerts
          </a>
          <a
            href="https://www.transwa.wa.gov.au/"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-800 font-medium hover:underline"
          >
            Transwa Australind
          </a>
        </div>
      </section>
    </div>
  );
}
