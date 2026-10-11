# ROHIT QUEST — Master Build Prompt

> **Historical design context.** This is the original build brief, preserved for its design rationale. The application now exists, serves generated WebP assets, and uses an animated sprite sheet. Its starter-kit paths, single-pose player guidance, and visible-placeholder instructions are historical. Use the [README](README.md), [implementation guide](IMPLEMENTATION_GUIDE.md), and [repository guidelines](AGENTS.md) for current contributor instructions; current code and configuration determine operational behavior. The original brief follows unchanged.

Copy everything in this file into your coding LLM after placing the supplied assets in the project. This is an implementation specification, not a request for a static concept image.

---

You are a principal frontend engineer, experienced 2D browser game developer, and exceptional product designer. Build a **working, responsive personal portfolio website** named **ROHIT QUEST**. The website should feel like an **original cheerful 16-bit side-scrolling adventure game** while remaining genuinely useful to recruiters who want to evaluate a backend/full-stack engineer quickly.

## Mission and success criteria

Build a visually extraordinary portfolio with a playable desktop side-scrolling hero area, collectible elements, original project landmarks, and clean, accessible project case studies. The character must move, jump, interact with signposts/buildings, and trigger functional overlays. This is **not** a static illustration masquerading as a game.

At the same time, a recruiter must be able to reach Projects, Experience, GitHub, Contact, and a résumé in one click without playing. Include an obvious **Quick Portfolio / Skip Game** action and conventional navigation. Do not put critical information only inside a canvas.

## Technology

- Next.js App Router, TypeScript, React.
- pnpm as package manager.
- Tailwind CSS, with accessible DOM-based overlays and content components.
- Phaser 3 for the client-only playable canvas, its Arcade Physics, keyboard input, camera-follow, and interactive zones.
- Lucide React for non-game icons. Use a small amount of Motion/CSS animation outside Phaser only if necessary.
- Static typed data objects in `src/data/portfolio.ts` or equivalent; no backend, database, authentication, CMS, or API needed.
- Use dynamic import for the Phaser-containing client component. Never access `window`, `document`, or Phaser at server-render time.
- Use `next/font` or well-fallbacked web fonts: pixel display font for short headlines/HUD; modern sans-serif for paragraph text.
- Keep dependencies lean. Reuse existing workspace conventions if the repository already exists. Do not overwrite unrelated user work.

## Supplied original assets — USE THEM

Files have been placed in `public/assets/`:

1. `/assets/world-background.png` — 1672×941 pixel-art landscape without UI; use behind the scene, not as the collision layer.
2. `/assets/rohit-avatar.png` — 1179×1334 transparent single-character idle cutout. This is NOT an animation sprite sheet. Use a trimmed/appropriately scaled image as the Phaser player in the MVP; flip horizontally when moving left and add tasteful idle/run bob. Do not fake sprite-frame coordinates.
3. `/assets/clinzo-castle.png` — 1536×1024 transparent landmark opening the Clinzo360 case study.
4. `/assets/openforms-workshop.png` — 1402×1122 transparent landmark opening the OpenForms case study.

The images are reference-ready but larger than runtime sprites: size them sensibly and optimize/downscale for production if necessary. If transparent margins need trimming, do so without distorting subject proportions. Phaser collisions should use separately defined simple rectangles or zones, not image alpha boundaries. Do not add text onto the bitmap art; HTML text provides crisp accessible typography.

## Originality and visual direction

Be inspired by the joyful **era** of 1990s colorful platformers, but do not copy Nintendo characters, franchise names, recognisable tile maps, soundtracks, logos, or UI art. Give the project its own identity. The character is an original young Indian software engineer in a blue hoodie with a backpack.

Palette: sky `#79D3FF`, grass `#39BA68`, warm gold `#F8C84E`, earth `#A0704B`, deep navy `#101E39`, ivory `#F8FAFC`. Buttons are pixel-edged, with a chunky bottom shadow and press-down feedback. Large composition and whitespace, crisp outlines, no excessive gradients. Include gentle layered clouds and restrained parallax.

Typography: bold pixel font for HUD and short titles, readable clean sans-serif for case-study body. Avoid making every paragraph pixel-font text.

## Primary routes / information architecture

- `/` — game-flavoured hero, quick navigation, project previews, and accessible static content.
- `/projects/clinzo360` — detailed real engineering case study.
- `/projects/openforms` — case study marked in progress as appropriate.
- `/resume` may redirect to `/resume.pdf` only if an actual file is provided; otherwise display a clear placeholder/disabled state and TODO, never a broken link.
- On the home page, standard anchored sections: `#about`, `#projects`, `#skills`, `#experience`, `#contact`.

## Above-the-fold layout at 1440px desktop

1. Fixed/accessible navy header, approximately 68–76px tall. Original pixel avatar/logo + `ROHIT QUEST` left; `ABOUT`, `PROJECTS`, `SKILLS`, `EXPERIENCE`, `CONTACT`, `RESUME` right. The résumé CTA visually stands out.
2. A game HUD inside the hero: `WORLD 01`, three decorative stars, optional coin count, sound-toggle (muted by default), and `SKIP GAME`.
3. Scenic playable viewport occupying about 60–70vh (with sensible min/max sizes), with blue sky, mountains, grass platform layer built in Phaser, and the small hero character left of center. Camera follows character, but only after the first screen. Do not stretch the art in a way that distorts proportions.
4. Readable DOM overlay over hero: `HI, I'M ROHIT`, `BACKEND & FULL-STACK ENGINEER`, one concise value proposition, yellow `START EXPLORING`, secondary `QUICK PORTFOLIO`.
5. A controls hint below the viewport: `← → MOVE · SPACE JUMP · E INTERACT`. Hide/replace this on touchscreens.
6. Below the hero, two polished project preview cards for Clinzo360 and OpenForms. Cards are directly clickable, including when the game fails to load.
7. Further down, an elegant traditional portfolio view for accessibility and direct skimming.

## World and navigation

One horizontal Phaser scene of roughly 5–6 themed segments/checkpoints is sufficient; avoid complex game engines or level loading systems at MVP stage:

1. Welcome Meadows — about me signpost and tutorial.
2. Skill Forest — clickable floating badges for NestJS, TypeScript, PostgreSQL, Docker, AWS, Next.js.
3. Clinzo Castle — use supplied transparent castle; interaction triggers project overlay.
4. OpenForms Workshop — use supplied transparent workshop; interaction triggers project overlay.
5. Career Mountains — signpost opens professional experience timeline (placeholders rather than fabricated employers/dates).
6. Contact Kingdom — contact panel and résumé/GitHub/LinkedIn buttons.

Build terrain from crisp Phaser graphics/static platforms (grass-top, earth sides), with static collision geometry. Use the supplied backdrop as one scenic layer, plus generated simple clouds/trees/signposts from shapes or your own minimal art. Scale assets proportionally. There must be no lethal enemies, game-over screen, waiting puzzle, or forced grinding. The purpose is delightful navigation, not difficulty.

Keyboard controls: `A/D` or left/right arrows for walking; Space for a small jump; `E` or Enter to interact near a landmark; Escape to close overlay/pause. Arrow keys and Space must only prevent page scrolling while the game viewport is active/focused; normal page keyboard navigation must work elsewhere. Mouse users can directly click any landmark. Offer compact tap navigation on touch devices if game mode is enabled.

When within the interaction radius of a building or signpost, show a contextual prompt (e.g. `E — EXPLORE CLINZO360`). Activating it should dispatch a typed event/callback into React, pause game movement, and open an accessible DOM modal/panel. On close, restore focus sensibly and resume exactly where the player was standing.

## Core UI panels

### About Me

Copy: `Hi, I'm Rohit. I design and ship reliable software.`

Subtitle: `Backend-focused software engineer building production APIs, multi-tenant products, and cloud-deployed applications with NestJS, TypeScript, PostgreSQL, AWS, and Next.js.`

No invented years or hiring availability claims. Editable social/profile fields should be clear placeholders until user supplies them.

### Project: Clinzo360

Name: `Clinzo360`
Tagline: `Multi-tenant clinic management SaaS`
Description: `A platform for clinic teams to manage access, patient workflows, consultations, and operations.`
Verified or user-reported engineering topics that can be described without fabricating metrics: NestJS backend, PostgreSQL, role-based access control, team/membership and invitations, clinic settings, medicine catalogue, consultation and patient queue workflows, Next.js frontend, Docker/cloud deployment, GitHub Actions CI/CD, Sentry, Prometheus/Grafana. Where you need to distinguish current vs planned features, mark status accurately.
Case study sections: Problem, Role & Scope, Architecture, Security & Tenancy, Deployment & Observability, Technical Decisions, Screenshots, Links.
Do not add fake revenue, user counts, performance wins, HIPAA certification, or private patient information. Do not invent demo URLs.

### Project: OpenForms

Name: `OpenForms`
Tagline: `Form builder and response collection`
Status: `In progress` unless user confirms production release.
Description: `A full-stack project exploring how people create, publish, share and collect responses through forms.`
Stack: NestJS, TypeScript, PostgreSQL, Next.js/Tailwind as applicable. Do not falsely claim that analytics, team collaboration, conditional logic, or multi-tenancy are finished; list possible future features separately if referenced.
Case study: UX, Form Model, API Design, Validation, Responses, Architecture, Roadmap.

### Skills

Present clusters: Backend (NestJS, Node.js, TypeScript, Express.js, PHP); Data (PostgreSQL, TypeORM); Cloud & DevOps (AWS, Docker, CI/CD); Frontend (React, Next.js, Tailwind); Reliability (Sentry, Prometheus, Grafana). No inaccurate proficiency scores or percentage bars.

### Experience

Modern timeline with data placeholders for company, role, dates, outcome. Do not fabricate names, job titles, dates, numeric achievements, or years of experience.

### Contact

Friendly final scene and HTML buttons for Email, LinkedIn, GitHub, résumé. Use `TODO_ADD_EMAIL`, `TODO_ADD_LINKEDIN`, `TODO_ADD_GITHUB`, `TODO_ADD_RESUME` in one configuration file until real details are provided. Show a non-broken disabled state for missing links.

## Recruiter mode / quick portfolio

`QUICK PORTFOLIO` must immediately reveal or scroll to a conventional fast-loading HTML portfolio: introduction, featured projects, concise engineering highlights, professional experience, skills, and contact. The static content should exist in semantic HTML even when the game JavaScript is unavailable. Game and quick view should use one shared typed data source so descriptions never drift. No forced animation or delay.

## Project modal visual specification

Large accessible overlay on desktop (max-width ~1050px), scrollable internally on small screens, dark navy chrome with subtle pixel border. Header with project name, role, status badge, close button. Main area: screenshot placeholder gallery or supplied landmark art on one side; concise description, tech tags, bullets on the other. Tabs/sections for Overview, Architecture, Challenges. Footer CTAs `View Project` and `GitHub`, enabled only when links exist. Escape and overlay close buttons must work; implement focus trapping and focus return. Deep-link route to full case study.

## Responsive behavior

- Desktop ≥1024px: full playable game as hero, text overlay, direct nav, project cards.
- Tablet: shrink game viewport, still permit tapping a building; always show skip option.
- Mobile <768px: default to a curated vertically scrolling pixel-art portfolio with cards. An explicit `PLAY MINI GAME` can open a simplified optional game. Do not require a virtual joystick to navigate professional content.
- Honor `prefers-reduced-motion`; disable camera effects and decorative motion, retaining full information access. Mute sound by default and never autoplay music.

## UX polish and technical constraints

- Cursor, hover, press, and focus states must be unmistakable.
- Beautiful loading fallback showing useful HTML content while Phaser loads or fails.
- Use asset size optimization; no giant background image preloads on mobile quick mode.
- `image-rendering: pixelated` on suitable intentionally pixelated game sprites, but keep text antialiased/readable.
- Respect content width/contrast, avoid motion sickness, include skip links and alt text for informative images.
- SEO metadata with title, description, Open Graph image placeholder, and server-rendered accessible content.
- Production code: modular components, cleanup for Phaser scenes/listeners, no hydration errors, no console warnings, no broken routes, no placeholder dead buttons.
- Avoid loading a backend, extra game engine plugins, auth, database, contact form server, leaderboards, or needless dependencies.

## Suggested architecture (adapt if repository conventions differ)

```
src/
  app/
    page.tsx
    layout.tsx
    projects/[slug]/page.tsx
  components/
    game/QuestGame.tsx
    game/QuestScene.ts
    game/GameHUD.tsx
    portfolio/ProjectCard.tsx
    portfolio/ProjectDetail.tsx
    portfolio/QuickPortfolio.tsx
    layout/Navbar.tsx
  data/portfolio.ts
  lib/quest-types.ts
public/assets/
  world-background.png
  rohit-avatar.png
  clinzo-castle.png
  openforms-workshop.png
```

## Implementation order and handoff

Build it in small verifiable stages rather than dumping thousands of untested lines:

1. Scaffold Next.js app, fonts, palette, accessible HTML hero/nav/project cards, data model, and responsive quick portfolio. Make it build.
2. Add a client-only Phaser single-scene game with static collision platforms, player controls, camera follow, backdrop, and two supplied landmark images. Make character movement playable.
3. Wire keyboard/mouse proximity interactions to React project overlays. Add all world signposts and nav/checkpoint jumps.
4. Build proper case-study pages, mobile mode, reduced motion, and final visual polish.
5. Run `pnpm lint` and `pnpm build`; resolve errors. Explain what was implemented and any explicit TODOs. Add basic smoke tests if test tooling exists.

Do not ask vague design questions; make sensible decisions from this prompt. Clearly state assumptions. First inspect the repository, then implement **Stage 1 and Stage 2** in working code; show which files changed, how to run locally, and what to review before the next stage. Deliver actual source code rather than only advice or screenshots.
