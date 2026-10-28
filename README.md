# Bulusan Zoo – Frontend

React 19 + Vite 7 + Tailwind CSS 4 single-page app for the Bulusan Zoo digital platform
(visitor site, community, reservations, staff and admin portals, on-device animal scanner).

## Getting started

```bash
npm ci
cp .env.example .env   # fill in what you need
npm run dev            # http://localhost:5173
```

| Script | Purpose |
| --- | --- |
| `npm run dev` | Vite dev server (LAN-accessible) |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | ESLint |
| `npm test` | Unit tests (Node test runner) |

## Structure

- `src/pages/{user,admin,staff,auth,legal}` – route-level pages (lazy-loaded except Home)
- `src/components` – shared UI, layouts, feature components
- `src/services/api-client.js` – all backend calls; `src/context/AuthContext.jsx` – session handling
- `public/` – static files served as-is:
  - `brand/` logo · `icons/` favicons and SVG icons · `og-image.jpg` social preview (Home hero with header, 1200×630)
  - `images/park/` park photos (named by subject) · `images/mascot/` Jiji sprites · `images/event-img-placeholder.jpg` and `profile-img/` are also referenced by the backend / stored URLs, so keep their paths
  - `video/` hero loop and poster · `fonts/` woff2 fonts · `audio/` toast sounds
  - `models/animal-classifier/` TensorFlow.js model used by the animal scanner
  - `apps/` downloadable installers (public URLs, kept unchanged)
- `vercel.json` – SPA rewrites, caching and security headers

## Notes

- The backend is a separate service; this repo only contains the client.
- The scanner (TensorFlow.js) is loaded on demand to keep the first page load small.
