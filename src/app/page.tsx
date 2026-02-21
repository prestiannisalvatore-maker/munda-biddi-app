import Link from "next/link";

export default function Home() {
  return (
    <div
      className="relative min-h-[calc(100vh-8rem)] -mx-4 sm:-mx-6 lg:-mx-8 -mt-8 rounded-xl overflow-hidden"
      style={{
        backgroundImage: "url(/zino-sam-photo.jpg)",
        backgroundSize: "contain",
        backgroundPosition: "left center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#1a2e1a",
      }}
    >
      <div className="absolute inset-0 bg-black/10" aria-hidden />
      <div className="relative z-10 flex flex-col lg:flex-row min-h-[calc(100vh-8rem)] px-4 sm:px-6 lg:px-8 py-12">
        <div className="hidden lg:block flex-1 min-w-0" aria-hidden />
        <div className="flex flex-col justify-center space-y-8 flex-shrink-0 w-full max-w-2xl mx-auto lg:px-4">
      <header className="text-center space-y-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-white drop-shadow-lg">
          Zino and Sam Prestianni
        </h1>
        <p className="text-xl text-white font-semibold drop-shadow-md">
          Munda Biddi End to End Planning — May 2027
        </p>
        <p className="text-slate-100 max-w-2xl mx-auto drop-shadow-md">
          Plan your 1,067 km cycling adventure from Mundaring to Albany along
          Western Australia&apos;s world-class off-road trail.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/map"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Trail Map</h2>
          <p className="text-sm text-slate-600">
            Interactive map with topography and the trail highlighted in red.
          </p>
        </Link>
        <Link
          href="/info"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Trail Info</h2>
          <p className="text-sm text-slate-600">
            Comprehensive guide from the Munda Biddi Trail Guide.
          </p>
        </Link>
        <Link
          href="/distance-calculator"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Distance Calculator</h2>
          <p className="text-sm text-slate-600">
            Calculate distances between campsites and towns.
          </p>
        </Link>
        <Link
          href="/schedule"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Schedule</h2>
          <p className="text-sm text-slate-600">
            Day-by-day plan with km, times, and accommodation.
          </p>
        </Link>
        <Link
          href="/calendar"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Calendar</h2>
          <p className="text-sm text-slate-600">
            View your trip on a calendar.
          </p>
        </Link>
        <Link
          href="/checklist"
          className="block p-6 rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all"
        >
          <h2 className="font-semibold text-slate-800 mb-2">Checklist</h2>
          <p className="text-sm text-slate-600">
            Gear and planning checklist with tick boxes.
          </p>
        </Link>
      </div>

      <div className="rounded-xl bg-white/40 backdrop-blur-sm border border-white/30 p-6">
        <h3 className="font-semibold text-emerald-800 mb-2">Quick Facts</h3>
        <ul className="text-sm text-emerald-900 space-y-1">
          <li>• Distance: 1,067 km (663 miles)</li>
          <li>• Route: Mundaring to Albany</li>
          <li>• 12 purpose-built campsites</li>
          <li>• 15+ trail towns</li>
          <li>• Typical duration: 3–4 weeks</li>
        </ul>
      </div>
        </div>
        <div className="flex-1 min-w-[280px] flex items-stretch">
          <img
            src="/hero-photo.jpg"
            alt="Cycling on Munda Biddi Trail"
            className="rounded-xl shadow-xl object-cover w-full h-full min-h-[350px]"
          />
        </div>
      </div>
    </div>
  );
}
