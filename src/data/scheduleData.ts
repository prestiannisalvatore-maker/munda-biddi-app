// Default schedule for May 2027 End-to-End trip
// Based on ~50km/day average, 21 days total

export interface ScheduleDay {
  day: number;
  date: string; // YYYY-MM-DD
  from: string;
  to: string;
  km: number;
  cumulativeKm: number;
  startTime: string;
  lunchTime: string;
  finishTime: string;
  accommodation: string; // "campsite" or town name
  accommodationType?: "campsite" | "hotel" | "motel" | "b&b" | "other";
  notes?: string;
}

export const defaultSchedule: ScheduleDay[] = [
  { day: 1, date: "2027-05-01", from: "Mundaring", to: "Carinyah", km: 42, cumulativeKm: 42, startTime: "07:00", lunchTime: "12:00", finishTime: "14:00", accommodation: "Carinyah", accommodationType: "campsite" },
  { day: 2, date: "2027-05-02", from: "Carinyah", to: "Wungong", km: 34.7, cumulativeKm: 76.7, startTime: "07:00", lunchTime: "11:30", finishTime: "13:30", accommodation: "Wungong", accommodationType: "campsite" },
  { day: 3, date: "2027-05-03", from: "Wungong", to: "Dandalup", km: 60.9, cumulativeKm: 137.6, startTime: "07:00", lunchTime: "12:00", finishTime: "16:00", accommodation: "Dandalup", accommodationType: "campsite" },
  { day: 4, date: "2027-05-04", from: "Dandalup", to: "Bidjar Ngoulin", km: 69, cumulativeKm: 206.6, startTime: "07:00", lunchTime: "12:30", finishTime: "17:00", accommodation: "Bidjar Ngoulin", accommodationType: "campsite" },
  { day: 5, date: "2027-05-05", from: "Bidjar Ngoulin", to: "Yarri", km: 77.7, cumulativeKm: 284.3, startTime: "06:30", lunchTime: "12:00", finishTime: "17:00", accommodation: "Yarri", accommodationType: "campsite" },
  { day: 6, date: "2027-05-06", from: "Yarri", to: "Nglang Boodja", km: 91.4, cumulativeKm: 375.7, startTime: "06:30", lunchTime: "12:00", finishTime: "17:30", accommodation: "Nglang Boodja", accommodationType: "campsite" },
  { day: 7, date: "2027-05-07", from: "Nglang Boodja", to: "Nala Mia", km: 92.7, cumulativeKm: 468.4, startTime: "06:00", lunchTime: "12:00", finishTime: "18:00", accommodation: "Nala Mia", accommodationType: "campsite" },
  { day: 8, date: "2027-05-08", from: "Nala Mia", to: "Karta Burnu", km: 87.5, cumulativeKm: 555.9, startTime: "06:00", lunchTime: "12:00", finishTime: "18:00", accommodation: "Karta Burnu", accommodationType: "campsite" },
  { day: 9, date: "2027-05-09", from: "Karta Burnu", to: "Manjimup", km: 23.2, cumulativeKm: 579.1, startTime: "08:00", lunchTime: "11:00", finishTime: "13:00", accommodation: "Manjimup", accommodationType: "hotel", notes: "Rest day option - short ride to town" },
  { day: 10, date: "2027-05-10", from: "Manjimup", to: "Pemberton", km: 83.1, cumulativeKm: 662.2, startTime: "07:00", lunchTime: "12:30", finishTime: "17:00", accommodation: "Pemberton", accommodationType: "hotel" },
  { day: 11, date: "2027-05-11", from: "Pemberton", to: "Northcliffe", km: 44.5, cumulativeKm: 706.7, startTime: "07:30", lunchTime: "11:30", finishTime: "14:30", accommodation: "Northcliffe", accommodationType: "motel" },
  { day: 12, date: "2027-05-12", from: "Northcliffe", to: "Yirra Kartta", km: 49.8, cumulativeKm: 756.5, startTime: "07:00", lunchTime: "12:00", finishTime: "15:00", accommodation: "Yirra Kartta", accommodationType: "campsite" },
  { day: 13, date: "2027-05-13", from: "Yirra Kartta", to: "Kwokralup Beela", km: 49.8, cumulativeKm: 806.3, startTime: "07:00", lunchTime: "12:00", finishTime: "15:00", accommodation: "Kwokralup Beela", accommodationType: "campsite" },
  { day: 14, date: "2027-05-14", from: "Kwokralup Beela", to: "Booner Mundak", km: 82.9, cumulativeKm: 889.2, startTime: "06:00", lunchTime: "12:00", finishTime: "18:00", accommodation: "Booner Mundak", accommodationType: "campsite" },
  { day: 15, date: "2027-05-15", from: "Booner Mundak", to: "Jinung Beigabup", km: 54.9, cumulativeKm: 944.1, startTime: "07:00", lunchTime: "12:00", finishTime: "16:00", accommodation: "Jinung Beigabup", accommodationType: "campsite" },
  { day: 16, date: "2027-05-16", from: "Jinung Beigabup", to: "Denmark", km: 41.6, cumulativeKm: 985.7, startTime: "07:30", lunchTime: "11:30", finishTime: "14:30", accommodation: "Denmark", accommodationType: "hotel" },
  { day: 17, date: "2027-05-17", from: "Denmark", to: "Albany", km: 75.1, cumulativeKm: 1060.8, startTime: "07:00", lunchTime: "12:00", finishTime: "16:00", accommodation: "Albany", accommodationType: "hotel", notes: "Finish! End-to-End complete!" },
];

// Accommodation suggestions by town
export const accommodationSuggestions: Record<string, string[]> = {
  "Mundaring": ["Mundaring Weir Hotel", "Various B&Bs", "Caravan parks"],
  "Jarrahdale": ["Jarrahdale Tavern", "Local accommodation"],
  "Dwellingup": ["Dwellingup Forest Lodge", "Dwellingup Caravan Park", "Dwellingup Hotel"],
  "Collie (Soldiers Park)": ["Collie hotels and motels", "Caravan parks"],
  "Donnybrook": ["Donnybrook hotels", "B&Bs", "Caravan parks"],
  "Donnelly River Village": ["Donnelly River Village accommodation", "Holiday village"],
  "Nannup": ["Nannup hotels", "B&Bs", "Forest Lodge"],
  "Manjimup": ["Manjimup hotels", "Motels", "Caravan parks"],
  "Pemberton": ["Pemberton hotels", "Karri Forest Lodge", "Caravan parks"],
  "Northcliffe": ["Northcliffe hotels", "Local accommodation"],
  "Walpole": ["Walpole hotels", "Tree Top Walk accommodation"],
  "Denmark": ["Denmark hotels", "Wine region B&Bs", "Caravan parks"],
  "Albany": ["Albany hotels", "Motels", "B&Bs", "Caravan parks"],
};
