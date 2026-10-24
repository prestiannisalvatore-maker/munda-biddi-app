"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { peaks, campsites, routeCoordinates, trailInfo } from "@/data/stirlingRidgeData";
import MapCompass from "./MapCompass";
import TriangulationPanel, { type Sighting } from "./TriangulationPanel";
import { lineOfPosition, intersectLines } from "@/lib/geo";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const userLocationIcon = L.divIcon({
  className: "user-location-marker",
  html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;">
    <div style="width:24px;height:24px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.3);"></div>
    <div style="position:absolute;width:12px;height:12px;background:#3b82f6;border-radius:50%;animation:pulse 2s infinite;"></div>
  </div>
  <style>
    @keyframes pulse {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(3); opacity: 0; }
    }
  </style>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const peakIcon = (name: string, elevation: number, isHighest: boolean) =>
  L.divIcon({
    className: "peak-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="font-size:${isHighest ? '24px' : '18px'};line-height:1;">⛰️</span>
      <span style="font-size:9px;font-weight:600;color:#1e293b;white-space:nowrap;text-shadow:0 0 3px white,0 0 3px white;background:rgba(255,255,255,0.9);padding:1px 4px;border-radius:3px;">
        ${name}<br/><span style="color:#b45309;">${elevation}m</span>
      </span>
    </div>`,
    iconSize: [100, 50],
    iconAnchor: [50, 40],
  });

const campIcon = (name: string) =>
  L.divIcon({
    className: "camp-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
      <span style="font-size:18px;line-height:1;">🏕️</span>
      <span style="font-size:9px;font-weight:600;color:#166534;white-space:nowrap;text-shadow:0 0 3px white,0 0 3px white;background:rgba(255,255,255,0.9);padding:1px 4px;border-radius:3px;">
        ${name}
      </span>
    </div>`,
    iconSize: [100, 40],
    iconAnchor: [50, 35],
  });


type LocationStatus = "idle" | "locating" | "tracking" | "error";

export default function StirlingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPeaks, setShowPeaks] = useState(true);
  const [showCamps, setShowCamps] = useState(true);
  const [showCompass, setShowCompass] = useState(false);
  const [showNorthLines, setShowNorthLines] = useState(true);
  const [showTriangulate, setShowTriangulate] = useState(false);
  const [triStep, setTriStep] = useState<1 | 2 | 3 | 4>(1);
  const [sighting1, setSighting1] = useState<Sighting | null>(null);
  const [sighting2, setSighting2] = useState<Sighting | null>(null);
  const [triResult, setTriResult] = useState<{ lat: number; lng: number } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  const peakMarkersRef = useRef<L.Marker[]>([]);
  const campMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);
  const northLinesLayerRef = useRef<L.LayerGroup | null>(null);
  const triLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Device heading for triangulation bearing helper
  useEffect(() => {
    const onOrient = (event: DeviceOrientationEvent) => {
      if (event.alpha === null) return;
      const heading =
        (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ?? 360 - event.alpha;
      setDeviceHeading(heading);
    };
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", onOrient, true);
    }
    return () => window.removeEventListener("deviceorientation", onOrient, true);
  }, []);

  const clearTriangulation = useCallback(() => {
    const map = mapInstanceRef.current;
    if (triLayerRef.current && map) {
      map.removeLayer(triLayerRef.current);
      triLayerRef.current = null;
    }
    setTriResult(null);
  }, []);

  const plotTriangulation = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map || !sighting1 || !sighting2) return;

    clearTriangulation();

    const p1 = peaks.find((p) => p.id === sighting1.peakId);
    const p2 = peaks.find((p) => p.id === sighting2.peakId);
    if (!p1 || !p2) return;

    const [a1, a2] = lineOfPosition(p1.lat, p1.lng, sighting1.bearing);
    const [b1, b2] = lineOfPosition(p2.lat, p2.lng, sighting2.bearing);
    const cross = intersectLines(a1, a2, b1, b2);

    const group = L.layerGroup();

    L.polyline([a1, a2], {
      color: "#7c3aed",
      weight: 3,
      opacity: 0.85,
      dashArray: "8 6",
    }).addTo(group);

    L.polyline([b1, b2], {
      color: "#0d9488",
      weight: 3,
      opacity: 0.85,
      dashArray: "8 6",
    }).addTo(group);

    // Landmark dots
    L.circleMarker([p1.lat, p1.lng], {
      radius: 7,
      color: "#7c3aed",
      fillColor: "#a78bfa",
      fillOpacity: 1,
      weight: 2,
    })
      .bindTooltip(`Sight 1: ${p1.name} @ ${Math.round(sighting1.bearing)}°`, { permanent: false })
      .addTo(group);

    L.circleMarker([p2.lat, p2.lng], {
      radius: 7,
      color: "#0d9488",
      fillColor: "#5eead4",
      fillOpacity: 1,
      weight: 2,
    })
      .bindTooltip(`Sight 2: ${p2.name} @ ${Math.round(sighting2.bearing)}°`, { permanent: false })
      .addTo(group);

    if (cross) {
      const [lat, lng] = cross;
      setTriResult({ lat, lng });

      const youIcon = L.divIcon({
        className: "tri-position",
        html: `<div style="display:flex;flex-direction:column;align-items:center;">
          <div style="width:22px;height:22px;background:#ec4899;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.45);"></div>
          <span style="margin-top:2px;font-size:10px;font-weight:800;color:#9d174d;background:rgba(255,255,255,0.95);padding:1px 5px;border-radius:4px;white-space:nowrap;">YOU ≈ here</span>
        </div>`,
        iconSize: [80, 40],
        iconAnchor: [40, 11],
      });

      L.marker([lat, lng], { icon: youIcon })
        .bindPopup(
          `<strong>Estimated position</strong><br/>From compass triangulation<br/>${Math.abs(lat).toFixed(5)}°S, ${lng.toFixed(5)}°E`
        )
        .addTo(group);

      map.fitBounds(L.latLngBounds([a1, a2, b1, b2, [lat, lng]]), { padding: [40, 40] });
    } else {
      setTriResult(null);
    }

    group.addTo(map);
    triLayerRef.current = group;
  }, [sighting1, sighting2, clearTriangulation]);

  const updateUserLocation = useCallback((position: GeolocationPosition) => {
    const { latitude, longitude, accuracy } = position.coords;
    setUserCoords({ lat: latitude, lng: longitude, accuracy });
    setLocationStatus("tracking");
    setLocationError(null);

    const map = mapInstanceRef.current;
    if (!map) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng([latitude, longitude]);
    } else {
      userMarkerRef.current = L.marker([latitude, longitude], { icon: userLocationIcon })
        .addTo(map)
        .bindPopup(`<strong>Your Location</strong><br/>Accuracy: ${Math.round(accuracy)}m`);
    }

    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng([latitude, longitude]);
      accuracyCircleRef.current.setRadius(accuracy);
    } else {
      accuracyCircleRef.current = L.circle([latitude, longitude], {
        radius: accuracy,
        color: "#3b82f6",
        fillColor: "#3b82f6",
        fillOpacity: 0.15,
        weight: 2,
      }).addTo(map);
    }
  }, []);

  const handleLocationError = useCallback((error: GeolocationPositionError) => {
    setLocationStatus("error");
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setLocationError("Location permission denied. Please enable location access in your browser settings.");
        break;
      case error.POSITION_UNAVAILABLE:
        setLocationError("Location unavailable. Make sure GPS is enabled on your device.");
        break;
      case error.TIMEOUT:
        setLocationError("Location request timed out. Please try again.");
        break;
      default:
        setLocationError("Unable to get your location.");
    }
  }, []);

  const startTracking = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLocationStatus("locating");
    setLocationError(null);

    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateUserLocation,
      handleLocationError,
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
      }
    );
  }, [updateUserLocation, handleLocationError]);

  const stopTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    const map = mapInstanceRef.current;
    if (map) {
      if (userMarkerRef.current) {
        map.removeLayer(userMarkerRef.current);
        userMarkerRef.current = null;
      }
      if (accuracyCircleRef.current) {
        map.removeLayer(accuracyCircleRef.current);
        accuracyCircleRef.current = null;
      }
    }

    setLocationStatus("idle");
    setUserCoords(null);
    setLocationError(null);
  }, []);

  const centerOnUser = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map && userCoords) {
      map.setView([userCoords.lat, userCoords.lng], 15);
    }
  }, [userCoords]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    // Esri World Topo keeps ridge/path detail when zoomed in (OpenTopo often goes blank past ~15 in WA)
    const topoLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri — World Topographic Map",
        maxZoom: 19,
        maxNativeZoom: 18,
      }
    );

    // Classic contours — useful mid-zoom; blanks out if you push past available tiles
    const contoursLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
        maxNativeZoom: 15,
      }
    );

    const streetsLayer = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
        maxNativeZoom: 19,
      }
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
        maxZoom: 19,
        maxNativeZoom: 19,
      }
    );

    const map = L.map(mapRef.current, {
      center: [-34.355, 118.31],
      zoom: 13,
      layers: [topoLayer],
      minZoom: 11,
      maxZoom: 18,
    });

    L.control
      .layers({
        Topographic: topoLayer,
        "Contours (OpenTopo)": contoursLayer,
        Streets: streetsLayer,
        Satellite: satelliteLayer,
      })
      .addTo(map);

    const trailCoords: L.LatLngExpression[] = routeCoordinates.map(
      ([lng, lat]) => [lat, lng] as L.LatLngExpression
    );

    const trailLine = L.polyline(trailCoords, {
      color: "#ea580c",
      weight: 5,
      opacity: 0.95,
    }).addTo(map);

    const bounds = trailLine.getBounds();
    map.fitBounds(bounds, { padding: [20, 20] });

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const padLat = (ne.lat - sw.lat) * 0.15;
    const padLng = (ne.lng - sw.lng) * 0.15;
    map.setMaxBounds(
      L.latLngBounds(
        L.latLng(sw.lat - padLat, sw.lng - padLng),
        L.latLng(ne.lat + padLat, ne.lng + padLng)
      )
    );

    const peakMarkers: L.Marker[] = [];
    peaks.forEach((peak) => {
      const isHighest = peak.elevation === trailInfo.highestPoint.elevation;
      const marker = L.marker([peak.lat, peak.lng], {
        icon: peakIcon(peak.name, peak.elevation, isHighest),
      })
        .addTo(map)
        .bindPopup(`<strong>${peak.name}</strong><br/>${peak.elevation}m ASL<br/><em>${peak.description}</em>`);
      peakMarkers.push(marker);
    });
    peakMarkersRef.current = peakMarkers;

    const campMarkers: L.Marker[] = [];
    campsites.forEach((site) => {
      const marker = L.marker([site.lat, site.lng], { icon: campIcon(site.name) })
        .addTo(map)
        .bindPopup(`<strong>${site.name}</strong><br/>${site.description}<br/><br/><em>${site.features.join(", ")}</em>`);
      campMarkers.push(marker);
    });
    campMarkersRef.current = campMarkers;

    // North-south orienteering grid lines (map north = top)
    const gridBounds = map.getBounds().pad(0.35);
    const south = gridBounds.getSouth();
    const north = gridBounds.getNorth();
    const west = gridBounds.getWest();
    const east = gridBounds.getEast();
    const lngSpan = east - west;
    // ~12–16 parallel north lines across the map
    const step = lngSpan / 14;

    const northGroup = L.layerGroup();
    for (let lng = west; lng <= east + step * 0.01; lng += step) {
      // North-south meridian line
      L.polyline(
        [
          [south, lng],
          [north, lng],
        ],
        {
          color: "#dc2626",
          weight: 1.5,
          opacity: 0.45,
          interactive: false,
          dashArray: "6 8",
        }
      ).addTo(northGroup);

      // North arrow tip near top of each line
      L.marker([north - (north - south) * 0.02, lng], {
        interactive: false,
        icon: L.divIcon({
          className: "north-arrow",
          html: `<div style="color:#dc2626;font-size:10px;font-weight:800;text-shadow:0 0 3px white,0 0 3px white;transform:translate(-50%,-50%);">N▲</div>`,
          iconSize: [24, 14],
          iconAnchor: [12, 7],
        }),
      }).addTo(northGroup);
    }

    // Lighter east-west lines for a full orienteering grid
    const latStep = (north - south) / 10;
    for (let lat = south; lat <= north + latStep * 0.01; lat += latStep) {
      L.polyline(
        [
          [lat, west],
          [lat, east],
        ],
        {
          color: "#dc2626",
          weight: 0.75,
          opacity: 0.2,
          interactive: false,
          dashArray: "4 6",
        }
      ).addTo(northGroup);
    }

    northGroup.addTo(map);
    northLinesLayerRef.current = northGroup;

    mapInstanceRef.current = map;
    setLoading(false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      northLinesLayerRef.current = null;
    };
  }, [mounted]);

  // Toggle north grid lines
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = northLinesLayerRef.current;
    if (!map || !layer) return;

    if (showNorthLines) {
      if (!map.hasLayer(layer)) layer.addTo(map);
    } else {
      if (map.hasLayer(layer)) map.removeLayer(layer);
    }
  }, [showNorthLines]);

  // Auto-show north lines when compass opens
  useEffect(() => {
    if (showCompass) setShowNorthLines(true);
  }, [showCompass]);

  // Disable Leaflet map gestures while user is moving/rotating the compass with fingers
  const handleCompassInteract = useCallback((active: boolean) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const tapHandler = (map as L.Map & { tap?: { disable: () => void; enable: () => void } }).tap;

    if (active) {
      map.dragging.disable();
      map.touchZoom.disable();
      map.doubleClickZoom.disable();
      map.scrollWheelZoom.disable();
      map.boxZoom.disable();
      tapHandler?.disable();
    } else {
      map.dragging.enable();
      map.touchZoom.enable();
      map.doubleClickZoom.enable();
      map.scrollWheelZoom.enable();
      map.boxZoom.enable();
      tapHandler?.enable();
    }
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    peakMarkersRef.current.forEach((marker) => {
      if (showPeaks) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }, [showPeaks]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    campMarkersRef.current.forEach((marker) => {
      if (showCamps) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  }, [showCamps]);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center gap-4">
        <span className="text-sm font-medium text-slate-700">Show:</span>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showPeaks}
            onChange={(e) => setShowPeaks(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm text-slate-700">Peaks</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showCamps}
            onChange={(e) => setShowCamps(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
          />
          <span className="text-sm text-slate-700">Campsites</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={showNorthLines}
            onChange={(e) => setShowNorthLines(e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-slate-700">North lines</span>
        </label>
        
        <div className="ml-auto flex items-center gap-2">
          {locationStatus === "idle" && (
            <button
              onClick={startTracking}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <span>📍</span> Show My Location
            </button>
          )}
          {locationStatus === "locating" && (
            <span className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg">
              <span className="animate-pulse">📍</span> Locating...
            </span>
          )}
          {locationStatus === "tracking" && (
            <>
              <button
                onClick={centerOnUser}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-700 text-sm font-medium rounded-lg hover:bg-blue-200 transition-colors"
                title="Center map on your location"
              >
                <span>🎯</span> Center
              </button>
              <button
                onClick={stopTracking}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors"
              >
                Stop Tracking
              </button>
            </>
          )}
          {locationStatus === "error" && (
            <button
              onClick={startTracking}
              className="flex items-center gap-2 px-3 py-1.5 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition-colors"
            >
              <span>⚠️</span> Retry Location
            </button>
          )}
          
          {/* Compass Toggle */}
          <button
            onClick={() => setShowCompass(!showCompass)}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              showCompass 
                ? "bg-amber-600 text-white hover:bg-amber-700" 
                : "bg-amber-100 text-amber-700 hover:bg-amber-200"
            }`}
            title="Toggle orienteering compass"
          >
            <span>🧭</span> Compass
          </button>

          {/* Triangulation Toggle */}
          <button
            onClick={() => {
              const next = !showTriangulate;
              setShowTriangulate(next);
              if (next) {
                setShowNorthLines(true);
                setShowPeaks(true);
                setTriStep(1);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
              showTriangulate
                ? "bg-indigo-600 text-white hover:bg-indigo-700"
                : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
            }`}
            title="Find your position by sighting two peaks"
          >
            <span>📐</span> Find me
          </button>
        </div>
      </div>

      {showTriangulate && (
        <TriangulationPanel
          step={triStep}
          sighting1={sighting1}
          sighting2={sighting2}
          result={triResult}
          onStepChange={setTriStep}
          onSighting1Change={setSighting1}
          onSighting2Change={setSighting2}
          onPlot={plotTriangulation}
          onClear={() => {
            clearTriangulation();
            setSighting1(null);
            setSighting2(null);
          }}
          onClose={() => {
            setShowTriangulate(false);
          }}
          deviceHeading={deviceHeading}
        />
      )}

      {locationError && (
        <div className="bg-red-50 px-4 py-2 border-b border-red-200 text-sm text-red-700">
          {locationError}
        </div>
      )}

      {userCoords && locationStatus === "tracking" && (
        <div className="bg-blue-50 px-4 py-2 border-b border-blue-200 text-sm text-blue-700 flex items-center gap-2">
          <span>📍</span>
          <span>
            GPS Active: {userCoords.lat.toFixed(5)}°S, {userCoords.lng.toFixed(5)}°E 
            <span className="text-blue-500 ml-2">(±{Math.round(userCoords.accuracy)}m)</span>
          </span>
        </div>
      )}

      <div ref={mapRef} className="h-[600px] w-full relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 z-[1000]">
            <span className="text-slate-500">Loading map...</span>
          </div>
        )}
        
        {/* Orienteering Compass Overlay */}
        {showCompass && (
          <MapCompass
            magneticDeclination={1.5}
            onClose={() => {
              handleCompassInteract(false);
              setShowCompass(false);
            }}
            onInteractChange={handleCompassInteract}
          />
        )}
      </div>

      <div className="bg-white px-4 py-3 border-t border-slate-200 flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <span className="w-4 h-1 bg-orange-500 rounded" />
          Full GPX track (1,514 points)
        </span>
        <span className="flex items-center gap-2">
          <span className="text-base">⛰️</span>
          Peaks
        </span>
        <span className="flex items-center gap-2">
          <span className="text-base">🏕️</span>
          Campsites
        </span>
        {showNorthLines && (
          <span className="flex items-center gap-2">
            <span
              className="w-4 h-0 border-t-2 border-dashed border-red-500"
              aria-hidden
            />
            <span className="text-red-600 font-medium">N▲ North lines</span>
          </span>
        )}
        {triResult && (
          <>
            <span className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-violet-600" style={{ borderTop: "2px dashed #7c3aed" }} />
              Bearing line 1
            </span>
            <span className="flex items-center gap-2">
              <span className="w-4 h-0.5 bg-teal-600" />
              Bearing line 2
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 bg-pink-500 rounded-full border-2 border-white shadow" />
              Estimated position
            </span>
          </>
        )}
        {locationStatus === "tracking" && (
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow" />
            Your Location
          </span>
        )}
      </div>
    </div>
  );
}
