"use client";

import { peaks } from "@/data/stirlingRidgeData";

export type Sighting = {
  peakId: string;
  bearing: number; // degrees TO the landmark
};

type Step = 1 | 2 | 3 | 4;

interface TriangulationPanelProps {
  step: Step;
  sighting1: Sighting | null;
  sighting2: Sighting | null;
  result: { lat: number; lng: number } | null;
  onStepChange: (step: Step) => void;
  onSighting1Change: (s: Sighting | null) => void;
  onSighting2Change: (s: Sighting | null) => void;
  onPlot: () => void;
  onClear: () => void;
  onClose: () => void;
  deviceHeading: number | null;
}

function BearingInput({
  value,
  onChange,
  deviceHeading,
  label,
}: {
  value: number;
  onChange: (n: number) => void;
  deviceHeading: number | null;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-medium text-slate-600">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange((value - 5 + 360) % 360)}
          className="w-10 h-10 bg-slate-200 rounded-lg font-bold text-slate-700 active:bg-slate-300"
        >
          −5
        </button>
        <input
          type="number"
          min={0}
          max={359}
          value={Math.round(value)}
          onChange={(e) => onChange(((parseInt(e.target.value) || 0) % 360 + 360) % 360)}
          className="flex-1 text-center text-2xl font-mono font-bold border-2 border-amber-400 rounded-lg py-2"
        />
        <button
          type="button"
          onClick={() => onChange((value + 5) % 360)}
          className="w-10 h-10 bg-slate-200 rounded-lg font-bold text-slate-700 active:bg-slate-300"
        >
          +5
        </button>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onChange((value - 1 + 360) % 360)}
          className="flex-1 py-1.5 text-xs bg-slate-100 rounded"
        >
          −1°
        </button>
        <button
          type="button"
          onClick={() => onChange((value + 1) % 360)}
          className="flex-1 py-1.5 text-xs bg-slate-100 rounded"
        >
          +1°
        </button>
        {deviceHeading !== null && (
          <button
            type="button"
            onClick={() => onChange(Math.round(deviceHeading))}
            className="flex-1 py-1.5 text-xs bg-blue-100 text-blue-700 rounded font-medium"
          >
            Use phone {Math.round(deviceHeading)}°
          </button>
        )}
      </div>
      <p className="text-[10px] text-slate-500 text-center">
        Point compass at the peak → read the bearing (0°=N, 90°=E, 180°=S, 270°=W)
      </p>
    </div>
  );
}

export default function TriangulationPanel({
  step,
  sighting1,
  sighting2,
  result,
  onStepChange,
  onSighting1Change,
  onSighting2Change,
  onPlot,
  onClear,
  onClose,
  deviceHeading,
}: TriangulationPanelProps) {
  const peak1 = peaks.find((p) => p.id === sighting1?.peakId);
  const peak2 = peaks.find((p) => p.id === sighting2?.peakId);

  return (
    <div className="bg-white border-b-2 border-indigo-400 shadow-inner">
      {/* Header */}
      <div className="bg-indigo-700 text-white px-4 py-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold flex items-center gap-2">
            <span>📐</span> Find Position by Compass
          </h3>
          <p className="text-[11px] text-indigo-200">
            Sight 2 peaks → draw bearing lines → your location is where they cross
          </p>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-indigo-500 hover:bg-indigo-400 font-bold"
        >
          ✕
        </button>
      </div>

      {/* Step indicators */}
      <div className="flex border-b border-slate-200">
        {([1, 2, 3, 4] as Step[]).map((s) => (
          <button
            key={s}
            onClick={() => onStepChange(s)}
            className={`flex-1 py-2 text-xs font-semibold border-b-2 transition-colors ${
              step === s
                ? "border-indigo-600 text-indigo-700 bg-indigo-50"
                : "border-transparent text-slate-500"
            }`}
          >
            {s === 1 && "How to"}
            {s === 2 && "Sight 1"}
            {s === 3 && "Sight 2"}
            {s === 4 && "Result"}
          </button>
        ))}
      </div>

      <div className="p-4 max-h-[340px] overflow-y-auto">
        {/* STEP 1 — Instructions */}
        {step === 1 && (
          <div className="space-y-3 text-sm text-slate-700">
            <p className="font-semibold text-indigo-800">
              Triangulation finds where you are when GPS fails.
            </p>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  1
                </span>
                <div>
                  <p className="font-medium">Pick a peak you can see</p>
                  <p className="text-xs text-slate-500">
                    Choose a clear landmark from the list (e.g. Bluff Knoll)
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </span>
                <div>
                  <p className="font-medium">Sight it with your compass</p>
                  <p className="text-xs text-slate-500">
                    Point the direction arrow at the peak. Read the bearing number at the index.
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </span>
                <div>
                  <p className="font-medium">Enter bearing &amp; plot line 1</p>
                  <p className="text-xs text-slate-500">
                    A coloured line is drawn through that peak on the map
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs">
                  4
                </span>
                <div>
                  <p className="font-medium">Repeat for a second peak</p>
                  <p className="text-xs text-slate-500">
                    Prefer peaks ~60–120° apart for a clear cross
                  </p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <div>
                  <p className="font-medium">Where the lines cross ≈ you</p>
                  <p className="text-xs text-slate-500">
                    That intersection is your approximate position on the map
                  </p>
                </div>
              </li>
            </ol>
            <button
              onClick={() => onStepChange(2)}
              className="w-full mt-2 py-3 bg-indigo-600 text-white rounded-lg font-semibold"
            >
              Start — Sight first peak →
            </button>
          </div>
        )}

        {/* STEP 2 — First sighting */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-600">Peak you can see</label>
              <select
                className="mt-1 w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium"
                value={sighting1?.peakId || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    onSighting1Change(null);
                    return;
                  }
                  onSighting1Change({
                    peakId: id,
                    bearing: sighting1?.bearing ?? 0,
                  });
                }}
              >
                <option value="">Select a peak…</option>
                {peaks.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === sighting2?.peakId}>
                    {p.name} ({p.elevation}m)
                  </option>
                ))}
              </select>
            </div>

            {sighting1 && (
              <BearingInput
                label="Compass bearing TO this peak"
                value={sighting1.bearing}
                onChange={(bearing) =>
                  onSighting1Change({ ...sighting1, bearing })
                }
                deviceHeading={deviceHeading}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onStepChange(1)}
                className="px-4 py-2.5 bg-slate-100 rounded-lg text-sm"
              >
                Back
              </button>
              <button
                disabled={!sighting1}
                onClick={() => onStepChange(3)}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm disabled:opacity-40"
              >
                Next — Second peak →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — Second sighting */}
        {step === 3 && (
          <div className="space-y-4">
            {peak1 && (
              <div className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-xs text-violet-800">
                Line 1: <strong>{peak1.name}</strong> at{" "}
                <strong>{Math.round(sighting1!.bearing)}°</strong>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-600">
                Second peak (different direction)
              </label>
              <select
                className="mt-1 w-full border-2 border-slate-200 rounded-lg px-3 py-2.5 text-sm font-medium"
                value={sighting2?.peakId || ""}
                onChange={(e) => {
                  const id = e.target.value;
                  if (!id) {
                    onSighting2Change(null);
                    return;
                  }
                  onSighting2Change({
                    peakId: id,
                    bearing: sighting2?.bearing ?? 90,
                  });
                }}
              >
                <option value="">Select a peak…</option>
                {peaks.map((p) => (
                  <option key={p.id} value={p.id} disabled={p.id === sighting1?.peakId}>
                    {p.name} ({p.elevation}m)
                  </option>
                ))}
              </select>
            </div>

            {sighting2 && (
              <BearingInput
                label="Compass bearing TO this peak"
                value={sighting2.bearing}
                onChange={(bearing) =>
                  onSighting2Change({ ...sighting2, bearing })
                }
                deviceHeading={deviceHeading}
              />
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onStepChange(2)}
                className="px-4 py-2.5 bg-slate-100 rounded-lg text-sm"
              >
                Back
              </button>
              <button
                disabled={!sighting2}
                onClick={() => {
                  onPlot();
                  onStepChange(4);
                }}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-lg font-semibold text-sm disabled:opacity-40"
              >
                Draw lines &amp; find me →
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — Result */}
        {step === 4 && (
          <div className="space-y-3">
            {result ? (
              <>
                <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center">
                  <p className="text-green-800 font-bold text-lg mb-1">
                    ✕ Your estimated position
                  </p>
                  <p className="font-mono text-sm text-green-700">
                    {Math.abs(result.lat).toFixed(5)}°S, {result.lng.toFixed(5)}°E
                  </p>
                  <p className="text-xs text-green-600 mt-2">
                    Purple &amp; teal lines cross at the pink marker on the map
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-violet-50 border border-violet-200 rounded-lg p-2">
                    <div className="font-semibold text-violet-800">Line 1 (purple)</div>
                    <div className="text-violet-700">
                      {peak1?.name}
                      <br />
                      Bearing {Math.round(sighting1!.bearing)}°
                    </div>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-lg p-2">
                    <div className="font-semibold text-teal-800">Line 2 (teal)</div>
                    <div className="text-teal-700">
                      {peak2?.name}
                      <br />
                      Bearing {Math.round(sighting2!.bearing)}°
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900">
                  <strong>Tips:</strong> Accuracy depends on careful sightings. Cross-check with the
                  trail line, terrain, and a third peak if unsure. Prefer landmarks far apart in
                  direction.
                </div>
              </>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800">
                Could not find a crossing. Check bearings are different and peaks are not in a
                straight line from you. Go back and adjust.
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onStepChange(3)}
                className="px-4 py-2.5 bg-slate-100 rounded-lg text-sm"
              >
                Adjust
              </button>
              <button
                onClick={() => {
                  onClear();
                  onStepChange(2);
                }}
                className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg font-semibold text-sm"
              >
                New triangulation
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
