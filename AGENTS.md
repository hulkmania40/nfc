# AGENTS.md

## Project

Hydra is a local-first hydration tracking Progressive Web App built with:

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Zustand
- date-fns
- Lucide React
- vite-plugin-pwa

The app is designed to feel premium and polished while keeping all persistence inside `localStorage` behind a repository layer so storage can later be replaced without rewriting UI components.

## Product Intent

Hydra should feel like a consumer app, not an admin panel.

Core UX goals:

- Fast tap-to-log hydration flow
- Pleasant but lightweight motion
- Offline-friendly behavior
- Clean onboarding for first-time setup
- Easy NFC tag management
- Beautiful dashboard and historical insights

## Current State

Implemented features currently in the app:

- Landing page with premium visual styling
- Dashboard with:
  - daily intake
  - progress ring
  - quick stats
  - recent drinks
  - weekly chart
  - hydration calendar
- NFC-style tap flow at `/tap/:tagId`
- Double-tap protection
- Undo toast after logging water
- Tag onboarding when no tags exist
- Settings page for:
  - daily goal
  - default glass amount
  - add tag
  - rename tag
  - delete tag
  - reset local data
- PWA manifest and offline support wiring
- Dedicated storage/repository layer over `localStorage`

## Architecture

### Routing

- `/` landing page
- `/dashboard` main app dashboard
- `/tap/:tagId` hydration confirmation flow
- `/settings` settings and tag management
- `/404` not found page

### State

Zustand stores are separated by concern:

- `src/stores/settings-store.ts`
- `src/stores/tag-store.ts`
- `src/stores/hydration-store.ts`

Keep stores focused and avoid merging unrelated state into a single global object.

### Persistence

Do not access `localStorage` directly from UI components.

Current storage path:

- UI components
- Zustand stores
- `hydrationRepository`
- `storage/local-storage.ts`
- browser storage

Relevant files:

- `src/services/hydration-repository.ts`
- `src/storage/local-storage.ts`

This layer should remain the only place that knows about storage keys and serialization details.

### Derived Data

Hydration analytics and date logic live in:

- `src/utils/hydration.ts`

Keep derived metrics there instead of duplicating logic inside pages or components.

## Design Direction

Hydra should preserve this visual language:

- soft cyan / water-blue accents
- light atmospheric backgrounds
- rounded glass-like cards
- spacious layout
- minimal, calm typography
- subtle premium depth

Avoid:

- heavy enterprise UI styling
- dense CRUD tables
- constant animation loops
- Material UI-like visual patterns

## Performance Notes

Recent work removed several always-on animation paths because they were causing visible lag.

Current guidance:

- Prefer static or one-shot motion over infinite animation
- Avoid wrapping frequently used primitives in `motion.*` unless necessary
- Avoid animating expensive properties like `filter`
- Keep dashboard rendering cheap; it is the hottest screen in the app
- Be cautious with animated lists, calendars, counters, and global page transitions

When adding motion back in:

- use it only where it improves clarity
- prefer opacity/transform
- keep durations short
- avoid animating dozens of elements at once

## Existing Issues / Follow-Up

These are the most likely next areas to improve:

1. Dashboard render cost
   The dashboard still computes several date-based metrics and calendar structures on render.

2. Date formatting overhead
   Repeated `date-fns` formatting inside render paths may be worth consolidating or memoizing further.

3. Landing/dashboard polish balance
   The visual quality is strong, but we should continue validating that polish does not reintroduce jank.

4. Encoding cleanup
   There are a few mojibake-like text artifacts in copy that should be cleaned up.

## Development Guardrails

When editing this app:

- Keep storage concerns out of components
- Keep UI reusable and modular
- Prefer small focused components over large pages
- Preserve the repository abstraction for future backend migration
- Do not introduce backend/auth dependencies
- Default to client-friendly rendering patterns; this is currently a Vite SPA
- Treat performance regressions as product bugs, not polish issues

## Near-Term Plan

### Phase 1: Stabilize Runtime

- Verify dashboard responsiveness on real device/browser profiles
- Clean up any remaining jank in tap flow and dashboard
- Remove any unnecessary rerenders in hot components
- Fix visible text encoding issues

### Phase 2: Improve Product Quality

- Refine empty states and success feedback
- Improve settings UX for tag editing
- Add better install/app-like affordances
- Tighten copy and consistency across pages

### Phase 3: Strengthen Analytics

- Add monthly trend cards
- Add clearer streak storytelling
- Add richer day detail views from calendar selections
- Add lightweight comparative insights without clutter

### Phase 4: PWA Maturity

- Improve icons and splash assets
- Validate install behavior across Android/iOS/Desktop
- Audit offline fallback behavior more thoroughly
- Confirm route handling works cleanly after install

## Future Plans

Potential future expansions, in recommended order:

1. Performance pass
   Profile the dashboard and memoize or restructure any expensive derived views.

2. Data portability
   Add export/import for local hydration history.

3. Better tag workflows
   Support richer tag metadata such as glass type, color, location, or icon.

4. Habit intelligence
   Surface preferred drink times, streak recovery prompts, and goal trends.

5. Supabase migration path
   Replace the repository implementation while keeping stores and UI stable.

6. Optional sync
   Add account-backed sync only if the product direction truly needs cross-device persistence.

## Suggested Next Tasks

Good next tasks for future agents:

- profile and optimize `DashboardPage`
- clean up text encoding/copy issues
- improve tap success flow without heavy animation
- refresh `README.md` so it documents the actual Hydra app instead of the starter template
- add basic test coverage around repository and hydration utility functions

## File Map

High-value files to read first:

- `src/App.tsx`
- `src/pages/dashboard-page.tsx`
- `src/pages/tap-page.tsx`
- `src/pages/settings-page.tsx`
- `src/services/hydration-repository.ts`
- `src/stores/hydration-store.ts`
- `src/stores/settings-store.ts`
- `src/stores/tag-store.ts`
- `src/utils/hydration.ts`

## Handoff Note

If performance complaints continue, start by profiling the dashboard screen before adding any new visual polish. The app’s main risk right now is not missing features; it is preserving the premium feel without making the runtime heavy.
