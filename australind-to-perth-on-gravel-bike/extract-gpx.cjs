const fs = require('fs');

const gpxContent = fs.readFileSync('munda-biddi-north.gpx', 'utf8');

// Extract all track points
const trkptRegex = /<trkpt lat="([^"]+)" lon="([^"]+)">/g;
const points = [];
let match;

while ((match = trkptRegex.exec(gpxContent)) !== null) {
  const lat = parseFloat(match[1]);
  const lon = parseFloat(match[2]);
  points.push([lat, lon]);
}

console.log(`Total points: ${points.length}`);

// Filter for Collie (-33.36) to Dwellingup (-32.71) area
// Actually we need from south of Collie to north of Dwellingup
const filteredPoints = points.filter(([lat, lon]) => {
  return lat >= -33.45 && lat <= -32.65;
});

console.log(`Filtered points (Collie to Dwellingup area): ${filteredPoints.length}`);

// Sample every Nth point to get ~500 points for the web map
const sampleRate = Math.max(1, Math.floor(filteredPoints.length / 500));
const sampledPoints = filteredPoints.filter((_, i) => i % sampleRate === 0);

console.log(`Sampled points: ${sampledPoints.length}`);

// Output as TypeScript array
const tsOutput = `// Official Munda Biddi Trail coordinates (Collie to Dwellingup section)
// Source: DBCA GPX file - https://catalogue.data.wa.gov.au/dataset/long-trails
// Sampled from ${filteredPoints.length} points at 1:${sampleRate} ratio
export const mundaBiddiTrailPath: [number, number][] = [
${sampledPoints.map(p => `  [${p[0].toFixed(6)}, ${p[1].toFixed(6)}],`).join('\n')}
];
`;

fs.writeFileSync('src/data/trailPath.ts', tsOutput);
console.log('Written to src/data/trailPath.ts');
