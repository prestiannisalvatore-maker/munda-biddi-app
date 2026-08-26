"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { peaks, campsites, routeCoordinates, trailInfo } from "@/data/stirlingRidgeData";

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
  const [locationStatus, setLocationStatus] = useState<LocationStatus>("idle");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);

  const peakMarkersRef = useRef<L.Marker[]>([]);
  const campMarkersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

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

    const topoLayer = L.tileLayer(
      "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      {
        attribution:
          'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>',
        maxZoom: 17,
      }
    );

    const satelliteLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: 'Tiles &copy; Esri',
        maxZoom: 18,
      }
    );

    const map = L.map(mapRef.current, {
      center: [-34.355, 118.31],
      zoom: 12,
      layers: [topoLayer],
      minZoom: 10,
      maxZoom: 17,
    });

    L.control.layers({
      "Topographic": topoLayer,
      "Satellite": satelliteLayer,
    }).addTo(map);

    const trailCoords: L.LatLngExpression[] = routeCoordinates.map(
      ([lng, lat]) => [lat, lng] as L.LatLngExpression
    );

    const trailLine = L.polyline(trailCoords, {
      color: "#ea580c",
      weight: 4,
      opacity: 0.9,
    }).addTo(map);

    const bounds = trailLine.getBounds();
    map.fitBounds(bounds, { padding: [30, 30] });

    const sw = bounds.getSouthWest();
    const ne = bounds.getNorthEast();
    const padLat = (ne.lat - sw.lat) * 0.3;
    const padLng = (ne.lng - sw.lng) * 0.3;
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

    mapInstanceRef.current = map;
    setLoading(false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [mounted]);

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
        </div>
      </div>

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
      </div>

      <div className="bg-white px-4 py-3 border-t border-slate-200 flex flex-wrap gap-4 text-sm text-slate-600">
        <span className="flex items-center gap-2">
          <span className="w-4 h-1 bg-orange-500 rounded" />
          Ridge Route (approximate)
        </span>
        <span className="flex items-center gap-2">
          <span className="text-base">⛰️</span>
          Peaks
        </span>
        <span className="flex items-center gap-2">
          <span className="text-base">🏕️</span>
          Campsites
        </span>
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
