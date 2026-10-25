"use client";

import Link from "next/link";

export default function OfflineStatusBanner() {
  return (
    <div className="bg-red-900 text-white text-center text-sm px-3 py-2">
      Airplane Mode: use{" "}
      <a href="/field.html" className="underline font-bold">
        Field Mode
      </a>{" "}
      (Add to Home Screen from that page) — not a Safari tab.{" "}
      <Link href="/" className="underline">
        Instructions on Home
      </Link>
      .
    </div>
  );
}
