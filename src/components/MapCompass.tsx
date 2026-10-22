"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface MapCompassProps {
  mapScale?: number; // meters per pixel at current zoom
  magneticDeclination?: number; // degrees (positive = east, negative = west)
  onClose?: () => void;
}

export default function MapCompass({
  mapScale = 10,
  magneticDeclination = 1.5, // Stirling Range WA ~1.5° East
  onClose,
}: MapCompassProps) {
  const [position, setPosition] = useState({ x: 50, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [bezelRotation, setBezelRotation] = useState(0); // User-adjustable bezel
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [hasDeviceOrientation, setHasDeviceOrientation] = useState(false);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [customDeclination, setCustomDeclination] = useState(magneticDeclination);
  const compassRef = useRef<HTMLDivElement>(null);

  // Device orientation for magnetic needle
  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        setHasDeviceOrientation(true);
        // alpha is the compass direction the device is facing (0-360)
        // On iOS, we need webkitCompassHeading
        const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
          .webkitCompassHeading ?? (360 - event.alpha);
        setDeviceHeading(heading);
      }
    };

    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      // Check if we need to request permission (iOS 13+)
      const requestPermission = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
      if (typeof requestPermission === "function") {
        setIsCalibrating(true);
      } else {
        window.addEventListener("deviceorientation", handleOrientation, true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation, true);
    };
  }, []);

  const requestOrientationPermission = async () => {
    const requestPermission = (DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> }).requestPermission;
    if (typeof requestPermission === "function") {
      try {
        const permission = await requestPermission();
        if (permission === "granted") {
          window.addEventListener("deviceorientation", (event: DeviceOrientationEvent) => {
            if (event.alpha !== null) {
              setHasDeviceOrientation(true);
              const heading = (event as DeviceOrientationEvent & { webkitCompassHeading?: number })
                .webkitCompassHeading ?? (360 - event.alpha);
              setDeviceHeading(heading);
            }
          }, true);
          setIsCalibrating(false);
        }
      } catch (error) {
        console.error("Orientation permission denied:", error);
        setIsCalibrating(false);
      }
    }
  };

  // Dragging functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".compass-control")) return;
    setIsDragging(true);
    const rect = compassRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const parent = compassRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: Math.max(0, Math.min(parentRect.width - 280, e.clientX - parentRect.left - dragOffset.x)),
        y: Math.max(0, Math.min(parentRect.height - 320, e.clientY - parentRect.top - dragOffset.y)),
      });
    }
  }, [isDragging, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Touch support for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if ((e.target as HTMLElement).closest(".compass-control")) return;
    setIsDragging(true);
    const touch = e.touches[0];
    const rect = compassRef.current?.getBoundingClientRect();
    if (rect) {
      setDragOffset({
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      });
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const parent = compassRef.current?.parentElement;
    if (parent) {
      const parentRect = parent.getBoundingClientRect();
      setPosition({
        x: Math.max(0, Math.min(parentRect.width - 280, touch.clientX - parentRect.left - dragOffset.x)),
        y: Math.max(0, Math.min(parentRect.height - 320, touch.clientY - parentRect.top - dragOffset.y)),
      });
    }
  }, [isDragging, dragOffset]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("touchmove", handleTouchMove);
      window.addEventListener("touchend", handleMouseUp);
      return () => {
        window.removeEventListener("touchmove", handleTouchMove);
        window.removeEventListener("touchend", handleMouseUp);
      };
    }
  }, [isDragging, handleTouchMove, handleMouseUp]);

  // Bezel rotation control
  const rotateBezzel = (direction: "cw" | "ccw") => {
    setBezelRotation((prev) => {
      const newVal = direction === "cw" ? prev + 2 : prev - 2;
      return ((newVal % 360) + 360) % 360;
    });
  };

  // Calculate true north from magnetic north
  const trueNorth = deviceHeading !== null 
    ? (deviceHeading + customDeclination + 360) % 360 
    : null;

  // Calculate bearing based on bezel position
  const currentBearing = (bezelRotation + 360) % 360;

  // Ruler measurements (based on map scale)
  const rulerMarks = [0, 250, 500, 750, 1000]; // meters

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
      {/* Compass Container */}
      <div className="relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="compass-control absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600 z-10 flex items-center justify-center shadow-lg"
        >
          ✕
        </button>

        {/* Settings button */}
        <button
          onClick={() => { setShowSettings(!showSettings); setShowHelp(false); }}
          className="compass-control absolute -top-2 left-0 w-6 h-6 bg-slate-600 text-white rounded-full text-xs hover:bg-slate-700 z-10 flex items-center justify-center shadow-lg"
        >
          ⚙
        </button>

        {/* Help button */}
        <button
          onClick={() => { setShowHelp(!showHelp); setShowSettings(false); }}
          className={`compass-control absolute -top-2 left-8 w-6 h-6 rounded-full text-xs font-bold z-10 flex items-center justify-center shadow-lg ${
            showHelp ? "bg-amber-500 text-white" : "bg-amber-100 text-amber-700 hover:bg-amber-200"
          }`}
        >
          ?
        </button>

        {/* Settings Panel */}
        {showSettings && (
          <div className="compass-control absolute -top-32 left-0 bg-white rounded-lg shadow-xl p-3 w-64 border border-slate-200 z-20">
            <h4 className="font-semibold text-sm text-slate-800 mb-2">Compass Settings</h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-slate-600">Magnetic Declination (°)</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="number"
                    value={customDeclination}
                    onChange={(e) => setCustomDeclination(parseFloat(e.target.value) || 0)}
                    className="w-20 px-2 py-1 border rounded text-sm"
                    step="0.1"
                  />
                  <span className="text-slate-500">
                    {customDeclination >= 0 ? "East" : "West"}
                  </span>
                </div>
                <p className="text-slate-400 mt-1">Stirling Range: ~1.5° E</p>
              </div>
              {isCalibrating && (
                <button
                  onClick={requestOrientationPermission}
                  className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Enable Device Compass
                </button>
              )}
            </div>
          </div>
        )}

        {/* Help Panel - Navigation Instructions */}
        {showHelp && (
          <div className="compass-control absolute -top-2 left-16 bg-white rounded-xl shadow-2xl p-4 w-72 border-2 border-amber-400 z-20">
            <h4 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
              <span>🧭</span> How to Navigate
            </h4>
            
            <div className="space-y-4 text-xs">
              {/* Step 1 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">1</div>
                <div>
                  <p className="font-semibold text-slate-700">Find Your Location</p>
                  <p className="text-slate-500">Place compass on map where you are (use GPS blue dot)</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">2</div>
                <div>
                  <p className="font-semibold text-slate-700">Point to Destination</p>
                  <p className="text-slate-500">Align the direction arrow (↑) toward where you want to go</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">3</div>
                <div>
                  <p className="font-semibold text-slate-700">Rotate the Bezel</p>
                  <p className="text-slate-500">Use ↺ ↻ buttons until the red N aligns with map north (top)</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold">4</div>
                <div>
                  <p className="font-semibold text-slate-700">Read Your Bearing</p>
                  <p className="text-slate-500">The bezel number at the index line is your bearing (e.g., 45° = NE)</p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">5</div>
                <div>
                  <p className="font-semibold text-slate-700">Walk!</p>
                  <p className="text-slate-500">Hold phone flat, turn until red needle points to N on bezel, then walk in arrow direction</p>
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <p className="text-[10px] text-slate-400 font-medium mb-1">QUICK REFERENCE</p>
              <div className="grid grid-cols-4 gap-1 text-center text-[10px]">
                <div className="bg-slate-100 rounded p-1">
                  <div className="font-bold text-slate-700">0°</div>
                  <div className="text-slate-500">N</div>
                </div>
                <div className="bg-slate-100 rounded p-1">
                  <div className="font-bold text-slate-700">90°</div>
                  <div className="text-slate-500">E</div>
                </div>
                <div className="bg-slate-100 rounded p-1">
                  <div className="font-bold text-slate-700">180°</div>
                  <div className="text-slate-500">S</div>
                </div>
                <div className="bg-slate-100 rounded p-1">
                  <div className="font-bold text-slate-700">270°</div>
                  <div className="text-slate-500">W</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-3 w-full py-2 bg-amber-500 text-white rounded-lg font-semibold text-sm hover:bg-amber-600"
            >
              Got it!
            </button>
          </div>
        )}

        {/* Base Plate with Ruler */}
        <div className="relative bg-white/90 backdrop-blur-sm rounded-lg shadow-2xl border-2 border-slate-300 p-2">
          {/* Direction of Travel Arrow (Top) */}
          <div className="flex justify-center mb-1">
            <div className="flex flex-col items-center">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[12px] border-b-red-600" />
              <div className="w-1 h-3 bg-red-600" />
              <span className="text-[8px] font-bold text-red-600 mt-0.5">DIRECTION OF TRAVEL</span>
            </div>
          </div>

          {/* Index Line */}
          <div className="flex justify-center mb-1">
            <div className="w-16 h-0.5 bg-red-600 relative">
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 border-2 border-red-600 bg-white rotate-45" />
            </div>
          </div>

          {/* Rotating Bezel with Compass Housing */}
          <div className="relative w-64 h-64 mx-auto">
            {/* Bezel rotation controls */}
            <button
              onClick={() => rotateBezzel("ccw")}
              className="compass-control absolute -left-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-700 text-white rounded-full text-sm hover:bg-slate-800 z-10"
            >
              ↺
            </button>
            <button
              onClick={() => rotateBezzel("cw")}
              className="compass-control absolute -right-8 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-slate-700 text-white rounded-full text-sm hover:bg-slate-800 z-10"
            >
              ↻
            </button>

            {/* Outer Bezel Ring with Bearings */}
            <div
              className="absolute inset-0 rounded-full border-4 border-slate-800 bg-gradient-to-br from-slate-100 to-slate-200"
              style={{ transform: `rotate(${-bezelRotation}deg)` }}
            >
              {/* Degree markings on bezel */}
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const isCardinal = deg % 90 === 0;
                const isMajor = deg % 30 === 0;
                const isMinor = deg % 10 === 0;
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: "50%",
                      top: "50%",
                      transform: `rotate(${deg}deg) translateY(-120px)`,
                      transformOrigin: "0 0",
                    }}
                  >
                    <div
                      className={`w-0.5 ${
                        isCardinal ? "h-4 bg-red-600" : isMajor ? "h-3 bg-slate-800" : isMinor ? "h-2 bg-slate-600" : "h-1 bg-slate-400"
                      }`}
                      style={{ marginLeft: "-1px" }}
                    />
                    {isMajor && (
                      <span
                        className={`absolute text-[9px] font-bold ${isCardinal ? "text-red-600" : "text-slate-800"}`}
                        style={{
                          transform: `rotate(${-deg + bezelRotation}deg)`,
                          marginLeft: "-8px",
                          marginTop: "2px",
                        }}
                      >
                        {deg === 0 ? "N" : deg === 90 ? "E" : deg === 180 ? "S" : deg === 270 ? "W" : deg}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Inner compass dial with orienting lines */}
            <div
              className="absolute inset-4 rounded-full bg-white border-2 border-slate-400 overflow-hidden"
              style={{ transform: `rotate(${-bezelRotation}deg)` }}
            >
              {/* Orienting lines (parallel to N-S) */}
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute top-0 bottom-0 w-px bg-red-300"
                  style={{ left: `${(i + 1) * 10}%` }}
                />
              ))}
              
              {/* Orienting arrow (points to N on dial) */}
              <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[10px] border-b-red-500" />
                <div className="w-2 h-16 border-2 border-red-500 bg-transparent" />
              </div>
            </div>

            {/* Magnetic Needle (rotates based on device heading) */}
            <div
              className="absolute inset-8 pointer-events-none"
              style={{
                transform: deviceHeading !== null ? `rotate(${-deviceHeading}deg)` : "rotate(0deg)",
                transition: "transform 0.3s ease-out",
              }}
            >
              {/* North (Red) end of needle */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[60px] border-b-red-600 drop-shadow-md" />
              </div>
              {/* South (White) end of needle */}
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
                <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[60px] border-t-white drop-shadow-md" style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }} />
              </div>
              {/* Center pivot */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-800 border-2 border-white shadow-lg" />
            </div>

            {/* Declination indicator */}
            {customDeclination !== 0 && (
              <div
                className="absolute inset-12 pointer-events-none"
                style={{ transform: `rotate(${-customDeclination}deg)` }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                  <div className="w-0.5 h-6 bg-green-500 opacity-70" />
                  <span className="text-[7px] text-green-600 font-bold ml-1">TN</span>
                </div>
              </div>
            )}
          </div>

          {/* Ruler on base plate */}
          <div className="mt-3 px-2">
            <div className="relative h-6 bg-slate-100 rounded border border-slate-300">
              {/* Ruler markings */}
              <div className="absolute inset-x-2 top-0 h-full flex justify-between items-end">
                {rulerMarks.map((mark, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <span className="text-[7px] text-slate-600 mb-0.5">{mark}m</span>
                    <div className={`w-px ${i === 0 || i === rulerMarks.length - 1 ? "h-3 bg-slate-800" : "h-2 bg-slate-500"}`} />
                  </div>
                ))}
              </div>
              {/* Intermediate marks */}
              <div className="absolute inset-x-2 bottom-0 h-full flex justify-between items-end">
                {Array.from({ length: 21 }).map((_, i) => (
                  <div key={i} className={`w-px ${i % 5 === 0 ? "h-2 bg-slate-400" : "h-1 bg-slate-300"}`} />
                ))}
              </div>
            </div>
            <p className="text-[7px] text-slate-500 text-center mt-0.5">Scale: ~{mapScale}m per division (adjust by zoom level)</p>
          </div>

          {/* Bearing readout */}
          <div className="mt-2 bg-slate-800 text-white rounded px-3 py-2 text-center">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400">Bezel:</span>
                <span className="ml-1 font-mono font-bold">{currentBearing.toFixed(0)}°</span>
              </div>
              <div>
                <span className="text-slate-400">Heading:</span>
                <span className="ml-1 font-mono font-bold">
                  {deviceHeading !== null ? `${deviceHeading.toFixed(0)}°` : "--"}
                </span>
              </div>
            </div>
            {trueNorth !== null && (
              <div className="text-[10px] text-slate-400 mt-1">
                True North: {trueNorth.toFixed(0)}° (Decl: {customDeclination > 0 ? "+" : ""}{customDeclination}°)
              </div>
            )}
            {!hasDeviceOrientation && (
              <div className="text-[10px] text-amber-400 mt-1">
                ⚠️ Rotate bezel manually or enable device compass
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-2 text-[8px] text-slate-500 text-center leading-tight">
            <p><strong>Drag</strong> to move • <strong>↺↻</strong> rotate bezel • <strong className="text-amber-600">?</strong> for help</p>
          </div>
        </div>
      </div>
    </div>
  );
}
