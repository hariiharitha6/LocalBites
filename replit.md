# LocalBite

LocalBite is a mobile-first guide to Kerala food for first-time visitors. It helps people explore dishes and keep a private tasting journey; it is not an ordering app.

## Run & Operate

- Preview: use the managed `artifacts/localbite: web` workflow.
- Typecheck: `pnpm --filter @workspace/localbite run typecheck`
- Local food saves, tried states, notes, comparison choices, filters, preferences, and area are stored in browser localStorage.
- LocalBite does not require a database, account, API server, or environment secret.

## Stack

- React, TypeScript, Vite, and Wouter
- pnpm workspace package at `artifacts/localbite`
- Tailwind CSS utilities with the app's own responsive stylesheet
- No server-side data or authentication is used for this MVP.

## Where things live

## Where things live

- `artifacts/localbite/src/App.tsx` — routes and interactive screens.
- `artifacts/localbite/src/food-content.ts` — typed dish seed content and its source, confidence, price, freshness, allergen, venue, and local-context fields.
- `artifacts/localbite/src/index.css` — visual styling and responsive layouts.
- `artifacts/localbite/public/foods/` — reused food photos from the original archive.

## Architecture decisions

- Guest-first: discovery works without login; personal records remain on the device.
- Seed dish facts and indicative prices are explicitly unverified and marked low confidence.
- Unknown allergens and venue details stay unknown; the app does not fabricate venues, reviews, opening hours, or distances.
- Browser location is requested only after a user presses “Use my location”; users can instead enter an area manually.
- Correction reports are local drafts only; there is no moderation service or ordering/payment flow.

## Product

- Explore and search dishes, filter by category, price range, spice estimate, dietary starting point, and experience, and compare up to three dishes.
- Save foods, mark foods tried, add personal notes, and tune recommendation preferences.
- Nearby accepts a manually entered area or optional browser location but currently has no verified venue feed.
- Responsive pages: Discover, Explore, food details, Compare, Nearby, My journey, and Preferences.

## Gotchas

- Clearing browser storage removes this device's saved foods, notes, filters, preferences, comparisons, area, and report drafts.
- Never present seed diet tags or ingredient summaries as allergy, religious, or medical safety assurances; users should confirm with the venue.
- Do not add venue or price claims without a source and verification status.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
