# 03 — Production validation and Vercel release

Status: pending. All checks, deployment steps, and evidence fields below refer to future release work. Inspection and checks performed while writing these plans do not certify a release candidate. Execute after [01 — Contributor documentation](01-documentation.md) and [02 — Verified content](02-verified-content.md).

## Objective

Validate the existing Next.js portfolio locally and in Preview before the public Production release. Preserve the pixel-art design and Next.js/Phaser stack, record deployment evidence, and prepare a usable rollback procedure.

## Current findings

- [package.json](../package.json) pins `pnpm@11.22.0`, requires Node >= 22, and defines all local checks below.
- [next.config.ts](../next.config.ts) sets `agentRules: false` and `devIndicators: false`; it does not configure a static export. Use the existing Next.js deployment model.
- [playwright.config.ts](../playwright.config.ts) targets `http://127.0.0.1:3000`, starts `pnpm dev` or `pnpm start`, and reuses an existing server when `CI` is unset. Its suite is not configured to target a remote Preview URL.
- [tests/portfolio.spec.ts](../tests/portfolio.spec.ts) contains coverage for no-JavaScript access, routes, contact links, PDF delivery, experience, responsive layout, game physics, dialogs/focus, touch controls, fallback, and reduced motion. Test presence does not establish a pass.
- [layout.tsx](../src/app/layout.tsx) contains basic metadata but no production `metadataBase` or canonical URL. There is no sitemap route in `src/app`.
- Vercel account/team, project, repository connection, production branch, hosting URL, and any custom domain are unconfirmed. The contact email does not establish ownership or selection of a website domain.

## Ordered task checklist

### 1. Establish the release candidate

- [ ] Complete plans 01 and 02; select and record the intended commit and any remaining working-tree changes. Preserve unrelated local work, including the existing sprite-geometry change, and make the deployed source explicit.
- [ ] Record Node/pnpm versions and browser executable. Install dependencies from the lockfile and configure Chromium as documented in plan 01.
- [ ] Run each check below, capture its actual exit result and log reference, and resolve failures within the intended release scope. Do not mark skipped or blocked checks passed.

```bash
pnpm install --frozen-lockfile
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
pnpm test
```

- [ ] After development testing, ensure port 3000 is free. On macOS, inspect listeners with `lsof -nP -iTCP:3000 -sTCP:LISTEN`; identify and stop the appropriate server through its owning terminal. Do not terminate an unidentified process.
- [ ] With no listener on port 3000, rebuild if the candidate changed and run the production suite below. Confirm Playwright starts `pnpm start` against the intended build. Do not accept a result obtained by reusing a development server. As an additional guard, `CI=1 TEST_PRODUCTION=1 pnpm test` disables reuse in the current configuration.

```bash
pnpm build
TEST_PRODUCTION=1 pnpm test
```

### 2. Review the built site

- [ ] Review desktop and narrow mobile layouts for overflow, legible text, image loading, static-first mobile behavior, and optional touch controls.
- [ ] Exercise keyboard navigation, skip links, checkpoint dialogs, focus trapping/restoration, Escape behavior, and page scrolling outside the game. Review reduced motion and the single standing idle/run pose.
- [ ] Review JavaScript-disabled content, blocked game assets/error fallback, direct loads and refreshes of `/projects/clinzo360` and `/projects/openforms`, and all home section anchors.
- [ ] Check `/resume`, `/rohit-sonawane-resume.pdf`, an unknown project slug, and an unknown top-level route. Verify valid PDF content and usable missing-page navigation/status behavior.
- [ ] Recheck contact links, disabled project actions, absence of editorial TODOs, browser console errors, and failed network requests. Save desktop/mobile screenshots containing no private data and record issues and resolutions.

### 3. Configure Vercel and the production URL

- [ ] Record the account/team, project name, connected repository, release owner, production branch, and access needed to deploy or roll back. These are deployment prerequisites, not blockers to writing this plan.
- [ ] Set the project root to the directory containing this `package.json`; use the Next.js framework preset and existing configuration. Use a supported Node version satisfying `>=22`, the pinned pnpm version and committed lockfile, `pnpm install --frozen-lockfile`, and `pnpm build`. Retain the framework's default output handling; do not substitute an `out/` export or a persistent `pnpm start` process. Confirm effective settings and tool versions in build logs.
- [ ] Review any required environment variables without committing credentials. Do not invent backend services or add deployment dependencies for this portfolio.
- [ ] Record the chosen HTTPS production origin, whether a Vercel hostname or a confirmed custom domain. Only then implement canonical metadata/`metadataBase`, appropriate Open Graph URLs, and a sitemap using that exact origin. Do not infer a domain from `rohit@imrohit.dev`. Validate generated URLs and rerun affected checks before deployment.

### 4. Validate Preview, then release

- [ ] Follow [Vercel's environment workflow](https://vercel.com/docs/deployments/environments). Verify the deployment's actual environment. Current guidance says a new project's first deployment is Production even from a non-production branch; resolve bootstrap exposure/protection before deploying. Do not count that initial deployment as Preview approval. Keep the public launch gated on a subsequent validated Preview, and use staged production/manual promotion when appropriate.
- [ ] Create a Preview for the intended candidate; record its immutable URL, deployment ID, commit, environment, build logs, and access/protection settings. Repeat the built-site review against that URL. The existing local Playwright command does not validate remote hosting; use explicit browser smoke checks and record their results.
- [ ] After Preview passes, release the same reviewed source through the selected Production workflow. Record any build/configuration differences and validate them before promotion. Record the final deployment ID and assigned production URL.
- [ ] Smoke-test the production origin: home and assets, both direct case-study routes, résumé page/PDF, contact links, keyboard/mobile access, game/fallback, reduced motion, no-JavaScript content, missing routes, and canonical/sitemap URLs. Check HTTPS, intended domain routing, console/network errors, and that public access works without a reviewer login.
- [ ] Save results and screenshots alongside build logs and the candidate/deployment identifiers. A successful deployment build alone does not complete release validation.

### 5. Prepare rollback and recovery

- [ ] Before release, record the last successful eligible Production deployment's ID, URL, commit, domains, and smoke-check evidence when one exists. Verify access and plan restrictions using [Vercel's rollback guidance](https://vercel.com/docs/instant-rollback). Eligibility requires prior assignment to a production domain; an unpromoted Preview is not a rollback target. Hobby is limited to the previous deployment.
- [ ] For a failed release, open the project's Deployments view, select the recorded eligible deployment's Instant Rollback action, verify the affected domains, and confirm. Record the rollback event and repeat production smoke checks. Rollback changes the deployment serving traffic; it does not rebuild it.
- [ ] After rollback, review disabled automatic production-domain assignment. Promote a verified corrective deployment through the documented undo/restore workflow before resuming normal releases.
- [ ] On a first release with no eligible predecessor, record “none — first release” rather than inventing a target. Document an owner-approved corrective deployment or temporary traffic removal procedure and establish a known-good target after successful validation.

## Dependencies

Plans 01 and 02, a reproducible candidate, installed dependencies/browser, free port 3000 for production testing, Vercel access, and a confirmed production origin are prerequisites for their respective execution steps. Custom domains require verified control and routing configuration. None of these external prerequisites blocks creation of these planning documents.

## Release evidence record

Fill this in during execution; every field is pending now.

| Evidence                                                         | Result or reference      |
| ---------------------------------------------------------------- | ------------------------ |
| Candidate commit and working-tree disposition                    | Pending                  |
| Node, pnpm, browser versions                                     | Pending                  |
| Lint / typecheck / formatting                                    | Pending for each command |
| Production build                                                 | Pending                  |
| Development Playwright                                           | Pending                  |
| Port 3000 check and production Playwright                        | Pending                  |
| Desktop/mobile/accessibility/fallback review                     | Pending                  |
| Content audit and résumé confirmation                            | Pending                  |
| Vercel team/project/branch/settings                              | Pending                  |
| Chosen production origin and canonical/sitemap validation        | Pending                  |
| Preview URL / ID / commit / logs / smoke checks                  | Pending                  |
| Production URL / ID / commit / logs / smoke checks               | Pending                  |
| Screenshots, reviewer, date, unresolved issues                   | Pending                  |
| Eligible rollback target and operator, or first-release recovery | Pending                  |

## Acceptance criteria

- [ ] All required local checks have recorded passing results for the candidate, including genuine production-server Playwright results. Failures, blocked checks, and omissions remain explicit.
- [ ] Preview and Production reviews have recorded results and deployment evidence tied to the reviewed source.
- [ ] Production pages, assets, direct routes, résumé delivery, canonical metadata, and sitemap work at the chosen origin.
- [ ] Desktop/mobile, keyboard, reduced motion, no-JavaScript access, game fallback, and missing-page behavior are verified.
- [ ] Rollback instructions identify an eligible previous successful deployment when one exists, or explicitly document first-release recovery.
