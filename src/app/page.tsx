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
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-normal text-white drop-shadow-lg tracking-tight" style={{ fontFamily: "'Pacifico', cursive" }}>
          Zino and Sam Prestianni
        </h1>
        <p className="text-xl text-white font-semibold drop-shadow-md">
          Australind Munda Biddi — 21–25 Sep 2026
        </p>
        <p className="text-slate-100 max-w-2xl mx-auto drop-shadow-md">
          Train to Bunbury, five days north on the Munda Biddi, then Mandurah
          and home by rail. The May 2027 end-to-end plan is still here too.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-6">
        <Link
          href="/australind"
          className="block p-6 rounded-xl bg-emerald-700/80 backdrop-blur-sm border border-white/30 shadow-lg hover:shadow-xl hover:border-emerald-200 transition-all sm:col-span-2"
        >
          <h2 className="font-semibold text-white mb-2">Australind trip</h2>
          <p className="text-sm text-emerald-50">
            ~259 km · Bunbury → Nglang Boodja → Collie → Brockman Lake →
            Dwellingup → Mandurah. Itinerary, logistics, and a link to the live
            GPS companion.
          </p>
        </Link>
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
          <li>• Australind trip: ~259 km · 5 riding days · 21–25 Sep 2026</li>
          <li>• Route: Australind train → Bunbury → Mandurah line home</li>
          <li>• Hut, lodge, bush camp, and caravan-park hut nights</li>
          <li>• End-to-end (Mundaring–Albany) still available in Trip</li>
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
