"use client";

import { TripProvider } from "@/context/TripContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <TripProvider>{children}</TripProvider>;
}
