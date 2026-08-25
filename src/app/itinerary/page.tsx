"use client";

import { useState } from "react";
import { itinerary, itinerary3Day, trailInfo } from "@/data/stirlingRidgeData";

export default function ItineraryPage() {
  const [selectedPlan, setSelectedPlan] = useState<"2day" | "3day">("2day");
  const currentItinerary = selectedPlan === "2day" ? itinerary : itinerary3Day;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Day-by-Day Itinerary</h1>
        <p className="text-slate-600">
          Detailed breakdown of the Stirling Ridge Walk from Ellen Peak to Bluff Knoll
        </p>
      </header>

      {/* Plan Selector */}
      <div className="flex justify-center">
        <div className="inline-flex bg-slate-100 rounded-lg p-1">
          <button
            onClick={() => setSelectedPlan("2day")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === "2day"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            2-Day Plan
          </button>
          <button
            onClick={() => setSelectedPlan("3day")}
            className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedPlan === "3day"
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            3-Day Plan
          </button>
        </div>
      </div>

      {/* Plan Overview */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <div className="grid sm:grid-cols-4 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-amber-700">{trailInfo.distanceKm}km</div>
            <div className="text-sm text-amber-600">Total Distance</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">{trailInfo.elevationGainM}m</div>
            <div className="text-sm text-amber-600">Elevation Gain</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">{currentItinerary.length}</div>
            <div className="text-sm text-amber-600">Days</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-700">
              {currentItinerary.length - 1}
            </div>
            <div className="text-sm text-amber-600">Nights on Ridge</div>
          </div>
        </div>
      </div>

      {/* Direction Note */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <p className="text-blue-800 text-sm">
          <strong>Note:</strong> This itinerary starts at the Ellen Peak (Gnowellen Road) end and finishes at 
          Bluff Knoll. This is the recommended direction as it&apos;s easier and faster to reach the ridge from 
          Bluff Knoll end (the only part with a maintained trail), making it a better exit point.
        </p>
      </div>

      {/* Day Cards */}
      <div className="space-y-6">
        {currentItinerary.map((day) => (
          <div
            key={day.day}
            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-amber-100 text-sm">Day {day.day}</span>
                  <h2 className="text-xl font-semibold">{day.title}</h2>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">{day.distanceKm}km</div>
                  <div className="text-amber-100 text-sm">{day.estimatedHours}</div>
                </div>
              </div>
            </div>

            {/* Day Content */}
            <div className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-slate-800">{day.distanceKm}km</div>
                  <div className="text-xs text-slate-500">Distance</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-slate-800">+{day.elevationGainM}m</div>
                  <div className="text-xs text-slate-500">Elevation Gain</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3 text-center">
                  <div className="text-lg font-semibold text-slate-800">{day.estimatedHours}</div>
                  <div className="text-xs text-slate-500">Time</div>
                </div>
              </div>

              {/* Description */}
              <p className="text-slate-700 mb-6">{day.description}</p>

              {/* Two Column Layout */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Waypoints */}
                <div>
                  <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <span>📍</span> Waypoints
                  </h3>
                  <ol className="space-y-2">
                    {day.waypoints.map((waypoint, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-xs font-medium">
                          {i + 1}
                        </span>
                        <span className="text-slate-700">{waypoint}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Highlights */}
                <div>
                  <h3 className="font-medium text-slate-800 mb-3 flex items-center gap-2">
                    <span>⭐</span> Highlights
                  </h3>
                  <ul className="space-y-2">
                    {day.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-slate-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Campsite */}
              {day.campsite && (
                <div className="mt-6 bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="flex items-center gap-2 text-green-800">
                    <span className="text-lg">🏕️</span>
                    <span className="font-medium">Tonight&apos;s Camp:</span>
                    <span>{day.campsite}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pre and Post Logistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span>🚗</span> Day Before
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Drive to Stirling Range area (4.5hrs from Perth, 1hr from Albany)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Stay at Stirling Range Retreat or Mt Trio Bush Camp
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Organise car shuttle - drop one car at Bluff Knoll car park
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Sign the walkers register at Bluff Knoll Road entrance
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Final gear and water check
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span>🎉</span> After Completion
          </h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Descend Bluff Knoll via maintained trail (3km, 1-1.5hrs)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Retrieve car from Gnowellen Road
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Celebrate at Bluff Knoll Cafe or Porongurup Inn
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Sign out of walker register
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Share your experience on the FB group!
            </li>
          </ul>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="font-semibold text-lg text-blue-800 mb-4">Pro Tips from The Life of Py</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              Start early on Day 1 - aim for dawn departure from Gnowellen Road
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              The first 6km along the fence line is flat walking - good warmup
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              Ellen Peak is the biggest single climb - pace yourself
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              The sword grass section around Pyungoorup is slow going
            </li>
          </ul>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              Baker&apos;s Knob Saddle has the best sunset views
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              The Arrows section is the most technical - take your time
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              Isongerup North has the best 360° views of the entire ridge
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">💡</span>
              Allow time for summit of Bluff Knoll at sunset if possible
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
