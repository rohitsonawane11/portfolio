# ROHIT QUEST — How to Build with a Coding LLM

## What this kit contains

- `MASTER_PROMPT.md`: complete project specification to give to a coding LLM.
- `public/assets/world-background.png`: pixel-art scenic background (no gameplay collisions).
- `public/assets/rohit-avatar.png`: original character illustration, transparent, single idle pose — **not a running/jumping sprite sheet**.
- `public/assets/clinzo-castle.png`: original landmark for Clinzo360, transparent.
- `public/assets/openforms-workshop.png`: original landmark for OpenForms, transparent.

Artwork is original image-generated pixel-art illustration. It is concept-quality and sufficiently useful for an MVP, but not a production-grade tile atlas or multi-frame animation set. Avoid using copyrighted franchise artwork and music.

## Step 1 — Create your Next.js project

If you do not already have a portfolio repository:

```bash
pnpm create next-app@latest rohit-quest --ts --tailwind --eslint --app --src-dir
cd rohit-quest
```

## Step 2 — Place assets

Copy all four files from this kit's `public/assets/` folder into your Next.js project's `public/assets/` folder. Keep the filenames unchanged. `MASTER_PROMPT.md` expects those exact paths.

## Step 3 — Give the coding LLM context

Open the project folder in your coding agent (Codex, Claude Code, Cursor, etc.). Attach or paste the entire `MASTER_PROMPT.md`. Tell it you have copied the image assets into `public/assets` and ask it to implement Stage 1 and Stage 2 first. If the agent can read local files, point it at `MASTER_PROMPT.md` instead of pasting.

## Step 4 — Test the first version

```bash
pnpm install
pnpm dev
```

Open the printed local URL and verify the checklist below. Also run:

```bash
pnpm lint
pnpm build
```

## Step 5 — Iterative prompts

### After basic visuals work

> Implement the Phaser interaction layer from MASTER_PROMPT.md. Use real Arcade Physics movement, jump collisions, proximity prompts, E/Enter interactions, clickable buildings, and accessible React project overlays. Preserve all existing responsive design. Run lint and build.

### After interaction works

> Build the detailed Clinzo360 and OpenForms case-study routes. Use only verified product features and separate shipped work from work in progress. Keep all text in data/portfolio.ts and add visible TODO placeholders for missing links, dates, screenshots and metrics. Run lint and build.

### After desktop works

> Perfect mobile and accessibility: default quick portfolio on phones, optional game, keyboard focus management, reduced motion, sound muted by default, fast static fallback, strong SEO and responsive layouts. Test touch, keyboard and small viewport. Run lint and build.

### Before publishing

> Audit the whole portfolio as a recruiter and QA engineer. Find broken navigation, fake claims, placeholder links, keyboard traps, overflow, huge image downloads and hydration errors. Fix problems without changing the visual concept. Summarize unresolved TODOs.

## Quality checklist

- [ ] Website immediately explains who Rohit is and what engineering work he does.
- [ ] `Start Adventure` controls a real moving character.
- [ ] `Quick Portfolio` works without requiring gameplay.
- [ ] Castle and workshop are interactive by pointer and keyboard.
- [ ] Project details show accurate technologies and status.
- [ ] Contact, GitHub and résumé links point somewhere real, or are visibly disabled.
- [ ] Mobile mode is usable without a virtual joystick.
- [ ] Sound is off initially, and motion preferences are respected.
- [ ] Direct project URLs load and contain readable text.
- [ ] No fake employment, user counts, medical compliance claims or metrics.
- [ ] `pnpm lint` and `pnpm build` pass.

## Asset tuning notes

The image-generated PNGs are relatively large. For production, trim transparent margins and export optimised copies at appropriate display sizes. Keep the supplied originals as design sources. For proper animated walking and jumping, commission/draw a consistent sprite sheet with exact equal-sized frames; do not assume `rohit-avatar.png` already has frames. Keep separate hitboxes and collision rectangles in Phaser.

## Content you still need to provide

1. Your preferred public contact email and GitHub/LinkedIn URLs.
2. A current résumé PDF.
3. Your actual employer history, titles, and dates.
4. Clinzo360 product screenshots that contain no patient/private data.
5. OpenForms screenshots and links, once the project is sufficiently complete.

## Practical scope

Don't let game polish hold up the portfolio launch. Stage 1 can be shipped as an attractive regular portfolio with original pixel artwork, while Stage 2 makes the desktop hero genuinely playable.

