// Munda Biddi Trail data - from mundabiddi.org.au and Munda Biddi Trail Guide PDF

export interface TrailLocation {
  id: string;
  name: string;
  type: "campsite" | "town" | "landmark";
  description?: string;
  cumulativeKm?: number;
  lat?: number;
  lng?: number;
}

export interface DistanceSegment {
  from: string;
  to: string;
  km: number;
}

// Point-to-point distances from mundabiddi.org.au
export const pointToPointDistances: DistanceSegment[] = [
  { from: "Mundaring", to: "Carinyah", km: 42 },
  { from: "Carinyah", to: "Wungong", km: 34.7 },
  { from: "Wungong", to: "Jarrahdale", km: 26.2 },
  { from: "Jarrahdale", to: "Dandalup", km: 34.7 },
  { from: "Dandalup", to: "Dwellingup", km: 40.4 },
  { from: "Dwellingup", to: "Bidjar Ngoulin", km: 28.6 },
  { from: "Bidjar Ngoulin", to: "Yarri", km: 77.7 },
  { from: "Yarri", to: "Collie (Soldiers Park)", km: 44.9 },
  { from: "Collie (Soldiers Park)", to: "Nglang Boodja", km: 46.5 },
  { from: "Nglang Boodja", to: "Boyanup (Hurst Road)", km: 25.9 },
  { from: "Boyanup (Hurst Road)", to: "Donnybrook", km: 22.1 },
  { from: "Donnybrook", to: "Jarrahwood (Jarrahwood Road)", km: 43.7 },
  { from: "Jarrahwood (Jarrahwood Road)", to: "Nala Mia", km: 0.9 },
  { from: "Nala Mia", to: "Nannup", km: 26.7 },
  { from: "Nannup", to: "Karta Burnu", km: 60.8 },
  { from: "Karta Burnu", to: "Manjimup", km: 23.2 },
  { from: "Manjimup", to: "Pemberton", km: 83.1 },
  { from: "Pemberton", to: "Northcliffe", km: 44.5 },
  { from: "Northcliffe", to: "Yirra Kartta", km: 49.8 },
  { from: "Yirra Kartta", to: "Kwokralup Beela", km: 49.8 },
  { from: "Kwokralup Beela", to: "Walpole", km: 30.5 },
  { from: "Walpole", to: "Booner Mundak", km: 52.4 },
  { from: "Booner Mundak", to: "Jinung Beigabup", km: 54.9 },
  { from: "Jinung Beigabup", to: "Denmark", km: 41.6 },
  { from: "Denmark", to: "Albany", km: 75.1 },
];

// All locations for distance calculator (ordered north to south)
export const allLocations = [
  "Mundaring",
  "Carinyah",
  "Wungong",
  "Jarrahdale",
  "Dandalup",
  "Dwellingup",
  "Bidjar Ngoulin",
  "Yarri",
  "Collie (Soldiers Park)",
  "Nglang Boodja",
  "Boyanup (Hurst Road)",
  "Donnybrook",
  "Jarrahwood (Jarrahwood Road)",
  "Nala Mia",
  "Nannup",
  "Karta Burnu",
  "Manjimup",
  "Pemberton",
  "Northcliffe",
  "Yirra Kartta",
  "Kwokralup Beela",
  "Walpole",
  "Booner Mundak",
  "Jinung Beigabup",
  "Denmark",
  "Albany",
];

// 12 purpose-built campsites (north to south)
export const campsites = [
  { id: "carinyah", name: "Carinyah", description: "First campsite from northern terminus" },
  { id: "wungong", name: "Wungong", description: "In the Canning River Valley area" },
  { id: "dandalup", name: "Dandalup", description: "South of North Dandalup Dam with stunning views" },
  { id: "bidjar-ngoulin", name: "Bidjar Ngoulin", description: "Near Lane Poole Reserve and Murray River" },
  { id: "yarri", name: "Yarri", description: "Located on a hillside in jarrah forest" },
  { id: "nglang-boodja", name: "Nglang Boodja", description: "In Wellington National Park" },
  { id: "nala-mia", name: "Nala Mia", description: "At Jarrahwood in farming country" },
  { id: "karta-burnu", name: "Karta Burnu", description: "Massive hut with wraparound deck and valley views" },
  { id: "yirra-kartta", name: "Yirra Kartta", description: "Well-positioned in varied forest types" },
  { id: "kwokralup-beela", name: "Kwokralup Beela", description: "Near Mount Frankland and Frankland River" },
  { id: "booner-mundak", name: "Booner Mundak", description: "In the Walpole area" },
  { id: "jinung-beigabup", name: "Jinung Beigabup", description: "Near Mount Lindesay approaching Denmark" },
];

// Towns with accommodation options
export const townsWithAccommodation = [
  "Mundaring",
  "Jarrahdale",
  "Dwellingup",
  "Collie (Soldiers Park)",
  "Donnybrook",
  "Nannup",
  "Donnelly River Village",
  "Manjimup",
  "Pemberton",
  "Northcliffe",
  "Walpole",
  "Denmark",
  "Albany",
];

// Trail coordinates from KML (Mundaring to Albany) - lon, lat
export const trailCoordinates: [number, number][] = [
  [116.1636, -32.0949], // Mundaring
  [116.1733, -32.3019],
  [116.0087, -32.5310],
  [116.1065, -32.8622],
  [116.0234, -33.1481],
  [115.9260, -33.4107],
  [115.6674, -33.7962],
  [115.9527, -34.2325],
  [116.4669, -34.7126],
  [116.7554, -34.8685],
  [116.9417, -34.8452],
  [117.2645, -34.9020], // Albany
];

// Calculate cumulative distances
export function getCumulativeDistances(): Map<string, number> {
  const map = new Map<string, number>();
  let cumulative = 0;
  map.set("Mundaring", 0);
  for (const seg of pointToPointDistances) {
    cumulative += seg.km;
    map.set(seg.to, Math.round(cumulative * 10) / 10);
  }
  return map;
}

// Get distance between two locations
export function getDistanceBetween(from: string, to: string): number | null {
  const fromIndex = allLocations.indexOf(from);
  const toIndex = allLocations.indexOf(to);
  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return null;
  const [start, end] = fromIndex < toIndex ? [fromIndex, toIndex] : [toIndex, fromIndex];
  let total = 0;
  for (let i = start; i < end; i++) {
    const seg = pointToPointDistances.find(
      (s) => s.from === allLocations[i] && s.to === allLocations[i + 1]
    );
    if (seg) total += seg.km;
  }
  return Math.round(total * 10) / 10;
}
