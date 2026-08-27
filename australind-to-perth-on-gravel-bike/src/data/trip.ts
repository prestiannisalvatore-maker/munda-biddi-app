export const tripMeta = {
  title: "Australind Munda Biddi",
  subtitle: "Train to Bunbury · ride north to Mandurah · train home",
  riders: ["Zino Prestianni", "Sam Prestianni"],
  startDate: "2026-09-21",
  endDate: "2026-09-26",
  totalKm: 269,
  ridingDays: 6,
};

export interface Location {
  name: string;
  lat: number;
  lng: number;
  type: "start" | "hut" | "town" | "camp" | "end";
  description?: string;
}

export const routeLocations: Location[] = [
  {
    name: "Bunbury Terminal",
    lat: -33.3256,
    lng: 115.6396,
    type: "start",
    description: "Australind train arrives ~midday. Start of the trail.",
  },
  {
    name: "Nglang Boodja Hut",
    lat: -33.4097,
    lng: 115.9276,
    type: "hut",
    description: "Day 1 overnight. Munda Biddi hut in Wellington National Park.",
  },
  {
    name: "Collie",
    lat: -33.3614,
    lng: 116.1558,
    type: "town",
    description: "Day 2 overnight. Black Diamond Lodge. Good resupply point.",
  },
  {
    name: "Yarri Hut",
    lat: -33.1950,
    lng: 116.0980,
    type: "hut",
    description: "Day 3 overnight. Munda Biddi hut in jarrah forest.",
  },
  {
    name: "Lake Brockman",
    lat: -33.0580,
    lng: 116.0420,
    type: "camp",
    description: "Day 4 overnight. Campsites, cabins, café. Swimming allowed.",
  },
  {
    name: "Dwellingup",
    lat: -32.7144,
    lng: 116.0622,
    type: "town",
    description: "Day 5 overnight. Caravan park huts. Last town stop.",
  },
  {
    name: "Mandurah Station",
    lat: -32.5285,
    lng: 115.7440,
    type: "end",
    description: "Day 6 finish. Train home to Perth via Mandurah line.",
  },
];

export const routePath: [number, number][] = [
  // Day 1: Bunbury to Nglang Boodja
  [-33.3256, 115.6396], // Bunbury Terminal
  [-33.3350, 115.6800], // Preston River path
  [-33.3500, 115.7400], // Dardanup area
  [-33.3700, 115.8200], // Ferguson Rd
  [-33.3900, 115.8800], // Approaching Wellington NP
  [-33.4097, 115.9276], // Nglang Boodja Hut
  
  // Day 2: Nglang Boodja to Collie
  [-33.4000, 115.9800], // Trail through Wellington NP
  [-33.3800, 116.0400], // Honeymoon Pool area
  [-33.3700, 116.1000], // Approaching Collie
  [-33.3614, 116.1558], // Collie
  
  // Day 3: Collie to Yarri
  [-33.3400, 116.1400], // North of Collie
  [-33.3000, 116.1300], // Mornington Rd area
  [-33.2500, 116.1100], // Through jarrah forest
  [-33.1950, 116.0980], // Yarri Hut
  
  // Day 4: Yarri to Lake Brockman
  [-33.1500, 116.0800], // North of Yarri
  [-33.1000, 116.0600], // Through forest
  [-33.0580, 116.0420], // Lake Brockman
  
  // Day 5: Lake Brockman to Dwellingup
  [-33.0000, 116.0300], // Bidjar Ngoulin area
  [-32.9200, 116.0400], // Lane Poole Reserve
  [-32.8400, 116.0500], // Murray River area
  [-32.7144, 116.0622], // Dwellingup
  
  // Day 6: Dwellingup to Mandurah
  [-32.6800, 116.0200], // North Spur Rd
  [-32.6300, 115.9500], // Descending scarp
  [-32.5900, 115.8600], // Pinjarra area
  [-32.5500, 115.8000], // Approaching Mandurah
  [-32.5285, 115.7440], // Mandurah Station
];

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

export const days: TripDay[] = [
  {
    id: 1,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Bunbury to Nglang Boodja Hut",
    route:
      "Bunbury Terminal → Preston River path → Dardanup → Ferguson Rd → Wellington National Park → Nglang Boodja Hut",
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
