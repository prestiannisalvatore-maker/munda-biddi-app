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
  packType: "base" | "consumable"; // base = equipment, consumable = water/food
  essential: boolean;
  weightGrams?: number; // approximate weight in grams
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
    lat: -34.318061,
    lng: 118.39204,
  },
  endPoint: {
    name: "Bluff Knoll Car Park",
    lat: -34.36778,
    lng: 118.242314,
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

// Peaks along the ridge (coordinates derived from verified GPX track)
// Listed west to east (Bluff Knoll to Ellen Peak)
export const peaks: Peak[] = [
  {
    id: "bluff-knoll",
    name: "Bluff Knoll",
    elevation: 1095,
    description: "The highest peak in the Stirling Range and all of Southern WA. Features a well-maintained trail from the car park.",
    lat: -34.3735,
    lng: 118.2640,
  },
  {
    id: "east-peak",
    name: "East Peak",
    elevation: 997,
    description: "A challenging 400m climb from Eucalyptus Col. The final major ascent before Bluff Knoll.",
    lat: -34.3605,
    lng: 118.2740,
  },
  {
    id: "moongoongoonderup",
    name: "Moongoongoonderup Hill",
    elevation: 850,
    description: "A smaller hill marking the transition between Isongerup and East Peak sections.",
    lat: -34.3636,
    lng: 118.2800,
  },
  {
    id: "isongerup-south",
    name: "Isongerup Peak South",
    elevation: 920,
    description: "Southern summit of Isongerup, offering panoramic views of Bluff Knoll and the western peaks.",
    lat: -34.3632,
    lng: 118.2876,
  },
  {
    id: "isongerup-peak",
    name: "Isongerup Peak",
    elevation: 962,
    description: "The main summit of Isongerup, a turning point with stunning 360-degree views.",
    lat: -34.3595,
    lng: 118.2892,
  },
  {
    id: "isongerup-north",
    name: "Isongerup Peak North",
    elevation: 962,
    description: "Considered the best viewpoint on the entire ridge. Pivot point between east and west views.",
    lat: -34.3572,
    lng: 118.2905,
  },
  {
    id: "first-arrow",
    name: "First Arrow",
    elevation: 900,
    description: "The westernmost and most technical of the three Arrows. Features the sketchiest scrambling section.",
    lat: -34.3569,
    lng: 118.3013,
  },
  {
    id: "second-arrow",
    name: "Second Arrow",
    elevation: 880,
    description: "Gentler than Third Arrow with a green top and less jagged rocks.",
    lat: -34.3561,
    lng: 118.3071,
  },
  {
    id: "third-arrow",
    name: "Third Arrow",
    elevation: 920,
    description: "Imposing rocky formation with dramatic eastern face. Features a cave for camping nearby.",
    lat: -34.3578,
    lng: 118.3125,
  },
  {
    id: "bakers-knob",
    name: "Baker's Knob",
    elevation: 890,
    description: "First major peak after Pyungoorup. Offers the first view of the Arrows laid out ahead.",
    lat: -34.3592,
    lng: 118.3196,
  },
  {
    id: "pyungoorup",
    name: "Pyungoorup Peak",
    elevation: 1012,
    description: "Massive monolithic peak. The trail passes to the south under dramatic cliff faces.",
    lat: -34.3582,
    lng: 118.3297,
  },
  {
    id: "ellen-peak",
    name: "Ellen Peak",
    elevation: 1012,
    description: "Starting peak if hiking east to west. The biggest single climb of the journey.",
    lat: -34.3517,
    lng: 118.3375,
  },
];

// Campsites and bivouac spots (coordinates derived from GPX track)
export const campsites: CampSite[] = [
  {
    id: "third-arrow-cave",
    name: "Third Arrow Cave",
    description: "A small cave near Third Arrow offering shelter from weather. Popular overnight spot.",
    features: ["Natural shelter", "Rocky floor", "No water", "Limited space for 2-3 people"],
    lat: -34.3575,
    lng: 118.3130,
  },
  {
    id: "bakers-knob-saddle",
    name: "Baker's Knob Saddle",
    description: "Grassy saddle before Baker's Knob with rocky platforms for tents. Great sunset views.",
    features: ["Grassy patches", "Rocky platforms", "Wind exposed", "Stunning views of Pyungoorup"],
    lat: -34.3590,
    lng: 118.3220,
  },
  {
    id: "she-oak-col",
    name: "She-Oak Col",
    description: "Informal campsite at the base between First Arrow and Isongerup. Multiple tent sites.",
    features: ["Multiple tent spots", "She-Oak trees for shade", "Multiple access paths", "No water"],
    lat: -34.3551,
    lng: 118.2945,
  },
  {
    id: "eucalyptus-col",
    name: "Eucalyptus Col",
    description: "Protected campsite at the lowest point of the ridge, before the climb to East Peak.",
    features: ["Protected from wind", "Kingia forest", "Thick vegetation", "Historic campsite"],
    lat: -34.3636,
    lng: 118.2799,
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

// Gear checklist with weights (approximate, in grams)
export const gearChecklist: GearItem[] = [
  // Navigation - Base Equipment
  { id: "map", name: "Topographic map", category: "Navigation", packType: "base", essential: true, weightGrams: 80, notes: "1:25,000 scale recommended" },
  { id: "compass", name: "Compass", category: "Navigation", packType: "base", essential: true, weightGrams: 50 },
  { id: "gps", name: "GPS device or phone with offline maps", category: "Navigation", packType: "base", essential: true, weightGrams: 200, notes: "Download AllTrails or similar offline" },
  { id: "plb", name: "Personal Locator Beacon (PLB)", category: "Navigation", packType: "base", essential: true, weightGrams: 150, notes: "Strongly recommended by Parks WA" },
  
  // Shelter - Base Equipment
  { id: "tent", name: "Lightweight tent", category: "Shelter", packType: "base", essential: true, weightGrams: 1200, notes: "Free-standing recommended due to rocky ground" },
  { id: "groundsheet", name: "Groundsheet/footprint", category: "Shelter", packType: "base", essential: false, weightGrams: 150 },
  { id: "sleeping-bag", name: "Sleeping bag (0°C comfort)", category: "Shelter", packType: "base", essential: true, weightGrams: 1100, notes: "Temperatures can drop to 5°C or below" },
  { id: "sleeping-pad", name: "Sleeping pad", category: "Shelter", packType: "base", essential: true, weightGrams: 450 },
  
  // Clothing - Base Equipment
  { id: "base-layers", name: "Merino base layers", category: "Clothing", packType: "base", essential: true, weightGrams: 350 },
  { id: "fleece", name: "Fleece mid-layer", category: "Clothing", packType: "base", essential: true, weightGrams: 300 },
  { id: "rain-jacket", name: "Waterproof jacket", category: "Clothing", packType: "base", essential: true, weightGrams: 350, notes: "Alpine conditions possible" },
  { id: "rain-pants", name: "Waterproof pants", category: "Clothing", packType: "base", essential: true, weightGrams: 200 },
  { id: "gaiters", name: "Gaiters", category: "Clothing", packType: "base", essential: false, weightGrams: 150, notes: "Protect from sword grass and rain" },
  { id: "hiking-boots", name: "Sturdy hiking boots", category: "Clothing", packType: "base", essential: true, weightGrams: 900, notes: "Ankle support essential for rock scrambling (worn, not packed)" },
  { id: "spare-socks", name: "Spare socks (2 pairs)", category: "Clothing", packType: "base", essential: true, weightGrams: 120 },
  { id: "sun-hat", name: "Sun hat", category: "Clothing", packType: "base", essential: true, weightGrams: 80 },
  { id: "beanie", name: "Warm beanie", category: "Clothing", packType: "base", essential: true, weightGrams: 60 },
  { id: "gloves", name: "Hiking gloves", category: "Clothing", packType: "base", essential: false, weightGrams: 50, notes: "Useful for scrambling" },
  
  // Water & Food - Consumables
  { id: "water-bladder", name: "Water bladder or bottles (empty)", category: "Water & Food", packType: "base", essential: true, weightGrams: 180, notes: "Capacity for 4-5L per day" },
  { id: "water-day1", name: "Water - Day 1 (5L)", category: "Water & Food", packType: "consumable", essential: true, weightGrams: 5000, notes: "1L = 1kg, no water sources on trail" },
  { id: "water-day2", name: "Water - Day 2 (4L)", category: "Water & Food", packType: "consumable", essential: true, weightGrams: 4000, notes: "Slightly less as you'll drink Day 1 supply" },
  { id: "food-day1", name: "Food - Day 1", category: "Water & Food", packType: "consumable", essential: true, weightGrams: 800, notes: "High calorie, lightweight options" },
  { id: "food-day2", name: "Food - Day 2", category: "Water & Food", packType: "consumable", essential: true, weightGrams: 800 },
  { id: "food-emergency", name: "Emergency food (extra day)", category: "Water & Food", packType: "consumable", essential: true, weightGrams: 400, notes: "Energy bars, nuts, dried fruit" },
  { id: "stove", name: "Lightweight stove + fuel", category: "Water & Food", packType: "base", essential: false, weightGrams: 250, notes: "Many go no-cook to save weight" },
  
  // Safety - Base Equipment
  { id: "first-aid", name: "First aid kit", category: "Safety", packType: "base", essential: true, weightGrams: 300 },
  { id: "headlamp", name: "Headlamp + spare batteries", category: "Safety", packType: "base", essential: true, weightGrams: 100 },
  { id: "emergency-blanket", name: "Emergency space blanket", category: "Safety", packType: "base", essential: true, weightGrams: 50 },
  { id: "whistle", name: "Whistle", category: "Safety", packType: "base", essential: true, weightGrams: 10 },
  { id: "sunscreen", name: "Sunscreen SPF50+", category: "Safety", packType: "consumable", essential: true, weightGrams: 100 },
  { id: "insect-repellent", name: "Insect repellent", category: "Safety", packType: "consumable", essential: false, weightGrams: 50 },
  
  // Other - Base Equipment
  { id: "backpack", name: "Backpack (50-65L)", category: "Other", packType: "base", essential: true, weightGrams: 1500, notes: "With hip belt for scrambling" },
  { id: "trekking-poles", name: "Trekking poles", category: "Other", packType: "base", essential: false, weightGrams: 500, notes: "Helpful for steep sections" },
  { id: "camera", name: "Camera", category: "Other", packType: "base", essential: false, weightGrams: 400 },
  { id: "phone", name: "Mobile phone (charged)", category: "Other", packType: "base", essential: true, weightGrams: 200, notes: "Limited reception - mainly for PLB backup" },
  { id: "power-bank", name: "Power bank", category: "Other", packType: "base", essential: false, weightGrams: 250 },
  { id: "trowel", name: "Trowel for waste burial", category: "Other", packType: "base", essential: true, weightGrams: 80, notes: "Bury waste 15cm deep minimum" },
  { id: "plastic-bags", name: "Plastic bags for rubbish", category: "Other", packType: "base", essential: true, weightGrams: 30, notes: "Pack out everything" },
  { id: "toilet-paper", name: "Toilet paper", category: "Other", packType: "consumable", essential: true, weightGrams: 50 },
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

// Route coordinates from verified GPX track (April 2022 hike recording)
// Source: Ride With GPS - Stirling Ridge Walk
// This is actual GPS data recorded during a real hike
export const routeCoordinates: [number, number][] = [
  [118.39204, -34.318061],   // Start - Gnowellen Road trailhead
  [118.361656, -34.318132],  // Along fence line
  [118.32992, -34.318167],   // Approaching national park
  [118.327624, -34.325947],  // Turn into park
  [118.331165, -34.335214],  // Climbing towards Ellen Peak
  [118.335928, -34.344463],  // Ellen Peak approach
  [118.337506, -34.351709],  // Ellen Peak area
  [118.333058, -34.355943],  // Pyungoorup approach
  [118.329706, -34.358237],  // Pyungoorup south side
  [118.326594, -34.359853],  // Past Pyungoorup
  [118.323472, -34.359012],  // Towards Baker's Knob
  [118.319621, -34.359229],  // Baker's Knob area
  [118.316112, -34.357895],  // Third Arrow approach
  [118.312454, -34.357821],  // Third Arrow
  [118.308779, -34.357187],  // Second Arrow
  [118.307068, -34.356111],  // Between Arrows
  [118.304482, -34.356377],  // First Arrow approach
  [118.301312, -34.356882],  // First Arrow
  [118.297761, -34.35589],   // She-Oak Col approach
  [118.294515, -34.355079],  // She-Oak Col
  [118.292031, -34.35488],   // Isongerup climb
  [118.29047, -34.357161],   // Isongerup North
  [118.289172, -34.359494],  // Isongerup Peak
  [118.288539, -34.361523],  // Isongerup area
  [118.28759, -34.363183],   // Isongerup South
  [118.284827, -34.364587],  // Descending Isongerup
  [118.281989, -34.365074],  // Towards Eucalyptus Col
  [118.27986, -34.363604],   // Eucalyptus Col area
  [118.278164, -34.361859],  // Climbing to East Peak
  [118.275938, -34.360314],  // East Peak approach
  [118.27405, -34.360486],   // East Peak
  [118.271625, -34.361319],  // Past East Peak
  [118.270579, -34.362661],  // Towards Bluff Knoll
  [118.269839, -34.364552],  // Bluff Knoll approach
  [118.268954, -34.367009],  // Bluff Knoll climb
  [118.266803, -34.367686],  // Bluff Knoll area
  [118.265343, -34.369143],  // Near summit
  [118.264437, -34.371096],  // Summit ridge
  [118.263981, -34.373522],  // Bluff Knoll summit area
  [118.26279, -34.374709],   // Descent begins
  [118.260253, -34.376143],  // Descending
  [118.25742, -34.376484],   // Trail descent
  [118.255682, -34.374864],  // Lower trail
  [118.253622, -34.377684],  // Continuing descent
  [118.251455, -34.378526],  // Near car park
  [118.250554, -34.380469],  // Approaching finish
  [118.250135, -34.377746],  // Near trailhead
  [118.24999, -34.374466],   // Final section
  [118.250849, -34.372119],  // Almost there
  [118.248982, -34.369604],  // Near end
  [118.244261, -34.36835],   // Final approach
  [118.242314, -34.36778],   // End - Bluff Knoll car park
];
