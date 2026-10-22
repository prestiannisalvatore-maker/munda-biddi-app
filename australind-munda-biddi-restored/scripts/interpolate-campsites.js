/**
 * Script to find exact campsite coordinates on the Munda Biddi trail.
 * For each campsite, finds the closest point on the trail geometry.
 * Run: node scripts/interpolate-campsites.js
 */

const fs = require("fs");
const path = require("path");

const KML_PATH = path.join(__dirname, "../public/munda_biddi_cycle_trail.kml");

// Initial positions: verified from Komoot/MTBProject/Google Maps where available,
// otherwise based on Munda Biddi Trail cumulative distances (mundabiddi.org.au)
const CAMPSITES = [
  { name: "Carinyah", lat: -32.095336, lng: 116.163463 }, // Komoot verified
  { name: "Wungong", lat: -32.302187, lng: 116.173402 }, // MTBProject verified
  { name: "Dandalup", lat: -32.5798, lng: 116.079 }, // Near North Dandalup
  { name: "Bidjar Ngoulin", lat: -32.8486, lng: 116.032 }, // ~29km S of Dwellingup
  { name: "Yarri", lat: -33.1789, lng: 116.107 }, // Harvey region
  { name: "Nglang Boodja", lat: -33.4501, lng: 115.901 }, // Between Collie & Donnybrook
  { name: "Nala Mia", lat: -33.971, lng: 115.781 }, // Near Jarrahwood
  { name: "Karta Burnu", lat: -34.102577, lng: 115.978315 }, // MTBProject verified
  { name: "Yirra Kartta", lat: -34.558, lng: 116.414 }, // Between Pemberton & Northcliffe
  { name: "Kwokralup Beela", lat: -34.7848, lng: 116.536 }, // Near Walpole
  { name: "Booner Mundak", lat: -34.879, lng: 116.714 }, // Between Walpole & Denmark
  { name: "Jinung Beigabup", lat: -34.8905, lng: 117.085 }, // Near Denmark
];

function parseKml(kmlText) {
  const coordElements = kmlText.match(/<coordinates>([\s\S]*?)<\/coordinates>/g);
  const allPoints = [];
  for (const el of coordElements || []) {
    const text = el.replace(/<\/?coordinates>/g, "").trim();
    const points = text.split(/\s+/).filter(Boolean).map((s) => {
      const [lon, lat] = s.split(",").map(Number);
      return { lat, lon };
    });
    allPoints.push(...points);
  }
  return allPoints;
}

function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // km
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

function findClosestPointOnSegment(px, py, x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lenSq = dx * dx + dy * dy;
  if (lenSq === 0) return { x: x1, y: y1, t: 0 };
  let t = ((px - x1) * dx + (py - y1) * dy) / lenSq;
  t = Math.max(0, Math.min(1, t));
  return { x: x1 + t * dx, y: y1 + t * dy, t };
}

function findClosestOnTrail(targetLat, targetLng, points) {
  let best = null;
  let bestDist = Infinity;
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const proj = findClosestPointOnSegment(
      targetLng,
      targetLat,
      p1.lon,
      p1.lat,
      p2.lon,
      p2.lat
    );
    const dist = haversineDistance(targetLat, targetLng, proj.y, proj.x);
    if (dist < bestDist) {
      bestDist = dist;
      best = { lat: proj.y, lon: proj.x };
    }
  }
  return best;
}

function main() {
  const kmlText = fs.readFileSync(KML_PATH, "utf8");
  const points = parseKml(kmlText);
  console.log(`Parsed ${points.length} trail points from KML`);

  const results = [];
  for (const camp of CAMPSITES) {
    const closest = findClosestOnTrail(camp.lat, camp.lng, points);
    if (closest) {
      results.push({
        name: camp.name,
        lat: closest.lat,
        lng: closest.lon,
      });
      console.log(
        `${camp.name}: ${closest.lat.toFixed(6)}, ${closest.lon.toFixed(6)}`
      );
    }
  }

  console.log("\n--- TypeScript output for mapLocations.ts ---\n");
  console.log(
    "export const campsiteMarkers: MapMarker[] = ["
  );
  for (const r of results) {
    console.log(
      `  { name: "${r.name}", lat: ${r.lat.toFixed(6)}, lng: ${r.lng.toFixed(6)}, type: "campsite" },`
    );
  }
  console.log("];");
}

main();
