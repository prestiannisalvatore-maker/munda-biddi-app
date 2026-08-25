import Link from "next/link";
import { trailInfo, peaks, weatherInfo } from "@/data/stirlingRidgeData";

export default function Home() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-amber-800 via-amber-700 to-orange-600 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtOS45NDEgMC0xOCA4LjA1OS0xOCAxOHM4LjA1OSAxOCAxOCAxOCAxOC04LjA1OSAxOC0xOC04LjA1OS0xOC0xOC0xOHptMCAzMmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNC0xNCAxNCA2LjI2OCAxNCAxNC02LjI2OCAxNC0xNCAxNHoiIG9wYWNpdHk9Ii4wNSIgZmlsbD0iI2ZmZiIvPjwvZz48L3N2Zz4=')] opacity-30" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-24 text-center">
          <div className="text-amber-200 text-sm font-medium tracking-wide uppercase mb-4">
            Stirling Range National Park • {trailInfo.traditionalCustodians}
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Stirling Ridge Walk
          </h1>
          <p className="text-xl sm:text-2xl text-amber-100 mb-6 max-w-3xl mx-auto">
            Western Australia&apos;s most challenging multi-day hike across dramatic mountain peaks
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              📍 {trailInfo.distanceKm}km One Way
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              ⛰️ {trailInfo.elevationGainM}m Elevation
            </span>
            <span className="bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm">
              ⏱️ {trailInfo.duration}
            </span>
            <span className="bg-red-500/80 px-4 py-2 rounded-full backdrop-blur-sm font-semibold">
              ⚠️ Grade {trailInfo.gradeWA} - Expert Only
            </span>
          </div>
        </div>
      </section>

      {/* Quick Warning Banner */}
      <section className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h2 className="font-semibold text-red-800 text-lg mb-1">Important Warning</h2>
            <p className="text-red-700 text-sm">
              This is NOT a marked trail. It requires expert navigation skills, high fitness, and proper equipment. 
              Carry 4-5L of water per day as there are NO reliable water sources. Check weather conditions and 
              know all exit routes before departing. This should not be your first or second overnight hike.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/map"
          className="group p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
        >
          <div className="text-3xl mb-3">🗺️</div>
          <h2 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
            Trail Map
          </h2>
          <p className="text-sm text-slate-600">
            Interactive map showing the ridge route, peaks, and camping spots.
          </p>
        </Link>

        <Link
          href="/info"
          className="group p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
        >
          <div className="text-3xl mb-3">📋</div>
          <h2 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
            Trail Info
          </h2>
          <p className="text-sm text-slate-600">
            Comprehensive guide with directions, warnings, and essential information.
          </p>
        </Link>

        <Link
          href="/itinerary"
          className="group p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
        >
          <div className="text-3xl mb-3">📅</div>
          <h2 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
            Itinerary
          </h2>
          <p className="text-sm text-slate-600">
            Day-by-day breakdown with distances, waypoints, and camping options.
          </p>
        </Link>

        <Link
          href="/checklist"
          className="group p-6 rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-amber-300 transition-all"
        >
          <div className="text-3xl mb-3">✅</div>
          <h2 className="font-semibold text-slate-800 mb-2 group-hover:text-amber-700 transition-colors">
            Gear Checklist
          </h2>
          <p className="text-sm text-slate-600">
            Essential and recommended gear with interactive checklist.
          </p>
        </Link>
      </section>

      {/* Quick Facts */}
      <section className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span>📊</span> Quick Facts
          </h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Distance</dt>
              <dd className="font-medium text-slate-800">{trailInfo.distanceKm}km one way</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Total Elevation Gain</dt>
              <dd className="font-medium text-slate-800">{trailInfo.elevationGainM}m</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Duration</dt>
              <dd className="font-medium text-slate-800">{trailInfo.duration}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Difficulty Grade</dt>
              <dd className="font-medium text-red-600">Grade {trailInfo.gradeWA} (Expert Only)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Highest Point</dt>
              <dd className="font-medium text-slate-800">{trailInfo.highestPoint.name} ({trailInfo.highestPoint.elevation}m)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Best Time</dt>
              <dd className="font-medium text-slate-800">{trailInfo.bestTime}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Dog Friendly</dt>
              <dd className="font-medium text-slate-800">{trailInfo.dogFriendly ? "Yes" : "No"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Park Fees</dt>
              <dd className="font-medium text-slate-800">{trailInfo.cost}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4 flex items-center gap-2">
            <span>⛰️</span> Major Peaks ({peaks.length} summits)
          </h2>
          <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
            {peaks.map((peak) => (
              <div
                key={peak.id}
                className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0"
              >
                <span className="text-sm text-slate-700">{peak.name}</span>
                <span className="text-sm font-medium text-amber-700">{peak.elevation}m</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Weather Warning */}
      <section className="bg-amber-50 border border-amber-200 rounded-xl p-6">
        <h2 className="font-semibold text-lg text-amber-800 mb-3 flex items-center gap-2">
          <span>🌦️</span> Weather Conditions
        </h2>
        <p className="text-amber-900 text-sm mb-4">{weatherInfo.conditions}</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-amber-800 text-sm mb-2">Risks</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              {weatherInfo.risks.map((risk, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  {risk}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-medium text-amber-800 text-sm mb-2">Recommendations</h3>
            <ul className="text-sm text-amber-800 space-y-1">
              {weatherInfo.recommendations.map((rec, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-600 mt-1">•</span>
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Attribution */}
      <section className="text-center text-sm text-slate-500 py-4 border-t border-slate-200">
        <p>
          Trail information sourced from{" "}
          <a
            href="https://www.thelifeofpy.com/stirling-ridge-walk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:underline"
          >
            The Life of Py
          </a>
          ,{" "}
          <a
            href="https://trailswa.com.au/trails/trail-networks/stirling-range-national-park"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-600 hover:underline"
          >
            Trails WA
          </a>
          , and Parks WA.
        </p>
        <p className="mt-2">
          Traditional Custodians: Minang People (Koikyennuruff)
        </p>
      </section>
    </div>
  );
}
