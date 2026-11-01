# LocalBite

**Discover the food. Understand the culture. Find your next favourite.**

LocalBite is a mobile-first Kerala food discovery guide for first-time visitors. It helps people understand unfamiliar dishes, compare what they might like, and keep a private tasting journal without pretending to be a restaurant directory or ordering app.

- Repository: [github.com/hariiharitha6/LocalBites](https://github.com/hariiharitha6/LocalBites)
- Live demo: _Deployment placeholder — add the approved Vercel URL here._
- Status: deployment-prepared frontend portfolio project, no backend required.

## Overview

Kerala food rewards curiosity, but a menu full of unfamiliar names, textures, spice levels and portion sizes can be intimidating. Most food apps are built to complete an order. LocalBite is built to help someone understand what they are choosing.

The app provides editorial dish guides, search and filters, side-by-side comparison, a private Food Passport, and optional preference-based suggestions. All personal data stays in the browser. There are no accounts, fabricated reviews, invented venues or live ordering flows.

## Problem and solution

### The problem

- Dish guidance is scattered across blogs, maps and social posts.
- Spice, texture, portion and price expectations are difficult to compare.
- Visitors forget what they wanted to try and what they enjoyed.
- Generic recommendations rarely explain the culture or context behind a dish.
- Invented ratings and venue claims make food discovery less trustworthy.

### The solution

LocalBite brings a small, focused set of Kerala dishes into one calm reading experience. Each guide explains taste, texture, spice, ingredients, context and what to ask at the table. Visitors can save dishes, record reactions, compare options and set preferences without creating an account.

The content is explicitly labelled as seed material with low confidence. The interface never turns missing information into a fabricated fact.

## Features

- **Editorial dish guides:** taste, texture, spice estimate, indicative price, ingredients, suitability, cultural context and first-timer tips.
- **Search and filtering:** search by text; filter by category, budget, spice level, diet, experience and intent; sort results.
- **Personal suggestions:** tune spice comfort, budget, dietary starting points and taste preferences.
- **Side-by-side compare:** compare up to three dishes in one view.
- **Food Passport:** save dishes, mark them tried, add personal notes and record reactions.
- **Accessible preview dialogs:** open a dish preview from any card without leaving the page.
- **Area context:** set a browsing area manually or explicitly request browser location. No nearby venue data is invented.
- **Correction drafts:** submit a local report draft for a dish. Reports are not sent to a server.
- **Responsive design:** layouts are designed for small screens first and expand for tablets and desktop.
- **Local-first privacy:** no account, database, analytics or API key is required.

## Screenshots

Actual screenshots will be added before the final portfolio launch. These placeholders define the recommended captures:

### Home — desktop

> **Screenshot placeholder:** `docs/screenshots/home-desktop.png`
> Suggested viewport: 1440 × 1000. Capture the hero, suggested dishes and first-timer section.

### Home — mobile

> **Screenshot placeholder:** `docs/screenshots/home-mobile.png`
> Suggested viewport: 390 × 844. Capture the hero and at least one dish card.

### Explore and filters

> **Screenshot placeholder:** `docs/screenshots/explore.png`
> Show the search field, filter panel and result grid.

### Dish detail and compare

> **Screenshot placeholder:** `docs/screenshots/detail-compare.png`
> Show a dish guide and a two- or three-dish comparison.

### Food Passport

> **Screenshot placeholder:** `docs/screenshots/passport.png`
> Show saved dishes, tried dishes, notes and reactions.

## Technology stack

- **React 19** — component-based UI.
- **TypeScript** — typed content, state and component props.
- **Vite 7** — development server and production build.
- **Wouter** — lightweight client-side routing.
- **Tailwind CSS 4** — utility foundation.
- **Custom CSS design system** — typography, layout, colour, responsive rules and motion.
- **Lucide React** — interface icons.
- **localStorage** — on-device persistence with cross-tab synchronisation.

No server, database, authentication provider or external API is required.

## Architecture

LocalBite is a static single-page application.

1. `main.tsx` mounts the React tree inside an error boundary.
2. `App.tsx` defines the route switch and page-level interactions.
3. `AppStateProvider` centralises journey, comparison and preference state.
4. `useStored` reads and writes versionless JSON values in `localStorage` and listens for storage events from other tabs.
5. `food-content.ts` is the authoritative seed content source and adds responsive image metadata.
6. `AppShell` provides the skip link, header, main landmark, footer and mobile navigation.
7. `index.css` contains the app-specific visual system and responsive breakpoints.

### Folder structure

```text
LocalBites/
├─ artifacts/
│  └─ localbite/
│     ├─ public/
│     │  ├─ foods/                 # Optimised responsive WebP assets
│     │  ├─ favicon.svg
│     │  └─ robots.txt
│     ├─ source-images/            # Local-only masters; Git-ignored and not deployed
│     ├─ src/
│     │  ├─ components/
│     │  │  ├─ layout/             # Header, footer, shell, mobile navigation
│     │  │  └─ ui/                 # Modal, preview, food card, dish image, primitives
│     │  ├─ hooks/
│     │  ├─ lib/                   # App state, types, navigation, storage hook
│     │  ├─ pages/                 # About and not-found pages
│     │  ├─ App.tsx                # Routes and interactive screens
│     │  ├─ food-content.ts        # Typed dish seed content and image metadata
│     │  ├─ index.css              # Design system and responsive layouts
│     │  └─ main.tsx               # React entry point
│     ├─ index.html
│     ├─ package.json
│     └─ vite.config.ts
├─ package.json
├─ pnpm-lock.yaml
├─ pnpm-workspace.yaml
├─ vercel.json
└─ .vercelignore
```

## Routes

| Route | Page | Purpose |
| --- | --- | --- |
| `/` | Discover | Hero, preference-based suggestions, first-timer shortlist and Passport prompt. |
| `/explore` | Explore | Search, filters, sorting and the complete dish grid. |
| `/food/:id` | Dish guide | Taste, texture, context, ingredients, indicative price, related dishes and report form. |
| `/compare` | Compare | Up to three dishes side by side, with a persistent comparison tray. |
| `/journey` | Food Passport | Saved and tried dishes, notes and reactions. |
| `/preferences` | Preferences | Spice, budget, diet and taste inputs used by home suggestions. |
| `/nearby` | Nearby | Manual area context and optional geolocation, with an honest empty venue state. |
| `/about` | About | Project story, principles and technology overview. |

The router uses path-based URLs. Deployment must include an SPA fallback to `index.html`.

## State and localStorage

State is intentionally local and account-free.

| Key | Shape | Purpose |
| --- | --- | --- |
| `localbite-journey` | `{ saved: string[], tried: string[], notes: Record<string,string>, reactions: Record<string,string> }` | Food Passport data. |
| `localbite-compare` | `string[]` | Up to three dish IDs selected for comparison. |
| `localbite-preferences` | `{ spice: number, budget: number, diet: string[], tastes: string[] }` | Personal suggestion inputs. |
| `localbite-explore-filters` | Filter object | Persisted search, budget, spice, category, diet, experience, sort and intent. |
| `localbite-area` | `string` | User-entered browsing area. |
| `localbite-reports` | Array of report drafts | Local correction notes; never sent to a server. |

The storage hook:

- Falls back safely if stored JSON is missing or malformed.
- Writes JSON after state changes.
- Synchronises updates from other browser tabs through the `storage` event.
- Does not sync between devices.

Clearing browser storage removes saved dishes, notes, preferences, comparisons, area and report drafts.

## Accessibility and responsive design

Accessibility is treated as part of the product, not a final patch.

- Semantic landmarks, one `h1` per page, meaningful headings and a skip link.
- Visible keyboard focus, `aria-current` navigation state and labelled icon buttons.
- Modal focus entry, focus trapping, Escape-to-close, background scroll locking and focus return.
- Live status messages for saved states, location and form feedback.
- Touch targets sized for mobile use, including 44px minimums for primary controls.
- Reduced-motion support through CSS media queries.
- Responsive layouts audited from 320px through 1920px with no horizontal overflow.
- Food cards reserve image space with dimensions and aspect ratios to avoid layout shifts.
- Automated axe-core checks reported zero violations across eight routes at 320, 390, 768 and 1440px widths during the latest local verification.
- Automated checks do not replace manual keyboard, screen-reader or real-device testing.

## Image delivery

- Eleven dish photos are served as responsive WebP variants from `public/foods/`.
- Variants range from 300px to 1440px wide, with `srcSet` and `sizes` selecting an appropriate file.
- The hero image is eager and high priority. Below-the-fold card, comparison and Passport images are lazy-loaded.
- The dish preview image loads eagerly when the preview opens.
- All content images include dimensions to reserve layout space.
- Meaningful images use dish-specific alt text. Decorative Passport thumbnails use empty alt text because the adjacent link is labelled.
- A local inline SVG fallback replaces a failed image without shifting the layout or claiming that the photo is available.
- Original master photos are kept locally in `source-images/` and excluded from Git and the Vercel upload. They are not required to build or serve the app.

Measured in a local production preview with browser cache disabled:

- Initial home image transfer: about 80KB at 390px and 168KB at 1440px.
- Full home image transfer after scrolling: about 161KB at 390px and 193KB at 1440px.
- All optimised variants total about 1.70 MiB, compared with about 4.15 MiB of source originals.
- CSS transfer is about 22KB gzipped; JavaScript is about 83KB gzipped.
- Home, Explore and dish-detail pages measured zero layout shift at 390px and 1440px in the local production preview.

These are local measurements, not field data or Lighthouse scores.

> **Image rights note:** The food photographs are inherited seed assets. Their provenance and redistribution rights have not been verified. Replace them with owned or properly licensed photography before commercial use or public promotion.

## Local installation (Windows PowerShell)

Prerequisites: Node.js, Corepack and pnpm.

```powershell
git clone https://github.com/hariiharitha6/LocalBites.git
Set-Location LocalBites

corepack enable
pnpm install

$env:PORT="4173"
$env:BASE_PATH="/"

pnpm --filter @workspace/localbite run dev
```

Open `http://localhost:4173`.

The Vite configuration reads `PORT` and `BASE_PATH` when the config loads. Both variables are required for development and production builds.

## Development commands

Run from the repository root:

```powershell
$env:PORT="4173"
$env:BASE_PATH="/"

pnpm --filter @workspace/localbite run dev
```

Production preview after a build:

```powershell
$env:PORT="4173"
$env:BASE_PATH="/"

pnpm --filter @workspace/localbite run serve
```

## Typecheck and production build

```powershell
pnpm --filter @workspace/localbite run typecheck

$env:PORT="4173"
$env:BASE_PATH="/"

pnpm --filter @workspace/localbite run build
```

The production output is written to:

```text
artifacts/localbite/dist/public
```

## Deployment

The repository includes a minimal root-level `vercel.json` for Vercel.

| Setting | Value |
| --- | --- |
| Project root | Repository root |
| Install command | `pnpm install --frozen-lockfile` |
| Build command | `PORT=4173 BASE_PATH=/ pnpm --filter @workspace/localbite run build` |
| Output directory | `artifacts/localbite/dist/public` |
| SPA fallback | All paths rewrite to `/index.html` |

The build command supplies the two variables required by `vite.config.ts`. If the Vercel project overrides the build command or uses a different environment configuration, set these in Project Settings as well:

```text
PORT=4173
BASE_PATH=/
```

Deploy from the repository root. Do not point Vercel's Root Directory at `artifacts/localbite` while using this root-level configuration.

```powershell
pnpm dlx vercel
pnpm dlx vercel --prod
```

Replace the live-demo placeholder in this README after an approved deployment.

The SPA rewrite is required for direct navigation and refresh on `/explore`, `/food/:id`, `/compare`, `/journey`, `/preferences`, `/nearby` and `/about`.

## Known limitations

- The guide contains 11 seed dishes. Facts, ingredient notes and indicative prices are low-confidence and may be incomplete.
- Bottom-of-card prices are indicative ranges, not quotes from a venue.
- There is no live venue directory, map, distance calculation, opening-hours feed or review system.
- Nearby accepts an area or browser location but does not return nearby restaurants because no verified venue source is connected.
- There are no accounts, cloud sync or cross-device persistence.
- Correction reports are local drafts only; no moderation or delivery service exists.
- The photography is inherited material with unverified provenance and licensing. See the image rights note above.
- Full-resolution masters are kept locally and Git-ignored; a fresh clone contains only the served WebP variants.
- The Kerala sadya source image is only 300×180, so it can look soft on large high-density displays.
- Google Fonts is an external dependency. Offline use falls back to system fonts.
- There is no PWA, offline cache or service worker.
- Browser automation scripts used for local QA are not committed as a reusable test suite.
- The package includes scaffolded UI primitives that the current screens do not all use; unused files are not imported into the production bundle.

## Future enhancements

- Replace seed photography with original or properly licensed images.
- Connect a verified venue and source-data layer with confidence and review dates.
- Add server-backed accounts and optional cross-device sync.
- Add a checked-in Playwright or Vitest Browser test suite for routes and persisted state.
- Add a PWA shell and offline reading support.
- Add Malayalam/English interface options and pronunciation guidance.
- Add printable or shareable Food Passport summaries.
- Add AVIF output and an image CDN pipeline if traffic grows.

## License

MIT, as declared in the root `package.json`. Add a standalone `LICENSE` file if this repository will be distributed as a reusable template.
