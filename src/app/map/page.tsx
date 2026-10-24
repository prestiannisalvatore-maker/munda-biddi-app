import dynamic from "next/dynamic";
import Link from "next/link";

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
    <div className="space-y-4">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Trail Map</h1>
          <p className="text-slate-600 mt-1">
            GPS, compass, peaks, and camps — Stirling Ridge Walk
          </p>
        </div>
        <Link
          href="/help"
          className="text-sm font-medium text-amber-700 hover:text-amber-800 underline underline-offset-2"
        >
          How to use this map → Help
        </Link>
      </header>

      <p className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
        Planning only — not for sole navigation. See{" "}
        <Link href="/help" className="font-semibold underline">
          Help
        </Link>{" "}
        for GPX download, offline setup, and safety notes.
      </p>

      <StirlingMap />
    </div>
  );
}
