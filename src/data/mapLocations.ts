// Map marker locations - coordinates from Wikipedia / official sources
// Towns verified against mundabiddi.org.au trail route

export interface MapMarker {
  name: string;
  lat: number;
  lng: number;
  type: "campsite" | "town";
  major?: boolean; // Larger marker for major towns with services
}

// Coordinates snapped to trail (from Komoot, MTBProject, mundabiddi.org.au + KML)
export const campsiteMarkers: MapMarker[] = [
  { name: "Carinyah", lat: -32.095317, lng: 116.163448, type: "campsite" },
  { name: "Wungong", lat: -32.302193, lng: 116.173405, type: "campsite" },
  { name: "Dandalup", lat: -32.579802, lng: 116.07901, type: "campsite" },
  { name: "Bidjar Ngoulin", lat: -32.84861, lng: 116.032058, type: "campsite" },
  { name: "Yarri", lat: -33.178827, lng: 116.107518, type: "campsite" },
  { name: "Nglang Boodja", lat: -33.450319, lng: 115.901354, type: "campsite" },
  { name: "Nala Mia", lat: -33.97089, lng: 115.781168, type: "campsite" },
  { name: "Karta Burnu", lat: -34.102577, lng: 115.978313, type: "campsite" },
  { name: "Yirra Kartta", lat: -34.557828, lng: 116.414122, type: "campsite" },
  { name: "Kwokralup Beela", lat: -34.784671, lng: 116.536091, type: "campsite" },
  { name: "Booner Mundak", lat: -34.879026, lng: 116.714145, type: "campsite" },
  { name: "Jinung Beigabup", lat: -34.890481, lng: 117.085001, type: "campsite" },
];

// Town coordinates from Wikipedia (town centre / CBD)
export const townMarkers: MapMarker[] = [
  { name: "Mundaring", lat: -31.897, lng: 116.171, type: "town", major: true },
  { name: "Jarrahdale", lat: -32.339, lng: 116.062, type: "town" },
  { name: "Dwellingup", lat: -32.72, lng: 116.06, type: "town", major: true },
  { name: "Collie", lat: -33.363, lng: 116.156, type: "town", major: true },
  { name: "Donnybrook", lat: -33.58, lng: 115.82, type: "town", major: true },
  { name: "Nannup", lat: -33.982, lng: 115.765, type: "town", major: true },
  { name: "Donnelly River Village", lat: -34.10, lng: 115.98, type: "town" },
  { name: "Manjimup", lat: -34.241, lng: 116.146, type: "town", major: true },
  { name: "Pemberton", lat: -34.445, lng: 116.034, type: "town", major: true },
  { name: "Northcliffe", lat: -34.633, lng: 116.124, type: "town" },
  { name: "Walpole", lat: -34.98, lng: 116.7, type: "town", major: true },
  { name: "Denmark", lat: -34.96, lng: 117.353, type: "town", major: true },
  { name: "Albany", lat: -35.023, lng: 117.881, type: "town", major: true },
];
