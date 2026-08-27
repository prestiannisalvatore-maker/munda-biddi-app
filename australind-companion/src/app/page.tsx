import Link from "next/link";

const cards = [
  {
    href: "/itinerary",
    title: "Itinerary",
    detail: "Six trail days · trains bookending the week",
    primary: true,
  },
  {
    href: "/track",
    title: "Track",
    detail: "Live GPS on the Bunbury → Mandurah ride line",
  },
  {
    href: "/logistics",
    title: "Logistics",
    detail: "Australind, lodges, Days 3-4 food, offline maps",
  },
  {
    href: "/family",
    title: "Share with family",
    detail: "Check in and send them a private link",
  },
  {
    href: "/emergency",
    title: "SOS",
    detail: "Emergency contacts on this phone",
  },
  {
    href: "/more",
    title: "More",
    detail: "Guide, packing, journal, offline maps",
  },
];

export default function HomePage() {
  return (
    <div className="topo-wash relative min-h-[100dvh] overflow-hidden">
      <section className="relative mx-auto flex min-h-[100dvh] max-w-6xl flex-col justify-end px-5 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(3rem,env(safe-area-inset-top))] md:justify-center md:pb-24">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean">
            21–26 Sep 2026 · Australind · Munda Biddi · Mandurah line
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-ink sm:text-5xl md:text-6xl">
            Australind
            <br />
            Munda Biddi
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-lg">
            Train to Bunbury, six days of gravel north through hut nights and
            quiet forest, then off the scarp to Mandurah and home by rail. Built
            for Zino & Sam — the week you keep looking at on the calendar.
          </p>
          <div className="mt-7 grid gap-3">
            {cards.map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className={`rounded-2xl border px-5 py-4 transition active:scale-[0.99] ${
                  card.primary
                    ? "border-ink bg-ink text-sand shadow-sm"
                    : "border-line/80 bg-surface/85 text-ink backdrop-blur-sm"
                }`}
              >
                <p
                  className={`font-serif text-2xl ${
                    card.primary ? "text-sand" : "text-ink"
                  }`}
                >
                  {card.title}
                </p>
                <p
                  className={`mt-1 text-sm ${
                    card.primary ? "text-sand/80" : "text-muted"
                  }`}
                >
                  {card.detail}
                </p>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
          <span className="font-medium text-ink/80">~269 km · 6 riding days</span>
          <a
            href="https://mundabiddi.org.au/pages/route-updates"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ocean underline-offset-2 hover:underline"
          >
            Route updates
          </a>
          <a
            href="https://www.transwa.wa.gov.au/"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-ocean underline-offset-2 hover:underline"
          >
            Transwa Australind
          </a>
        </div>
      </section>
    </div>
  );
}
