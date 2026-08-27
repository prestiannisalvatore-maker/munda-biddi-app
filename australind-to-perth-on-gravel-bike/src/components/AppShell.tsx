import { Link, useLocation, Outlet } from "react-router-dom";

const desktopNav = [
  { href: "/itinerary", label: "Days" },
  { href: "/track", label: "Track" },
  { href: "/logistics", label: "Logistics" },
  { href: "/guide", label: "Guide" },
  { href: "/family", label: "Family" },
  { href: "/emergency", label: "SOS" },
  { href: "/more", label: "More" },
];

const bottomNav = [
  { href: "/", label: "Home" },
  { href: "/itinerary", label: "Days" },
  { href: "/track", label: "Track" },
  { href: "/logistics", label: "Prep" },
  { href: "/more", label: "More" },
];

export default function AppShell() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-line bg-surface/90 pt-[env(safe-area-inset-top)] backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5">
          <Link className="min-w-0" to="/">
            <p className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-ocean">
              Zino & Sam
            </p>
            <p className="truncate font-serif text-base leading-tight text-ink sm:text-lg">
              Australind Munda
            </p>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {desktopNav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`rounded-md px-3 py-1.5 text-sm transition ${
                    active
                      ? "bg-bush-soft text-bush"
                      : "text-muted hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <Link
            className="shrink-0 rounded-md bg-ink px-3 py-1.5 text-xs font-semibold text-sand md:hidden"
            to="/track"
          >
            Track
          </Link>
        </div>
      </header>
      <main className="flex-1 pb-[calc(4.25rem+env(safe-area-inset-bottom))] md:pb-0">
        <Outlet />
      </main>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <ul className="mx-auto grid max-w-lg grid-cols-5 gap-0.5 px-1.5 py-1.5">
          {bottomNav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <li key={item.href}>
                <Link
                  to={item.href}
                  className={`flex min-h-12 flex-col items-center justify-center rounded-xl px-1 text-[11px] font-semibold tracking-wide ${
                    active ? "bg-bush-soft text-bush" : "text-muted"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
