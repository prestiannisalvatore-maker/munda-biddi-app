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
          Stirling Ridge Walk route from Ellen Peak to Bluff Knoll with topography
        </p>
      </header>

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
          <h2 className="font-semibold text-lg text-slate-800 mb-4">Map Tips</h2>
          <ul className="space-y-2 text-sm text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Click on any marker for more information about that location
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Use the layer control (top right) to switch between topographic and satellite views
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Toggle peaks and campsites using the checkboxes above the map
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              Zoom in to see more detail of the terrain and route
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500 mt-0.5">•</span>
              The orange line shows the approximate ridge route
            </li>
          </ul>
        </div>
      </div>

      {/* External Maps */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h2 className="font-semibold text-lg text-blue-800 mb-4">GPS & Offline Maps</h2>
        <p className="text-blue-700 text-sm mb-4">
          This overview map is for planning purposes. For hiking, you need proper offline GPS maps.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <a
            href="https://www.alltrails.com/trail/australia/western-australia/stirling-ranges-ridge-walk"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📱</span>
            <div>
              <div className="font-medium text-blue-800">AllTrails</div>
              <div className="text-xs text-blue-600">Download for offline use</div>
            </div>
          </a>
          <a
            href="https://www.facebook.com/groups/stirlingridgewalk/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📂</span>
            <div>
              <div className="font-medium text-blue-800">Facebook Group Files</div>
              <div className="text-xs text-blue-600">GPX files and detailed routes</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
