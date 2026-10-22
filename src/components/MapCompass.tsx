"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MapCompassProps {
  magneticDeclination?: number;
  onClose?: () => void;
}

function touchAngle(t0: Touch, t1: Touch) {
  return (Math.atan2(t1.clientY - t0.clientY, t1.clientX - t0.clientX) * 180) / Math.PI;
}

function touchMidpoint(t0: Touch, t1: Touch) {
  return {
    x: (t0.clientX + t1.clientX) / 2,
    y: (t0.clientY + t1.clientY) / 2,
  };
}

export default function MapCompass({
  magneticDeclination = 1.5,
  onClose,
}: MapCompassProps) {
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [compassRotation, setCompassRotation] = useState(0);
  const [bezelRotation, setBezelRotation] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [opacity, setOpacity] = useState(0.75);
  const [gestureHint, setGestureHint] = useState("1 finger: move · 2 fingers: rotate");

  const compassRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const rotationRef = useRef(compassRotation);

  // Gesture tracking (refs for performance / no stale closures)
  const gestureRef = useRef<{
    mode: "none" | "move" | "pinch-rotate" | "mouse-rotate";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    startAngle: number;
    originRotation: number;
  }>({
    mode: "none",
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
    startAngle: 0,
    originRotation: 0,
  });

  useEffect(() => {
    positionRef.current = position;
  }, [position]);

  useEffect(() => {
    rotationRef.current = compassRotation;
  }, [compassRotation]);

  // Device compass needle
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        const heading =
          (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
            .webkitCompassHeading ?? 360 - event.alpha;
        setDeviceHeading(heading);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      const requestPermission = (
        DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }
      ).requestPermission;
      if (typeof requestPermission === "function") {
        requestPermission()
          .then((permission) => {
            if (permission === "granted") {
              window.addEventListener("deviceorientation", handleOrientation, true);
            }
          })
          .catch(() => {});
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const clampPosition = useCallback((x: number, y: number) => {
    const parent = compassRef.current?.parentElement;
    if (!parent) return { x, y };
    const parentRect = parent.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(parentRect.width - 200, x)),
      y: Math.max(0, Math.min(parentRect.height - 260, y)),
    };
  }, []);

  // Native touch listeners — two-finger move + rotate (iPhone)
  useEffect(() => {
    const el = compassRef.current;
    if (!el) return;

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".compass-control")) return;

      e.stopPropagation();

      const g = gestureRef.current;

      if (e.touches.length === 2) {
        // Two fingers: rotate (twist) + move (midpoint drag)
        e.preventDefault();
        const mid = touchMidpoint(e.touches[0], e.touches[1]);
        g.mode = "pinch-rotate";
        g.startX = mid.x;
        g.startY = mid.y;
        g.originX = positionRef.current.x;
        g.originY = positionRef.current.y;
        g.startAngle = touchAngle(e.touches[0], e.touches[1]);
        g.originRotation = rotationRef.current;
        setGestureHint("2 fingers: twist to rotate · drag to move");
      } else if (e.touches.length === 1) {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = el.getBoundingClientRect();
        g.mode = "move";
        g.startX = touch.clientX;
        g.startY = touch.clientY;
        g.originX = positionRef.current.x;
        g.originY = positionRef.current.y;
        // Also store offset for single-finger relative to element
        g.startAngle = touch.clientX - rect.left;
        setGestureHint("1 finger: drag to move");
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      const g = gestureRef.current;
      if (g.mode === "none") return;

      e.stopPropagation();
      e.preventDefault();

      if (e.touches.length >= 2 && (g.mode === "pinch-rotate" || e.touches.length === 2)) {
        g.mode = "pinch-rotate";
        const mid = touchMidpoint(e.touches[0], e.touches[1]);
        const dx = mid.x - g.startX;
        const dy = mid.y - g.startY;
        setPosition(clampPosition(g.originX + dx, g.originY + dy));

        const angle = touchAngle(e.touches[0], e.touches[1]);
        const delta = angle - g.startAngle;
        setCompassRotation(((g.originRotation + delta) % 360 + 360) % 360);
      } else if (e.touches.length === 1 && g.mode === "move") {
        const touch = e.touches[0];
        const dx = touch.clientX - g.startX;
        const dy = touch.clientY - g.startY;
        setPosition(clampPosition(g.originX + dx, g.originY + dy));
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (e.touches.length === 0) {
        gestureRef.current.mode = "none";
        setGestureHint("1 finger: move · 2 fingers: rotate");
      } else if (e.touches.length === 1) {
        // Dropped to one finger — continue as move from current position
        const touch = e.touches[0];
        const g = gestureRef.current;
        g.mode = "move";
        g.startX = touch.clientX;
        g.startY = touch.clientY;
        g.originX = positionRef.current.x;
        g.originY = positionRef.current.y;
      }
    };

    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    el.addEventListener("touchcancel", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
      el.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [clampPosition]);

  // Mouse drag / corner rotate (desktop)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".compass-control")) return;

      const g = gestureRef.current;
      const rect = compassRef.current?.getBoundingClientRect();

      if ((e.target as HTMLElement).closest(".rotate-handle") && rect) {
        g.mode = "mouse-rotate";
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        g.startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        g.originRotation = rotationRef.current;
        return;
      }

      g.mode = "move";
      g.startX = e.clientX;
      g.startY = e.clientY;
      g.originX = positionRef.current.x;
      g.originY = positionRef.current.y;
    },
    []
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const g = gestureRef.current;
      if (g.mode === "none") return;

      if (g.mode === "mouse-rotate") {
        const rect = compassRef.current?.getBoundingClientRect();
        if (!rect) return;
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        setCompassRotation(((g.originRotation + (angle - g.startAngle)) % 360 + 360) % 360);
        return;
      }

      if (g.mode === "move") {
        const dx = e.clientX - g.startX;
        const dy = e.clientY - g.startY;
        setPosition(clampPosition(g.originX + dx, g.originY + dy));
      }
    };

    const onMouseUp = () => {
      gestureRef.current.mode = "none";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [clampPosition]);

  const rotateBezzel = (direction: "cw" | "ccw", amount: number = 5) => {
    setBezelRotation((prev) => ((prev + (direction === "cw" ? amount : -amount)) % 360 + 360) % 360);
  };

  const currentBearing = Math.round(bezelRotation);
  const compassSize = 180;

  return (
    <div
      ref={compassRef}
      className="absolute z-[1000] select-none touch-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: "grab",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Top controls */}
      <div className="absolute -top-8 left-0 right-0 flex justify-center gap-1 z-20">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="compass-control w-6 h-6 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 shadow-lg"
        >
          ?
        </button>
        <button
          onClick={() => setOpacity((o) => Math.max(0.3, o - 0.15))}
          className="compass-control w-6 h-6 bg-slate-600 text-white rounded-full text-[10px] hover:bg-slate-700 shadow-lg"
        >
          ◐
        </button>
        <button
          onClick={() => setOpacity((o) => Math.min(1, o + 0.15))}
          className="compass-control w-6 h-6 bg-slate-600 text-white rounded-full text-[10px] hover:bg-slate-700 shadow-lg"
        >
          ●
        </button>
        <button
          onClick={onClose}
          className="compass-control w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 shadow-lg"
        >
          ✕
        </button>
      </div>

      {/* Gesture hint */}
      <div className="absolute -bottom-6 left-0 right-0 text-center z-20 pointer-events-none">
        <span className="inline-block bg-slate-900/80 text-white text-[9px] px-2 py-0.5 rounded-full">
          {gestureHint}
        </span>
      </div>

      {/* Help */}
      {showHelp && (
        <div className="compass-control absolute -top-8 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-xl p-3 w-72 border-2 border-amber-400 z-30 text-xs">
          <h4 className="font-bold text-amber-800 mb-2">🧭 How to Use (iPhone)</h4>
          <ol className="space-y-2 text-slate-600">
            <li>
              <span className="font-bold text-amber-600">1 finger</span> — drag to move compass on the map
            </li>
            <li>
              <span className="font-bold text-amber-600">2 fingers</span> — twist to rotate · drag to move
            </li>
            <li>
              <span className="font-bold text-amber-600">Align</span> — rotate until compass N lines match the red north lines on the map
            </li>
            <li>
              <span className="font-bold text-amber-600">Bezel ◀▶</span> — set your bearing
            </li>
            <li>
              <span className="font-bold text-green-600">Walk</span> — turn until red needle points to N, then walk
            </li>
          </ol>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-3 w-full py-2 bg-amber-500 text-white rounded-lg font-semibold"
          >
            Got it!
          </button>
        </div>
      )}

      {/* Compass body */}
      <div
        style={{
          transform: `rotate(${compassRotation}deg)`,
          opacity,
          width: compassSize,
          height: compassSize + 50,
        }}
        className="relative"
      >
        <div className="rotate-handle absolute -top-2 -left-2 w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">
          ↻
        </div>
        <div className="rotate-handle absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">
          ↻
        </div>

        <div
          className="relative rounded-lg shadow-xl border-2 border-slate-400/50 backdrop-blur-sm"
          style={{ backgroundColor: `rgba(255,255,255,${opacity * 0.65})` }}
        >
          <div className="flex justify-center pt-2 pb-1">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-600" />
              <div className="w-0.5 h-2 bg-red-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-8 h-0.5 bg-red-600 relative">
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rotate-45" />
            </div>
          </div>

          <div className="relative mx-auto my-1" style={{ width: compassSize - 20, height: compassSize - 20 }}>
            <button
              onClick={() => rotateBezzel("ccw")}
              className="compass-control absolute -left-5 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-slate-700/80 text-white rounded text-[10px] z-10 flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={() => rotateBezzel("cw")}
              className="compass-control absolute -right-5 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-slate-700/80 text-white rounded text-[10px] z-10 flex items-center justify-center"
            >
              ▶
            </button>

            <div
              className="absolute inset-0 rounded-full border-2 border-slate-600/70"
              style={{
                transform: `rotate(${-bezelRotation}deg)`,
                backgroundColor: `rgba(241,245,249,${opacity * 0.55})`,
              }}
            >
              {Array.from({ length: 36 }).map((_, i) => {
                const deg = i * 10;
                const isCardinal = deg % 90 === 0;
                const isMajor = deg % 30 === 0;
                const radius = (compassSize - 20) / 2;
                return (
                  <div
                    key={i}
                    className="absolute text-center"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${deg}deg) translateY(-${radius - 8}px)`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <div
                      className={`w-px mx-auto ${
                        isCardinal ? "h-3 bg-red-600" : isMajor ? "h-2 bg-slate-700" : "h-1.5 bg-slate-400"
                      }`}
                      style={{ marginLeft: "-0.5px" }}
                    />
                    {isMajor && (
                      <span
                        className={`block text-[7px] font-bold mt-0.5 ${isCardinal ? "text-red-600" : "text-slate-700"}`}
                        style={{ transform: `rotate(${-deg + bezelRotation}deg)` }}
                      >
                        {deg === 0 ? "N" : deg === 90 ? "E" : deg === 180 ? "S" : deg === 270 ? "W" : deg}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            <div
              className="absolute rounded-full overflow-hidden"
              style={{
                inset: 15,
                transform: `rotate(${-bezelRotation}deg)`,
                backgroundColor: `rgba(255,255,255,${opacity * 0.45})`,
              }}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-red-400/60"
                  style={{ left: `${(i + 1) * 16.66}%` }}
                />
              ))}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-400/70" />
                <div className="w-1.5 h-10 border border-red-400/70 bg-transparent" />
              </div>
            </div>

            <div
              className="absolute pointer-events-none"
              style={{
                inset: 20,
                transform:
                  deviceHeading !== null
                    ? `rotate(${-deviceHeading - compassRotation}deg)`
                    : "rotate(0deg)",
                transition: "transform 0.2s ease-out",
              }}
            >
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[40px] border-b-red-600" />
              </div>
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[40px] border-t-slate-100" />
              </div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-white shadow" />
            </div>
          </div>

          <div
            className="mx-2 mb-2 rounded px-2 py-1 text-center"
            style={{ backgroundColor: `rgba(30,41,59,${opacity})` }}
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">Bearing:</span>
              <span className="font-mono font-bold text-white text-sm">{currentBearing}°</span>
              <span className="text-slate-300">
                {Math.round(compassRotation)}° rot
              </span>
            </div>
          </div>
        </div>

        <div className="rotate-handle absolute -bottom-2 -left-2 w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">
          ↻
        </div>
        <div className="rotate-handle absolute -bottom-2 -right-2 w-5 h-5 bg-amber-500 rounded-full shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">
          ↻
        </div>
      </div>

      {/* Bezel-only fine adjust (kept small — primary control is two-finger) */}
      <div className="flex justify-center gap-2 mt-1" style={{ opacity }}>
        <button
          onClick={() => setCompassRotation(0)}
          className="compass-control px-3 py-1 bg-slate-600/90 text-white rounded text-[10px] shadow"
        >
          Reset North
        </button>
      </div>
    </div>
  );
}
