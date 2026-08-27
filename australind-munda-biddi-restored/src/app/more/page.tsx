import Link from "next/link";

const links = [
  { href: "/guide", title: "Guide", detail: "Trail notes for the five days" },
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
              href={item.href}
              className="block rounded-2xl border border-line bg-surface px-5 py-4"
            >
              <p className="font-serif text-xl text-ink">{item.title}</p>
              <p className="mt-1 text-sm text-muted">{item.detail}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
