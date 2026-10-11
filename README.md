# Rohit Quest

A personal engineering portfolio presented as a pixel-art, side-scrolling quest. Visitors can start a playable Phaser adventure or read the same portfolio through ordinary HTML navigation. Phones show the static portfolio first, with an optional game; portfolio content and direct routes also work with JavaScript disabled.

The application uses Next.js 16 (App Router and Turbopack), React 19, TypeScript, Tailwind CSS v4, and Phaser 3. Playwright tests the static and interactive paths.

## Setup

Use Node.js **22 or newer** and **pnpm 11.22.0**, as specified in [package.json](package.json). Install a current patch of your chosen Node release, then provision the pinned pnpm version if it is not already available:

```bash
npm install --global pnpm@11.22.0
node --version
pnpm --version
```

The pnpm version should print `11.22.0`. If you already manage pnpm through a package-manager shim, configure that tool to use the pinned version instead of installing a second copy. See [pnpm installation guidance](https://pnpm.io/installation) for platform-specific setup.

Clone this repository or obtain a full checkout, then enter its root directory, which contains `package.json`. No starter kit, backend service, or environment file is required for local development. Keep [pnpm-lock.yaml](pnpm-lock.yaml) and [pnpm-workspace.yaml](pnpm-workspace.yaml), including the native build permissions, with the checkout.

```bash
pnpm install --frozen-lockfile
pnpm dev
```

Open <http://127.0.0.1:3000>. Stop the server with Ctrl+C. The committed [runtime assets](public/assets) are ready to use; asset generation is only needed when maintaining artwork.

## Routes and architecture

| Route                           | Content                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------- |
| `/`                             | Hero/game and static About, Projects, Skills, Experience, and Contact sections. |
| `/projects/clinzo360`           | Clinzo360 case study.                                                           |
| `/projects/openforms`           | OpenForms case study.                                                           |
| `/resume`                       | Résumé page with a link to the configured PDF.                                  |
| `/rohit-sonawane-resume.pdf`    | Current committed résumé document.                                              |
| Unknown routes or project slugs | Missing-page UI.                                                                |

- [src/app](src/app) contains routes, shared layout, metadata, and global styles. [src/components/portfolio](src/components/portfolio) and [src/components/layout](src/components/layout) provide static content and navigation.
- [Hero.tsx](src/components/game/Hero.tsx) owns React game UI state and dynamically imports [QuestGame.tsx](src/components/game/QuestGame.tsx) with server rendering disabled when the visitor starts playing. `QuestGame` creates and destroys the Phaser instance.
- [QuestScene.ts](src/components/game/QuestScene.ts) handles Arcade physics, input, camera, checkpoints, and animations. It communicates through `QuestCallbacks` and the `QuestHandle` supplied to `onReady`, defined in [quest-types.ts](src/lib/quest-types.ts).
- [QuestPanel.tsx](src/components/game/QuestPanel.tsx) renders accessible HTML dialogs. [GameErrorBoundary.tsx](src/components/game/GameErrorBoundary.tsx) and the hero's error handling keep static content available when the game fails.
- [portfolio.ts](src/data/portfolio.ts) owns profile copy, links, projects, experience, skills, and checkpoints. Make content changes there. Unknown destinations retain a `TODO_` sentinel; `configuredLink()` keeps them from becoming navigable URLs. Existing copy is not evidence for a factual claim.

## Commands

Run commands from the repository root. [package.json](package.json) is the source of truth for scripts.

| Command                          | Purpose                                                                             |
| -------------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm install --frozen-lockfile` | Install the committed dependency versions without updating the lockfile.            |
| `pnpm dev`                       | Start Next.js development server on `127.0.0.1:3000`.                               |
| `pnpm build`                     | Create the production build in `.next`.                                             |
| `pnpm start`                     | Serve an existing production build on `127.0.0.1:3000`. Run `pnpm build` first.     |
| `pnpm lint`                      | Run ESLint; any warning fails the check.                                            |
| `pnpm typecheck`                 | Run `tsc --noEmit`.                                                                 |
| `pnpm format`                    | Run Prettier over the repository, respecting `.prettierignore`. Review the diff.    |
| `pnpm format:check`              | Check formatting without changing files.                                            |
| `pnpm test`                      | Run Playwright and start/reuse its local server.                                    |
| `pnpm assets`                    | Regenerate six runtime WebP images and the player geometry module from PNG sources. |

Asset generation is an explicit maintenance operation; `pnpm build` does not run it. See the [asset workflow](IMPLEMENTATION_GUIDE.md#asset-workflow) before regenerating files or replacing sprite artwork.

## Browser setup and testing

The suite uses Chromium with one worker. [playwright.config.ts](playwright.config.ts) chooses the browser in this order:

1. The executable supplied in `PLAYWRIGHT_CHROMIUM_EXECUTABLE`.
2. Installed Brave on macOS at `/Applications/Brave Browser.app/Contents/MacOS/Brave Browser`.
3. Playwright's bundled Chromium when neither of those applies.

Install the bundled browser if needed:

```bash
pnpm exec playwright install chromium
```

On Linux CI, `pnpm exec playwright install --with-deps chromium` also installs required system libraries and may need administrator privileges. See [Playwright browser setup](https://playwright.dev/docs/browsers). Repeat browser installation when a Playwright upgrade requires a new browser build. Installing Chromium does not override the macOS Brave preference.

To use a compatible installed browser, replace the example path with its actual executable path:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE="/absolute/path/to/browser" pnpm test
```

For development tests, leave `TEST_PRODUCTION` unset:

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm test
```

Playwright starts `pnpm dev` by default. Outside CI, it can reuse a server already responding on port 3000; verify that it serves this checkout. A nonempty `TEST_PRODUCTION` selects `pnpm start`, even if its value is `0`.

For production tests, first stop the development server and any other server using port 3000. On macOS, inspect listeners with `lsof -nP -iTCP:3000 -sTCP:LISTEN`, then stop the identified server through its owning terminal. A free port prevents accidental reuse of a development server.

```bash
pnpm build
TEST_PRODUCTION=1 pnpm test
```

Use `CI=1 TEST_PRODUCTION=1 pnpm test` as an additional guard: the current configuration disables server reuse when `CI` is set. Examples above use POSIX shell environment syntax; on Windows, set the same environment variables using your shell's syntax.

The [test suite](tests/portfolio.spec.ts) covers no-JavaScript pages, direct routes, configured links and résumé delivery, responsive layout, physics and sprite animations, keyboard dialogs/focus restoration, touch controls, asset-failure fallback, and reduced motion. Failure screenshots and retained traces are written under `test-results/`; inspect a trace with `pnpm exec playwright show-trace` followed by its actual ZIP path.

## Contributing and launch work

Read [AGENTS.md](AGENTS.md) for repository rules and the [implementation guide](IMPLEMENTATION_GUIDE.md) for maintenance details. Preserve unrelated working-tree changes, add tests for behavior changes, and run the required checks before considering a change complete. Keep credentials out of version control and use synthetic data for product screenshots.

[MASTER_PROMPT.md](MASTER_PROMPT.md) is historical design context. Its starter-kit paths and original implementation instructions are not current operating instructions; current code and configuration determine behavior.

Launch work is tracked in [01 — Documentation](plans/01-documentation.md), [02 — Verified content](plans/02-verified-content.md), and [03 — Vercel release](plans/03-vercel-release.md). Documentation completion does not certify content or a production deployment.
