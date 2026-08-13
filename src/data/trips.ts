import { defaultSchedule, type ScheduleDay } from "./scheduleData";
import { australindMeta, australindSchedule } from "./australindTrip";

export type TripId = "australind" | "e2e";

export interface TripSummary {
  id: TripId;
  name: string;
  shortName: string;
  from: string;
  to: string;
  km: number;
  days: number;
  startDate: string;
  endDate: string;
  dateLabel: string;
  description: string;
  schedule: ScheduleDay[];
}

export const trips: Record<TripId, TripSummary> = {
  australind: {
    id: "australind",
    name: "Australind Munda Biddi",
    shortName: "Australind",
    from: "Bunbury",
    to: "Mandurah",
    km: australindMeta.totalKm,
    days: australindMeta.ridingDays,
    startDate: australindMeta.startDate,
    endDate: australindMeta.endDate,
    dateLabel: "21–25 Sep 2026",
    description:
      "Train to Bunbury, five days of gravel north through hut nights, then off the scarp to Mandurah and home by rail.",
    schedule: australindSchedule,
  },
  e2e: {
    id: "e2e",
    name: "End to End",
    shortName: "E2E May 2027",
    from: "Mundaring",
    to: "Albany",
    km: 1060.8,
    days: defaultSchedule.length,
    startDate: "2027-05-01",
    endDate: "2027-05-17",
    dateLabel: "1–17 May 2027",
    description:
      "Full 1,067 km Mundaring to Albany end-to-end along the official trail.",
    schedule: defaultSchedule,
  },
};

export const TRIP_STORAGE_KEY = "munda-biddi-selected-trip";
