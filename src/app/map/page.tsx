import dynamic from "next/dynamic";

const TrailMap = dynamic(() => import("@/components/TrailMap"), {
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
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trail Map</h1>
        <p className="text-slate-600 mt-1">
          Munda Biddi Trail from Mundaring to Albany with topography
        </p>
      </div>
      <TrailMap />
    </div>
  );
}
