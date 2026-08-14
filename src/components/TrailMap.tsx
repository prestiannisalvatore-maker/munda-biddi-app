"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import { campsiteMarkers, townMarkers } from "@/data/mapLocations";
import {
  buildTrailPath,
  findClosestOnTrail,
  distanceAlongTrail,
  type TrailPath,
} from "@/lib/trailUtils";

// Fix Leaflet default icon in Next.js
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function parseKmlLineStrings(kmlText: string): L.LatLngExpression[][] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(kmlText, "text/xml");
  const lineStrings: L.LatLngExpression[][] = [];

  const coordElements = doc.querySelectorAll("coordinates");
  coordElements.forEach((el) => {
    const text = el.textContent?.trim() || "";
    const points = text
      .split(/\s+/)
      .filter(Boolean)
      .map((s) => {
        const [lon, lat] = s.split(",").map(Number);
        return [lat, lon] as L.LatLngExpression;
      });
    if (points.length > 0) lineStrings.push(points);
  });

  return lineStrings;
}

const tentIcon = (name: string) =>
  L.divIcon({
    className: "tent-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:0;">
      <span style="font-size:20px;line-height:1;">⛺</span>
      <span style="font-size:10px;font-weight:600;color:#1e293b;white-space:nowrap;text-shadow:0 0 2px white,0 0 2px white;">${name}</span>
    </div>`,
    iconSize: [60, 36],
    iconAnchor: [30, 36],
  });

const townIcon = (name: string, major: boolean) => {
  const size = major ? 22 : 14;
  const fontSize = major ? 11 : 10;
  const iconH = major ? 36 : 28;
  const iconW = major ? 100 : 80;
  return L.divIcon({
    className: "town-marker",
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:0;">
      <span style="width:${size}px;height:${size}px;background:#2563eb;border:${major ? 3 : 2}px solid white;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></span>
      <span style="font-size:${fontSize}px;font-weight:${major ? 700 : 600};color:#1e293b;white-space:nowrap;text-shadow:0 0 2px white,0 0 2px white;">${name}</span>
    </div>`,
    iconSize: [iconW, iconH],
    iconAnchor: [iconW / 2, size],
  });
};

type MeasurePoint = { lat: number; lng: number; cumDist: number };

export default function TrailMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const trailPathRef = useRef<TrailPath | null>(null);
  const userStartMarkerRef = useRef<L.Marker | null>(null);
  const userEndMarkerRef = useRef<L.Marker | null>(null);
  const placeModeRef = useRef<"idle" | "start" | "end">("idle");
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placeMode, setPlaceMode] = useState<"idle" | "start" | "end">("idle");
  const [measureStart, setMeasureStart] = useState<MeasurePoint | null>(null);
  const [measureEnd, setMeasureEnd] = useState<MeasurePoint | null>(null);

  const measureDistance =
    measureStart && measureEnd
      ? distanceAlongTrail(measureStart.cumDist, measureEnd.cumDist)
      : null;

  useEffect(() => {
    placeModeRef.current = placeMode;
  }, [placeMode]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !mapRef.current) return;

    let cancelled = false;

    const initMap = async () => {
      try {
        const res = await fetch("/munda_biddi_cycle_trail.kml");
        const kmlText = await res.text();
        if (cancelled) return;

        const lineStrings = parseKmlLineStrings(kmlText);
        trailPathRef.current = buildTrailPath(kmlText);
        if (cancelled || !mapRef.current) return;

        const topoLayer = L.tileLayer(
          "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
          {
            attribution:
              'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://opentopomap.org">OpenTopoMap</a>',
            maxZoom: 18,
          }
        );

        const map = L.map(mapRef.current, {
          center: [-33.5, 116.5],
          zoom: 8,
          layers: [topoLayer],
          minZoom: 6,
        });

        const trailStyle = {
          color: "#dc2626",
          weight: 5,
          opacity: 0.9,
        };

        let allBounds: L.LatLngBounds | null = null;

        lineStrings.forEach((latLngs) => {
          const polyline = L.polyline(latLngs, trailStyle).addTo(map);
          const b = polyline.getBounds();
          allBounds = allBounds ? allBounds.extend(b) : b;
        });

        if (allBounds) {
          const bounds = allBounds as L.LatLngBounds;
          map.fitBounds(bounds, { padding: [40, 40] });
          const trailZoom = map.getBoundsZoom(bounds);
          map.setMinZoom(trailZoom);
          const sw = bounds.getSouthWest();
          const ne = bounds.getNorthEast();
          const padLat = (ne.lat - sw.lat) * 0.2;
          const padLng = (ne.lng - sw.lng) * 0.2;
          map.setMaxBounds(
            L.latLngBounds(
              L.latLng(sw.lat - padLat, sw.lng - padLng),
              L.latLng(ne.lat + padLat, ne.lng + padLng)
            )
          );
        }

        const startIcon = L.divIcon({
          className: "custom-marker",
          html: '<div style="background:#16a34a;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        const endIcon = L.divIcon({
          className: "custom-marker",
          html: '<div style="background:#dc2626;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 2px 5px rgba(0,0,0,0.3)"></div>',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        L.marker([-31.897, 116.171], { icon: startIcon })
          .addTo(map)
          .bindPopup("Mundaring (Start)");
        L.marker([-35.023, 117.881], { icon: endIcon })
          .addTo(map)
          .bindPopup("Albany (Finish)");

        campsiteMarkers.forEach(({ name, lat, lng }) => {
          L.marker([lat, lng], { icon: tentIcon(name) })
            .addTo(map)
            .bindPopup(`<strong>${name}</strong><br/>Campsite`);
        });

        townMarkers.forEach(({ name, lat, lng, major }) => {
          L.marker([lat, lng], { icon: townIcon(name, major ?? false) })
            .addTo(map)
            .bindPopup(`<strong>${name}</strong><br/>${major ? "Major town" : "Town"}`);
        });

        map.on("click", (e: L.LeafletMouseEvent) => {
          const path = trailPathRef.current;
          const mode = placeModeRef.current;
          if (!path || mode === "idle") return;
          const closest = findClosestOnTrail(path, e.latlng.lat, e.latlng.lng);
          if (!closest) return;
          const point: MeasurePoint = {
            lat: closest.lat,
            lng: closest.lng,
            cumDist: closest.cumDist,
          };
          if (mode === "start") {
            setMeasureStart(point);
            setPlaceMode("idle");
          } else if (mode === "end") {
            setMeasureEnd(point);
            setPlaceMode("idle");
          }
        });

        mapInstanceRef.current = map;
      } catch (err) {
        console.error("Failed to load trail KML:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initMap();

    return () => {
      cancelled = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
      userStartMarkerRef.current = null;
      userEndMarkerRef.current = null;
    };
  }, [mounted]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || loading) return;

    if (userStartMarkerRef.current) {
      map.removeLayer(userStartMarkerRef.current);
      userStartMarkerRef.current = null;
    }
    if (userEndMarkerRef.current) {
      map.removeLayer(userEndMarkerRef.current);
      userEndMarkerRef.current = null;
    }

    const measureStartIcon = L.divIcon({
      className: "measure-marker",
      html: '<div style="background:#16a34a;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;color:white;">S</div>',
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });

    const dist = measureStart && measureEnd ? distanceAlongTrail(measureStart.cumDist, measureEnd.cumDist) : null;
    const measureEndIcon = L.divIcon({
      className: "measure-marker",
      html: `<div style="display:flex;flex-direction:column;align-items:center;gap:2px;">
        <div style="background:#dc2626;width:18px;height:18px;border-radius:50%;border:3px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;color:white;">E</div>
        ${dist != null ? `<span style="font-size:11px;font-weight:700;color:#1e293b;white-space:nowrap;background:white;padding:2px 6px;border-radius:4px;box-shadow:0 1px 3px rgba(0,0,0,0.2);">${dist.toFixed(1)} km</span>` : ""}
      </div>`,
      iconSize: [80, 40],
      iconAnchor: [40, 18],
    });

    if (measureStart) {
      const m = L.marker([measureStart.lat, measureStart.lng], { icon: measureStartIcon })
        .addTo(map)
        .bindPopup("Measure start");
      userStartMarkerRef.current = m;
    }
    if (measureEnd) {
      const m = L.marker([measureEnd.lat, measureEnd.lng], { icon: measureEndIcon })
        .addTo(map)
        .bindPopup("Measure end");
      userEndMarkerRef.current = m;
    }
  }, [loading, measureStart, measureEnd, measureDistance]);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      <div className="bg-white px-4 py-3 border-b border-slate-200 flex flex-wrap items-center gap-3">
        <span className="text-sm font-medium text-slate-700">Measure distance:</span>
        <button
          type="button"
          onClick={() => setPlaceMode(placeMode === "start" ? "idle" : "start")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            placeMode === "start"
              ? "bg-green-600 text-white ring-2 ring-green-400"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Place start
        </button>
        <button
          type="button"
          onClick={() => setPlaceMode(placeMode === "end" ? "idle" : "end")}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            placeMode === "end"
              ? "bg-red-600 text-white ring-2 ring-red-400"
              : "bg-slate-100 text-slate-700 hover:bg-slate-200"
          }`}
        >
          Place end
        </button>
        <button
          type="button"
          onClick={() => {
            setMeasureStart(null);
            setMeasureEnd(null);
            setPlaceMode("idle");
          }}
          className="px-3 py-1.5 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
        >
          Clear
        </button>
        {placeMode !== "idle" && (
          <span className="text-sm text-slate-500">
            Click on the trail to place {placeMode === "start" ? "start" : "end"} marker
          </span>
        )}
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
          <span className="w-4 h-1 bg-red-600 rounded" />
          Trail
        </span>
        <span className="flex items-center gap-2">
          <span className="text-lg">⛺</span>
          Campsites
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow" />
          Towns
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow" />
          Major towns
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-600 border-2 border-white shadow" />
          Trail start (Mundaring)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-600 border-2 border-white shadow" />
          Trail finish (Albany)
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-green-600 border-2 border-white shadow font-bold text-white text-xs flex items-center justify-center">S</span>
          Measure start
        </span>
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 rounded-full bg-red-600 border-2 border-white shadow font-bold text-white text-xs flex items-center justify-center">E</span>
          Measure end
        </span>
      </div>
    </div>
  );
}
