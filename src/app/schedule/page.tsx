"use client";

import { useState } from "react";
import {
  defaultSchedule,
  accommodationSuggestions,
  type ScheduleDay,
} from "@/data/scheduleData";

export default function SchedulePage() {
  const [schedule] = useState<ScheduleDay[]>(defaultSchedule);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trip Schedule</h1>
        <p className="text-slate-600 mt-1">
          Day-by-day plan with distances, times, and accommodation
        </p>
      </div>

      <div className="space-y-4">
        {schedule.map((day) => {
          const suggestions = accommodationSuggestions[day.accommodation];
          const isTown = day.accommodationType !== "campsite";

          return (
            <div
              key={day.day}
              className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
            >
              <div className="flex flex-wrap sm:flex-nowrap gap-4 p-6">
                <div className="flex-shrink-0 w-14 h-14 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg">
                  {day.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="font-semibold text-slate-800">
                      {day.from} → {day.to}
                    </span>
                    <span className="text-emerald-600 font-medium">
                      {day.km} km
                    </span>
                    <span className="text-slate-500 text-sm">
                      (cumulative: {day.cumulativeKm} km)
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-600">
                    <span>Start: {day.startTime}</span>
                    <span>Lunch: {day.lunchTime}</span>
                    <span>Finish: {day.finishTime}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-sm text-slate-600">Accommodation:</span>
                    <span
                      className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${
                        isTown
                          ? "bg-amber-100 text-amber-800"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {day.accommodation}
                      {isTown ? ` (${day.accommodationType})` : " (campsite)"}
                    </span>
                  </div>
                  {day.notes && (
                    <p className="mt-2 text-sm text-emerald-700 font-medium">
                      {day.notes}
                    </p>
                  )}
                </div>
              </div>
              {isTown && suggestions && suggestions.length > 0 && (
                <div className="px-6 pb-6 pt-0">
                  <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">
                    Suggested accommodation
                  </p>
                  <ul className="text-sm text-slate-600">
                    {suggestions.map((s, i) => (
                      <li key={i}>• {s}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="rounded-xl bg-slate-100 p-6">
        <p className="font-semibold text-slate-800">Total: 1,060.8 km</p>
        <p className="text-sm text-slate-600 mt-1">
          {schedule.length} days • May 1–17, 2027
        </p>
      </div>
    </div>
  );
}
