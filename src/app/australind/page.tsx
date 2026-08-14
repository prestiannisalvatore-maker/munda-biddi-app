"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useTrip } from "@/context/TripContext";
import DaysItinerary from "@/components/DaysItinerary";
import { australindMeta } from "@/data/australindTrip";

export default function AustralindTripPage() {
  const { setTripId } = useTrip();

  useEffect(() => {
    setTripId("australind");
  }, [setTripId]);

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-600">
        {australindMeta.riders.join(" & ")} · {australindMeta.totalKm} km ·{" "}
        {australindMeta.ridingDays} days. Five calendar days only — Friday is
        the ride to Mandurah and the train home on the same card.
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
