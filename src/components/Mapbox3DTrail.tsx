"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeCoordinates } from "@/data/routeCoordinates";
import { peaks, campsites } from "@/data/stirlingRidgeData";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
const TRAIL_LEN = routeCoordinates.length;
const LAST_IDX = TRAIL_LEN - 1;
/** Full trail walk duration at 1× — slow scenic flyover. */
const BASE_DURATION_SEC = 160;
/** How often to push progress into React for the scrubber UI. */
const UI_UPDATE_MS = 150;
/** Look ahead ~8 GPS samples (~300–400 m) for stable camera bearing. */
const BEARING_LOOKAHEAD = 8;
/** Default framing when ▶ starts (user can still pinch/scroll to zoom further). */
const PLAY_ZOOM = 13.25;
/** Closest useful satellite detail for this Esri imagery. */
const MAX_ZOOM = 18;
const MIN_ZOOM = 9;
const DETAIL_ZOOM = 16.5;
/** Camera follow smoothing (lower = smoother / less snappy). */
const CENTER_SMOOTH = 0.12;
const BEARING_SMOOTH = 0.08;
/** Throttle map.jumpTo during play to cut tile thrash (marker still updates every frame). */
const CAMERA_UPDATE_MS = 48;
const SPEED_OPTIONS = [0.5, 1, 2] as const;

/**
 * Esri World Imagery as the basemap — Mapbox satellite tiles are often rate-limited
 * (HTTP 429), which leaves a black WebGL canvas. Esri raster tiles stay visible.
 */
const SATELLITE_STYLE: mapboxgl.StyleSpecification = {
  version: 8,
  name: "Stirling Satellite",
  glyphs: "mapbox://fonts/mapbox/{fontstack}/{range}.pbf",
  sources: {
    "esri-satellite": {
      type: "raster",
      tiles: [
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      ],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        "Tiles © Esri — Source: Esri, Maxar, Earthstar Geographics, and the GIS User Community",
    },
  },
  layers: [
    {
      id: "background",
      type: "background",
      paint: { "background-color": "#1a2332" },
    },
    {
      id: "esri-satellite",
      type: "raster",
      source: "esri-satellite",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
};

function shortestAngleDelta(from: number, to: number): number {
  let delta = to - from;
  while (delta > 180) delta -= 360;
  while (delta < -180) delta += 360;
  return delta;
}

function bearingBetweenCoords(
  a: [number, number],
  b: [number, number]
): number {
  const [lng, lat] = a;
  const [nextLng, nextLat] = b;
  return (Math.atan2(nextLng - lng, nextLat - lat) * 180) / Math.PI;
}

/** Interpolate along the GPX so the camera doesn't snap between points. */
function sampleTrail(pct: number): {
  lng: number;
  lat: number;
  bearing: number;
  index: number;
} {
  const clamped = Math.min(Math.max(pct, 0), 100);
  const t = (clamped / 100) * LAST_IDX;
  const i0 = Math.min(Math.floor(t), LAST_IDX);
  const i1 = Math.min(i0 + 1, LAST_IDX);
  const f = t - i0;

  const [lng0, lat0] = routeCoordinates[i0];
  const [lng1, lat1] = routeCoordinates[i1];
  const lng = lng0 + (lng1 - lng0) * f;
  const lat = lat0 + (lat1 - lat0) * f;

  const look = Math.min(i0 + BEARING_LOOKAHEAD, LAST_IDX);
  const bearing =
    look === i0
      ? 0
      : bearingBetweenCoords([lng, lat], routeCoordinates[look] as [number, number]);

  return { lng, lat, bearing, index: i0 };
}

function indexAtProgress(pct: number): number {
  return sampleTrail(pct).index;
}

export default function Mapbox3DTrail() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const progressRef = useRef(0);
  const pitchRef = useRef(55);
  const isPlayingRef = useRef(false);
  const lastUiUpdateRef = useRef(0);
  const smoothCenterRef = useRef<{ lng: number; lat: number } | null>(null);
  const smoothBearingRef = useRef<number | null>(null);
  const lastCameraMoveRef = useRef(0);
  const terrainFailedRef = useRef(false);

  const [loaded, setLoaded] = useState(false);
  const [terrainReady, setTerrainReady] = useState(false);
  const [terrainNote, setTerrainNote] = useState<string | null>(null);
  const [loadStatus, setLoadStatus] = useState("Loading satellite imagery…");
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pitch, setPitch] = useState(55);
  const [showPeaks, setShowPeaks] = useState(true);
  const [showCamps, setShowCamps] = useState(true);
  const [showContours, setShowContours] = useState(false);
  const [exaggeration, setExaggeration] = useState(1.5);
  const [speed, setSpeed] = useState(0.5);

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

  const resetCameraSmoothing = useCallback(() => {
    smoothCenterRef.current = null;
    smoothBearingRef.current = null;
  }, []);

  /** Move camera + walker. Interpolated + smoothed during play for less jerk. */
  const applyCamera = useCallback(
    (
      pct: number,
      opts?: {
        animate?: boolean;
        duration?: number;
        zoom?: number;
        smooth?: boolean;
      }
    ) => {
      const map = mapRef.current;
      if (!map) return;

      const sample = sampleTrail(pct);
      let { lng, lat, bearing } = sample;

      if (opts?.smooth) {
        const prevC = smoothCenterRef.current;
        if (prevC) {
          lng = prevC.lng + (lng - prevC.lng) * CENTER_SMOOTH;
          lat = prevC.lat + (lat - prevC.lat) * CENTER_SMOOTH;
        }
        smoothCenterRef.current = { lng, lat };

        const prevB = smoothBearingRef.current;
        if (prevB !== null) {
          bearing = prevB + shortestAngleDelta(prevB, bearing) * BEARING_SMOOTH;
        }
        smoothBearingRef.current = bearing;
      } else {
        smoothCenterRef.current = { lng, lat };
        smoothBearingRef.current = bearing;
      }

      markerRef.current?.setLngLat([lng, lat]);

      const camera = {
        center: [lng, lat] as [number, number],
        bearing,
        pitch: pitchRef.current,
        zoom: opts?.zoom ?? map.getZoom(),
      };

      if (opts?.animate) {
        map.easeTo({
          ...camera,
          duration: opts.duration ?? 500,
          essential: true,
          easing: (t) => t * (2 - t),
        });
        return;
      }

      // During smooth play, don't jump the map every RAF — that floods tile requests
      // and can blank the imagery. Marker still follows every frame above.
      if (opts?.smooth) {
        const now = performance.now();
        if (now - lastCameraMoveRef.current < CAMERA_UPDATE_MS) return;
        lastCameraMoveRef.current = now;
      }

      map.jumpTo(camera);
    },
    []
  );

  const syncProgressUi = useCallback((pct: number, force = false) => {
    const now = performance.now();
    if (!force && now - lastUiUpdateRef.current < UI_UPDATE_MS) return;
    lastUiUpdateRef.current = now;
    setProgress(pct);
  }, []);

  const setContourLabelsVisible = useCallback((visible: boolean) => {
    const map = mapRef.current;
    if (!map?.getLayer("contour-labels")) return;
    map.setLayoutProperty("contour-labels", "visibility", visible ? "visible" : "none");
  }, []);

  // Esri satellite first (always visible). Optional Mapbox DEM for 3D — disabled on 429/errors.
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
        style: SATELLITE_STYLE,
        center: [118.31, -34.355],
        zoom: 11.5,
        pitch: 45,
        bearing: -35,
        antialias: true,
        fadeDuration: 0,
        maxPitch: 80,
        minZoom: MIN_ZOOM,
        maxZoom: MAX_ZOOM,
        preserveDrawingBuffer: false,
      });

      map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");
      map.addControl(new mapboxgl.FullscreenControl(), "top-right");
      map.addControl(
        new mapboxgl.ScaleControl({ maxWidth: 120, unit: "metric" }),
        "bottom-left"
      );

      const bounds = new mapboxgl.LngLatBounds();
      routeCoordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));

      const disableTerrain = (reason: string) => {
        terrainFailedRef.current = true;
        try {
          map.setTerrain(null);
        } catch {
          /* ignore */
        }
        if (map.getLayer("sky")) {
          try {
            map.removeLayer("sky");
          } catch {
            /* ignore */
          }
        }
        setTerrainReady(false);
        setTerrainNote(reason);
        setLoadStatus("");
        // Keep a pleasant pitched view over flat satellite
        map.easeTo({ pitch: 50, duration: 400, essential: true });
      };

      const addTrailAndMarkers = () => {
        if (!map.getSource("trail")) {
          map.addSource("trail", {
            type: "geojson",
            data: trailGeoJSON,
          });
          map.addLayer({
            id: "trail-glow",
            type: "line",
            source: "trail",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#fbbf24",
              "line-width": 10,
              "line-opacity": 0.45,
            },
          });
          map.addLayer({
            id: "trail-line",
            type: "line",
            source: "trail",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#ea580c",
              "line-width": 4,
              "line-opacity": 0.95,
            },
          });
        }

        const start = routeCoordinates[0];
        const end = routeCoordinates[LAST_IDX];

        new mapboxgl.Marker({ color: "#16a34a" })
          .setLngLat(start as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>START</strong><br/>Gnowellen Road"))
          .addTo(map);

        new mapboxgl.Marker({ color: "#dc2626" })
          .setLngLat(end as [number, number])
          .setPopup(new mapboxgl.Popup().setHTML("<strong>FINISH</strong><br/>Bluff Knoll Car Park"))
          .addTo(map);

        if (!markerRef.current) {
          const el = document.createElement("div");
          el.className = "walker-marker";
          el.style.cssText =
            "width:18px;height:18px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.4);";
          markerRef.current = new mapboxgl.Marker(el)
            .setLngLat(start as [number, number])
            .addTo(map);
        }
      };

      const enableTerrain = async () => {
        if (terrainFailedRef.current || map.getSource("mapbox-dem")) return;
        setLoadStatus("Checking 3D terrain…");

        // Preflight one DEM tile — if Mapbox is rate-limiting, skip terrain so
        // the canvas never goes black.
        try {
          const probe = await fetch(
            `https://api.mapbox.com/v4/mapbox.mapbox-terrain-dem-v1/10/844/616.webp?access_token=${MAPBOX_TOKEN}`,
            { method: "GET", cache: "no-store" }
          );
          if (!probe.ok) {
            disableTerrain(
              probe.status === 429
                ? "Mapbox 3D terrain temporarily rate-limited — satellite preview stays on."
                : "3D terrain unavailable — showing flat satellite."
            );
            return;
          }
        } catch {
          disableTerrain("3D terrain unavailable — showing flat satellite.");
          return;
        }

        try {
          setLoadStatus("Enhancing 3D terrain…");
          map.addSource("mapbox-dem", {
            type: "raster-dem",
            url: "mapbox://mapbox.mapbox-terrain-dem-v1",
            tileSize: 512,
            maxzoom: 14,
          });
          map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
          if (!map.getLayer("sky")) {
            map.addLayer({
              id: "sky",
              type: "sky",
              paint: {
                "sky-type": "atmosphere",
                "sky-atmosphere-sun": [0.0, 90.0],
                "sky-atmosphere-sun-intensity": 15,
              },
            });
          }
          map.easeTo({ pitch: 60, duration: 900, essential: true });
          setTerrainReady(true);
          setTerrainNote(null);
          setLoadStatus("");
        } catch {
          disableTerrain("3D terrain unavailable — showing flat satellite.");
        }
      };

      map.on("load", () => {
        addTrailAndMarkers();
        map.fitBounds(bounds, {
          padding: 56,
          pitch: 45,
          bearing: -35,
          duration: 0,
        });
        setLoaded(true);
        setLoadStatus("");

        // Try DEM only after satellite is painted; never risk blanking imagery
        let enhanced = false;
        const enhance = () => {
          if (enhanced) return;
          enhanced = true;
          void enableTerrain();
        };
        map.once("idle", () => window.setTimeout(enhance, 500));
        window.setTimeout(enhance, 2500);
      });

      map.on("error", (e) => {
        console.error("Mapbox error:", e);
        const msg = (e.error?.message || "").toLowerCase();
        const status = (e as { error?: { status?: number } }).error?.status;
        if (msg.includes("access token") || msg.includes("401")) {
          setError("invalid-token");
          return;
        }
        // DEM / Mapbox tile rate limits blank the canvas when terrain is on — drop terrain
        const isTileFail =
          status === 429 ||
          msg.includes("429") ||
          msg.includes("rate limit") ||
          msg.includes("dem") ||
          msg.includes("terrain") ||
          msg.includes("failed to fetch") ||
          msg.includes("ajax");
        if (isTileFail && map.getTerrain()) {
          disableTerrain(
            "Mapbox terrain rate-limited — satellite stays on; try 3D again later."
          );
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

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded || !terrainReady || !map.getSource("mapbox-dem")) return;
    map.setTerrain({ source: "mapbox-dem", exaggeration });
  }, [exaggeration, loaded, terrainReady]);

  useEffect(() => {
    pitchRef.current = pitch;
    const map = mapRef.current;
    if (!map || !loaded || isPlayingRef.current) return;
    map.easeTo({ pitch, duration: 250 });
  }, [pitch, loaded]);

  // Contours are heavy — only add when user opts in
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    const removeContours = () => {
      if (map.getLayer("contour-labels")) map.removeLayer("contour-labels");
      if (map.getLayer("contour-lines")) map.removeLayer("contour-lines");
      if (map.getSource("contours")) map.removeSource("contours");
    };

    if (!showContours) {
      removeContours();
      return;
    }

    if (!map.getSource("contours")) {
      map.addSource("contours", {
        type: "vector",
        url: "mapbox://mapbox.mapbox-terrain-v2",
      });
    }

    if (!map.getLayer("contour-lines")) {
      map.addLayer({
        id: "contour-lines",
        type: "line",
        source: "contours",
        "source-layer": "contour",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#ffffff",
          "line-width": [
            "interpolate",
            ["linear"],
            ["get", "ele"],
            0, 0.25,
            500, 0.4,
            1000, 0.9,
          ],
          "line-opacity": 0.35,
        },
      });
    }

    if (!map.getLayer("contour-labels")) {
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
          visibility: isPlayingRef.current ? "none" : "visible",
        },
        paint: {
          "text-color": "#ffffff",
          "text-halo-color": "#000000",
          "text-halo-width": 1,
          "text-opacity": 0.65,
        },
      });
    }
  }, [loaded, showContours]);

  const speedRef = useRef(speed);
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  const stopPlayback = useCallback(() => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    setContourLabelsVisible(true);
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  }, [setContourLabelsVisible]);

  const startPlayback = useCallback(() => {
    const map = mapRef.current;
    if (!map || !loaded) return;

    map.stop();
    // Hide contour labels while flying — they cause visual flicker
    setContourLabelsVisible(false);

    let startPct = progressRef.current;
    if (startPct >= 99.5) {
      startPct = 0;
      progressRef.current = 0;
      resetCameraSmoothing();
      syncProgressUi(0, true);
    }

    // Seed smoother from the current trail sample, then glide.
    // Set play framing once — do NOT re-clamp zoom every frame (that blocked zooming in).
    const seed = sampleTrail(startPct);
    smoothCenterRef.current = { lng: seed.lng, lat: seed.lat };
    smoothBearingRef.current = seed.bearing;
    const startZoom = Math.max(map.getZoom(), PLAY_ZOOM);
    applyCamera(startPct, { zoom: startZoom, smooth: false });

    isPlayingRef.current = true;
    setIsPlaying(true);

    let last = performance.now();
    const tick = (now: number) => {
      if (!isPlayingRef.current) return;

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const rate = (100 / BASE_DURATION_SEC) * speedRef.current;
      const next = progressRef.current + rate * dt;

      if (next >= 100) {
        progressRef.current = 100;
        applyCamera(100, { smooth: true });
        syncProgressUi(100, true);
        stopPlayback();
        return;
      }

      progressRef.current = next;
      // Preserve whatever zoom the user set with scroll/pinch/+-
      applyCamera(next, { smooth: true });
      syncProgressUi(next);

      animFrameRef.current = requestAnimationFrame(tick);
    };

    animFrameRef.current = requestAnimationFrame(tick);
  }, [
    loaded,
    applyCamera,
    syncProgressUi,
    stopPlayback,
    setContourLabelsVisible,
    resetCameraSmoothing,
  ]);

  const togglePlay = useCallback(() => {
    if (isPlayingRef.current) {
      stopPlayback();
      syncProgressUi(progressRef.current, true);
      return;
    }
    startPlayback();
  }, [startPlayback, stopPlayback, syncProgressUi]);

  const onScrub = useCallback(
    (value: number) => {
      stopPlayback();
      mapRef.current?.stop();
      progressRef.current = value;
      resetCameraSmoothing();
      setProgress(value);
      applyCamera(value);
    },
    [applyCamera, stopPlayback, resetCameraSmoothing]
  );

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

  const pointIdx = indexAtProgress(progress);

  return (
    <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
      <div className="bg-slate-900 text-white px-4 py-3 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🛰️</span>
          <div>
            <div className="font-semibold text-sm">3D Trail Preview</div>
            <div className="text-[10px] text-slate-400">
              {TRAIL_LEN.toLocaleString()} GPS points · Satellite imagery
              {terrainReady ? " + 3D terrain" : ""}
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
          <label className="flex items-center gap-1.5 text-xs cursor-pointer" title="Optional — can slow loading">
            <input
              type="checkbox"
              checked={showContours}
              onChange={(e) => setShowContours(e.target.checked)}
              className="rounded"
            />
            Contours
          </label>
        </div>
      </div>

      <div ref={mapContainer} className="w-full h-[500px] sm:h-[600px] relative bg-slate-800">
        {!loaded && !error && (
          <div className="absolute inset-0 flex items-center justify-center text-white z-10 bg-slate-900/70">
            <div className="text-center px-4">
              <div className="animate-pulse text-2xl mb-2">🛰️</div>
              <div className="text-sm text-slate-200">{loadStatus}</div>
              <div className="text-[11px] text-slate-400 mt-2">
                Satellite imagery loads first, then 3D terrain
              </div>
            </div>
          </div>
        )}
        {loaded && !!loadStatus && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs">
            {loadStatus}
          </div>
        )}
        {loaded && !loadStatus && terrainNote && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 max-w-[90%] px-3 py-1.5 rounded-full bg-amber-900/85 text-amber-100 text-[11px] text-center">
            {terrainNote}
          </div>
        )}
      </div>

      <div className="bg-slate-900 text-white px-4 py-4 space-y-3">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
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
                Point {pointIdx + 1}/{TRAIL_LEN}
              </span>
              <span>Bluff Knoll (Finish)</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={0.1}
              value={progress}
              onChange={(e) => onScrub(parseFloat(e.target.value))}
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
          <div>
            <label className="text-slate-400 block mb-1">Play speed</label>
            <div className="flex gap-1">
              {SPEED_OPTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpeed(s)}
                  disabled={!loaded}
                  className={`flex-1 py-2 rounded-lg disabled:opacity-40 ${
                    speed === s
                      ? "bg-orange-500 text-white"
                      : "bg-slate-700 hover:bg-slate-600"
                  }`}
                >
                  {s}×
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => {
                  const map = mapRef.current;
                  if (!map) return;
                  map.easeTo({
                    zoom: Math.min(MAX_ZOOM, map.getZoom() + 1),
                    duration: 300,
                    essential: true,
                  });
                }}
                disabled={!loaded}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
                title="Zoom in"
              >
                ＋
              </button>
              <button
                type="button"
                onClick={() => {
                  const map = mapRef.current;
                  if (!map) return;
                  map.easeTo({
                    zoom: Math.max(MIN_ZOOM, map.getZoom() - 1),
                    duration: 300,
                    essential: true,
                  });
                }}
                disabled={!loaded}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
                title="Zoom out"
              >
                －
              </button>
              <button
                type="button"
                onClick={() => {
                  const map = mapRef.current;
                  if (!map) return;
                  map.easeTo({
                    zoom: DETAIL_ZOOM,
                    pitch: Math.min(pitchRef.current, 55),
                    duration: 500,
                    essential: true,
                  });
                }}
                disabled={!loaded}
                className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
                title="Zoom in for more satellite detail"
              >
                Detail
              </button>
            </div>
            <button
              onClick={() => {
                stopPlayback();
                mapRef.current?.stop();
                progressRef.current = 0;
                resetCameraSmoothing();
                setProgress(0);
                applyCamera(0, { animate: true, duration: 600, zoom: PLAY_ZOOM });
              }}
              disabled={!loaded}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
            >
              ↺ Restart
            </button>
            <button
              onClick={() => {
                stopPlayback();
                const map = mapRef.current;
                if (!map) return;
                map.stop();
                const bounds = new mapboxgl.LngLatBounds();
                routeCoordinates.forEach(([lng, lat]) => bounds.extend([lng, lat]));
                map.fitBounds(bounds, { padding: 60, pitch: pitchRef.current, duration: 1200 });
              }}
              disabled={!loaded}
              className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg disabled:opacity-40"
            >
              🔭 Full Trail
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 text-center">
          Scroll / pinch or use ＋ － / Detail to zoom (up to ~street-level satellite) · ▶ keeps your
          zoom while flying
        </p>
      </div>
    </div>
  );
}
