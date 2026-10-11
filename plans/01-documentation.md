# 01 — Contributor documentation

Status: implemented. Contributor documentation is in place; validation results and environment limitations are recorded below. Continue with [02 — Verified content](02-verified-content.md) and [03 — Vercel release](03-vercel-release.md).

## Objective

Make the existing portfolio maintainable from a fresh checkout without the original starter kit. Preserve the pixel-art design, Next.js/React/Phaser stack, and [AGENTS.md](../AGENTS.md) unchanged.

## Findings at the start of this task

- There is no root README. [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) still instructs contributors to create an application and copy runtime PNG files from a kit.
- [MASTER_PROMPT.md](../MASTER_PROMPT.md) describes the original design and build stages. Its PNG paths, single-pose player guidance, and placeholder-content instructions do not describe the current application.
- [package.json](../package.json) requires Node >= 22 and pins `pnpm@11.22.0`; [pnpm-lock.yaml](../pnpm-lock.yaml) is committed.
- The App Router pages live in [src/app](../src/app). React owns game UI state in [Hero.tsx](../src/components/game/Hero.tsx); [QuestGame.tsx](../src/components/game/QuestGame.tsx) loads Phaser, and [QuestScene.ts](../src/components/game/QuestScene.ts) implements gameplay through the [typed contract](../src/lib/quest-types.ts). Static portfolio content remains accessible without gameplay or JavaScript.
- [prepare-assets.mjs](../scripts/prepare-assets.mjs) converts PNG sources in [design](../design) to WebP files in [public/assets](../public/assets), including a mobile background and normalized animated sprite sheet. It also generates [player-sprite.ts](../src/lib/player-sprite.ts).
- [playwright.config.ts](../playwright.config.ts) uses Chromium, prefers installed Brave on macOS, and accepts `PLAYWRIGHT_CHROMIUM_EXECUTABLE`. It starts the development server unless `TEST_PRODUCTION` is set, and can reuse an existing server outside CI.
- The generated sprite module has an existing uncommitted change. Preserve it; do not regenerate assets or run a repository-wide formatter over it while preparing these documents.

## Ordered task checklist

1. [x] Create a root `README.md` describing the quest portfolio, static HTML access, responsive behavior, architecture, route map, and content ownership in [portfolio.ts](../src/data/portfolio.ts). Link the contributor guide and repository guidelines.
2. [x] Document Node >= 22, provisioning the exact pinned pnpm version, and confirming `node --version` and `pnpm --version`. Start from a checkout containing the lockfile and design assets; use `pnpm install --frozen-lockfile`, then `pnpm dev` and `http://127.0.0.1:3000`.
3. [x] Include the script reference below, checked against `package.json`. Explain that `pnpm start` needs a successful build and that asset generation is an explicit maintenance step, not part of `build`.
4. [x] Replace starter-kit instructions in `IMPLEMENTATION_GUIDE.md` with guidance for the existing application. Document PNG-to-WebP generation with `pnpm assets`, all generated outputs, and inspection of the resulting diff. Preserve per-pose alpha bounds, foot alignment, fixed world-space collision dimensions, and animation registration/reduced-motion constraints described in `AGENTS.md`. Never hand-edit generated sprite geometry.
5. [x] Label `MASTER_PROMPT.md` as historical design context in its introduction and linked documentation. Preserve its design history while directing operational questions to current code, configuration, README, and the updated guide.
6. [x] Document browser setup: use installed Brave on macOS when available, or install bundled Chromium with `pnpm exec playwright install chromium`. Explain how to supply an installed compatible browser with `PLAYWRIGHT_CHROMIUM_EXECUTABLE="/absolute/path/to/browser" pnpm test`; the path is a user-supplied value. Note that Linux CI may require Playwright system dependencies.
7. [x] Explain development testing with `pnpm test` and production testing with `pnpm build` followed by `TEST_PRODUCTION=1 pnpm test`. Leave `TEST_PRODUCTION` unset for development tests. Free port 3000 before production testing so reuse cannot silently select a development server; see [release validation](03-vercel-release.md).
8. [x] Walk through setup in a clean checkout, verify relative links and paths, format only intended documentation, and record command outcomes. Check the diff to ensure `AGENTS.md` and unrelated local changes remain untouched.

## Script reference to document

| Command             | Current purpose                                                       |
| ------------------- | --------------------------------------------------------------------- |
| `pnpm install`      | Install dependencies; use `--frozen-lockfile` for reproducible setup. |
| `pnpm dev`          | Run Next.js development server on `127.0.0.1:3000`.                   |
| `pnpm build`        | Create the Next.js production build.                                  |
| `pnpm start`        | Serve that build on `127.0.0.1:3000`.                                 |
| `pnpm lint`         | Run ESLint with zero warnings tolerated.                              |
| `pnpm typecheck`    | Run TypeScript without emitting output.                               |
| `pnpm format`       | Format the repository with Prettier; review unrelated changes.        |
| `pnpm format:check` | Check formatting without writing files.                               |
| `pnpm test`         | Run the Playwright suite and manage its local server.                 |
| `pnpm assets`       | Regenerate runtime WebP assets and sprite geometry from PNG sources.  |

## Dependencies

Access to the checkout, Node and the pinned pnpm version, dependency installation, and a compatible Chromium executable are needed to verify setup. No Vercel account or domain is needed. Consult current scripts/configuration when historical documentation conflicts with implementation.

## Acceptance criteria

- [x] A contributor can install, develop, regenerate assets, build, and test without the original starter kit.
- [x] Every documented script agrees with `package.json`; relative links resolve and referenced existing paths exist. Newly proposed files are clearly identified until created.
- [x] Development and production Playwright instructions explain browser selection and server reuse.
- [x] Historical design instructions are clearly distinguished from current operational guidance.
- [x] `AGENTS.md`, runtime behavior, dependencies, and the pre-existing sprite change are preserved.

## Implementation and validation record

Implemented on 2026-10-11:

- Added the [README](../README.md) with requirements, exact pnpm provisioning, setup, routes, architecture, scripts, browser selection, and development/production testing.
- Replaced starter-kit instructions in the [implementation guide](../IMPLEMENTATION_GUIDE.md) with the current maintenance and PNG-to-WebP workflow, including all generated outputs and sprite/input constraints.
- Added a historical-context notice to [MASTER_PROMPT.md](../MASTER_PROMPT.md), preserving the original brief's content.
- Checked all nine package scripts and 73 local links/anchors across the contributor documents and this plan, plus current inline source/asset paths. Explicit Prettier checks passed for the three contributor documents and this plan; the guide and master prompt were included despite their existing ignore rules.
- Main checkout: `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test` passed; Playwright reported 14 passing tests. The development suite used the existing local server.
- Main checkout: `pnpm format:check` still fails only on the pre-existing `src/lib/player-sprite.ts` formatting change. It was deliberately preserved. Byte checks confirmed both that file and `AGENTS.md` remained unchanged by this task.
- Fresh-source walkthrough used a temporary `git archive HEAD` export with no existing dependencies or build output, followed by the new documentation. Node was `v24.19.0` and pnpm was `11.22.0`. `pnpm install --frozen-lockfile` succeeded using cached packages; this did not test a cold network download or reinstall the already-available pnpm executable.
- In that isolated copy, `pnpm assets` succeeded and all six regenerated WebP files matched the committed assets byte-for-byte. Formatting the generated module with the documented targeted Prettier command succeeded. No assets were regenerated in the main working tree.
- The isolated development server served `/`, both project routes, `/resume`, and the PDF with HTTP 200; the PDF had a valid `%PDF-` header. Port 3101 was used because existing servers occupied port 3000, and those servers were left untouched.
- The isolated production build passed after retrying outside the sandbox; the sandboxed attempt stalled during compilation and was interrupted. This was an environment limitation, not a source change.
- Isolated production Playwright: `CI=1 TEST_PRODUCTION=1 pnpm test` passed all 14 tests. Only the temporary copy's Playwright port and server commands were adjusted to port 3101; server reuse was disabled, and logs confirmed `next start`. A sandbox dependency-restore attempt encountered blocked registry access; retrying outside the sandbox restored cached dependencies and completed the suite. Browser tests used the installed macOS Brave executable; bundled Chromium installation and Linux system-dependency installation were documented but not exercised here.

Plans 02 and 03 remain pending. These checks validate the documentation workflow, not factual portfolio content or a production deployment.
