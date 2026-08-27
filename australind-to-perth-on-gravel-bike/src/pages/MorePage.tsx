import { Link } from "react-router-dom";

const links = [
  { href: "/guide", title: "Guide", detail: "Trail notes for the six days" },
  { href: "/packing", title: "Packing", detail: "What to carry" },
  { href: "/family", title: "Family", detail: "Share a check-in" },
  { href: "/emergency", title: "SOS", detail: "Emergency contacts" },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="font-serif text-3xl text-ink">More</h1>
      <p className="mt-1 text-sm text-muted">
        Guide, packing, family share, and SOS for the Australind week.
      </p>
      <ul className="mt-8 grid gap-3">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              to={item.href}
              className="block rounded-2xl border border-line bg-surface px-5 py-4 transition hover:border-bush/30 hover:shadow-sm"
            >
              <p className="font-serif text-xl text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
      
      <div className="mt-10 rounded-2xl border border-line bg-surface px-5 py-4">
        <h2 className="font-serif text-lg text-ink">Useful Links</h2>
        <ul className="mt-3 space-y-2 text-sm">
          <li>
            <a
              href="https://mundabiddi.org.au/pages/route-updates"
              target="_blank"
              rel="noreferrer"
              className="text-ocean underline-offset-2 hover:underline"
            >
              Munda Biddi Route Updates
            </a>
          </li>
          <li>
            <a
              href="https://www.transwa.wa.gov.au/"
              target="_blank"
              rel="noreferrer"
              className="text-ocean underline-offset-2 hover:underline"
            >
              Transwa (Australind train)
            </a>
          </li>
          <li>
            <a
              href="https://www.transperth.wa.gov.au/"
              target="_blank"
              rel="noreferrer"
              className="text-ocean underline-offset-2 hover:underline"
            >
              Transperth (Mandurah line)
            </a>
          </li>
          <li>
            <a
              href="https://parks.dpaw.wa.gov.au/"
              target="_blank"
              rel="noreferrer"
              className="text-ocean underline-offset-2 hover:underline"
            >
              WA Parks & Wildlife
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
