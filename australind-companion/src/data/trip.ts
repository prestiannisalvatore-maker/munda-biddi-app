export const tripMeta = {
  title: "Australind Munda Biddi",
  subtitle: "Train to Bunbury · ride north to Mandurah · train home",
  riders: ["Zino Prestianni", "Sam Prestianni"],
  startDate: "2026-09-21",
  endDate: "2026-09-26",
  totalKm: 269,
  ridingDays: 6,
};

export type OvernightKind = "camp" | "motel" | "home";

export interface TripDay {
  id: number;
  date: string;
  dayOfWeek: string;
  label: string;
  route: string;
  distanceKm: number;
  section: string;
  overnightKind: OvernightKind;
  bookingStatus: "pending" | "skip" | "booked";
  highlight: string;
  amber: boolean;
  notes: string;
  logistics?: string[];
}

/** Six calendar days. Trains are logistics on Day 1 and Day 6 — not extra DAY badges. */
export const days: TripDay[] = [
  {
    id: 1,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Bunbury to Nglang Boodja Hut",
    route:
      "Bunbury Terminal → Preston River / Dardanup / Ferguson Rd → Munda Biddi → Nglang Boodja Hut",
    distanceKm: 32,
    section: "DAY 1 · ONTO THE TRAIL",
    overnightKind: "camp",
    bookingStatus: "pending",
    highlight:
      "Australind arrives ~midday · lunch in Bunbury · Preston River path out of town",
    amber: false,
    notes:
      "Leave town on the Preston River path. Ferguson Rd from Dardanup joins the Munda Biddi. Hut has shelter, water tanks, drop toilet.",
    logistics: [
      "Morning: bike ~7 km from 32 Browning St, Yokine to Perth City Station.",
      "Transwa Australind Perth → Bunbury (bikes on hooks). Aim for midday arrival.",
      "Lunch in Bunbury, then ride onto the trail.",
    ],
  },
  {
    id: 2,
    date: "2026-09-22",
    dayOfWeek: "Tuesday",
    label: "Nglang Boodja Hut to Collie",
    route: "Wellington National Park → Honeymoon Pool area → Collie",
    distanceKm: 37,
    section: "DAY 2 · INTO COLLIE",
    overnightKind: "motel",
    bookingStatus: "pending",
    highlight: "Technical descent near Honeymoon Pool · proper bed and resupply in Collie",
    amber: false,
    notes: "Steep switchback descent to Collie River. Book Black Diamond Lodge ahead and confirm bike storage.",
  },
  {
    id: 3,
    date: "2026-09-23",
    dayOfWeek: "Wednesday",
    label: "Collie to Yarri Hut",
    route: "Collie → Mornington Rd area → jarrah forest → Yarri Hut",
    distanceKm: 40,
    section: "DAY 3 · INTO THE FOREST",
    overnightKind: "camp",
    bookingStatus: "skip",
    highlight: "Flowing singletrack through tall jarrah and marri forest",
    amber: false,
    notes:
      "Leave Collie with food for two camp nights. Yarri Hut has shelter, water tanks, drop toilet. Beautiful tall forest riding.",
  },
  {
    id: 4,
    date: "2026-09-24",
    dayOfWeek: "Thursday",
    label: "Yarri Hut to Lake Brockman",
    route: "Yarri Hut → singletrack through forest → Lake Brockman",
    distanceKm: 35,
    section: "DAY 4 · TO LAKE BROCKMAN",
    overnightKind: "camp",
    bookingStatus: "skip",
    highlight: "Pleasant forest riding · Lake Brockman has café (check hours) and swimming",
    amber: false,
    notes: "Lake Brockman has campsites, cabins and café. Swimming allowed. Check café opening hours if relying on them for food.",
  },
  {
    id: 5,
    date: "2026-09-25",
    dayOfWeek: "Friday",
    label: "Lake Brockman to Dwellingup",
    route: "Lake Brockman → Bidjar Ngoulin area → Lane Poole Reserve → Murray River → Dwellingup",
    distanceKm: 56,
    section: "DAY 5 · TO DWELLINGUP",
    overnightKind: "motel",
    bookingStatus: "pending",
    highlight: "Best singletrack of the trail through Lane Poole Reserve · Murray River swimming",
    amber: false,
    notes: "Smooth winding singletrack beside Murray River. Suspension bridge crossing. Confirm hut/cabin booking in Dwellingup.",
  },
  {
    id: 6,
    date: "2026-09-26",
    dayOfWeek: "Saturday",
    label: "Dwellingup to Mandurah",
    route:
      "Dwellingup → North Spur Rd → descent off scarp → Pinjarra → Mandurah Station",
    distanceKm: 69,
    section: "DAY 6 · OFF THE SCARP · TRAIN HOME",
    overnightKind: "home",
    bookingStatus: "skip",
    highlight:
      "Early start for longest day. North Spur Rd downhill off the scarp, lunch in Pinjarra.",
    amber: true,
    notes:
      "Longest day. Descend off the Darling Scarp via North Spur Rd. Mix of gravel and road to Mandurah. Train home that evening.",
    logistics: [
      "Early start recommended for this longer day.",
      "Ride to Mandurah Station.",
      "Transperth Mandurah line to Perth the same evening.",
    ],
  },
];

export const logisticsGates = [
  {
    title: "Yokine → Perth City Station",
    detail:
      "Bike ~7 km from 32 Browning St to Perth City Station with loaded bikes. Leave buffer before the Australind.",
  },
  {
    title: "Australind tickets + bikes",
    detail:
      "Book Perth → Bunbury with two bikes. Aim for midday Bunbury so Day 1 still has afternoon light.",
  },
  {
    title: "Black Diamond Lodge, Collie",
    detail: "Day 2 overnight — bike-friendly bed and resupply. Book ahead.",
  },
  {
    title: "Days 3-4 food & water",
    detail:
      "Collie → Yarri → Lake Brockman. Leave Collie full; pack food for two camp nights. Lake Brockman café available (check hours).",
  },
  {
    title: "Dwellingup accommodation",
    detail: "Day 5 overnight. Confirm hut/cabin booking and late arrival.",
  },
  {
    title: "Mandurah line home",
    detail:
      "Saturday after Day 6 — check Transperth bike-on-train rules and the weekend timetable.",
  },
];
