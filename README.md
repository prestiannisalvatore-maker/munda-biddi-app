# Stirling Ridge Walk — Western Australia Hiking Guide

A comprehensive web application for planning your Stirling Ridge Walk adventure in Stirling Range National Park, Western Australia.

## About the Trail

The Stirling Ridge Walk is a challenging 25km multi-day hike across the dramatic peaks of the Stirling Range. It's considered the toughest hike in Western Australia and requires:
- Expert navigation skills (unmarked trail)
- High fitness level
- Self-sufficiency (no water sources)
- 2-3 days to complete

## Features

- **Home Page** — Trail overview, warnings, quick facts, and weather information
- **Trail Info** — Comprehensive guide with directions, all 12 peaks, camping spots, exit routes, and safety information
- **Itinerary** — Day-by-day breakdown with 2-day and 3-day planning options
- **Interactive Map** — Full GPX trail (1,514 points), peaks, campsites, GPS, and orienteering compass
- **3D Satellite Preview** — Mapbox 3D terrain with satellite imagery, contours, and walk-along flythrough
- **Gear Checklist** — Interactive checklist with progress tracking, categories, and local storage persistence
- **Offline PWA** — Install on iPhone for offline use

## Run Locally

```bash
npm install
cp .env.example .env.local   # then add your Mapbox token
npm run dev
```

Open [http://localhost:3002](http://localhost:3002).

### Mapbox 3D Preview

1. Get a free token at [mapbox.com](https://account.mapbox.com/access-tokens/)
2. Set `NEXT_PUBLIC_MAPBOX_TOKEN` in `.env.local` (local) or Vercel Environment Variables (production)
3. Redeploy / restart — the 3D preview appears on the Map page

## Deploy to Vercel

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Import the repository
4. Add `NEXT_PUBLIC_MAPBOX_TOKEN` in Project Settings → Environment Variables
5. Deploy — your app will be live at `your-project.vercel.app`

See [DEPLOY.md](./DEPLOY.md) for detailed instructions.

## Data Sources

- [The Life of Py](https://www.thelifeofpy.com/stirling-ridge-walk) — Detailed trail guide and trip report by Mark Pybus
- [Trails WA](https://trailswa.com.au/trails/trail-networks/stirling-range-national-park) — Official trail information
- [Parks WA](https://parks.dpaw.wa.gov.au/park/stirling-range) — National park information

## Tech Stack

- **Framework**: Next.js 14
- **Styling**: Tailwind CSS
- **Maps**: Leaflet (OpenTopoMap) + Mapbox GL JS (3D satellite terrain)
- **Language**: TypeScript

## Customisation

- **Trail Data**: Edit `src/data/stirlingRidgeData.ts` for peaks, campsites, and itinerary
- **Map**: Edit `src/components/StirlingMap.tsx` for map features
- **Checklist**: Modify gear items in `stirlingRidgeData.ts`

## Acknowledgements

Special thanks to Mark Pybus of [The Life of Py](https://www.thelifeofpy.com/) for the detailed trail information and trip report that made this guide possible.

Traditional Custodians: **Minang People** (Koikyennuruff)

## Safety Warning

⚠️ This is NOT a marked trail. It requires expert navigation skills, high fitness, and proper equipment. Always:
- Check weather conditions before departing
- Carry a Personal Locator Beacon (PLB)
- Carry 4-5L of water per day
- Know all exit routes
- Inform someone of your plans

This should NOT be your first or second overnight hike.
