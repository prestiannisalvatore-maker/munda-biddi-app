import type { ScheduleDay } from "./scheduleData";

/** Live GPS companion built for this same trip. */
export const AUSTRALIND_COMPANION_URL = "https://australind-munda-biddi.vercel.app/";

export interface AustralindLeg {
  id: number;
  date: string;
  dayOfWeek: string;
  label: string;
  route: string;
  distanceKm: number;
  cumulativeKm: number;
  isRest: boolean;
  section: string;
  end: string;
  endType: "town" | "hut";
  terrain: string;
  camping: string;
  motel: string;
  highlight: string;
  amber: boolean;
  weatherPlace: string;
  lat: number;
  lon: number;
  overnight: "camp" | "motel";
  notes: string;
  logistics?: string[];
  googleMapsDirections?: string;
  overnightKind: "camp" | "motel" | "home";
  bookingStatus: "pending" | "skip" | "booked";
}

export const australindMeta = {
  title: "Australind Munda Biddi",
  subtitle: "Train to Bunbury · ride north to Mandurah · train home",
  riders: ["Zino Prestianni", "Sam Prestianni"],
  startDate: "2026-09-21",
  endDate: "2026-09-26",
  totalKm: 259.2,
  ridingDays: 6,
  datesNote: "tentative",
  direction: "bunbury-to-mandurah",
};

export const australindLegs: AustralindLeg[] = [
  {
    id: 1,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Bunbury to Nglang Boodja Hut",
    route:
      "Bunbury Terminal → Preston River / Dardanup / Ferguson Rd → Munda Biddi → Nglang Boodja Hut",
    distanceKm: 32.11,
    cumulativeKm: 32.11,
    isRest: false,
    section: "DAY 1 · ONTO THE TRAIL",
    end: "Nglang Boodja Hut",
    endType: "hut",
    terrain: "Road connector + Ferguson Valley climb onto Munda Biddi",
    camping: "Nglang Boodja Hut — narrow valley, very dark and quiet",
    motel: "n/a",
    highlight:
      "Australind arrives ~midday · lunch in Bunbury · Preston River path out of town",
    amber: false,
    weatherPlace: "Dardanup",
    lat: -33.4108324397821,
    lon: 115.9255357703952,
    overnight: "camp",
    overnightKind: "camp",
    bookingStatus: "pending",
    notes:
      "Leave town on the Preston River path (not straight through). Ferguson Rd from Dardanup joins the Munda Biddi. First trail overnight.",
    logistics: [
      "Morning: bike ~7 km from 32 Browning St, Yokine to Perth City Station.",
      "Transwa Australind Perth → Bunbury (bikes on hooks). Aim for midday arrival.",
      "Lunch in Bunbury, then ride onto the trail.",
    ],
    googleMapsDirections:
      "https://www.google.com/maps/dir/?api=1&origin=32+Browning+St,+Yokine+WA+6060&destination=Perth+City+Station,+Perth+WA+6000&travelmode=bicycling",
  },
  {
    id: 2,
    date: "2026-09-22",
    dayOfWeek: "Tuesday",
    label: "Nglang Boodja Hut to Collie",
    route: "Munda Biddi through to Collie",
    distanceKm: 36.56,
    cumulativeKm: 68.67,
    isRest: false,
    section: "DAY 2 · INTO COLLIE",
    end: "Black Diamond Lodge, Collie",
    endType: "town",
    terrain: "Munda Biddi fire road / rail trail / singletrack",
    camping: "n/a",
    motel: "Black Diamond Lodge, Collie — bike-friendly bed + resupply",
    highlight: "Proper bed and resupply in Collie before the long quiet day",
    amber: false,
    weatherPlace: "Collie",
    lat: -33.3583550001494,
    lon: 116.14731799994844,
    overnight: "motel",
    overnightKind: "motel",
    bookingStatus: "pending",
    notes: "Book Black Diamond Lodge ahead and confirm bike storage.",
  },
  {
    id: 3,
    date: "2026-09-23",
    dayOfWeek: "Wednesday",
    label: "Collie to Yarri Hut",
    route: "Munda Biddi through jarrah forest to Yarri Hut campsite",
    distanceKm: 40,
    cumulativeKm: 108.67,
    isRest: false,
    section: "DAY 3 · TO YARRI HUT",
    end: "Yarri Hut",
    endType: "hut",
    terrain: "Munda Biddi through jarrah forest",
    camping: "Yarri Hut — bush hut with tank water and composting toilet",
    motel: "n/a",
    highlight: "Manageable day through beautiful jarrah forest · overnight at Yarri Hut",
    amber: false,
    weatherPlace: "Harvey",
    lat: -33.195,
    lon: 116.098,
    overnight: "camp",
    overnightKind: "camp",
    bookingStatus: "skip",
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
    cumulativeKm: 158.38,
    isRest: false,
    section: "DAY 4 · YARRI TO BROCKMAN",
    end: "Brockman Lake Park (bush camp)",
    endType: "hut",
    terrain: "Munda Biddi through forest to Brockman Lake",
    camping: "Bush camp on the edge of Brockman Lake Park",
    motel: "n/a",
    highlight: "Second bush camp · quiet stretch through the forest",
    amber: false,
    weatherPlace: "Harvey",
    lat: -32.998046009393875,
    lon: 115.96937572422394,
    overnight: "camp",
    overnightKind: "camp",
    bookingStatus: "skip",
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
    cumulativeKm: 214.88,
    isRest: false,
    section: "DAY 5 · TO DWELLINGUP",
    end: "Caravan park huts, Dwellingup",
    endType: "town",
    terrain: "Munda Biddi via Bidjar Ngoulin",
    camping: "n/a",
    motel: "Caravan park huts, Dwellingup",
    highlight: "Cafe near Brockman Lake opens 8am — breakfast before the push",
    amber: false,
    weatherPlace: "Dwellingup",
    lat: -32.71447961875299,
    lon: 116.06196329610634,
    overnight: "motel",
    overnightKind: "motel",
    bookingStatus: "pending",
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
    cumulativeKm: 259.18,
    isRest: false,
    section: "DAY 6 · OFF THE SCARP · TRAIN HOME",
    end: "Home",
    endType: "town",
    terrain:
      "Trail to North Spur Rd descent · road to Pinjarra · Paterson Rd to Mandurah · Transperth home",
    camping: "n/a",
    motel: "Home",
    highlight:
      "Late-morning start. North Spur Rd downhill off the escarpment, lunch in Pinjarra, then the Mandurah line to Perth the same evening.",
    amber: false,
    weatherPlace: "Mandurah",
    lat: -32.5361164,
    lon: 115.7424809,
    overnight: "motel",
    overnightKind: "home",
    bookingStatus: "skip",
    notes:
      "Ride off the scarp, then train home that evening. Check bike-on-train rules and the Saturday timetable.",
    googleMapsDirections: "https://maps.app.goo.gl/PrG9Fe9Wm5dm3H2cA",
  },
];

export interface LogisticsGate {
  id: string;
  dayId: number;
  kind: string;
  title: string;
  detail: string;
  critical: boolean;
}

export const australindLogistics: LogisticsGate[] = [
  {
    id: "yokine-station",
    dayId: 1,
    kind: "Access",
    title: "Yokine → Perth City Station",
    detail:
      "Bike ~7 km from 32 Browning St to Perth City Station with loaded bikes. Leave buffer before the Australind.",
    critical: true,
  },
  {
    id: "australind",
    dayId: 1,
    kind: "Booking",
    title: "Australind tickets + bikes",
    detail:
      "Book Perth → Bunbury with two bikes. Roll on and hang from the hooks. Aim for midday Bunbury so Day 1 still has afternoon light.",
    critical: true,
  },
  {
    id: "bunbury-exit",
    dayId: 1,
    kind: "Access",
    title: "Bunbury exit via Preston River",
    detail:
      "Leave town on the Preston River path (not straight through). Ferguson Rd from Dardanup joins the Munda Biddi toward Nglang Boodja Hut.",
    critical: true,
  },
  {
    id: "black-diamond",
    dayId: 2,
    kind: "Booking",
    title: "Black Diamond Lodge, Collie",
    detail:
      "Day 2 overnight — bike-friendly bed and resupply. Book ahead; confirm bike storage.",
    critical: true,
  },
  {
    id: "route-updates",
    dayId: 1,
    kind: "Alerts",
    title: "Check Munda Biddi + DBCA alerts",
    detail:
      "Confirm route updates and Park Alerts before each riding day — especially before the long Collie → Brockman stretch.",
    critical: true,
  },
  {
    id: "day3-4-food",
    dayId: 3,
    kind: "Water",
    title: "Day 3-4 food & water buffer",
    detail:
      "Collie → Yarri → Brockman Lake is two days in the bush. Leave Collie full; pack food for two nights camping.",
    critical: true,
  },
  {
    id: "yarri-hut",
    dayId: 3,
    kind: "Camping",
    title: "Yarri Hut overnight",
    detail:
      "Day 3 overnight — bush hut with tank water and composting toilet. No booking required.",
    critical: false,
  },
  {
    id: "offline-maps",
    dayId: 3,
    kind: "Safety",
    title: "Offline maps downloaded",
    detail:
      "On the companion Track page, cache Day 3-4 (and full trip) tiles on Wi-Fi before you leave Perth.",
    critical: true,
  },
  {
    id: "brockman-breakfast",
    dayId: 5,
    kind: "Resupply",
    title: "Brockman Lake cafe (~8am)",
    detail:
      "Cafe near the campsite opens 8am — good anchor before the push to Dwellingup.",
    critical: false,
  },
  {
    id: "dwellingup-huts",
    dayId: 5,
    kind: "Booking",
    title: "Dwellingup caravan park huts",
    detail: "Day 5 overnight. Confirm hut/cabin booking and late-arrival options.",
    critical: true,
  },
  {
    id: "mandurah-home",
    dayId: 6,
    kind: "Access",
    title: "Mandurah line home",
    detail:
      "Check Transperth bike-on-train rules and Saturday timetable Mandurah → Perth after the ride.",
    critical: true,
  },
  {
    id: "family-share",
    dayId: 1,
    kind: "Alerts",
    title: "Family check-in ready",
    detail:
      "Add emergency contacts in the companion, test the family share link, agree daily check-ins (Collie and Dwellingup are good anchors).",
    critical: false,
  },
];

export const australindSchedule: ScheduleDay[] = [
  {
    day: 1,
    date: "2026-09-21",
    from: "Bunbury Terminal",
    to: "Nglang Boodja Hut",
    km: 32.1,
    cumulativeKm: 32.1,
    startTime: "13:00",
    lunchTime: "12:00",
    finishTime: "17:30",
    accommodation: "Nglang Boodja Hut",
    accommodationType: "campsite",
    notes:
      "Train to Bunbury first. Lunch in town, then Preston River path onto the trail.",
  },
  {
    day: 2,
    date: "2026-09-22",
    from: "Nglang Boodja Hut",
    to: "Collie",
    km: 36.6,
    cumulativeKm: 68.7,
    startTime: "07:30",
    lunchTime: "12:00",
    finishTime: "14:30",
    accommodation: "Black Diamond Lodge, Collie",
    accommodationType: "hotel",
    notes: "Book Black Diamond Lodge ahead — bike-friendly bed and resupply.",
  },
  {
    day: 3,
    date: "2026-09-23",
    from: "Collie",
    to: "Yarri Hut",
    km: 40,
    cumulativeKm: 108.7,
    startTime: "07:30",
    lunchTime: "12:00",
    finishTime: "15:00",
    accommodation: "Yarri Hut",
    accommodationType: "campsite",
    notes:
      "Manageable day through jarrah forest. Yarri Hut has tank water and composting toilet.",
  },
  {
    day: 4,
    date: "2026-09-24",
    from: "Yarri Hut",
    to: "Brockman Lake Park",
    km: 49.7,
    cumulativeKm: 158.4,
    startTime: "07:30",
    lunchTime: "12:00",
    finishTime: "15:30",
    accommodation: "Brockman Lake Park",
    accommodationType: "campsite",
    notes:
      "Second bush camp. Pack dinner and breakfast — Brockman Lake cafe opens early next morning.",
  },
  {
    day: 5,
    date: "2026-09-25",
    from: "Brockman Lake Park",
    to: "Dwellingup",
    km: 56.5,
    cumulativeKm: 214.9,
    startTime: "08:30",
    lunchTime: "12:30",
    finishTime: "16:00",
    accommodation: "Dwellingup",
    accommodationType: "other",
    notes: "Cafe near camp opens ~8am. Overnight in caravan-park huts.",
  },
  {
    day: 6,
    date: "2026-09-26",
    from: "Dwellingup",
    to: "Home (via Mandurah)",
    km: 44.3,
    cumulativeKm: 259.2,
    startTime: "09:30",
    lunchTime: "12:30",
    finishTime: "14:30",
    accommodation: "Home",
    accommodationType: "other",
    notes:
      "Saturday: North Spur Rd off the scarp, lunch in Pinjarra, Mandurah line home the same evening.",
  },
];
