import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import { Icon, LatLngBounds } from "leaflet";
import { routeLocations } from "../data/trip";
import { mundaBiddiTrailPathNav, trailWaypoints } from "../data/trailPath";
import type { Location } from "../data/trip";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const getMarkerIcon = (type: Location["type"] | "hut" | "camp" | "town") => {
  const colors: Record<string, string> = {
    start: "#16a34a",
    end: "#dc2626",
    hut: "#d97706",
    town: "#2563eb",
    camp: "#7c3aed",
  };

  return new Icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${colors[type] || "#2563eb"}" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

function MapController({ selectedDay }: { selectedDay?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (selectedDay) {
      const dayBounds: Record<number, [[number, number], [number, number]]> = {
        1: [[-33.50, 115.60], [-33.30, 116.00]],
        2: [[-33.45, 115.90], [-33.30, 116.20]],
        3: [[-33.40, 116.05], [-33.15, 116.20]],
        4: [[-33.25, 116.00], [-33.00, 116.15]],
        5: [[-33.10, 116.00], [-32.65, 116.15]],
        6: [[-32.75, 115.70], [-32.50, 116.10]],
      };
      const bounds = dayBounds[selectedDay];
      if (bounds) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [selectedDay, map]);
  
  return null;
}

interface RouteMapProps {
  selectedDay?: number;
  height?: string;
  showFullTrail?: boolean;
}

export default function RouteMap({ selectedDay, height = "400px", showFullTrail = true }: RouteMapProps) {
  const bounds = new LatLngBounds(
    [-33.55, 115.55],
    [-32.45, 116.25]
  );

  return (
    <div className="relative rounded-2xl overflow-hidden border border-line shadow-sm">
      <MapContainer
        bounds={bounds}
        scrollWheelZoom={true}
        style={{ height, width: "100%" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapController selectedDay={selectedDay} />
        
        {/* Official Munda Biddi Trail path */}
        {showFullTrail && (
          <Polyline
            positions={mundaBiddiTrailPathNav}
            color="#2f6b4f"
            weight={4}
            opacity={0.9}
          />
        )}

        {/* Trail waypoints from official data */}
        {trailWaypoints.map((waypoint) => (
          <Marker
            key={waypoint.name}
            position={[waypoint.lat, waypoint.lng]}
            icon={getMarkerIcon(waypoint.type)}
          >
            <Popup>
              <div className="text-sm">
                <p className="font-bold text-ink">{waypoint.name}</p>
                <p className="text-muted mt-1">~{waypoint.km} km from start</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Start and end points */}
        {routeLocations.filter(l => l.type === "start" || l.type === "end").map((location) => (
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
      
      <div className="absolute top-2 left-2 z-[1000] bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs text-muted border border-line">
        Official DBCA Trail Data
      </div>
    </div>
  );
}
