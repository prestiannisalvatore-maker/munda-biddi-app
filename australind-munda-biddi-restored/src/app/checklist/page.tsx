"use client";

import { useState, useEffect } from "react";
import {
  defaultChecklist,
  type ChecklistCategory,
  type ChecklistItem,
} from "@/data/checklistData";

const STORAGE_KEY = "munda-biddi-checklist";

function loadChecklist(): ChecklistCategory[] {
  if (typeof window === "undefined") return defaultChecklist;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved) as ChecklistCategory[];
      return parsed;
    }
  } catch {}
  return defaultChecklist;
}

function saveChecklist(data: ChecklistCategory[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

export default function ChecklistPage() {
  const [checklist, setChecklist] = useState<ChecklistCategory[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setChecklist(loadChecklist());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && checklist.length > 0) {
      saveChecklist(checklist);
    }
  }, [checklist, mounted]);

  const toggleItem = (categoryId: string, itemId: string) => {
    setChecklist((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : cat
      )
    );
  };

  const totalItems = checklist.reduce((acc, c) => acc + c.items.length, 0);
  const checkedItems = checklist.reduce(
    (acc, c) => acc + c.items.filter((i) => i.checked).length,
    0
  );

  if (!mounted) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-slate-800">Checklist</h1>
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Trip Checklist</h1>
        <p className="text-slate-600 mt-1">
          Gear and planning checklist — tick off as you prepare
        </p>
      </div>

      <div className="flex gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
        <span className="font-medium text-emerald-800">Progress</span>
        <span className="text-emerald-700">
          {checkedItems} / {totalItems} items
        </span>
        <div className="flex-1 max-w-[200px] h-2 bg-emerald-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-600 transition-all"
            style={{ width: `${(checkedItems / totalItems) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        {checklist.map((category) => (
          <div
            key={category.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
              <h2 className="font-semibold text-slate-800">{category.title}</h2>
            </div>
            <ul className="divide-y divide-slate-100">
              {category.items.map((item) => (
                <li key={item.id} className="flex items-center gap-4 px-6 py-3">
                  <button
                    onClick={() => toggleItem(category.id, item.id)}
                    className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                      item.checked
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 hover:border-emerald-400"
                    }`}
                    aria-label={item.checked ? "Uncheck" : "Check"}
                  >
                    {item.checked && (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      item.checked
                        ? "text-slate-500 line-through"
                        : "text-slate-800"
                    }`}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
