export const tripMeta = {
  title: "Australind Munda Biddi",
  subtitle: "Train to Bunbury · ride north to Mandurah · train home",
  riders: ["Zino Prestianni", "Sam Prestianni"],
  startDate: "2026-09-21",
  endDate: "2026-09-26",
  totalKm: 259.2,
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
    distanceKm: 32.11,
    section: "DAY 1 · ONTO THE TRAIL",
    overnightKind: "camp",
    bookingStatus: "pending",
    highlight:
      "Australind arrives ~midday · lunch in Bunbury · Preston River path out of town",
    amber: false,
    notes:
      "Leave town on the Preston River path. Ferguson Rd from Dardanup joins the Munda Biddi.",
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
    route: "Munda Biddi through to Collie",
    distanceKm: 36.56,
    section: "DAY 2 · INTO COLLIE",
    overnightKind: "motel",
    bookingStatus: "pending",
    highlight: "Proper bed and resupply in Collie before the long quiet day",
    amber: false,
    notes: "Book Black Diamond Lodge ahead and confirm bike storage.",
  },
  {
    id: 3,
    date: "2026-09-23",
    dayOfWeek: "Wednesday",
    label: "Collie to Yarri Hut",
    route: "Munda Biddi through jarrah forest to Yarri Hut campsite",
    distanceKm: 40,
    section: "DAY 3 · TO YARRI HUT",
    overnightKind: "camp",
    bookingStatus: "skip",
    highlight: "Manageable day through beautiful jarrah forest · overnight at Yarri Hut",
    amber: false,
    notes:
      "Leave Collie with enough food and water for two nights camping. Yarri Hut has tank water and composting toilet.",
  },
  {
    id: 4,
    date: "2026-09-24",
    dayOfWeek: "Thursday",
    label: "Yarri Hut to Brockman Lake Park",
    route: "Munda Biddi continuing north through forest to Brockman Lake",
    distanceKm: 49.71,
    section: "DAY 4 · YARRI TO BROCKMAN",
    overnightKind: "camp",
    bookingStatus: "skip",
    highlight: "Second bush camp · quiet stretch through the forest",
    amber: false,
    notes:
      "Pack dinner and breakfast for the bush camp. Brockman Lake cafe opens early next morning.",
  },
  {
    id: 5,
    date: "2026-09-25",
    dayOfWeek: "Friday",
    label: "Brockman Lake to Dwellingup",
    route: "Munda Biddi via Bidjar Ngoulin",
    distanceKm: 56.5,
    section: "DAY 5 · TO DWELLINGUP",
    overnightKind: "motel",
    bookingStatus: "pending",
    highlight: "Cafe near Brockman Lake opens 8am — breakfast before the push",
    amber: false,
    notes: "Confirm hut/cabin booking and late-arrival options in Dwellingup.",
  },
  {
    id: 6,
    date: "2026-09-26",
    dayOfWeek: "Saturday",
    label: "Dwellingup to Mandurah",
    route:
      "Dwellingup → North Spur Rd → Pinjarra → Paterson Rd → Mandurah Station, then Mandurah line to Perth",
    distanceKm: 44.3,
    section: "DAY 6 · OFF THE SCARP · TRAIN HOME",
    overnightKind: "home",
    bookingStatus: "skip",
    highlight:
      "Late-morning start. North Spur Rd downhill, lunch in Pinjarra, Mandurah line home the same evening.",
    amber: false,
    notes:
      "Ride off the scarp, then train home that evening. Check bike-on-train rules and the Saturday timetable.",
    logistics: [
      "Ride to Mandurah Station.",
      "Transperth Mandurah line to Perth the same evening — not a separate day.",
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
    title: "Day 3-4 food & water",
    detail:
      "Collie → Yarri → Brockman Lake is two days in the bush. Leave Collie full; pack food for two nights camping.",
  },
  {
    title: "Yarri Hut overnight",
    detail: "Day 3 overnight — bush hut with tank water and composting toilet. No booking required.",
  },
  {
    title: "Dwellingup caravan park huts",
    detail: "Day 5 overnight. Confirm hut/cabin booking and late arrival.",
  },
  {
    title: "Mandurah line home",
    detail:
      "Same Saturday as the ride — check Transperth bike-on-train rules and the weekend timetable.",
  },
];
