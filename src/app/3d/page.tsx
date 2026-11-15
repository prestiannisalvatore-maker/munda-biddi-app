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
          Fly along the Stirling Ridge over satellite imagery (3D terrain when available) with the
          full GPX track ({routeCoordinates.length.toLocaleString()} points). Press ▶ to walk the
          trail from Gnowellen Road to Bluff Knoll.
        </p>
      </header>

      <div className="bg-red-50 border border-red-300 rounded-xl p-4 text-sm text-red-950">
        <strong>NOT for offline navigation.</strong> 3D Preview needs internet (satellite +
        elevation). On the ridge use <strong>Trail Map</strong> (after Prepare offline pack), plus
        a dedicated GPS, paper topo, and compass. Never treat this flyover as your only nav.
      </div>

      <Mapbox3DTrail />
    </div>
  );
}
