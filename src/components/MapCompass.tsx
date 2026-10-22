"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MapCompassProps {
  magneticDeclination?: number;
  onClose?: () => void;
}

export default function MapCompass({
  magneticDeclination = 1.5,
  onClose,
}: MapCompassProps) {
  const [position, setPosition] = useState({ x: 20, y: 80 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [compassRotation, setCompassRotation] = useState(0); // Rotate entire compass for orienteering
  const [bezelRotation, setBezelRotation] = useState(0); // Bezel rotation for bearing
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasDeviceOrientation, setHasDeviceOrientation] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [opacity, setOpacity] = useState(0.85);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState(0);
  const compassRef = useRef<HTMLDivElement>(null);

  // Device orientation for magnetic needle
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHasDeviceOrientation(true);
        const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ?? (360 - event.alpha);
        setDeviceHeading(heading);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      const requestPermission = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
      if (typeof requestPermission === "function") {
        requestPermission().then(permission => {
          if (permission === "granted") {
            window.addEventListener("deviceorientation", handleOrientation, true);
          }
        }).catch(() => {});
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  // Dragging functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".compass-control")) return;
    
    // Check if clicking on rotation handle
    if ((e.target as HTMLElement).closest(".rotate-handle")) {
      setIsRotating(true);
      const rect = compassRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        setRotateStart(angle - compassRotation);
      }
      return;
    }
    
    setIsDragging(true);
    const rect = compassRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, [compassRotation]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isRotating) {
      const rect = compassRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
        setCompassRotation(((angle - rotateStart) % 360 + 360) % 360);
      }
      return;
    }
    
    if (!isDragging) return;
    const parent = compassRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: Math.max(0, Math.min(parentRect.width - 200, e.clientX - parentRect.left - dragOffset.x)),
        y: Math.max(0, Math.min(parentRect.height - 240, e.clientY - parentRect.top - dragOffset.y)),
      });
    }
  }, [isDragging, isRotating, dragOffset, rotateStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setIsRotating(false);
  }, []);

  useEffect(() => {
    if (isDragging || isRotating) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isRotating, handleMouseMove, handleMouseUp]);

  // Touch support
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".compass-control")) return;
    
    if ((e.target as HTMLElement).closest(".rotate-handle")) {
      setIsRotating(true);
      const touch = e.touches[0];
      const rect = compassRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
        setRotateStart(angle - compassRotation);
      }
      return;
    }
    
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = compassRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  }, [compassRotation]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    
    if (isRotating) {
      const rect = compassRef.current?.getBoundingClientRect();
      if (rect) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const angle = Math.atan2(touch.clientY - centerY, touch.clientX - centerX) * (180 / Math.PI);
        setCompassRotation(((angle - rotateStart) % 360 + 360) % 360);
      }
      return;
    }
    
    if (!isDragging) return;
    const parent = compassRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: Math.max(0, Math.min(parentRect.width - 200, touch.clientX - parentRect.left - dragOffset.x)),
        y: Math.max(0, Math.min(parentRect.height - 240, touch.clientY - parentRect.top - dragOffset.y)),
      });
    }
  }, [isDragging, isRotating, dragOffset, rotateStart]);

  useEffect(() => {
    if (isDragging || isRotating) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, isRotating, handleTouchMove, handleMouseUp]);

  // Bezel rotation
  const rotateBezzel = (direction: "cw" | "ccw", amount: number = 5) => {
    setBezelRotation((prev) => ((prev + (direction === "cw" ? amount : -amount)) % 360 + 360) % 360);
  };

  // Compass rotation
  const rotateCompass = (direction: "cw" | "ccw", amount: number = 15) => {
    setCompassRotation((prev) => ((prev + (direction === "cw" ? amount : -amount)) % 360 + 360) % 360);
  };

  const currentBearing = Math.round(bezelRotation);
  const compassSize = 180; // Smaller size

  return (
    <div
      ref={compassRef}
      className="absolute z-[1000] select-none"
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? "grabbing" : "grab",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Control buttons - outside rotation */}
      <div className="absolute -top-8 left-0 right-0 flex justify-center gap-1 z-20">
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="compass-control w-6 h-6 bg-amber-500 text-white rounded-full text-xs font-bold hover:bg-amber-600 shadow-lg"
        >
          ?
        </button>
        <button
          onClick={() => setOpacity(o => Math.max(0.3, o - 0.15))}
          className="compass-control w-6 h-6 bg-slate-600 text-white rounded-full text-[10px] hover:bg-slate-700 shadow-lg"
          title="More transparent"
        >
          ◐
        </button>
        <button
          onClick={() => setOpacity(o => Math.min(1, o + 0.15))}
          className="compass-control w-6 h-6 bg-slate-600 text-white rounded-full text-[10px] hover:bg-slate-700 shadow-lg"
          title="Less transparent"
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

      {/* Help Panel */}
      {showHelp && (
        <div className="compass-control absolute -top-8 left-1/2 transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-xl p-3 w-64 border-2 border-amber-400 z-30 text-xs">
          <h4 className="font-bold text-amber-800 mb-2">🧭 Quick Guide</h4>
          <ol className="space-y-1 text-slate-600">
            <li><span className="font-bold text-amber-600">1.</span> Drag compass over your location on map</li>
            <li><span className="font-bold text-amber-600">2.</span> Rotate compass (use corners) to point arrow at destination</li>
            <li><span className="font-bold text-amber-600">3.</span> Rotate bezel until N aligns with map north</li>
            <li><span className="font-bold text-amber-600">4.</span> Read bearing at index mark</li>
            <li><span className="font-bold text-green-600">5.</span> Hold phone flat, turn until needle → N, walk!</li>
          </ol>
          <div className="mt-2 pt-2 border-t text-[10px] text-slate-400">
            <strong>Controls:</strong> Drag center to move • Drag corners to rotate • ◐● transparency
          </div>
        </div>
      )}

      {/* Rotatable Compass Container */}
      <div
        style={{
          transform: `rotate(${compassRotation}deg)`,
          opacity: opacity,
          width: compassSize,
          height: compassSize + 50,
        }}
        className="relative transition-opacity"
      >
        {/* Rotation handles (corners) */}
        <div className="rotate-handle absolute -top-2 -left-2 w-5 h-5 bg-amber-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">↻</div>
        <div className="rotate-handle absolute -top-2 -right-2 w-5 h-5 bg-amber-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">↻</div>

        {/* Base Plate - Transparent */}
        <div 
          className="relative rounded-lg shadow-xl border-2 border-slate-400/50 backdrop-blur-sm"
          style={{ backgroundColor: `rgba(255,255,255,${opacity * 0.7})` }}
        >
          {/* Direction of Travel Arrow */}
          <div className="flex justify-center pt-2 pb-1">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-600" />
              <div className="w-0.5 h-2 bg-red-600" />
            </div>
          </div>

          {/* Index Line */}
          <div className="flex justify-center">
            <div className="w-8 h-0.5 bg-red-600 relative">
              <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 bg-red-600 rotate-45" />
            </div>
          </div>

          {/* Compass Housing */}
          <div className="relative mx-auto my-1" style={{ width: compassSize - 20, height: compassSize - 20 }}>
            {/* Bezel rotation buttons */}
            <button
              onClick={() => rotateBezzel("ccw")}
              className="compass-control absolute -left-5 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-slate-700/80 text-white rounded text-[10px] hover:bg-slate-800 z-10 flex items-center justify-center"
            >
              ◀
            </button>
            <button
              onClick={() => rotateBezzel("cw")}
              className="compass-control absolute -right-5 top-1/2 transform -translate-y-1/2 w-4 h-8 bg-slate-700/80 text-white rounded text-[10px] hover:bg-slate-800 z-10 flex items-center justify-center"
            >
              ▶
            </button>

            {/* Outer Bezel Ring */}
            <div
              className="absolute inset-0 rounded-full border-2 border-slate-600/70"
              style={{ 
                transform: `rotate(${-bezelRotation}deg)`,
                backgroundColor: `rgba(241,245,249,${opacity * 0.6})`,
              }}
            >
              {/* Degree markings */}
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

            {/* Inner dial with orienting lines */}
            <div
              className="absolute rounded-full overflow-hidden"
              style={{ 
                inset: 15,
                transform: `rotate(${-bezelRotation}deg)`,
                backgroundColor: `rgba(255,255,255,${opacity * 0.5})`,
              }}
            >
              {/* Orienting lines */}
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-red-400/60"
                  style={{ left: `${(i + 1) * 16.66}%` }}
                />
              ))}
              
              {/* Orienting arrow outline */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-red-400/70" />
                <div className="w-1.5 h-10 border border-red-400/70 bg-transparent" />
              </div>
            </div>

            {/* Magnetic Needle */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: 20,
                transform: deviceHeading !== null ? `rotate(${-deviceHeading - compassRotation}deg)` : "rotate(0deg)",
                transition: "transform 0.2s ease-out",
              }}
            >
              {/* North (Red) */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                <div 
                  className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-b-[40px] border-b-red-600"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
                />
              </div>
              {/* South (White) */}
              <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                <div 
                  className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[40px] border-t-slate-100"
                  style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))" }}
                />
              </div>
              {/* Center pivot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-slate-800 border border-white shadow" />
            </div>
          </div>

          {/* Bearing Display */}
          <div 
            className="mx-2 mb-2 rounded px-2 py-1 text-center"
            style={{ backgroundColor: `rgba(30,41,59,${opacity})` }}
          >
            <div className="flex justify-between items-center text-[10px]">
              <span className="text-slate-300">Bearing:</span>
              <span className="font-mono font-bold text-white text-sm">{currentBearing}°</span>
              <span className="text-slate-300">
                {deviceHeading !== null ? `📱${Math.round(deviceHeading)}°` : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Rotation handles (bottom corners) */}
        <div className="rotate-handle absolute -bottom-2 -left-2 w-5 h-5 bg-amber-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">↻</div>
        <div className="rotate-handle absolute -bottom-2 -right-2 w-5 h-5 bg-amber-500 rounded-full cursor-grab active:cursor-grabbing shadow-lg border-2 border-white flex items-center justify-center text-white text-[8px]">↻</div>
      </div>

      {/* Compass rotation buttons - below compass */}
      <div 
        className="flex justify-center gap-2 mt-1"
        style={{ opacity: opacity }}
      >
        <button
          onClick={() => rotateCompass("ccw", 15)}
          className="compass-control px-2 py-1 bg-amber-600/90 text-white rounded text-[10px] font-bold hover:bg-amber-700 shadow"
        >
          ↺ 15°
        </button>
        <button
          onClick={() => setCompassRotation(0)}
          className="compass-control px-2 py-1 bg-slate-600/90 text-white rounded text-[10px] hover:bg-slate-700 shadow"
        >
          Reset
        </button>
        <button
          onClick={() => rotateCompass("cw", 15)}
          className="compass-control px-2 py-1 bg-amber-600/90 text-white rounded text-[10px] font-bold hover:bg-amber-700 shadow"
        >
          15° ↻
        </button>
      </div>
    </div>
  );
}
