// Stirling Ridge Walk data - from thelifeofpy.com and other sources

export interface Peak {
  id: string;
  name: string;
  elevation: number; // meters ASL
  description: string;
  lat: number;
  lng: number;
}

export interface TrailSegment {
  from: string;
  to: string;
  distanceKm: number;
  description: string;
}

export interface CampSite {
  id: string;
  name: string;
  description: string;
  features: string[];
  lat: number;
  lng: number;
}

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  distanceKm: number;
  elevationGainM: number;
  estimatedHours: string;
  highlights: string[];
  waypoints: string[];
  campsite?: string;
}

export interface GearItem {
  id: string;
  name: string;
  category: string;
  essential: boolean;
  notes?: string;
}

// Trail overview information
export const trailInfo = {
  name: "Stirling Ridge Walk",
  alternateNames: ["Stirling Range Ridge Walk", "Eastern Peaks Ridge Route"],
  location: "Stirling Range National Park, Western Australia",
  traditionalCustodians: "Minang People (Koikyennuruff)",
  distanceKm: 25,
  elevationGainM: 1605,
  duration: "2-3 days",
  gradeWA: 6, // Grade 6 - Very experienced only
  dogFriendly: false,
  bestTime: "Spring to Autumn (September - May)",
  cost: "National Park fees apply ($15/vehicle/day or $30 annual pass)",
  startPoint: {
    name: "Gnowellen Road (Ellen Peak end)",
    lat: -34.3850,
    lng: 118.1450,
  },
  endPoint: {
    name: "Bluff Knoll Car Park",
    lat: -34.3769,
    lng: 118.0956,
  },
  highestPoint: {
    name: "Bluff Knoll",
    elevation: 1095,
  },
  lowestPoint: {
    name: "Base of East Peak climb",
    elevation: 600,
  },
};

// Peaks along the ridge (west to east)
export const peaks: Peak[] = [
  {
    id: "bluff-knoll",
    name: "Bluff Knoll",
    elevation: 1095,
    description: "The highest peak in the Stirling Range and all of Southern WA. Features a well-maintained trail from the car park.",
    lat: -34.3769,
    lng: 118.0956,
  },
  {
    id: "east-peak",
    name: "East Peak",
    elevation: 997,
    description: "A challenging 400m climb from Eucalyptus Col. The final major ascent before Bluff Knoll.",
    lat: -34.3785,
    lng: 118.1050,
  },
  {
    id: "moongoongoonderup",
    name: "Moongoongoonderup Hill",
    elevation: 850,
    description: "A smaller hill marking the transition between Isongerup and East Peak sections.",
    lat: -34.3810,
    lng: 118.1150,
  },
  {
    id: "isongerup-south",
    name: "Isongerup Peak South",
    elevation: 920,
    description: "Southern summit of Isongerup, offering panoramic views of Bluff Knoll and the western peaks.",
    lat: -34.3835,
    lng: 118.1220,
  },
  {
    id: "isongerup-peak",
    name: "Isongerup Peak",
    elevation: 962,
    description: "The main summit of Isongerup, a turning point with stunning 360-degree views.",
    lat: -34.3850,
    lng: 118.1280,
  },
  {
    id: "isongerup-north",
    name: "Isongerup Peak North",
    elevation: 962,
    description: "Considered the best viewpoint on the entire ridge. Pivot point between east and west views.",
    lat: -34.3865,
    lng: 118.1320,
  },
  {
    id: "first-arrow",
    name: "First Arrow",
    elevation: 900,
    description: "The westernmost and most technical of the three Arrows. Features the sketchiest scrambling section.",
    lat: -34.3880,
    lng: 118.1380,
  },
  {
    id: "second-arrow",
    name: "Second Arrow",
    elevation: 880,
    description: "Gentler than Third Arrow with a green top and less jagged rocks.",
    lat: -34.3890,
    lng: 118.1420,
  },
  {
    id: "third-arrow",
    name: "Third Arrow",
    elevation: 920,
    description: "Imposing rocky formation with dramatic eastern face. Features a cave for camping nearby.",
    lat: -34.3900,
    lng: 118.1460,
  },
  {
    id: "bakers-knob",
    name: "Baker's Knob",
    elevation: 890,
    description: "First major peak after Pyungoorup. Offers the first view of the Arrows laid out ahead.",
    lat: -34.3920,
    lng: 118.1500,
  },
  {
    id: "pyungoorup",
    name: "Pyungoorup Peak",
    elevation: 1012,
    description: "Massive monolithic peak. The trail passes to the south under dramatic cliff faces.",
    lat: -34.3950,
    lng: 118.1550,
  },
  {
    id: "ellen-peak",
    name: "Ellen Peak",
    elevation: 1012,
    description: "Starting peak if hiking east to west. The biggest single climb of the journey.",
    lat: -34.3980,
    lng: 118.1620,
  },
];

// Campsites and bivouac spots
export const campsites: CampSite[] = [
  {
    id: "third-arrow-cave",
    name: "Third Arrow Cave",
    description: "A small cave near Third Arrow offering shelter from weather. Popular overnight spot.",
    features: ["Natural shelter", "Rocky floor", "No water", "Limited space for 2-3 people"],
    lat: -34.3898,
    lng: 118.1458,
  },
  {
    id: "bakers-knob-saddle",
    name: "Baker's Knob Saddle",
    description: "Grassy saddle before Baker's Knob with rocky platforms for tents. Great sunset views.",
    features: ["Grassy patches", "Rocky platforms", "Wind exposed", "Stunning views of Pyungoorup"],
    lat: -34.3915,
    lng: 118.1510,
  },
  {
    id: "she-oak-col",
    name: "She-Oak Col",
    description: "Informal campsite at the base between First Arrow and Isongerup. Multiple tent sites.",
    features: ["Multiple tent spots", "She-Oak trees for shade", "Multiple access paths", "No water"],
    lat: -34.3872,
    lng: 118.1350,
  },
  {
    id: "eucalyptus-col",
    name: "Eucalyptus Col",
    description: "Protected campsite at the lowest point of the ridge, before the climb to East Peak.",
    features: ["Protected from wind", "Kingia forest", "Thick vegetation", "Historic campsite"],
    lat: -34.3800,
    lng: 118.1100,
  },
];

// Day-by-day itinerary (2-day version going East to West)
export const itinerary: DayItinerary[] = [
  {
    day: 1,
    title: "Ellen Peak to Baker's Knob Saddle",
    description: "Start from Gnowellen Road and tackle the biggest climb of the journey up Ellen Peak. Navigate around Pyungoorup's southern cliffs through sword grass sections before camping at Baker's Knob Saddle.",
    distanceKm: 10,
    elevationGainM: 800,
    estimatedHours: "6-8 hours",
    highlights: [
      "Sunrise start from Ellen Peak trailhead",
      "Climb the imposing Ellen Peak (1,012m)",
      "Navigate around Pyungoorup's dramatic southern cliffs",
      "Sword grass sections and fern-filled valleys",
      "Sunset views from Baker's Knob Saddle camp",
    ],
    waypoints: [
      "Gnowellen Road parking",
      "Vehicle track (6km flat)",
      "Ellen Peak summit",
      "Pyungoorup Pass (south side)",
      "Baker's Knob Saddle",
    ],
    campsite: "Baker's Knob Saddle",
  },
  {
    day: 2,
    title: "Baker's Knob to Bluff Knoll",
    description: "Tackle the technical Arrows section with challenging scrambles. Cross She-Oak Col, summit all three Isongerup peaks, then push through to East Peak and finish at Bluff Knoll.",
    distanceKm: 15,
    elevationGainM: 805,
    estimatedHours: "8-12 hours",
    highlights: [
      "Dawn views from Baker's Knob",
      "Navigate the dramatic Three Arrows",
      "Technical rock scrambling sections",
      "Panoramic views from Isongerup North",
      "Final push to East Peak and Bluff Knoll",
      "Summit WA's highest southern peak",
    ],
    waypoints: [
      "Baker's Knob",
      "Third Arrow",
      "Second Arrow", 
      "First Arrow",
      "She-Oak Col",
      "Isongerup Peak North",
      "Isongerup Peak",
      "Isongerup Peak South",
      "Eucalyptus Col",
      "East Peak",
      "Bluff Knoll summit",
      "Bluff Knoll car park",
    ],
  },
];

// 3-day itinerary option
export const itinerary3Day: DayItinerary[] = [
  {
    day: 1,
    title: "Ellen Peak to Third Arrow Cave",
    description: "A shorter first day allowing time to acclimatize. Summit Ellen Peak and navigate to the iconic Third Arrow Cave for overnight.",
    distanceKm: 8,
    elevationGainM: 650,
    estimatedHours: "5-7 hours",
    highlights: [
      "Climb Ellen Peak",
      "Navigate Pyungoorup's southern cliffs",
      "Camp at Third Arrow Cave",
    ],
    waypoints: [
      "Gnowellen Road",
      "Ellen Peak",
      "Pyungoorup Pass",
      "Baker's Knob",
      "Third Arrow Cave",
    ],
    campsite: "Third Arrow Cave",
  },
  {
    day: 2,
    title: "Third Arrow to Eucalyptus Col",
    description: "Navigate the technical Three Arrows section and cross the Isongerup peaks. Camp at the sheltered Eucalyptus Col.",
    distanceKm: 10,
    elevationGainM: 550,
    estimatedHours: "6-8 hours",
    highlights: [
      "Traverse the Three Arrows",
      "Technical scrambling",
      "Summit Isongerup peaks",
      "Views to Bluff Knoll",
    ],
    waypoints: [
      "Third Arrow",
      "Second Arrow",
      "First Arrow",
      "She-Oak Col",
      "Isongerup North",
      "Isongerup Peak",
      "Isongerup South",
      "Eucalyptus Col",
    ],
    campsite: "Eucalyptus Col",
  },
  {
    day: 3,
    title: "Eucalyptus Col to Bluff Knoll",
    description: "Tackle the final challenge - the steep climb to East Peak followed by the traverse to Bluff Knoll summit and descent.",
    distanceKm: 7,
    elevationGainM: 405,
    estimatedHours: "4-6 hours",
    highlights: [
      "Climb East Peak",
      "Summit Bluff Knoll",
      "Descend via maintained trail",
    ],
    waypoints: [
      "Eucalyptus Col",
      "East Peak",
      "Bluff Knoll",
      "Bluff Knoll car park",
    ],
  },
];

// Gear checklist
export const gearChecklist: GearItem[] = [
  // Navigation
  { id: "map", name: "Topographic map", category: "Navigation", essential: true, notes: "1:25,000 scale recommended" },
  { id: "compass", name: "Compass", category: "Navigation", essential: true },
  { id: "gps", name: "GPS device or phone with offline maps", category: "Navigation", essential: true, notes: "Download AllTrails or similar offline" },
  { id: "plb", name: "Personal Locator Beacon (PLB)", category: "Navigation", essential: true, notes: "Strongly recommended by Parks WA" },
  
  // Shelter
  { id: "tent", name: "Lightweight tent", category: "Shelter", essential: true, notes: "Free-standing recommended due to rocky ground" },
  { id: "groundsheet", name: "Groundsheet/footprint", category: "Shelter", essential: false },
  { id: "sleeping-bag", name: "Sleeping bag (0°C comfort)", category: "Shelter", essential: true, notes: "Temperatures can drop to 5°C or below" },
  { id: "sleeping-pad", name: "Sleeping pad", category: "Shelter", essential: true },
  
  // Clothing
  { id: "base-layers", name: "Merino base layers", category: "Clothing", essential: true },
  { id: "fleece", name: "Fleece mid-layer", category: "Clothing", essential: true },
  { id: "rain-jacket", name: "Waterproof jacket", category: "Clothing", essential: true, notes: "Alpine conditions possible" },
  { id: "rain-pants", name: "Waterproof pants", category: "Clothing", essential: true },
  { id: "gaiters", name: "Gaiters", category: "Clothing", essential: false, notes: "Protect from sword grass and rain" },
  { id: "hiking-boots", name: "Sturdy hiking boots", category: "Clothing", essential: true, notes: "Ankle support essential for rock scrambling" },
  { id: "spare-socks", name: "Spare socks", category: "Clothing", essential: true },
  { id: "sun-hat", name: "Sun hat", category: "Clothing", essential: true },
  { id: "beanie", name: "Warm beanie", category: "Clothing", essential: true },
  { id: "gloves", name: "Hiking gloves", category: "Clothing", essential: false, notes: "Useful for scrambling" },
  
  // Water & Food
  { id: "water-bladder", name: "Water bladder or bottles", category: "Water & Food", essential: true, notes: "Carry 4-5L per day minimum" },
  { id: "water-total", name: "Total water (8-10L for 2 days)", category: "Water & Food", essential: true, notes: "NO reliable water sources on trail" },
  { id: "food", name: "Food for duration + extra day", category: "Water & Food", essential: true },
  { id: "stove", name: "Lightweight stove (optional)", category: "Water & Food", essential: false, notes: "Many go no-cook to save weight" },
  
  // Safety
  { id: "first-aid", name: "First aid kit", category: "Safety", essential: true },
  { id: "headlamp", name: "Headlamp + spare batteries", category: "Safety", essential: true },
  { id: "emergency-blanket", name: "Emergency space blanket", category: "Safety", essential: true },
  { id: "whistle", name: "Whistle", category: "Safety", essential: true },
  { id: "sunscreen", name: "Sunscreen SPF50+", category: "Safety", essential: true },
  { id: "insect-repellent", name: "Insect repellent", category: "Safety", essential: false },
  
  // Other
  { id: "trekking-poles", name: "Trekking poles", category: "Other", essential: false, notes: "Helpful for steep sections" },
  { id: "camera", name: "Camera", category: "Other", essential: false },
  { id: "phone", name: "Mobile phone (charged)", category: "Other", essential: true, notes: "Limited reception - mainly for PLB backup" },
  { id: "power-bank", name: "Power bank", category: "Other", essential: false },
  { id: "trowel", name: "Trowel for waste burial", category: "Other", essential: true, notes: "Bury waste 15cm deep minimum" },
  { id: "plastic-bags", name: "Plastic bags for rubbish", category: "Other", essential: true, notes: "Pack out everything" },
];

// Exit routes (escape points)
export const exitRoutes = [
  {
    name: "Ellen Peak Return",
    description: "Return the way you came from Ellen Peak trailhead",
    accessFrom: ["Ellen Peak", "Pyungoorup"],
  },
  {
    name: "South via Pyungoorup",
    description: "Descend south from Pyungoorup Pass towards farming areas",
    accessFrom: ["Pyungoorup Pass"],
  },
  {
    name: "She-Oak Col North",
    description: "Emergency descent north from She-Oak Col towards farming land",
    accessFrom: ["She-Oak Col"],
  },
  {
    name: "Bluff Knoll Trail",
    description: "Standard maintained trail down Bluff Knoll - safest and easiest exit",
    accessFrom: ["Bluff Knoll", "East Peak area"],
  },
];

// Important contacts
export const contacts = {
  stirlingRangeNP: {
    name: "Stirling Range National Park Office",
    phone: "9827 9230",
  },
  albanyDistrict: {
    name: "Albany District Office (DBCA)",
    phone: "9842 4500",
  },
  emergency: "000",
  bluffKnollCafe: {
    name: "Bluff Knoll Cafe",
    description: "Coffee, meals, and small bar. Sign walker register here.",
  },
  stirlingRangeRetreat: {
    name: "Stirling Range Retreat",
    description: "Accommodation and shuttle service available",
    website: "https://stirlingranges.com.au",
  },
};

// Weather considerations
export const weatherInfo = {
  conditions: "The Stirling Range has its own microclimate and is the only place in Western Australia that experiences true alpine conditions.",
  risks: [
    "Rapid weather changes with minimal warning",
    "White-out conditions possible any time of year",
    "Snow possible on peaks in winter",
    "Hypothermia risk when wet and windy",
    "Slippery rocks when wet",
  ],
  recommendations: [
    "Check Bureau of Meteorology forecasts before departure",
    "Be prepared for conditions 10-15°C colder than Perth",
    "Don't hesitate to turn back if weather deteriorates",
    "Navigation in white-out conditions is extremely difficult",
  ],
  bestWeatherSite: "Bureau of Meteorology - Stirling Range National Park",
};

// Route coordinates for map (approximate, east to west)
export const routeCoordinates: [number, number][] = [
  [118.1620, -34.3980], // Ellen Peak trailhead
  [118.1550, -34.3950], // Pyungoorup area
  [118.1500, -34.3920], // Baker's Knob
  [118.1460, -34.3900], // Third Arrow
  [118.1420, -34.3890], // Second Arrow
  [118.1380, -34.3880], // First Arrow
  [118.1350, -34.3872], // She-Oak Col
  [118.1320, -34.3865], // Isongerup North
  [118.1280, -34.3850], // Isongerup Peak
  [118.1220, -34.3835], // Isongerup South
  [118.1100, -34.3800], // Eucalyptus Col
  [118.1050, -34.3785], // East Peak
  [118.0956, -34.3769], // Bluff Knoll
];
