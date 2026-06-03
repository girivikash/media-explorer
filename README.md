# Cine-Stream

A Netflix-lite media discovery SPA built with React, Vite, and the TMDB API.

## Features

- Popular movies grid
- Search with debounce
- Infinite scroll for large result sets
- Favorites saved to `localStorage`
- Dedicated `/favorites` route
- Native lazy-loaded poster images
- Vercel-compatible deployment

## Setup

1. Install dependencies:

```bash
npm install
```

2. Add a TMDB API key:

Create a `.env` file with:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_OPENAI_API_KEY=your_openai_api_key_here # optional for Mood Matcher
```

3. Run locally:

```bash
npm run dev
```

## Deploying to Vercel

- Push this repository to GitHub.
- Import the project in Vercel.
- Set `VITE_TMDB_API_KEY` and optionally `VITE_OPENAI_API_KEY` as Environment Variables in Vercel.
- Use `vercel.json` to enable SPA routing and static build deployment.

## Notes

- `VITE_` env variables are exposed to the browser by Vite.
- No secret keys should be committed.
