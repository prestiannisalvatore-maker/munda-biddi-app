"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { peaks, campsites, routeCoordinates, trailInfo } from "@/data/stirlingRidgeData";

delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
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


export default function StirlingMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPeaks, setShowPeaks] = useState(true);
  const [showCamps, setShowCamps] = useState(true);

  const peakMarkersRef = useRef<L.Marker[]>([]);
  const campMarkersRef = useRef<L.Marker[]>([]);

  useEffect(() => {
    setMounted(true);
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
      </div>

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
      </div>
    </div>
  );
}
