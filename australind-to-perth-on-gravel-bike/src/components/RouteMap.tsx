import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import { routeLocations, routePath } from "../data/trip";
import type { Location } from "../data/trip";
import "leaflet/dist/leaflet.css";

const getMarkerIcon = (type: Location["type"]) => {
  const colors: Record<Location["type"], string> = {
    start: "#16a34a", // green
    end: "#dc2626", // red
    hut: "#d97706", // amber
    town: "#2563eb", // blue
    camp: "#7c3aed", // purple
  };

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${colors[type]}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

interface RouteMapProps {
  selectedDay?: number;
  height?: string;
}

export default function RouteMap({ selectedDay, height = "400px" }: RouteMapProps) {
  const bounds = new LatLngBounds(
    [-33.45, 115.55],
    [-32.45, 116.25]
  );

  const daySegments: Record<number, { start: number; end: number }> = {
    1: { start: 0, end: 5 },   // Bunbury to Nglang Boodja
    2: { start: 5, end: 9 },   // Nglang Boodja to Collie
    3: { start: 9, end: 13 },  // Collie to Yarri
    4: { start: 13, end: 16 }, // Yarri to Lake Brockman
    5: { start: 16, end: 21 }, // Lake Brockman to Dwellingup
    6: { start: 21, end: 26 }, // Dwellingup to Mandurah
  };

  const getPathForDay = (day: number) => {
    const segment = daySegments[day];
    return routePath.slice(segment.start, segment.end + 1);
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-line shadow-sm">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={false}
        style={{ height, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {selectedDay ? (
          <Polyline
            positions={getPathForDay(selectedDay)}
            color="#2f6b4f"
            weight={4}
            opacity={0.9}
          />
        ) : (
          <>
            {[1, 2, 3, 4, 5, 6].map((day) => (
              <Polyline
                key={day}
                positions={getPathForDay(day)}
                color="#2f6b4f"
                weight={4}
                opacity={0.8}
              />
            ))}
          </>
        )}

        {routeLocations.map((location) => (
          <Marker
            key={location.name}
            position={[location.lat, location.lng]}
            icon={getMarkerIcon(location.type)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-ink">{location.name}</p>
                <p className="text-muted mt-1">{location.description}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
