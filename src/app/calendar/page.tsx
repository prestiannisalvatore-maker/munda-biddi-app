"use client";

import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { defaultSchedule } from "@/data/scheduleData";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2027, 4, 1)); // May 2027

  const scheduleByDate = new Map<string, { from: string; to: string; km: number }>();
  defaultSchedule.forEach((d) => {
    scheduleByDate.set(d.date, { from: d.from, to: d.to, km: d.km });
  });

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days: Date[] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trip Calendar</h1>
        <p className="text-slate-600 mt-1">
          Your scheduled trip: May 1–17, 2027
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            ← Prev
          </button>
          <h2 className="font-semibold text-slate-800">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
          >
            Next →
          </button>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((d) => (
              <div
                key={d}
                className="text-center text-xs font-medium text-slate-500 py-2"
              >
                {d}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const dateStr = format(d, "yyyy-MM-dd");
              const schedule = scheduleByDate.get(dateStr);
              const isTripDay = !!schedule;
              const isCurrentMonth = isSameMonth(d, currentMonth);

              return (
                <div
                  key={d.toISOString()}
                  className={`min-h-[80px] p-2 rounded-lg border ${
                    isTripDay
                      ? "bg-emerald-50 border-emerald-200"
                      : isCurrentMonth
                      ? "bg-white border-slate-100"
                      : "bg-slate-50 border-slate-100"
                  } ${!isCurrentMonth ? "opacity-50" : ""}`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isCurrentMonth ? "text-slate-800" : "text-slate-400"
                    }`}
                  >
                    {format(d, "d")}
                  </span>
                  {schedule && (
                    <div className="mt-1 text-xs text-emerald-700">
                      <div className="font-medium truncate" title={`${schedule.from} → ${schedule.to}`}>
                        {schedule.from} → {schedule.to}
                      </div>
                      <div className="text-emerald-600">{schedule.km} km</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4">
        <p className="text-sm font-medium text-emerald-800">Trip dates</p>
        <p className="text-emerald-700 mt-1">
          May 1–17, 2027 • 17 days on trail
        </p>
      </div>
    </div>
  );
}
