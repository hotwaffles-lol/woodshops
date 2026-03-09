# woodshops — Vite/React App

## What this is
React app for Woodshops. Served at `hotwaffles.lol/woodshops/` in production.

## Stack
- Vite + React (JSX)
- Package manager: **npm** (was previously bun — do not reintroduce bun)

## Development
```bash
npm install     # install deps
npm run dev     # local dev server
npm run build   # production build → dist/
```

## Vite base path — DO NOT CHANGE
`vite.config.js` has `base: '/woodshops/'`. This is required so that built asset URLs
(`/woodshops/assets/...`) resolve correctly when served from the S3 bucket under that path.
Changing it to `'./'` or `'/'` will break assets in production.

## Deployment
This app is **not deployed on its own** — it is built and deployed as part of the root repo via `deploy.sh`.
From the repo root (`../`):
```bash
S3_BUCKET=your-bucket-name ./deploy.sh
```
The deploy script runs `npm run build` here, then copies `dist/` to `out/woodshops/` before syncing to S3.

## Critical rules
- Always build before checking production behaviour (`npm run build`, then inspect `dist/`).
- The `dist/` folder is a build artifact — do not manually edit files inside it.
- Do not run deploys from inside this folder; always deploy from the repo root.
- Do not change the `base` in `vite.config.js`.
- Do not reintroduce `bun.lockb` or use `bun` commands — this project uses npm.
