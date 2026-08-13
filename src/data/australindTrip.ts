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
  googleMapsDirections?: string;
  referenceOnly?: boolean;
}

export const australindMeta = {
  title: "Australind Munda Biddi",
  subtitle: "Train to Bunbury · ride north to Mandurah · train home",
  riders: ["Zino Prestianni", "Sam Prestianni"],
  startDate: "2026-09-21",
  endDate: "2026-09-25",
  totalKm: 259.2,
  ridingDays: 5,
  datesNote: "tentative",
  direction: "bunbury-to-mandurah",
};

export const australindLegs: AustralindLeg[] = [
  {
    id: 1,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Ride to Perth Station",
    route: "32 Browning St, Yokine → Perth City Station (bike)",
    distanceKm: 6.87,
    cumulativeKm: 0,
    isRest: true,
    section: "Day 0 · Logistics morning",
    end: "Perth City Station",
    endType: "town",
    terrain: "City bike paths / streets",
    camping: "n/a",
    motel: "n/a",
    highlight: "Roll bikes to Perth City Station for the Australind to Bunbury",
    amber: false,
    weatherPlace: "Perth",
    lat: -31.9515518,
    lon: 115.8595906,
    overnight: "motel",
    notes:
      "First logistics leg before the Australind. Bike ~7 km from Yokine with loaded bikes. Leave a buffer before the train.",
    googleMapsDirections:
      "https://www.google.com/maps/dir/?api=1&origin=32+Browning+St,+Yokine+WA+6060&destination=Perth+City+Station,+Perth+WA+6000&travelmode=bicycling",
    referenceOnly: true,
  },
  {
    id: 2,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Australind to Bunbury",
    route: "Perth City Station → Australind → Bunbury Terminal",
    distanceKm: 0,
    cumulativeKm: 0,
    isRest: true,
    section: "Day 0 · Logistics morning",
    end: "Bunbury Terminal",
    endType: "town",
    terrain: "Transwa Australind train (bikes on hooks)",
    camping: "n/a",
    motel: "n/a",
    highlight:
      "Roll bikes on · hang from onboard hooks · arrive Bunbury ~midday · lunch before Day 1 ride",
    amber: false,
    weatherPlace: "Bunbury",
    lat: -33.3444093,
    lon: 115.6573016,
    overnight: "motel",
    notes:
      "Book Perth → Bunbury with two bikes. Aim for midday Bunbury so Day 1 still has afternoon light.",
    googleMapsDirections: "https://maps.app.goo.gl/qQ4oXP4v5L4hP9SQA",
    referenceOnly: true,
  },
  {
    id: 3,
    date: "2026-09-21",
    dayOfWeek: "Monday",
    label: "Bunbury to Nglang Boodja Hut",
    route:
      "Bunbury Terminal → Preston River / Dardanup / Ferguson Rd → Munda Biddi → Nglang Boodja Hut",
    distanceKm: 32.11,
    cumulativeKm: 32.11,
    isRest: false,
    section: "Day 1 · Onto the trail",
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
    notes:
      "Leave town on the Preston River path (not straight through). Ferguson Rd from Dardanup joins the Munda Biddi. First trail overnight.",
  },
  {
    id: 4,
    date: "2026-09-22",
    dayOfWeek: "Tuesday",
    label: "Nglang Boodja Hut to Collie",
    route: "Munda Biddi through to Collie",
    distanceKm: 36.56,
    cumulativeKm: 68.67,
    isRest: false,
    section: "Day 2 · Into Collie",
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
    notes: "Book Black Diamond Lodge ahead and confirm bike storage.",
  },
  {
    id: 5,
    date: "2026-09-23",
    dayOfWeek: "Wednesday",
    label: "Collie to Brockman Lake Park",
    route: "Munda Biddi via Yarri, with bitumen mixed in",
    distanceKm: 89.71,
    cumulativeKm: 158.38,
    isRest: false,
    section: "Day 3 · Long quiet stretch",
    end: "Brockman Lake Park (bush camp)",
    endType: "hut",
    terrain: "Long quiet Munda Biddi stretch + optional sealed shortcuts",
    camping: "Bush camp on the edge of Brockman Lake Park",
    motel: "n/a",
    highlight: "Longest day · little resupply · expect a late finish",
    amber: true,
    weatherPlace: "Harvey",
    lat: -32.998046009393875,
    lon: 115.96937572422394,
    overnight: "camp",
    notes:
      "Leave Collie full. Pack dinner and breakfast for the bush camp. Strong lights if dusk catches you. Optional sealed shortcuts if needed.",
  },
  {
    id: 6,
    date: "2026-09-24",
    dayOfWeek: "Thursday",
    label: "Brockman Lake to Dwellingup",
    route: "Munda Biddi via Bidjar Ngoulin",
    distanceKm: 56.5,
    cumulativeKm: 214.88,
    isRest: false,
    section: "Day 4 · To Dwellingup",
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
    notes: "Confirm hut/cabin booking and late-arrival options in Dwellingup.",
  },
  {
    id: 7,
    date: "2026-09-25",
    dayOfWeek: "Friday",
    label: "Dwellingup to Mandurah",
    route: "Dwellingup → North Spur Rd → Pinjarra → Paterson Rd → Mandurah",
    distanceKm: 44.3,
    cumulativeKm: 259.18,
    isRest: false,
    section: "Day 5 · Off the scarp · train home",
    end: "Mandurah Station",
    endType: "town",
    terrain:
      "Trail to North Spur Rd descent · road to Pinjarra · Paterson Rd to Mandurah",
    camping: "n/a",
    motel: "Home via Mandurah line",
    highlight:
      "Late-morning start · North Spur Rd downhill off the escarpment · lunch Pinjarra · train home",
    amber: false,
    weatherPlace: "Mandurah",
    lat: -32.5361164,
    lon: 115.7424809,
    overnight: "motel",
    notes:
      "North Spur Road is steep downhill this direction. Lunch in Pinjarra, then Paterson Rd into Mandurah.",
  },
  {
    id: 8,
    date: "2026-09-25",
    dayOfWeek: "Friday",
    label: "Mandurah line home",
    route: "Mandurah → Perth City Station (Transperth Mandurah line)",
    distanceKm: 0,
    cumulativeKm: 259.18,
    isRest: true,
    section: "Day 5 · Logistics home",
    end: "Perth City Station",
    endType: "town",
    terrain: "Transperth Mandurah line (bikes permitted off-peak / check rules)",
    camping: "n/a",
    motel: "Home",
    highlight: "Train from Mandurah back to Perth after the ride",
    amber: false,
    weatherPlace: "Perth",
    lat: -31.9515518,
    lon: 115.8595906,
    overnight: "motel",
    notes: "Confirm bike-on-train rules and Friday timetable closer to travel.",
    googleMapsDirections: "https://maps.app.goo.gl/PrG9Fe9Wm5dm3H2cA",
    referenceOnly: true,
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
    dayId: 2,
    kind: "Booking",
    title: "Australind tickets + bikes",
    detail:
      "Book Perth → Bunbury with two bikes. Roll on and hang from the hooks. Aim for midday Bunbury so Day 1 still has afternoon light.",
    critical: true,
  },
  {
    id: "bunbury-exit",
    dayId: 3,
    kind: "Access",
    title: "Bunbury exit via Preston River",
    detail:
      "Leave town on the Preston River path (not straight through). Ferguson Rd from Dardanup joins the Munda Biddi toward Nglang Boodja Hut.",
    critical: true,
  },
  {
    id: "black-diamond",
    dayId: 4,
    kind: "Booking",
    title: "Black Diamond Lodge, Collie",
    detail:
      "Day 2 overnight — bike-friendly bed and resupply. Book ahead; confirm bike storage.",
    critical: true,
  },
  {
    id: "route-updates",
    dayId: 3,
    kind: "Alerts",
    title: "Check Munda Biddi + DBCA alerts",
    detail:
      "Confirm route updates and Park Alerts before each riding day — especially before the long Collie → Brockman stretch.",
    critical: true,
  },
  {
    id: "day3-food",
    dayId: 5,
    kind: "Water",
    title: "Day 3 food & water buffer",
    detail:
      "Collie → Brockman Lake is long and quiet. Leave Collie full; pack dinner/breakfast for the bush camp. Strong lights for a late finish.",
    critical: true,
  },
  {
    id: "offline-maps",
    dayId: 5,
    kind: "Safety",
    title: "Offline maps downloaded",
    detail:
      "On the companion Track page, cache Day 3 (and full trip) tiles on Wi-Fi before you leave Perth.",
    critical: true,
  },
  {
    id: "brockman-breakfast",
    dayId: 6,
    kind: "Resupply",
    title: "Brockman Lake cafe (~8am)",
    detail:
      "Cafe near the campsite opens 8am — good anchor before the push to Dwellingup.",
    critical: false,
  },
  {
    id: "dwellingup-huts",
    dayId: 6,
    kind: "Booking",
    title: "Dwellingup caravan park huts",
    detail: "Day 4 overnight. Confirm hut/cabin booking and late-arrival options.",
    critical: true,
  },
  {
    id: "mandurah-home",
    dayId: 7,
    kind: "Access",
    title: "Mandurah line home",
    detail:
      "Check Transperth bike-on-train rules and Friday timetable Mandurah → Perth after the ride.",
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
    to: "Brockman Lake Park",
    km: 89.7,
    cumulativeKm: 158.4,
    startTime: "06:30",
    lunchTime: "12:00",
    finishTime: "17:30",
    accommodation: "Brockman Lake Park",
    accommodationType: "campsite",
    notes:
      "Amber day — longest stretch, little resupply. Carry extra food, water, and lights.",
  },
  {
    day: 4,
    date: "2026-09-24",
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
    day: 5,
    date: "2026-09-25",
    from: "Dwellingup",
    to: "Mandurah Station",
    km: 44.3,
    cumulativeKm: 259.2,
    startTime: "09:30",
    lunchTime: "12:30",
    finishTime: "14:30",
    accommodation: "Home (Mandurah line)",
    accommodationType: "other",
    notes:
      "Late-morning start. North Spur Rd off the scarp, lunch in Pinjarra, train home.",
  },
];
