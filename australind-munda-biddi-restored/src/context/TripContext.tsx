"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  TRIP_STORAGE_KEY,
  trips,
  type TripId,
  type TripSummary,
} from "@/data/trips";

interface TripContextValue {
  tripId: TripId;
  trip: TripSummary;
  setTripId: (id: TripId) => void;
  hydrated: boolean;
}

const TripContext = createContext<TripContextValue | null>(null);

function isTripId(value: string | null): value is TripId {
  return value === "australind" || value === "e2e";
}

export function TripProvider({ children }: { children: ReactNode }) {
  const [tripId, setTripIdState] = useState<TripId>("australind");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TRIP_STORAGE_KEY);
      if (isTripId(saved)) setTripIdState(saved);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const setTripId = useCallback((id: TripId) => {
    setTripIdState(id);
    try {
      localStorage.setItem(TRIP_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({
      tripId,
      trip: trips[tripId],
      setTripId,
      hydrated,
    }),
    [tripId, setTripId, hydrated]
  );

  return <TripContext.Provider value={value}>{children}</TripContext.Provider>;
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used within TripProvider");
  return ctx;
}
