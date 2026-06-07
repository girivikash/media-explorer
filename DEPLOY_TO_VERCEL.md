# Deploy to Vercel (Cine-Stream)

## Prerequisites
- Vercel account
- Node installed locally
- This repo already contains `vercel.json` configured for SPA routing and static build.

## 1) Install dependencies (local)
```bash
cd "c:/Users/giriv/OneDrive/Desktop/Media explorar"
npm install
```

## 2) (Optional) Build locally to verify
```bash
cd "c:/Users/giriv/OneDrive/Desktop/Media explorar"
npm run build
```

## 3) Set environment variables in Vercel
In Vercel Dashboard → **Project** → **Settings** → **Environment Variables** add:
- `VITE_TMDB_API_KEY` = your TMDB API key (**required**)
- `VITE_OPENAI_API_KEY` = optional (if the app uses any mood/matching features)

Make sure to set the **scope** to your project and use the correct **Environment** (Preview/Production).

## 4) Deploy using Vercel CLI
### Login
```bash
vercel login
```

### Deploy
```bash
vercel
```

During `vercel` it will ask whether to deploy to **Production** or **Preview**.

### Deploy for production (recommended)
```bash
vercel --prod
```

## 5) Verify runtime
After deployment, open the provided URL in a browser.
- If you see blank content, confirm `VITE_TMDB_API_KEY` is set in Vercel.
- SPA routing is handled by `vercel.json`.

## Vercel build output

- This project uses Vite which outputs to the `dist` folder. `vercel.json` is configured to use `dist` as the build output directory so Vercel will serve the production build correctly.

## Deploy via GitHub (optional)

- Connect your GitHub repository in the Vercel dashboard to enable automatic deployments on push to branches (e.g., `main`).

## Notes
- Vite exposes `VITE_*` variables to the browser. Do not use non-`VITE_*` variables unless your code is server-side.

