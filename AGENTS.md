# Repository Guidelines

## Project Overview

`rohit-quest` is a personal portfolio built as a pixel-art side-scrolling "quest". The desktop hero is a playable Phaser 3 scene; every piece of portfolio content is also reachable as plain static HTML, so the site works with JavaScript disabled and on phones without the game.

Stack: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4, Phaser 3, Playwright. Package manager is pnpm; Node >= 22.

## Structure

- `src/app/`: routes — `page.tsx` (home), `projects/[slug]/page.tsx` (case studies), `resume/`, `not-found.tsx`, `layout.tsx`, `globals.css`.
- `src/components/game/`: the Phaser layer. `Hero.tsx` owns all game UI state, `QuestGame.tsx` boots Phaser, `QuestScene.ts` is the scene, `QuestPanel.tsx` is the checkpoint dialog, `GameErrorBoundary.tsx` falls back to static content.
- `src/components/portfolio/` and `src/components/layout/`: static, non-game UI.
- `src/data/portfolio.ts`: **all** user-facing copy, project data, and checkpoints. Change content here, not in components.
- `src/lib/quest-types.ts`: the React ↔ Phaser contract (`QuestHandle`, `QuestCallbacks`).
- `design/`: original full-size PNG artwork (design sources, not shipped).
- `public/assets/`: optimised WebP runtime assets, generated from `design/`.
- `tests/portfolio.spec.ts`: Playwright end-to-end suite.
- `scripts/prepare-assets.mjs`: regenerates `public/assets/*.webp` via sharp.

## Build, Test, and Development Commands

```bash
pnpm install
pnpm dev            # next dev on http://127.0.0.1:3000
pnpm build          # production build
pnpm start          # serve the production build
pnpm lint           # eslint, zero warnings tolerated
pnpm typecheck      # tsc --noEmit
pnpm format         # prettier --write .
pnpm format:check   # prettier --check .
pnpm test           # playwright; starts a dev server automatically
pnpm assets         # regenerate public/assets WebP from design/
```

`pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test` must all pass before a change is considered done. `TEST_PRODUCTION=1 pnpm test` runs the suite against `pnpm start` instead of the dev server.

Playwright uses Chromium and prefers a local Brave binary on macOS; override with `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.

## Coding Style & Naming Conventions

Prettier is the formatter — two-space indent, double quotes, semicolons, trailing commas. Do not hand-format; run `pnpm format`. ESLint extends `next/core-web-vitals` and `next/typescript`.

Components are PascalCase `.tsx` files; non-component modules are kebab-case `.ts`. Import through the `@/` alias (`@/data/portfolio`), not relative parent paths. Client components need an explicit `"use client"`.

## Content Rules

Nothing unverified ships as a live link or a factual claim. Unknown values use a `TODO_` prefix in `src/data/portfolio.ts`; `configuredLink()` refuses to render those as hrefs and a Playwright test asserts no `TODO_` URL is reachable. Keep it that way — never invent employers, dates, user counts, metrics, or compliance claims to fill a placeholder.

## Game Layer Notes

React owns all game state; `QuestScene` talks back only through `QuestCallbacks` and is driven through the `QuestHandle` returned by `onReady`. Phaser is loaded dynamically and never on mobile by default.

Two input gotchas are already worked around, so preserve them:

- Momentary actions (jump, interact) listen for `keydown-*` events rather than polling `JustDown`. Phaser clears a key's just-down flag on keyup, so a tap whose keydown and keyup land in the same frame is otherwise swallowed.
- `scene.restart()` on resize drops any held movement key, and Phaser emits `resize` even when dimensions are unchanged, so the handler compares dimensions before restarting.

Floating platforms must clear the player's head when walking underneath while staying inside the jump arc (apex = `velocity² / (2 × gravity)`). Moving them without checking both bounds will wedge the player against a platform edge.

## Testing Guidelines

Playwright specs live in `tests/` and are named for the behavior they assert. The suite covers the no-JavaScript path, direct route loads, responsive overflow, real Arcade physics, keyboard dialog access and focus restoration, mobile touch controls, asset-failure fallback, and reduced motion. Add a test alongside any behavior change; the scene exposes `data-player-x`, `data-player-y`, and `data-grounded` on the canvas for assertions.

## Commit & Pull Request Guidelines

Use short, imperative commit subjects, such as `Fix platform collision wedging the player`. Pull requests should describe the change, list validation performed, include screenshots for visible interface changes, and call out any check that could not be run.

## Security & Configuration

Keep credentials and local environment files out of version control. Provide placeholder configuration examples when external services are introduced. Project screenshots must contain no patient or otherwise private data.
