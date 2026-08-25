import dynamic from "next/dynamic";
import { trailInfo, peaks } from "@/data/stirlingRidgeData";

const StirlingMap = dynamic(() => import("@/components/StirlingMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] rounded-xl bg-slate-200 animate-pulse flex items-center justify-center">
      <span className="text-slate-500">Loading map...</span>
    </div>
  ),
});

export default function MapPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">Trail Map</h1>
        <p className="text-slate-600 mt-1">
          Stirling Ridge Walk overview - Bluff Knoll to Ellen Peak
        </p>
      </header>

      {/* CRITICAL WARNING */}
      <div className="bg-red-100 border-2 border-red-400 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-3xl">⚠️</span>
          <div>
            <h2 className="font-bold text-red-800 text-lg mb-2">CRITICAL: Do NOT Use This Map for Navigation</h2>
            <p className="text-red-700 text-sm mb-3">
              This map shows <strong>approximate</strong> locations for planning purposes only. 
              The coordinates and route line are indicative and may not be accurate.
            </p>
            <p className="text-red-800 font-semibold text-sm">
              For actual hiking navigation, you MUST download verified GPX tracks from AllTrails 
              or the Stirling Ridge Walk Facebook Group. Carry a proper GPS device, topographic map, 
              and compass. Your life depends on proper navigation equipment.
            </p>
          </div>
        </div>
      </div>

      <StirlingMap />

      {/* Map Info */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Route Overview</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-600">Total Distance</dt>
              <dd className="font-medium text-slate-800">{trailInfo.distanceKm}km</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Total Elevation Gain</dt>
              <dd className="font-medium text-slate-800">{trailInfo.elevationGainM}m</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Highest Point</dt>
              <dd className="font-medium text-amber-700">{trailInfo.highestPoint.name} ({trailInfo.highestPoint.elevation}m)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Lowest Point</dt>
              <dd className="font-medium text-slate-800">{trailInfo.lowestPoint.name} ({trailInfo.lowestPoint.elevation}m)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-600">Number of Peaks</dt>
              <dd className="font-medium text-slate-800">{peaks.length}</dd>
            </div>
          </dl>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Map Limitations</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              Peak and campsite locations are approximate
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              Route line is indicative only - not the actual trail
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠️</span>
              This map is NOT suitable for navigation
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Use layer control (top right) for satellite view
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Click markers for location information
            </li>
          </ul>
        </div>
      </div>

      {/* Required Navigation Resources */}
      <div className="bg-green-50 rounded-xl border-2 border-green-400 p-6">
        <h2 className="font-bold text-lg text-green-800 mb-4">✅ Required Navigation Resources</h2>
        <p className="text-green-700 text-sm mb-4">
          Download these BEFORE your hike. Test that they work offline. Your life depends on proper navigation.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.alltrails.com/trail/australia/western-australia/stirling-range-ridge-walk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-green-300 hover:bg-green-50 transition-colors"
          >
            <span className="text-3xl">📱</span>
            <div>
              <div className="font-bold text-green-800">AllTrails GPX Track</div>
              <div className="text-sm text-green-600">Download for offline use - ESSENTIAL</div>
            </div>
          </a>
          <a
            href="https://www.facebook.com/groups/stirlingridgewalk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-green-300 hover:bg-green-50 transition-colors"
          >
            <span className="text-3xl">📂</span>
            <div>
              <div className="font-bold text-green-800">Facebook Group GPX Files</div>
              <div className="text-sm text-green-600">Community-verified tracks and waypoints</div>
            </div>
          </a>
          <a
            href="https://www.trailhiking.com.au/hikes/stirling-range-ridge-traverse/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-green-300 hover:bg-green-50 transition-colors"
          >
            <span className="text-3xl">🗺️</span>
            <div>
              <div className="font-bold text-green-800">Trail Hiking Australia GPX</div>
              <div className="text-sm text-green-600">Detailed route with elevation data</div>
            </div>
          </a>
          <a
            href="https://fastestknowntime.com/route/stirling-range-ridge-walk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-green-300 hover:bg-green-50 transition-colors"
          >
            <span className="text-3xl">⏱️</span>
            <div>
              <div className="font-bold text-green-800">Fastest Known Time GPX</div>
              <div className="text-sm text-green-600">Verified route files</div>
            </div>
          </a>
        </div>
      </div>

      {/* Navigation Equipment Reminder */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h2 className="font-semibold text-lg text-amber-800 mb-4">Required Navigation Equipment</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-amber-800">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              GPS device with offline maps and GPX track loaded
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              1:25,000 topographic map of the area
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              Compass (and know how to use it)
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              Personal Locator Beacon (PLB)
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              Backup power for GPS device
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">✓</span>
              Knowledge of all exit routes
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
