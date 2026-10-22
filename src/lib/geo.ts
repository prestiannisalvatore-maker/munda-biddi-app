/** Geographic helpers for compass bearings and triangulation */

const R_KM = 6371;

export function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function toDeg(rad: number) {
  return (rad * 180) / Math.PI;
}

export function normalizeBearing(deg: number) {
  return ((deg % 360) + 360) % 360;
}

/** Reciprocal / back bearing */
export function reciprocalBearing(bearing: number) {
  return normalizeBearing(bearing + 180);
}

/**
 * Destination point given start, bearing (degrees from north), and distance (km).
 * Spherical Earth approximation — fine for Stirling Range distances.
 */
export function destinationPoint(
  lat: number,
  lng: number,
  bearingDeg: number,
  distanceKm: number
): [number, number] {
  const δ = distanceKm / R_KM;
  const θ = toRad(bearingDeg);
  const φ1 = toRad(lat);
  const λ1 = toRad(lng);

  const sinφ1 = Math.sin(φ1);
  const cosφ1 = Math.cos(φ1);
  const sinδ = Math.sin(δ);
  const cosδ = Math.cos(δ);

  const sinφ2 = sinφ1 * cosδ + cosφ1 * sinδ * Math.cos(θ);
  const φ2 = Math.asin(sinφ2);
  const λ2 =
    λ1 +
    Math.atan2(Math.sin(θ) * sinδ * cosφ1, cosδ - sinφ1 * sinφ2);

  return [toDeg(φ2), toDeg(λ2)];
}

/**
 * Build a long line of position through a landmark.
 * bearingToLandmark = compass bearing YOU measured looking AT the landmark.
 * We plot the reciprocal from the landmark (where you must be).
 */
export function lineOfPosition(
  landmarkLat: number,
  landmarkLng: number,
  bearingToLandmark: number,
  halfLengthKm = 12
): [[number, number], [number, number]] {
  const back = reciprocalBearing(bearingToLandmark);
  // Line extends both ways through the landmark along the LOP
  const forward = destinationPoint(landmarkLat, landmarkLng, back, halfLengthKm);
  const backward = destinationPoint(landmarkLat, landmarkLng, bearingToLandmark, halfLengthKm);
  return [backward, forward];
}

/**
 * Intersection of two lines defined by endpoint pairs [[lat,lng],[lat,lng]].
 * Uses planar approximation in local degrees (adequate over ~20km).
 */
export function intersectLines(
  a1: [number, number],
  a2: [number, number],
  b1: [number, number],
  b2: [number, number]
): [number, number] | null {
  // Use [x,y] = [lng, lat]
  const x1 = a1[1], y1 = a1[0];
  const x2 = a2[1], y2 = a2[0];
  const x3 = b1[1], y3 = b1[0];
  const x4 = b2[1], y4 = b2[0];

  const den = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  if (Math.abs(den) < 1e-12) return null; // parallel

  const t = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / den;
  const lng = x1 + t * (x2 - x1);
  const lat = y1 + t * (y2 - y1);

  return [lat, lng];
}

/** Approximate distance between two points in km */
export function distanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δφ = toRad(lat2 - lat1);
  const Δλ = toRad(lng2 - lng1);
  const a =
    Math.sin(Δφ / 2) ** 2 +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;
  return 2 * R_KM * Math.asin(Math.sqrt(a));
}
