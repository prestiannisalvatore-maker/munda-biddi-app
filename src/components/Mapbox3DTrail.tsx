"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeCoordinates } from "@/data/routeCoordinates";
import { peaks, campsites } from "@/data/stirlingRidgeData";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

export default function Mapbox3DTrail() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0); // 0-100 along trail
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(60);
  const [showPeaks, setShowPeaks] = useState(true);
  const [showCamps, setShowCamps] = useState(true);
  const [exaggeration, setExaggeration] = useState(1.5);

  const trailGeoJSON: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: { name: "Stirling Ridge Walk" },
        geometry: {
          type: "LineString",
          coordinates: routeCoordinates,
        },
      },
    ],
  };

  // Position camera along trail at given progress (0-1)
  const flyToProgress = useCallback((pct: number, animate = true) => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    const idx = Math.min(
      Math.floor((pct / 100) * (routeCoordinates.length - 1)),
      routeCoordinates.length - 1
    );
    const nextIdx = Math.min(idx + 5, routeCoordinates.length - 1);
    const [lng, lat] = routeCoordinates[idx];
    const [nextLng, nextLat] = routeCoordinates[nextIdx];

    // Bearing toward next points along trail
    const bearing =
      (Math.atan2(nextLng - lng, nextLat - lat) * 180) / Math.PI;

    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    }

    if (animate) {
      map.easeTo({
        center: [lng, lat],
        bearing,
        pitch,
        duration: 400,
        essential: true,
      });
    } else {
      map.jumpTo({
        center: [lng, lat],
        bearing,
        pitch,
      });
    }
  }, [loaded, pitch]);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    if (!MAPBOX_TOKEN) {
      setError("missing-token");
      return;
    }

    mapboxgl.accessToken = MAPBOX_TOKEN;

    try {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
        center: [118.31, -34.355],
        zoom: 12,
        pitch: 60,
        bearing: -45,
        antialias: true,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      map.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 120, unit: "metric" }),
        "bottom-left"
      );

      map.on("load", () => {
        // 3D terrain
        map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 14,
        });
        map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

        // Sky atmosphere for depth
        map.addLayer({
          id: "sky",
          type: "sky",
          paint: {
            "sky-type": "atmosphere",
            "sky-atmosphere-sun": [0.0, 90.0],
            "sky-atmosphere-sun-intensity": 15,
          },
        });

        // Contour lines from terrain vector tiles
        map.addSource("contours", {
          type: "vector",
          url: "mapbox://mapbox.mapbox-terrain-v2",
        });

        map.addLayer({
          id: "contour-lines",
          type: "line",
          source: "contours",
          "source-layer": "contour",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ffffff",
            "line-width": [
              "interpolate",
              ["linear"],
              ["get", "ele"],
              0, 0.3,
              500, 0.5,
              1000, 1.2,
            ],
            "line-opacity": 0.55,
          },
        });

        map.addLayer({
          id: "contour-labels",
          type: "symbol",
          source: "contours",
          "source-layer": "contour",
          filter: ["==", ["%", ["get", "ele"], 100], 0],
          layout: {
            "symbol-placement": "line",
            "text-field": ["concat", ["to-string", ["get", "ele"]], " m"],
            "text-size": 10,
            "text-max-angle": 25,
            "text-allow-overlap": false,
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 1,
            "text-opacity": 0.8,
          },
        });

        // Full GPX trail (all 1514 points)
        map.addSource("trail", {
          type: "geojson",
          data: trailGeoJSON,
        });

        // Trail glow underlay
        map.addLayer({
          id: "trail-glow",
          type: "line",
          source: "trail",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#fbbf24",
            "line-width": 10,
            "line-opacity": 0.35,
          },
        });

        // Main trail line
        map.addLayer({
          id: "trail-line",
          type: "line",
          source: "trail",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#ea580c",
            "line-width": 4,
            "line-opacity": 0.95,
          },
        });

        // Start / end markers
        const start = routeCoordinates[0];
        const end = routeCoordinates[routeCoordinates.length - 1];

        new mapboxgl.Marker({ color: "#16a34a" })
          .setLngLat(start as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>START</strong><br/>Gnowellen Road"))
          .addTo(map);

        new mapboxgl.Marker({ color: "#dc2626" })
          .setLngLat(end as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>FINISH</strong><br/>Bluff Knoll Car Park"))
          .addTo(map);

        // Walker position marker
        const el = document.createElement("div");
        el.className = "walker-marker";
        el.style.cssText =
          "width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);";
        markerRef.current = new mapboxgl.Marker(el)
          .setLngLat(start as [number, number])
          .addTo(map);

        // Fit to trail
        const bounds = new mapboxgl.LngLatBounds();
        routeCoordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
        map.fitBounds(bounds, { padding: 60, pitch: 60, duration: 2000 });

        setLoaded(true);
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        if (e.error?.message?.includes("access token") || e.error?.message?.includes("401")) {
          setError("invalid-token");
        }
      });

      mapRef.current = map;
    } catch (err) {
      console.error(err);
      setError("init-failed");
    }

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Peak markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    // Remove existing peak markers by class
    document.querySelectorAll(".peak-mb-marker").forEach((el) => el.remove());

    if (!showPeaks) return;

    peaks.forEach((peak) => {
      const el = document.createElement("div");
      el.className = "peak-mb-marker";
      el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
        <span style="font-size:16px;">⛰️</span>
        <span style="font-size:9px;font-weight:700;color:white;background:rgba(0,0,0,0.65);padding:1px 4px;border-radius:3px;white-space:nowrap;">${peak.name}</span>
      </div>`;
      new mapboxgl.Marker({ element: el })
        .setLngLat([peak.lng, peak.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(
            `<strong>${peak.name}</strong><br/>${peak.elevation}m<br/><em>${peak.description}</em>`
          )
        )
        .addTo(map);
    });
  }, [loaded, showPeaks]);

  // Camp markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    document.querySelectorAll(".camp-mb-marker").forEach((el) => el.remove());

    if (!showCamps) return;

    campsites.forEach((site) => {
      const el = document.createElement("div");
      el.className = "camp-mb-marker";
      el.innerHTML = `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:auto;cursor:pointer;">
        <span style="font-size:16px;">🏕️</span>
        <span style="font-size:9px;font-weight:700;color:#bbf7d0;background:rgba(0,0,0,0.65);padding:1px 4px;border-radius:3px;white-space:nowrap;">${site.name}</span>
      </div>`;
      new mapboxgl.Marker({ element: el })
        .setLngLat([site.lng, site.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 20 }).setHTML(
            `<strong>${site.name}</strong><br/>${site.description}`
          )
        )
        .addTo(map);
    });
  }, [loaded, showCamps]);

  // Terrain exaggeration
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    map.setTerrain({ source: "mapbox-dem", exaggeration });
  }, [exaggeration, loaded]);

  // Play animation along trail
  useEffect(() => {
    if (!isPlaying) {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
        animFrameRef.current = null;
      }
      return;
    }

    let last = performance.now();
    const speed = 2.5; // percent per second

    const tick = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setProgress((prev) => {
        const next = prev + speed * dt;
        if (next >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return next;
      });
      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying]);

  // Sync camera when progress changes
  useEffect(() => {
    if (loaded) flyToProgress(progress, !isPlaying);
  }, [progress, loaded, flyToProgress, isPlaying]);

  // Update pitch on map
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;
    map.easeTo({ pitch, duration: 300 });
  }, [pitch, loaded]);

  if (error === "missing-token" || error === "invalid-token") {
    return (
      <div className="rounded-xl border-2 border-amber-400 bg-amber-50 p-6">
        <h3 className="font-bold text-amber-900 text-lg mb-2">🗺️ Mapbox 3D Preview Setup Required</h3>
        <p className="text-amber-800 text-sm mb-4">
          To see the trail in 3D satellite imagery with terrain contours, add a free Mapbox access token.
        </p>
        <ol className="text-sm text-amber-900 space-y-2 list-decimal pl-5 mb-4">
          <li>
            Create a free account at{" "}
            <a
              href="https://account.mapbox.com/auth/signup/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              mapbox.com
            </a>
          </li>
          <li>
            Copy your default public token from{" "}
            <a
              href="https://account.mapbox.com/access-tokens/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold"
            >
              Access Tokens
            </a>
          </li>
          <li>
            Add it in Vercel as environment variable:{" "}
            <code className="bg-amber-100 px-1.5 py-0.5 rounded text-xs">NEXT_PUBLIC_MAPBOX_TOKEN</code>
          </li>
          <li>Redeploy — the 3D preview will appear here</li>
        </ol>
        <p className="text-xs text-amber-700">
          Mapbox free tier includes 50,000 map loads/month — plenty for personal use.
        </p>
      </div>
    );
  }

  const pointIdx = Math.floor((progress / 100) * (routeCoordinates.length - 1));

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      {/* Toolbar */}
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛰️</span>
          <div>
            <div className="font-semibold text-sm">3D Trail Preview</div>
            <div className="text-[10px] text-slate-400">
              {routeCoordinates.length.toLocaleString()} GPS points · Satellite + Terrain
            </div>
          </div>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showPeaks}
              onChange={(e) => setShowPeaks(e.target.checked)}
              className="rounded"
            />
            Peaks
          </label>
          <label className="flex items-center gap-1.5 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={showCamps}
              onChange={(e) => setShowCamps(e.target.checked)}
              className="rounded"
            />
            Camps
          </label>
        </div>
      </div>

      {/* Map */}
      <div ref={mapContainer} className="w-full h-[500px] sm:h-[600px] relative bg-slate-800">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-10">
            <div className="text-center">
              <div className="animate-pulse text-2xl mb-2">🏔️</div>
              <div className="text-sm text-slate-300">Loading 3D terrain...</div>
            </div>
          </div>
        )}
      </div>

      {/* Walk-along controls */}
      <div className="bg-slate-900 text-white px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={!loaded}
            className="w-12 h-12 rounded-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 flex items-center justify-center text-xl font-bold shadow-lg transition-colors"
            title={isPlaying ? "Pause" : "Walk the trail"}
          >
            {isPlaying ? "⏸" : "▶"}
          </button>

          <div className="flex-1">
            <div className="flex justify-between text-xs text-slate-400 mb-1">
              <span>Gnowellen Rd (Start)</span>
              <span className="text-orange-400 font-mono">
                Point {pointIdx + 1}/{routeCoordinates.length}
              </span>
              <span>Bluff Knoll (Finish)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => {
                setIsPlaying(false);
                setProgress(parseFloat(e.target.value));
              }}
              disabled={!loaded}
              className="w-full accent-orange-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Camera tilt</label>
            <input
              type="range"
              min={0}
              max={80}
              value={pitch}
              onChange={(e) => setPitch(parseInt(e.target.value))}
              disabled={!loaded}
              className="w-full accent-blue-400"
            />
            <span className="text-slate-500">{pitch}°</span>
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Terrain height</label>
            <input
              type="range"
              min={1}
              max={3}
              step={0.1}
              value={exaggeration}
              onChange={(e) => setExaggeration(parseFloat(e.target.value))}
              disabled={!loaded}
              className="w-full accent-blue-400"
            />
            <span className="text-slate-500">{exaggeration.toFixed(1)}x</span>
          </div>
          <button
            onClick={() => {
              setIsPlaying(false);
              setProgress(0);
            }}
            disabled={!loaded}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
          >
            ↺ Restart
          </button>
          <button
            onClick={() => {
              const map = mapRef.current;
              if (!map) return;
              const bounds = new mapboxgl.LngLatBounds();
              routeCoordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
              map.fitBounds(bounds, { padding: 60, pitch: 60, duration: 1500 });
              setIsPlaying(false);
            }}
            disabled={!loaded}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
          >
            🔭 Full Trail
          </button>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Drag the map to look around · Pinch/scroll to zoom · Use ▶ to fly along the ridge in 3D
        </p>
      </div>
    </div>
  );
}
