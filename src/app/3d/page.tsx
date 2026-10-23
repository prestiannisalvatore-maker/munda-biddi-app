import dynamic from "next/dynamic";
import { routeCoordinates } from "@/data/routeCoordinates";

const Mapbox3DTrail = dynamic(() => import("@/components/Mapbox3DTrail"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] sm:h-[600px] rounded-xl bg-slate-800 animate-pulse flex items-center justify-center">
      <span className="text-slate-400">Loading 3D trail preview...</span>
    </div>
  ),
});

export default function ThreeDPreviewPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-800">3D Trail Preview</h1>
        <p className="text-slate-600 mt-1">
          Fly along the Stirling Ridge in 3D satellite imagery with terrain contours and the full
          GPX track ({routeCoordinates.length.toLocaleString()} points). Press ▶ to walk the trail
          from Gnowellen Road to Bluff Knoll.
        </p>
      </header>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-900">
        <strong>Planning preview only.</strong> This 3D view needs an internet connection and a
        Mapbox token. Use the Trail Map tab for GPS, compass, and offline prep — and always carry a
        dedicated GPS, topo map, and compass on the hike.
      </div>

      <Mapbox3DTrail />
    </div>
  );
}
