"use client";

import { useState } from "react";
import {
  allLocations,
  getDistanceBetween,
  getCumulativeDistances,
} from "@/data/trailData";

export default function DistanceCalculatorPage() {
  const [from, setFrom] = useState(allLocations[0]);
  const [to, setTo] = useState(allLocations[allLocations.length - 1]);

  const distance = getDistanceBetween(from, to);
  const cumulative = getCumulativeDistances();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Distance Calculator</h1>
        <p className="text-slate-600 mt-1">
          Calculate distances between campsites and towns (similar to mundabiddi.org.au)
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 sm:p-8">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              From
            </label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              To
            </label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-4 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              {allLocations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 p-6 rounded-lg bg-emerald-50 border border-emerald-100">
          <p className="text-sm text-emerald-800 font-medium">Distance</p>
          <p className="text-3xl font-bold text-emerald-700 mt-1">
            {distance !== null ? `${distance} km` : "—"}
          </p>
          {from === to && (
            <p className="text-sm text-slate-600 mt-2">Select different locations</p>
          )}
        </div>

        <div className="mt-8">
          <h3 className="font-semibold text-slate-800 mb-4">
            Cumulative distances from Mundaring
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-2 font-medium text-slate-700">
                    Location
                  </th>
                  <th className="text-right py-2 font-medium text-slate-700">
                    km from Mundaring
                  </th>
                </tr>
              </thead>
              <tbody>
                {allLocations.map((loc) => (
                  <tr
                    key={loc}
                    className={`border-b border-slate-100 ${
                      loc === from || loc === to ? "bg-emerald-50" : ""
                    }`}
                  >
                    <td className="py-2 text-slate-800">{loc}</td>
                    <td className="py-2 text-right text-slate-600">
                      {cumulative.get(loc) ?? 0} km
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
