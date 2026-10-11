# Rohit Quest — Implementation guide

This guide describes maintenance of the existing Next.js/Phaser application. Start with the [README](README.md) for prerequisites, installation, routes, commands, and browser setup, and follow [AGENTS.md](AGENTS.md) for repository rules. Current code and configuration determine operational behavior. [MASTER_PROMPT.md](MASTER_PROMPT.md) preserves historical design context; its starter-kit instructions are not the current workflow.

## Working on the application

1. Inspect the working tree before editing. Preserve unrelated changes, especially generated assets or sprite geometry being maintained in another task.
2. Update user-facing content in [src/data/portfolio.ts](src/data/portfolio.ts). Confirm factual claims and link destinations; retain `TODO_` values internally for unavailable links so `configuredLink()` keeps them disabled. Keep unfinished editorial requests in the [content audit plan](plans/02-verified-content.md).
3. Update routes in [src/app](src/app), static content in [src/components/portfolio](src/components/portfolio), and shared navigation in [src/components/layout](src/components/layout). Preserve plain HTML access to every piece of portfolio content, including direct project routes and the résumé.
4. For gameplay, keep UI state in [Hero.tsx](src/components/game/Hero.tsx), Phaser setup/cleanup in [QuestGame.tsx](src/components/game/QuestGame.tsx), and world behavior in [QuestScene.ts](src/components/game/QuestScene.ts). Use the existing [React–Phaser contract](src/lib/quest-types.ts); do not introduce a second UI state owner in the scene.
5. Keep Phaser dynamically loaded with server rendering disabled, and preserve mobile's static-first experience. Keep dialogs in accessible HTML through [QuestPanel.tsx](src/components/game/QuestPanel.tsx) and retain error fallback through the hero and [GameErrorBoundary.tsx](src/components/game/GameErrorBoundary.tsx).

## Asset workflow

Original PNG artwork lives in [design](design); the site serves optimized WebP files from [public/assets](public/assets). All sources and generated outputs are included in the repository, so an ordinary checkout needs no external starter kit.

| Source                          | Generated output                                                            |
| ------------------------------- | --------------------------------------------------------------------------- |
| `design/world-background.png`   | `public/assets/world-background.webp` and `public/assets/world-mobile.webp` |
| `design/rohit-avatar.png`       | `public/assets/rohit-avatar.webp`                                           |
| `design/clinzo-castle.png`      | `public/assets/clinzo-castle.webp`                                          |
| `design/openforms-workshop.png` | `public/assets/openforms-workshop.webp`                                     |
| `design/rohit-sprite-sheet.png` | `public/assets/rohit-sprite.webp` and `src/lib/player-sprite.ts`            |

After an intentional source-art or generator change, run from the repository root:

```bash
pnpm assets
git diff --stat
git diff -- src/lib/player-sprite.ts
```

[scripts/prepare-assets.mjs](scripts/prepare-assets.mjs) uses Sharp to trim non-background cutouts, resize images, and encode WebP. It produces a 720-pixel-wide mobile background and normalizes the sprite sheet into 16 frames, currently 66 × 99 pixels each. The avatar remains a separate single-pose illustration.

Review the images and geometry together, then verify idle, running, jumping, landing, reduced motion, and platform clearance in the game. Include intended source and generated changes together. Asset generation is not part of `pnpm build`. Do not run it over unrelated uncommitted asset work; use an isolated checkout when evaluating regeneration.

The generator emits compact JSON in the `frames` property, which can cause `pnpm format:check` to flag the generated TypeScript file. After intentional regeneration, format that output with `pnpm exec prettier --write src/lib/player-sprite.ts` and review the diff. Do not hand-edit its geometry or reformat another contributor's existing change without including that work in scope.

### Sprite and physics constraints

- The image-generated source sheet is not a uniform grid. The generator finds each pose using alpha bounds, filters stray specks, centers it horizontally, and aligns grounded poses in each row to a shared foot baseline. Preserve the jump poses' vertical relationships. Missing transparent gutters or oversized poses fail generation rather than silently producing bad frames.
- [src/lib/player-sprite.ts](src/lib/player-sprite.ts) is generated geometry consumed by the runtime. Change the source artwork or generator and regenerate it; never manually adjust its frame geometry.
- `PLAYER_BODY` in `QuestScene.ts` defines a fixed collision box in world units. Frame widths vary, so deriving the body from the current frame would change collisions during animation. Arcade `Body.setSize` applies sprite scale; the existing code divides dimensions by that scale.
- Floating platforms must clear the walking player's head while remaining reachable inside the jump arc. Check both bounds using jump apex `velocity² / (2 × gravity)` and verify actual landings in Playwright.
- Animations belong to Phaser's game-level manager. Preserve the `anims.exists()` guards in `registerAnimations()` because scene creation repeats after restart.
- Under reduced motion, idle/run cycles hold a standing frame, while jump poses still convey gameplay state.

### Input and resize constraints

Jump and interaction actions listen for `keydown-*` events. Preserve these listeners: polling `JustDown` can lose a tap when keydown and keyup occur within a single frame. Preserve the dimension comparison before resize-triggered `scene.restart()` too; Phaser may emit unchanged dimensions, and unnecessary restarts drop held movement keys.

## Validation workflow

Follow the [README testing instructions](README.md#browser-setup-and-testing) for Chromium installation, the macOS Brave preference, and `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. Run:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm test
```

Use `pnpm format` to format intended repository changes, but first consider existing local edits. For a documentation-only change, format only the affected files. `IMPLEMENTATION_GUIDE.md` and `MASTER_PROMPT.md` are excluded by [.prettierignore](.prettierignore); explicitly format them with `pnpm exec prettier --ignore-path /dev/null --write IMPLEMENTATION_GUIDE.md MASTER_PROMPT.md` on macOS/Linux when editing those documents. Review the diff to avoid unrelated changes to historical text.

With port 3000 free, validate the production server separately:

```bash
pnpm build
TEST_PRODUCTION=1 pnpm test
```

Do not count this as production validation if Playwright reused a running development server. `CI=1 TEST_PRODUCTION=1 pnpm test` disables reuse. Leave `TEST_PRODUCTION` unset for development tests.

Add behavior-focused tests in [tests/portfolio.spec.ts](tests/portfolio.spec.ts) when behavior changes. The canvas exposes `data-player-x`, `data-player-y`, and `data-grounded` for physics assertions. Review desktop/mobile overflow, keyboard focus, reduced motion, no-JavaScript content, fallback, direct routes, and résumé delivery. Documentation-only edits need formatting, link, and command checks rather than new runtime tests.

## Content and release follow-up

The current résumé is [public/rohit-sonawane-resume.pdf](public/rohit-sonawane-resume.pdf), configured through `profile.resume`. Contact details and employment text already exist; audit them rather than assuming they still need initial placeholders. Project claims require evidence, and future screenshots must use synthetic data without patient or other private information.

Execute [02 — Verified content](plans/02-verified-content.md) and [03 — Vercel release](plans/03-vercel-release.md) after the documentation work. Record the chosen production origin before configuring canonical metadata or sitemap URLs. Preserve the current pixel-art design and application stack while resolving launch requirements.
