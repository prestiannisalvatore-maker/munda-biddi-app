// Checklist items for Munda Biddi End-to-End trip

export interface ChecklistCategory {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked?: boolean;
}

export const defaultChecklist: ChecklistCategory[] = [
  {
    id: "bike",
    title: "Bike & Equipment",
    items: [
      { id: "bike-1", text: "Mountain bike suitable for loaded touring" },
      { id: "bike-2", text: "Bikepacking bags or panniers" },
      { id: "bike-3", text: "Spare tubes (2-3)" },
      { id: "bike-4", text: "Patch kit" },
      { id: "bike-5", text: "Pump" },
      { id: "bike-6", text: "Basic tools (multi-tool, chain tool)" },
      { id: "bike-7", text: "Chain lubricant" },
    ],
  },
  {
    id: "camping",
    title: "Camping Gear",
    items: [
      { id: "camp-1", text: "Tent (backup even if using shelters)" },
      { id: "camp-2", text: "Sleeping bag" },
      { id: "camp-3", text: "Sleeping mat" },
      { id: "camp-4", text: "Fuel stove (no campfires allowed)" },
      { id: "camp-5", text: "Cooking equipment" },
      { id: "camp-6", text: "Headlamp" },
    ],
  },
  {
    id: "navigation",
    title: "Navigation",
    items: [
      { id: "nav-1", text: "Official Munda Biddi Trail App or maps" },
      { id: "nav-2", text: "GPS device or smartphone with offline maps" },
      { id: "nav-3", text: "Compass" },
      { id: "nav-4", text: "Waterproof map case" },
    ],
  },
  {
    id: "safety",
    title: "Safety",
    items: [
      { id: "safe-1", text: "First aid kit" },
      { id: "safe-2", text: "Personal Locator Beacon (PLB)" },
      { id: "safe-3", text: "Whistle" },
      { id: "safe-4", text: "Mobile phone" },
      { id: "safe-5", text: "Emergency contact information" },
    ],
  },
  {
    id: "water",
    title: "Water",
    items: [
      { id: "water-1", text: "Water bottles/hydration system (3-4L capacity)" },
      { id: "water-2", text: "Water treatment tablets or filter" },
      { id: "water-3", text: "Extra water for hot conditions" },
    ],
  },
  {
    id: "clothing",
    title: "Clothing",
    items: [
      { id: "cloth-1", text: "Cycling clothing" },
      { id: "cloth-2", text: "Rain gear" },
      { id: "cloth-3", text: "Warm layers" },
      { id: "cloth-4", text: "Sun protection" },
      { id: "cloth-5", text: "Spare socks" },
      { id: "cloth-6", text: "Camp clothes" },
      { id: "cloth-7", text: "Full gloves (protection from swordgrass)" },
    ],
  },
  {
    id: "other",
    title: "Other",
    items: [
      { id: "other-1", text: "Toilet paper" },
      { id: "other-2", text: "Sunscreen" },
      { id: "other-3", text: "Insect repellent" },
      { id: "other-4", text: "Cash" },
      { id: "other-5", text: "Food supplies" },
      { id: "other-6", text: "Rubbish bags (pack it in, pack it out)" },
    ],
  },
  {
    id: "planning",
    title: "Pre-Trip Planning",
    items: [
      { id: "plan-1", text: "Leave detailed itinerary with responsible person" },
      { id: "plan-2", text: "Check DBCA Park Alerts before departure" },
      { id: "plan-3", text: "Book accommodation in towns (if required)" },
      { id: "plan-4", text: "Arrange transport to/from trailheads" },
      { id: "plan-5", text: "Group of 8+? Notify Foundation 4 weeks ahead" },
    ],
  },
];
