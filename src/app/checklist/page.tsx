"use client";

import { useState, useEffect } from "react";
import { gearChecklist, GearItem } from "@/data/stirlingRidgeData";

const categories = Array.from(new Set(gearChecklist.map((item) => item.category)));

export default function ChecklistPage() {
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<"all" | "essential" | "unchecked">("all");
  const [viewMode, setViewMode] = useState<"category" | "packType">("packType");

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

  // Weight calculations
  const baseEquipment = gearChecklist.filter((item) => item.packType === "base");
  const consumables = gearChecklist.filter((item) => item.packType === "consumable");
  
  const essentialBaseEquipment = baseEquipment.filter((item) => item.essential);
  const essentialConsumables = consumables.filter((item) => item.essential);
  
  const baseWeight = essentialBaseEquipment.reduce((sum, item) => sum + (item.weightGrams || 0), 0);
  const consumableWeight = essentialConsumables.reduce((sum, item) => sum + (item.weightGrams || 0), 0);
  const totalWeight = baseWeight + consumableWeight;

  const totalItems = gearChecklist.length;
  const checkedCount = Object.values(checkedItems).filter(Boolean).length;
  const essentialItems = gearChecklist.filter((item) => item.essential).length;
  const essentialChecked = gearChecklist.filter(
    (item) => item.essential && checkedItems[item.id]
  ).length;

  const formatWeight = (grams: number) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(1)}kg`;
    }
    return `${grams}g`;
  };

  const renderItemRow = (item: GearItem) => (
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
        <div className="flex items-center gap-2 flex-wrap">
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
          {item.weightGrams && (
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              item.packType === "consumable" 
                ? "bg-blue-100 text-blue-700" 
                : "bg-slate-100 text-slate-600"
            }`}>
              {formatWeight(item.weightGrams)}
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
  );

  return (
    <div className="space-y-8">
      <header className="text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Gear Checklist</h1>
        <p className="text-slate-600">
          Essential and recommended gear for the Stirling Ridge Walk
        </p>
      </header>

      {/* Weight Summary */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-6 text-white">
        <h2 className="font-semibold text-lg mb-4 text-center">Total Pack Weight (Essential Items)</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold">{formatWeight(baseWeight)}</div>
            <div className="text-amber-100 text-sm mt-1">Base Equipment</div>
            <div className="text-amber-200 text-xs mt-1">Tent, sleeping gear, clothing, etc.</div>
          </div>
          <div className="bg-white/20 rounded-lg p-4 text-center backdrop-blur-sm">
            <div className="text-3xl font-bold">{formatWeight(consumableWeight)}</div>
            <div className="text-amber-100 text-sm mt-1">Water & Food</div>
            <div className="text-amber-200 text-xs mt-1">Consumables for 2 days</div>
          </div>
          <div className="bg-white/30 rounded-lg p-4 text-center backdrop-blur-sm border-2 border-white/50">
            <div className="text-4xl font-bold">{formatWeight(totalWeight)}</div>
            <div className="text-white text-sm mt-1 font-medium">Total Weight</div>
            <div className="text-amber-100 text-xs mt-1">At start of hike</div>
          </div>
        </div>
        <p className="text-center text-amber-100 text-sm mt-4">
          💡 Water weight decreases as you drink (~4-5kg less by end of Day 1)
        </p>
      </div>

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
        <div className="flex gap-2 flex-wrap">
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
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setViewMode(viewMode === "category" ? "packType" : "category")}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            View by: {viewMode === "category" ? "Category" : "Pack Type"}
          </button>
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

      {/* Checklist by Pack Type */}
      {viewMode === "packType" ? (
        <div className="space-y-6">
          {/* Base Equipment */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-slate-700 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  🎒 Base Equipment
                </h2>
                <div className="text-right">
                  <span className="text-2xl font-bold">{formatWeight(baseWeight)}</span>
                  <span className="text-slate-300 text-sm ml-2">essential</span>
                </div>
              </div>
              <p className="text-slate-300 text-sm mt-1">
                Equipment you carry throughout the hike (weight stays constant)
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {getFilteredItems(baseEquipment).map(renderItemRow)}
              {getFilteredItems(baseEquipment).length === 0 && (
                <p className="p-4 text-slate-500 text-center">No items to show</p>
              )}
            </div>
          </div>

          {/* Consumables */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 text-white">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-lg flex items-center gap-2">
                  💧 Water & Food (Consumables)
                </h2>
                <div className="text-right">
                  <span className="text-2xl font-bold">{formatWeight(consumableWeight)}</span>
                  <span className="text-blue-200 text-sm ml-2">at start</span>
                </div>
              </div>
              <p className="text-blue-200 text-sm mt-1">
                Items consumed during the hike (weight decreases over time)
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {getFilteredItems(consumables).map(renderItemRow)}
              {getFilteredItems(consumables).length === 0 && (
                <p className="p-4 text-slate-500 text-center">No items to show</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Checklist by Category */
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryItems = gearChecklist.filter((item) => item.category === category);
            const filteredItems = getFilteredItems(categoryItems);

            if (filteredItems.length === 0) return null;

            const categoryWeight = categoryItems
              .filter((item) => item.essential)
              .reduce((sum, item) => sum + (item.weightGrams || 0), 0);
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
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-amber-700 bg-amber-100 px-2 py-1 rounded">
                      {formatWeight(categoryWeight)}
                    </span>
                    <span className="text-sm text-slate-500">
                      {categoryChecked} / {categoryItems.length}
                    </span>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {filteredItems.map(renderItemRow)}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Weight Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="font-semibold text-lg text-slate-800 mb-4">Weight Breakdown (Essential Items)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 px-3 font-medium text-slate-600">Category</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">Weight</th>
                <th className="text-right py-2 px-3 font-medium text-slate-600">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => {
                const weight = gearChecklist
                  .filter((item) => item.category === category && item.essential)
                  .reduce((sum, item) => sum + (item.weightGrams || 0), 0);
                const percentage = ((weight / totalWeight) * 100).toFixed(1);
                return (
                  <tr key={category} className="border-b border-slate-100">
                    <td className="py-2 px-3 text-slate-700">{category}</td>
                    <td className="py-2 px-3 text-right font-medium text-slate-800">{formatWeight(weight)}</td>
                    <td className="py-2 px-3 text-right text-slate-500">{percentage}%</td>
                  </tr>
                );
              })}
              <tr className="bg-slate-50 font-semibold">
                <td className="py-2 px-3 text-slate-800">Total</td>
                <td className="py-2 px-3 text-right text-amber-700">{formatWeight(totalWeight)}</td>
                <td className="py-2 px-3 text-right text-slate-600">100%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Additional Tips */}
      <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
        <h2 className="font-semibold text-lg text-amber-800 mb-4">Packing Tips</h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm text-amber-800">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Water is your heaviest item - but there&apos;s no alternative
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Consider no-cook meals to save ~250g on stove/fuel
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Pack heavy items close to your back and mid-height
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Wear your boots - don&apos;t pack them (saves ~900g in pack)
            </li>
          </ul>
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              By end of Day 1, you&apos;ll have consumed ~5kg of water
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Target base weight under 8kg for comfortable hiking
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              High-calorie, lightweight food: nuts, chocolate, wraps
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 mt-0.5">•</span>
              Test your full pack weight before the hike
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
