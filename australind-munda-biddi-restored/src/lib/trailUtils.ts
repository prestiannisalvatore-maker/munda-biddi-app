/**
 * Trail geometry utilities for distance calculation along the Munda Biddi path.
 */

export interface TrailPoint {
  lat: number;
  lng: number;
}

export interface TrailPath {
  points: TrailPoint[];
  cumDist: number[]; // cumulative distance from start (km)
  totalLength: number;
}

function haversineKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function closestPointOnSegment(
  px: number,
  py: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number
): { x: number; y: number; t: number } {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return { x: x1, y: y1, t: 0 };
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return { x: x1 + t * dx, y: y1 + t * dy, t };
}

/**
 * Parse KML text and build an ordered trail path (Mundaring north to Albany south).
 */
export function buildTrailPath(kmlText: string): TrailPath {
  const parser = new DOMParser();
  const doc = parser.parseFromString(kmlText, "text/xml");
  const coordElements = doc.querySelectorAll("coordinates");

  const segments: TrailPoint[][] = [];
  coordElements.forEach((el) => {
    const text = el.textContent?.trim() || "";
    const points = text
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => {
        const [lon, lat] = s.split(",").map(Number);
        return { lat, lng: lon };
      });
    if (points.length > 0) segments.push(points);
  });

  // Use KML segment order (DBCA data is typically in trail order)
  // Concatenate segments into single path
  const points: TrailPoint[] = [];
  for (const seg of segments) {
    points.push(...seg);
  }

  // Compute cumulative distance
  const cumDist: number[] = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineKm(
      points[i - 1].lat,
      points[i - 1].lng,
      points[i].lat,
      points[i].lng
    );
    cumDist.push(total);
  }

  return { points, cumDist, totalLength: total };
}

/**
 * Find the closest point on the trail to a given lat/lng.
 * Returns the snapped position and its cumulative distance (km) from trail start.
 */
export function findClosestOnTrail(
  path: TrailPath,
  targetLat: number,
  targetLng: number
): { lat: number; lng: number; cumDist: number } | null {
  let best: { lat: number; lng: number; cumDist: number } | null = null;
  let bestDist = Infinity;

  const { points, cumDist } = path;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const proj = closestPointOnSegment(
      targetLng,
      targetLat,
      p1.lng,
      p1.lat,
      p2.lng,
      p2.lat
    );
    const dist = haversineKm(targetLat, targetLng, proj.y, proj.x);
    if (dist < bestDist) {
      bestDist = dist;
      // Interpolate cumDist between segment endpoints
      const d = cumDist[i] + proj.t * (cumDist[i + 1] - cumDist[i]);
      best = { lat: proj.y, lng: proj.x, cumDist: d };
    }
  }
  return best;
}

/**
 * Distance along trail between two cumulative distance values (km).
 */
export function distanceAlongTrail(
  startCumDist: number,
  endCumDist: number
): number {
  return Math.abs(endCumDist - startCumDist);
}
