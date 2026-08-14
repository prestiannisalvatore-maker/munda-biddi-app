# Zino and Sam Prestianni — Munda Biddi End to End Planning May 2027

A web application for planning your Munda Biddi Trail end-to-end ride from Mundaring to Albany (1,067 km).

## Features

- **Trail Map** — Interactive map with OpenTopoMap (topography/contour lines), trail highlighted in red
- **Trail Info** — Content from the Munda Biddi Trail Guide PDF
- **Distance Calculator** — Calculate distances between campsites and towns (like mundabiddi.org.au)
- **Schedule** — Day-by-day plan with km, cumulative total, start/lunch/finish times, accommodation suggestions
- **Calendar** — Trip displayed on a calendar
- **Checklist** — Gear and planning checklist with tick boxes (saved in browser)

## Run Locally

```bash
npm install --legacy-peer-deps
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Deploy to the Internet

### Vercel (recommended, free)

1. Push this project to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Import the repository
4. Deploy — your app will be live at `your-project.vercel.app`

### Netlify

1. Push to GitHub
2. Go to [netlify.com](https://netlify.com) → Add new site → Import from Git
3. Build command: `npm run build`
4. Publish directory: `.next` (or use Next.js runtime)

### Other options

- **Railway**, **Render**, **Fly.io** — all support Next.js
- **Self-hosted** — `npm run build && npm run start` on a VPS

## Data Sources

- Trail distances: [mundabiddi.org.au/pages/trail-distances](https://mundabiddi.org.au/pages/trail-distances)
- Trail guide: Munda Biddi Trail Guide PDF
- KML: `munda_biddi_trail.kml` (trail coordinates)

## Customisation

- **Campsites**: Edit `src/data/trailData.ts` or add a JSON file and load it
- **Schedule**: Edit `src/data/scheduleData.ts` for dates and accommodation
- **Checklist**: Edit `src/data/checklistData.ts`
