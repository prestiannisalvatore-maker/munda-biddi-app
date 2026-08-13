"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTrip } from "@/context/TripContext";
import DaysItinerary from "@/components/DaysItinerary";
import {
  AUSTRALIND_COMPANION_URL,
  australindMeta,
} from "@/data/australindTrip";

export default function AustralindTripPage() {
  const { setTripId } = useTrip();

  useEffect(() => {
    setTripId("australind");
  }, [setTripId]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {australindMeta.riders.join(" & ")} · {australindMeta.totalKm} km ·{" "}
        {australindMeta.ridingDays} days. GPS tracking stays on the{" "}
        <a
          href={AUSTRALIND_COMPANION_URL}
          className="font-medium text-emerald-800 underline"
          target="_blank"
          rel="noreferrer"
        >
          live companion
        </a>
        ; this itinerary is five calendar days only.
      </p>
      <DaysItinerary />
      <p className="text-sm text-slate-500">
        Also on the{" "}
        <Link href="/schedule" className="text-emerald-800 underline">
          schedule
        </Link>{" "}
        and{" "}
        <Link href="/calendar" className="text-emerald-800 underline">
          calendar
        </Link>
        .
      </p>
    </div>
  );
}
