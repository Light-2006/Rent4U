
# Rent4U — Submission README

This repository contains the Rent4U frontend (student submission). The original design/spec is on Figma:
https://www.figma.com/design/BYueShykFrYtfd0Wpm7h61/Rent4U

---

## Quick summary
- Stack: React + Vite + TypeScript + Tailwind CSS
- Mock API: `json-server` (provided via `mock-data/db.json`)
- What I changed for this submission:
  - Centralized logo assets in `src/assets/` and added an `index.ts` barrel.
  - Updated header/footer to use the new logo assets (`@/assets`).
  - Fixed dark-mode inconsistencies on the Profile page by replacing hard-coded hex color classes with semantic theme tokens (e.g. `bg-card`, `bg-accent`, `text-muted-foreground`, `text-card-foreground`, `bg-primary`).

## Prerequisites
- Node.js (recommended v18+)
- npm (or pnpm/yarn)

## Install

Install dependencies:

```bash
npm install
```

## Run (development)

1. Start the mock API server (json-server) on port 4001:

```bash
npm run mock-server
```

2. Start the dev server (Vite):

```bash
npm run dev
```

3. Open the app in your browser:

- Frontend: http://localhost:5173 (Vite default)
- Mock API: http://localhost:4001

Notes: if Vite chooses a different port, the CLI output will show the correct URL.

## Build (production)

```bash
npm run build
```

The production bundle will be in `dist/`.

## Project structure (important paths)

- `src/app/` — main app pages and components
- `src/app/components/layout/` — `Navbar.tsx`, `Footer.tsx` (logos updated)
- `src/app/pages/ProfilePage.tsx` — profile UI (dark-mode fixes applied)
- `src/assets/` — centralized image assets and `index.ts` barrel (logo files)
- `mock-data/db.json` — fake API data for `json-server`

## How I verified (manual checks to run locally)
1. Run `npm run mock-server` and `npm run dev`.
2. Open the app and check:
   - Header and footer show the small + light/dark Rent4U logos.
   - Switch the site theme to dark (if the theme toggle is present) and verify Profile page cards/forms change color.
   - Basic user flows: view products, add to cart, go to checkout, view profile.

## Submission checklist (what to include when nộp bài)
- [x] `README.md` (this file)
- [ ] Dev server runs locally (`npm run dev`)
- [ ] Mock API runs locally (`npm run mock-server`)
- [ ] Screenshots (light + dark, key pages: Home, Product detail, Cart, Profile)
- [ ] Optional: production build (`npm run build`) and include `dist/` if the grader requests it

## Known notes / troubleshooting
- If you see asset import errors after moving assets, run `npm install` and restart the dev server.
- Vite alias `@` is configured in `vite.config.ts` and maps to `./src`.
- Theme token classes in `src/styles/theme.css` control colors for `bg-card`, `bg-accent`, `text-muted-foreground`, etc. If something appears visually wrong in dark mode, open `src/styles/theme.css` to adjust variables.
 - If `VITE_MOCK_URL` is NOT set, the frontend will automatically fall back to the bundled `mock-data/db.json` and simulate CRUD operations in-memory (persisted to `localStorage` during the session). This makes the app suitable for static hosting (GitHub Pages) without a running `json-server`.

## Next recommended steps (I can do these for you)
- Run the dev + mock servers and take screenshots of the key pages (I can run and capture them if you want).
- Add a `screenshots/` folder with the captured images and include them in the submission zip.

---

If you want, I can now start the dev server and gather screenshots of Home, Product, Cart, and Profile in both light and dark modes. Which should I do next?

  