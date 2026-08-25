"use client";

import { useState, useEffect } from "react";
import { gearChecklist, GearItem } from "@/data/stirlingRidgeData";

const categories = Array.from(new Set(gearChecklist.map((item) => item.category)));

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "essential" | "unchecked">("all");

  useEffect(() => {
    const saved = localStorage.getItem("stirling-ridge-checklist");
    if (saved) {
      try {
        setCheckedItems(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("stirling-ridge-checklist", JSON.stringify(checkedItems));
  }, [checkedItems]);

  const toggleItem = (id: string) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const clearAll = () => {
    setCheckedItems({});
  };

  const checkAllEssential = () => {
    const essentials = gearChecklist.filter((item) => item.essential);
    const newChecked = { ...checkedItems };
    essentials.forEach((item) => {
      newChecked[item.id] = true;
    });
    setCheckedItems(newChecked);
  };

  const getFilteredItems = (items: GearItem[]) => {
    switch (filter) {
      case "essential":
        return items.filter((item) => item.essential);
      case "unchecked":
        return items.filter((item) => !checkedItems[item.id]);
      default:
        return items;
    }
  };

  const totalItems = gearChecklist.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const essentialItems = gearChecklist.filter((item) => item.essential).length;
  const essentialChecked = gearChecklist.filter(
    (item) => item.essential && checkedItems[item.id]
  ).length;

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gear Checklist</h1>
        <p className="text-slate-600">
          Essential and recommended gear for the Stirling Ridge Walk
        </p>
      </header>

      {/* Progress */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Total Progress</span>
              <span className="font-medium text-slate-800">
                {checkedCount} / {totalItems}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className="bg-amber-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(checkedCount / totalItems) * 100}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-600">Essential Items</span>
              <span className="font-medium text-slate-800">
                {essentialChecked} / {essentialItems}
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-300 ${
                  essentialChecked === essentialItems ? "bg-green-500" : "bg-red-500"
                }`}
                style={{ width: `${(essentialChecked / essentialItems) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "all"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All Items
          </button>
          <button
            onClick={() => setFilter("essential")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "essential"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Essential Only
          </button>
          <button
            onClick={() => setFilter("unchecked")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === "unchecked"
                ? "bg-amber-600 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            Unchecked
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={checkAllEssential}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-green-100 text-green-700 hover:bg-green-200 transition-colors"
          >
            Check All Essential
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
          >
            Clear All
          </button>
        </div>
      </div>

      {/* Checklist by Category */}
      <div className="space-y-6">
        {categories.map((category) => {
          const categoryItems = gearChecklist.filter((item) => item.category === category);
          const filteredItems = getFilteredItems(categoryItems);

          if (filteredItems.length === 0) return null;

          const categoryChecked = categoryItems.filter(
            (item) => checkedItems[item.id]
          ).length;

          return (
            <div
              key={category}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <h2 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
                  {category === "Navigation" && "🧭"}
                  {category === "Shelter" && "🏕️"}
                  {category === "Clothing" && "👕"}
                  {category === "Water & Food" && "💧"}
                  {category === "Safety" && "🩹"}
                  {category === "Other" && "🎒"}
                  {category}
                </h2>
                <span className="text-sm text-slate-500">
                  {categoryChecked} / {categoryItems.length}
                </span>
              </div>
              <div className="divide-y divide-slate-100">
                {filteredItems.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                      checkedItems[item.id] ? "bg-green-50/50" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={!!checkedItems[item.id]}
                      onChange={() => toggleItem(item.id)}
                      className="w-5 h-5 mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            checkedItems[item.id]
                              ? "text-slate-400 line-through"
                              : "text-slate-800"
                          }`}
                        >
                          {item.name}
                        </span>
                        {item.essential && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                            Essential
                          </span>
                        )}
                      </div>
                      {item.notes && (
                        <p
                          className={`text-sm mt-1 ${
                            checkedItems[item.id] ? "text-slate-400" : "text-slate-500"
                          }`}
                        >
                          {item.notes}
                        </p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Additional Tips */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h2 className="font-semibold text-lg text-amber-800 mb-4">Packing Tips</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Pack light - every gram counts over 25km of rugged terrain
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Use a pack with a hip belt - this helps on scrambling sections
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Water is heavy (1L = 1kg) but there&apos;s no alternative
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Consider no-cook meals to save weight on stove/fuel
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Free-standing tent recommended - rocky ground makes pegging difficult
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Merino base layers are worth the investment
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Download offline maps BEFORE leaving signal range
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Test all gear before the trip - no surprises on the ridge
            </li>
          </ul>
        </div>
      </div>

      {/* Print/Export */}
      <div className="text-center">
        <button
          onClick={() => window.print()}
          className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-700 transition-colors"
        >
          Print Checklist
        </button>
      </div>
    </div>
  );
}
