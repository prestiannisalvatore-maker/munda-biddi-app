# How to Run the Munda Biddi App

## Option A: Dev mode with Turbopack (try this first)

Turbopack avoids the webpack chunk errors:

```bash
cd "/Users/salvatoreprestianni/fitness app/new-project"
lsof -ti:3002 | xargs kill -9
npm run dev
```

Open **http://localhost:3002**

## Option B: Production mode

```bash
cd "/Users/salvatoreprestianni/fitness app/new-project"
lsof -ti:3002 | xargs kill -9
rm -rf .next node_modules/.cache
npm run build
npm run start
```

Open **http://localhost:3002** and hard refresh (Cmd+Shift+R).

## Option C: Standalone fallback

If neither works, open `STANDALONE.html` directly in your browser (double-click it). It shows the home page layout. The links won't work for other pages, but you'll see the content.

## Important

- Always run from the **`new-project`** folder
- Kill any existing server first: `lsof -ti:3002 | xargs kill -9`
