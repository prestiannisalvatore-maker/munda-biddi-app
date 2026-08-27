const fs = require('fs');

// Extract points from a GPX file, keeping original order
function extractPoints(filename) {
  const gpxContent = fs.readFileSync(filename, 'utf8');
  const trkptRegex = /<trkpt lat="([^"]+)" lon="([^"]+)">/g;
  const points = [];
  let match;
  
  while ((match = trkptRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    points.push([lat, lon]);
  }
  return points;
}

// The north GPX file contains Jarrahwood to Mundaring
// It goes SOUTH to NORTH in the file
const northPoints = extractPoints('munda-biddi-north.gpx');
console.log(`North file points: ${northPoints.length}`);
console.log(`First point: ${northPoints[0]}`);
console.log(`Last point: ${northPoints[northPoints.length-1]}`);

// Filter for the section we need: from Wellington NP area (-33.45) to Dwellingup (-32.65)
// Keep original order (south to north as in GPX)
const relevantPoints = northPoints.filter(([lat, lon]) => {
  return lat >= -33.50 && lat <= -32.60;
});

console.log(`Relevant section points: ${relevantPoints.length}`);

// Sample for map display (~1000 points)
const displayRate = Math.max(1, Math.floor(relevantPoints.length / 1000));
const displayPoints = relevantPoints.filter((_, i) => i % displayRate === 0);
console.log(`Display points: ${displayPoints.length}`);

// High detail for navigation (~3000 points)  
const navRate = Math.max(1, Math.floor(relevantPoints.length / 3000));
const navPoints = relevantPoints.filter((_, i) => i % navRate === 0);
console.log(`Navigation points: ${navPoints.length}`);

// Full detail for offline use
console.log(`Full detail points: ${relevantPoints.length}`);

// Output as TypeScript
const tsOutput = `// Official Munda Biddi Trail coordinates
// Source: DBCA GPX files - https://catalogue.data.wa.gov.au/dataset/long-trails
// CRITICAL: This is official government trail data for navigation
// Section: Wellington National Park (near Nglang Boodja) through to north of Dwellingup
// Last updated: October 2025

// Display quality (~${displayPoints.length} points) for map rendering
export const mundaBiddiTrailPath: [number, number][] = [
${displayPoints.map(p => `  [${p[0].toFixed(6)}, ${p[1].toFixed(6)}],`).join('\n')}
];

// Navigation quality (~${navPoints.length} points) for on-trail navigation
export const mundaBiddiTrailPathNav: [number, number][] = [
${navPoints.map(p => `  [${p[0].toFixed(6)}, ${p[1].toFixed(6)}],`).join('\n')}
];

// Full detail (${relevantPoints.length} points) for offline GPS navigation
export const mundaBiddiTrailPathFull: [number, number][] = [
${relevantPoints.map(p => `  [${p[0].toFixed(6)}, ${p[1].toFixed(6)}],`).join('\n')}
];

// Key waypoints with names for navigation
export const trailWaypoints = [
  { name: "Nglang Boodja Hut", lat: -33.4097, lng: 115.9276, type: "hut" as const, km: 0 },
  { name: "Collie", lat: -33.3614, lng: 116.1558, type: "town" as const, km: 37 },
  { name: "Yarri Hut", lat: -33.1950, lng: 116.0980, type: "hut" as const, km: 77 },
  { name: "Lake Brockman", lat: -33.0580, lng: 116.0420, type: "camp" as const, km: 112 },
  { name: "Bidjar Ngoulin Hut", lat: -32.9500, lng: 116.0350, type: "hut" as const, km: 135 },
  { name: "Dwellingup", lat: -32.7144, lng: 116.0622, type: "town" as const, km: 168 },
];
`;

fs.writeFileSync('src/data/trailPath.ts', tsOutput);
console.log('Written to src/data/trailPath.ts');
