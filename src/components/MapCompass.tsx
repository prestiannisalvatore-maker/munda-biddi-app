"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MapCompassProps {
  magneticDeclination?: number;
  onClose?: () => void;
  /** Called when user is actively moving/rotating compass — parent should disable map gestures */
  onInteractChange?: (active: boolean) => void;
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
  onClose,
  onInteractChange,
}: MapCompassProps) {
  const [position, setPosition] = useState({ x: 24, y: 90 });
  const [compassRotation, setCompassRotation] = useState(0);
  const [bezelRotation, setBezelRotation] = useState(0);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [opacity, setOpacity] = useState(0.75);
  const [gestureHint, setGestureHint] = useState("Put 2 fingers on compass to move & rotate");
  const [isActive, setIsActive] = useState(false);

  const compassRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef(position);
  const rotationRef = useRef(compassRotation);
  const onInteractChangeRef = useRef(onInteractChange);

  const gestureRef = useRef<{
    active: boolean;
    mode: "none" | "one" | "two" | "mouse-move" | "mouse-rotate";
    startX: number;
    startY: number;
    originX: number;
    originY: number;
    startAngle: number;
    originRotation: number;
  }>({
    active: false,
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

  useEffect(() => {
    onInteractChangeRef.current = onInteractChange;
  }, [onInteractChange]);

  const setInteract = useCallback((active: boolean) => {
    gestureRef.current.active = active;
    setIsActive(active);
    onInteractChangeRef.current?.(active);
  }, []);

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
      x: Math.max(0, Math.min(parentRect.width - 210, x)),
      y: Math.max(0, Math.min(parentRect.height - 280, y)),
    };
  }, []);

  /**
   * Document-level touch capture.
   * Once a finger starts on the compass, we track ALL fingers on the screen
   * so the second finger can land outside the compass (on the map) and still rotate.
   */
  useEffect(() => {
    const el = compassRef.current;
    if (!el) return;

    const beginFromTouches = (touches: TouchList) => {
      const g = gestureRef.current;
      if (touches.length >= 2) {
        const mid = touchMidpoint(touches[0], touches[1]);
        g.mode = "two";
        g.startX = mid.x;
        g.startY = mid.y;
        g.originX = positionRef.current.x;
        g.originY = positionRef.current.y;
        g.startAngle = touchAngle(touches[0], touches[1]);
        g.originRotation = rotationRef.current;
        setGestureHint("2 fingers — drag to move, twist to rotate");
      } else if (touches.length === 1) {
        g.mode = "one";
        g.startX = touches[0].clientX;
        g.startY = touches[0].clientY;
        g.originX = positionRef.current.x;
        g.originY = positionRef.current.y;
        setGestureHint("Add 2nd finger to rotate");
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;

      // Small UI buttons still work normally
      if (target.closest(".compass-control") && !gestureRef.current.active) {
        return;
      }

      // Start gesture if touch began on compass, OR gesture already active
      const startedOnCompass = el.contains(target);
      if (!startedOnCompass && !gestureRef.current.active) return;

      e.preventDefault();
      e.stopPropagation();

      setInteract(true);
      beginFromTouches(e.touches);
    };

    const onTouchMove = (e: TouchEvent) => {
      const g = gestureRef.current;
      if (!g.active) return;

      e.preventDefault();
      e.stopPropagation();

      // Upgrade to two-finger mid-gesture
      if (e.touches.length >= 2) {
        if (g.mode !== "two") {
          beginFromTouches(e.touches);
        }
        const mid = touchMidpoint(e.touches[0], e.touches[1]);
        setPosition(clampPosition(g.originX + (mid.x - g.startX), g.originY + (mid.y - g.startY)));
        const angle = touchAngle(e.touches[0], e.touches[1]);
        setCompassRotation(((g.originRotation + (angle - g.startAngle)) % 360 + 360) % 360);
        return;
      }

      if (e.touches.length === 1 && g.mode === "one") {
        const t = e.touches[0];
        setPosition(clampPosition(g.originX + (t.clientX - g.startX), g.originY + (t.clientY - g.startY)));
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!gestureRef.current.active) return;

      e.preventDefault();
      e.stopPropagation();

      if (e.touches.length === 0) {
        gestureRef.current.mode = "none";
        setInteract(false);
        setGestureHint("Put 2 fingers on compass to move & rotate");
      } else {
        // Remaining fingers — re-baseline
        beginFromTouches(e.touches);
      }
    };

    // Capture phase on document so we win against Leaflet
    document.addEventListener("touchstart", onTouchStart, { capture: true, passive: false });
    document.addEventListener("touchmove", onTouchMove, { capture: true, passive: false });
    document.addEventListener("touchend", onTouchEnd, { capture: true, passive: false });
    document.addEventListener("touchcancel", onTouchEnd, { capture: true, passive: false });

    return () => {
      document.removeEventListener("touchstart", onTouchStart, true);
      document.removeEventListener("touchmove", onTouchMove, true);
      document.removeEventListener("touchend", onTouchEnd, true);
      document.removeEventListener("touchcancel", onTouchEnd, true);
      setInteract(false);
    };
  }, [clampPosition, setInteract]);

  // Mouse (desktop)
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest(".compass-control")) return;
      e.preventDefault();

      const g = gestureRef.current;
      const rect = compassRef.current?.getBoundingClientRect();
      setInteract(true);

      if ((e.target as HTMLElement).closest(".rotate-handle") && rect) {
        g.mode = "mouse-rotate";
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        g.startAngle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        g.originRotation = rotationRef.current;
        return;
      }

      g.mode = "mouse-move";
      g.startX = e.clientX;
      g.startY = e.clientY;
      g.originX = positionRef.current.x;
      g.originY = positionRef.current.y;
    },
    [setInteract]
  );

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const g = gestureRef.current;
      if (!g.active) return;

      if (g.mode === "mouse-rotate") {
        const rect = compassRef.current?.getBoundingClientRect();
        if (!rect) return;
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - cy, e.clientX - cx) * (180 / Math.PI);
        setCompassRotation(((g.originRotation + (angle - g.startAngle)) % 360 + 360) % 360);
        return;
      }

      if (g.mode === "mouse-move") {
        setPosition(
          clampPosition(g.originX + (e.clientX - g.startX), g.originY + (e.clientY - g.startY))
        );
      }
    };

    const onMouseUp = () => {
      if (!gestureRef.current.active) return;
      gestureRef.current.mode = "none";
      setInteract(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [clampPosition, setInteract]);

  const rotateBezzel = (direction: "cw" | "ccw", amount: number = 5) => {
    setBezelRotation((prev) => ((prev + (direction === "cw" ? amount : -amount)) % 360 + 360) % 360);
  };

  const currentBearing = Math.round(bezelRotation);
  const compassSize = 180;

  return (
    <div
      ref={compassRef}
      className="absolute z-[1100] select-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: isActive ? "grabbing" : "grab",
        WebkitUserSelect: "none",
        userSelect: "none",
        touchAction: "none",
        // Larger invisible hit area so two fingers easily land on compass
        padding: 16,
        margin: -16,
      }}
      onMouseDown={handleMouseDown}
    >
      {/* Top controls — only small buttons */}
      <div className="absolute -top-7 left-0 right-0 flex justify-center gap-1 z-20 pointer-events-auto">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="compass-control w-7 h-7 bg-amber-500 text-white rounded-full text-xs font-bold shadow-lg"
        >
          ?
        </button>
        <button
          onClick={() => setOpacity((o) => Math.max(0.3, o - 0.15))}
          className="compass-control w-7 h-7 bg-slate-600 text-white rounded-full text-[10px] shadow-lg"
        >
          ◐
        </button>
        <button
          onClick={() => setOpacity((o) => Math.min(1, o + 0.15))}
          className="compass-control w-7 h-7 bg-slate-600 text-white rounded-full text-[10px] shadow-lg"
        >
          ●
        </button>
        <button
          onClick={onClose}
          className="compass-control w-7 h-7 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg"
        >
          ✕
        </button>
      </div>

      {/* Active gesture banner */}
      <div
        className={`absolute -bottom-8 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap pointer-events-none transition-all ${
          isActive ? "scale-105" : ""
        }`}
      >
        <span
          className={`inline-block text-[10px] px-3 py-1 rounded-full font-medium shadow ${
            isActive ? "bg-amber-500 text-white" : "bg-slate-900/85 text-white"
          }`}
        >
          {isActive ? "✋ Moving compass…" : gestureHint}
        </span>
      </div>

      {showHelp && (
        <div className="compass-control absolute -top-8 left-1/2 -translate-x-1/2 -translate-y-full bg-white rounded-xl shadow-xl p-4 w-72 border-2 border-amber-400 z-30 text-xs">
          <h4 className="font-bold text-amber-800 mb-2 text-sm">🧭 Two-finger control</h4>
          <ul className="space-y-2 text-slate-700">
            <li>
              <strong>Put both fingers on the compass</strong> (or one on compass, second anywhere)
            </li>
            <li>
              <strong>Drag both fingers</strong> — moves the compass on the map
            </li>
            <li>
              <strong>Twist your fingers</strong> — rotates the compass to align with north lines
            </li>
            <li>
              <strong>One finger</strong> — drag to move only
            </li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-3 w-full py-2.5 bg-amber-500 text-white rounded-lg font-semibold"
          >
            Got it — I&apos;ll use my fingers
          </button>
        </div>
      )}

      {/* Compass body — primary touch target */}
      <div
        style={{
          transform: `rotate(${compassRotation}deg)`,
          opacity,
          width: compassSize,
          height: compassSize + 48,
        }}
        className={`relative rounded-xl ${isActive ? "ring-2 ring-amber-400 ring-offset-2" : ""}`}
      >
        <div
          className="relative rounded-lg shadow-xl border-2 border-slate-400/60 backdrop-blur-sm"
          style={{ backgroundColor: `rgba(255,255,255,${opacity * 0.65})` }}
        >
          {/* Direction of travel */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-600" />
              <div className="w-0.5 h-2 bg-red-600" />
            </div>
          </div>

          <div className="flex justify-center">
            <div className="w-8 h-0.5 bg-red-600 relative">
              <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rotate-45" />
            </div>
          </div>

          <div className="relative mx-auto my-1" style={{ width: compassSize - 20, height: compassSize - 20 }}>
            {/* Bezel adjust — small side taps only */}
            <button
              onClick={() => rotateBezzel("ccw")}
              className="compass-control absolute -left-5 top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-700/90 text-white rounded text-[10px] z-10 flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={() => rotateBezzel("cw")}
              className="compass-control absolute -right-5 top-1/2 -translate-y-1/2 w-5 h-10 bg-slate-700/90 text-white rounded text-[10px] z-10 flex items-center justify-center"
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
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-400/70" />
                <div className="w-1.5 h-10 border border-red-400/70" />
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
                transition: "transform 0.15s ease-out",
              }}
            >
              <div className="absolute top-1 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[40px] border-b-red-600" />
              </div>
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2">
                <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[40px] border-t-slate-100" />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-white shadow" />
            </div>
          </div>

          <div
            className="mx-2 mb-2 rounded px-2 py-1.5 text-center"
            style={{ backgroundColor: `rgba(30,41,59,${opacity})` }}
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">Bearing</span>
              <span className="font-mono font-bold text-white text-sm">{currentBearing}°</span>
              <span className="text-amber-300 font-mono">{Math.round(compassRotation)}°</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-2">
        <button
          onClick={() => setCompassRotation(0)}
          className="compass-control px-3 py-1.5 bg-slate-700/90 text-white rounded-lg text-[10px] shadow"
        >
          Reset rotation
        </button>
      </div>
    </div>
  );
}
