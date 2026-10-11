import { test, expect, type Locator } from "@playwright/test";

async function expectNoEditorialPlaceholders(scope: Locator) {
  await expect(scope).not.toContainText(
    /TODO[:_]|coming soon|check back soon|still (?:need|to be)|not yet available/i,
  );
  await expect(
    scope.locator(
      '[title*="TODO"], [aria-label*="TODO"], [alt*="TODO"], a[href*="TODO_"]',
    ),
  ).toHaveCount(0);
}

test("public content has no editorial placeholders with or without JavaScript", async ({
  browser,
  baseURL,
}) => {
  for (const javaScriptEnabled of [false, true]) {
    const context = await browser.newContext({
      baseURL,
      javaScriptEnabled,
      viewport: { width: javaScriptEnabled ? 390 : 1440, height: 900 },
    });
    const page = await context.newPage();
    for (const route of [
      "/",
      "/projects/clinzo360",
      "/projects/openforms",
      "/resume",
    ]) {
      await page.goto(route);
      await expectNoEditorialPlaceholders(page.locator("body"));
      await expect(page.locator('meta[content*="TODO"]')).toHaveCount(0);
      if (route.startsWith("/projects/")) {
        await expect(
          page.locator(
            '#screenshots, .screenshot-placeholder, a[href="#screenshots"]',
          ),
        ).toHaveCount(0);
        const links = page.locator("#project-links");
        await expect(links.getByRole("heading")).toHaveText("Project links");
        await expect(links.locator('[aria-disabled="true"]')).toHaveCount(2);
        await expect(links.getByRole("link")).toHaveCount(0);
        for (const anchor of await page.locator(".case-toc a").all()) {
          const href = await anchor.getAttribute("href");
          expect(href).toMatch(/^#/);
          await expect(page.locator(href!)).toHaveCount(1);
        }
        if (route === "/projects/clinzo360") {
          await page.screenshot({
            path: `test-results/content-${javaScriptEnabled ? "mobile" : "desktop"}.png`,
            fullPage: true,
          });
        }
      }
    }
    await context.close();
  }
});

test("portfolio and case studies work without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("ROHIT");
  await page
    .getByRole("link", { name: "Quick portfolio", exact: true })
    .click();
  await expect(page).toHaveURL(/#quick-portfolio$/);
  await page.locator(".project-card.clinzo360").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Clinzo360");
  await expect(
    page.getByRole("heading", { name: "Security & tenancy" }),
  ).toBeVisible();
  await context.close();
});

test("direct routes load and missing links cannot navigate to placeholders", async ({
  page,
}) => {
  for (const [route, title] of [
    ["/projects/clinzo360", "Clinzo360"],
    ["/projects/openforms", "OpenForms"],
    ["/resume", "Résumé"],
  ]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(title);
    await expect(page.locator('a[href*="TODO_"]')).toHaveCount(0);
  }
  await page.goto("/projects/not-a-project");
  await expect(
    page.getByRole("heading", { name: "A path yet to be built." }),
  ).toBeVisible();
});

test("configured contact details render as live links", async ({ page }) => {
  await page.goto("/#contact");
  const contact = page.locator(".contact-links").first();
  await expect(contact.getByRole("link", { name: "Email" })).toHaveAttribute(
    "href",
    "mailto:rohit@imrohit.dev",
  );
  await expect(contact.getByRole("link", { name: "GitHub" })).toHaveAttribute(
    "href",
    "https://github.com/rohitsonawane11",
  );
  await expect(contact.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/rohit-sonawane-b4679b43",
  );
  await expect(contact.getByRole("link", { name: "Résumé" })).toHaveAttribute(
    "href",
    "/rohit-sonawane-resume.pdf",
  );
  // Every contact route is configured now, so nothing should render disabled.
  await expect(contact.locator(".contact-link.unavailable")).toHaveCount(0);
});

test("the résumé PDF is actually served", async ({ page }) => {
  const response = await page.request.get("/rohit-sonawane-resume.pdf");
  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain("pdf");
  expect(Number(response.headers()["content-length"])).toBeGreaterThan(1000);
});

test("the journey lists every role with its company and dates", async ({
  page,
}) => {
  await page.goto("/#experience");
  const timeline = page.locator(".timeline");
  await expect(timeline.locator(".timeline-entry")).toHaveCount(5);
  for (const [title, meta] of [
    ["Senior Backend Engineer", "Shree Infosoft · Feb 2026 — Present"],
    ["Backend Engineer", "IceSpice Technologies · Aug 2023 — Jan 2026"],
    ["Backend Engineer", "Myzer · Dec 2022 — Aug 2023"],
    ["Developer Trainee", "FunctionUp · May 2022 — Dec 2022"],
    ["Associate", "Accenture · May 2019 — May 2022"],
  ]) {
    const entry = timeline.locator(".timeline-entry", { hasText: meta });
    await expect(entry.getByRole("heading", { name: title })).toBeVisible();
  }
  // The placeholder that stood in for this section must be gone.
  await expect(page.locator(".experience-section .todo")).toHaveCount(0);
});

test("responsive quick portfolio has no overflow and does not start Phaser", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  for (const width of [320, 390, 768, 1024, 1440]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator("canvas")).toHaveCount(0);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
  }
  await page.screenshot({ path: "test-results/desktop.png", fullPage: true });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({ path: "test-results/mobile.png", fullPage: true });
  expect(errors).toEqual([]);
});

test("Arcade player moves, jumps, lands, collects coins and stops when paused", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const startX = Number(await canvas.getAttribute("data-player-x"));
  const floorY = Number(await canvas.getAttribute("data-player-y"));
  await page.keyboard.down("ArrowRight");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(startX + 100);
  await page.keyboard.up("ArrowRight");
  await page.keyboard.press("Space");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-y")))
    .toBeLessThan(floorY - 30);
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await page.keyboard.down("d");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(505);
  await page.keyboard.up("d");
  await expect(page.locator(".coin-count")).not.toContainText("00");
  await expect(
    page.getByRole("button", { name: "Enable sound" }),
  ).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.locator(".pause-overlay")).toBeVisible();
  const pausedX = await canvas.getAttribute("data-player-x");
  await page.keyboard.down("ArrowRight");
  await page.waitForTimeout(250);
  await page.keyboard.up("ArrowRight");
  expect(await canvas.getAttribute("data-player-x")).toBe(pausedX);
  await page
    .locator(".pause-overlay")
    .getByRole("button", { name: "Resume adventure" })
    .click();
  await expect(page.locator(".pause-overlay")).toHaveCount(0);
  await page.screenshot({ path: "test-results/game.png" });
  expect(errors).toEqual([]);
});

test("checkpoints open keyboard-accessible panels, trap focus and restore position", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(page.locator("canvas")).toHaveAttribute("data-grounded", "true");
  await page
    .locator(".checkpoint-bar")
    .getByRole("button", { name: "Clinzo360", exact: true })
    .click();
  await expect(page.locator(".interaction-prompt")).toContainText("Clinzo360");
  const playerX = await page.locator("canvas").getAttribute("data-player-x");
  await page.keyboard.press("e");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expectNoEditorialPlaceholders(dialog);
  await expect(
    dialog.getByRole("heading", { name: "Clinzo360", exact: true }),
  ).toBeVisible();
  for (let i = 0; i < 9; i++) {
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate((element) =>
        element.contains(document.activeElement),
      ),
    ).toBe(true);
  }
  await dialog
    .getByRole("button", { name: "Architecture", exact: true })
    .click();
  await expect(
    dialog.getByRole("heading", { name: "Architecture" }),
  ).toBeVisible();
  await expectNoEditorialPlaceholders(dialog);
  await dialog.getByRole("button", { name: "Challenges", exact: true }).click();
  await expectNoEditorialPlaceholders(dialog);
  await expect(dialog.locator('[aria-disabled="true"]')).toHaveCount(2);
  await page.screenshot({ path: "test-results/project-panel.png" });
  await page.keyboard.press("Escape");
  await expect(dialog).toHaveCount(0);
  await expect(
    page.getByRole("region", { name: "Adventure controls" }),
  ).toBeFocused();
  expect(await page.locator("canvas").getAttribute("data-player-x")).toBe(
    playerX,
  );
  for (const checkpoint of ["Skills", "OpenForms", "Career", "Contact"]) {
    await page
      .locator(".checkpoint-bar")
      .getByRole("button", { name: checkpoint, exact: true })
      .click();
    await expect(page.locator(".interaction-prompt")).toContainText(checkpoint);
    await page.keyboard.press("Enter");
    await expect(dialog).toBeVisible();
    await expectNoEditorialPlaceholders(dialog);
    if (checkpoint === "OpenForms") {
      for (const name of ["Architecture", "Challenges"]) {
        await dialog.getByRole("button", { name, exact: true }).click();
        await expectNoEditorialPlaceholders(dialog);
      }
      await expect(dialog.locator('[aria-disabled="true"]')).toHaveCount(2);
    }
    await dialog.getByRole("button", { name: "Close panel" }).click();
    await expect(dialog).toHaveCount(0);
  }
});

test("mobile is a static portfolio first and optional touch movement works", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  const requested: string[] = [];
  page.on("request", (request) => requested.push(request.url()));
  await page.goto("/");
  await expect(page.locator("canvas")).toHaveCount(0);
  expect(requested.some((url) => url.endsWith("/world-background.webp"))).toBe(
    false,
  );
  await page.getByRole("button", { name: "Play mini game" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const startX = Number(await canvas.getAttribute("data-player-x"));
  const right = page.getByRole("button", { name: "right in game" });
  await right.scrollIntoViewIfNeeded();
  const bounds = (await right.boundingBox())!;
  await page.mouse.move(
    bounds.x + bounds.width / 2,
    bounds.y + bounds.height / 2,
  );
  await page.mouse.down();
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(startX + 45);
  await page.mouse.up();
  await expect(page.locator(".pause-overlay")).toHaveCount(0);
});

test("failed game assets fall back to usable project content", async ({
  page,
}) => {
  await page.route("**/assets/world-background.webp", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  // Next.js injects its own role="alert" route announcer, so scope to the game's alert.
  await expect(
    page.locator('[role="alert"]:not(#__next-route-announcer__)'),
  ).toContainText("The game couldn’t load");
  await expect(page.locator(".project-card")).toHaveCount(2);
  await page.locator(".project-card.openforms").click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("OpenForms");
});

test("reduced motion disables smooth scrolling and page keyboard scrolling remains available", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  expect(
    await page.evaluate(
      () => getComputedStyle(document.documentElement).scrollBehavior,
    ),
  ).toBe("auto");
  await page.keyboard.press("Space");
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(0);
});

test("reduced motion holds a still pose instead of looping the walk cycle", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await expect(canvas).toHaveAttribute("data-frame", "0");
  await page.keyboard.down("ArrowRight");
  // Moving, but the decorative run cycle stays parked on the standing frame.
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(300);
  await expect(canvas).toHaveAttribute("data-frame", "0");
  // The jump pose still plays: it carries information, it is not decoration.
  await page.keyboard.press("Space");
  await expect(canvas).toHaveAttribute("data-anim", "rise");
  await page.keyboard.up("ArrowRight");
});

test("player animates through idle, run, jump and landing states", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await expect(canvas).toHaveAttribute("data-anim", "idle");

  // The idle cycle advances on its own.
  const idleFrame = await canvas.getAttribute("data-frame");
  await expect
    .poll(async () => canvas.getAttribute("data-frame"))
    .not.toBe(idleFrame);

  await page.keyboard.down("ArrowRight");
  await expect(canvas).toHaveAttribute("data-anim", "run");
  const runFrames = new Set<string | null>();
  for (let i = 0; i < 14; i++) {
    runFrames.add(await canvas.getAttribute("data-frame"));
    await page.waitForTimeout(40);
  }
  // Every frame played must come from the run row, and the cycle must advance.
  expect(
    [...runFrames].every((frame) => ["4", "5", "6", "7"].includes(frame!)),
  ).toBe(true);
  expect(runFrames.size).toBeGreaterThan(1);

  // The landing pose only lasts ~130ms, which is too brief to poll for
  // reliably, so record every transition and assert the order afterwards.
  await page.evaluate(() => {
    const canvas = document.querySelector("canvas")!;
    const seen: string[] = [];
    (window as unknown as { __anims: string[] }).__anims = seen;
    new MutationObserver(() => {
      const anim = canvas.getAttribute("data-anim");
      if (anim && seen[seen.length - 1] !== anim) seen.push(anim);
    }).observe(canvas, { attributes: true, attributeFilter: ["data-anim"] });
  });
  await page.keyboard.press("Space");
  await expect(canvas).toHaveAttribute("data-anim", "rise");
  await page.keyboard.up("ArrowRight");
  await expect(canvas).toHaveAttribute("data-anim", "idle");
  const sequence = await page.evaluate(
    () => (window as unknown as { __anims: string[] }).__anims,
  );
  expect(sequence.join(" > ")).toContain("rise > fall > land");
});

test("the player walks under the first platform and can land on top of it", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Start exploring" }).click();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const floorY = Number(await canvas.getAttribute("data-player-y"));

  // The platform at x=670 must not wedge the player walking underneath it.
  await page.keyboard.down("ArrowRight");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")), {
      timeout: 8000,
    })
    .toBeGreaterThan(900);

  // ...and must still be reachable by jumping onto it.
  await page.reload();
  await page.getByRole("button", { name: "Start exploring" }).click();
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await page.keyboard.down("ArrowRight");
  await page.waitForFunction(
    (x) =>
      Number(document.querySelector("canvas")?.getAttribute("data-player-x")) >
      x,
    470,
    { polling: 10 },
  );
  await page.keyboard.press("Space");
  let highestStanding = floorY;
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(50);
    const y = Number(await canvas.getAttribute("data-player-y"));
    if (
      (await canvas.getAttribute("data-grounded")) === "true" &&
      y < highestStanding
    )
      highestStanding = y;
  }
  await page.keyboard.up("ArrowRight");
  expect(floorY - highestStanding).toBeGreaterThan(100);
});

test("confirmed content distinguishes prototypes and omits performance metrics", async ({
  page,
}) => {
  for (const route of [
    "/",
    "/projects/clinzo360",
    "/projects/openforms",
    "/resume",
  ]) {
    await page.goto(route);
    await expect(page.locator("main")).not.toContainText(
      /85%|100K|20s|3-4 minutes|6\+ years|3\+ years|Six years in/,
    );
  }
  await page.goto("/projects/clinzo360");
  await expect(page.locator("main")).toContainText("in-memory mock data");
  await expect(page.locator("main")).toContainText("In development");
  await page.goto("/projects/openforms");
  await expect(page.locator("main")).toContainText(
    "Submission persistence and response review are planned",
  );
  await expect(page.locator("main")).toContainText("In development");
});

test("phone pages fit narrow screens and navigation closes after selection", async ({
  page,
}) => {
  for (const width of [320, 390, 430, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of [
      "/",
      "/projects/clinzo360",
      "/projects/openforms",
      "/resume",
    ]) {
      await page.goto(route);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
  await page.setViewportSize({ width: 320, height: 640 });
  await page.goto("/");
  const menu = page.locator(".mobile-menu");
  await menu.locator("summary").click();
  await menu.getByRole("link", { name: "Projects" }).click();
  await expect(menu).not.toHaveAttribute("open", "");
  await menu.locator("summary").click();
  await page.keyboard.press("Escape");
  await expect(menu).not.toHaveAttribute("open", "");
  await expect(menu.locator("summary")).toBeFocused();
  await page.screenshot({
    path: "test-results/mobile-320.png",
    fullPage: true,
  });
});

test("mobile play supports multitouch, rotation, panels, and exit restoration", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  const start = page.getByRole("button", { name: "Play mini game" });
  await start.scrollIntoViewIfNeeded();
  const scroll = await page.evaluate(() => scrollY);
  await start.tap();
  const play = page.locator(".mobile-play");
  const canvas = page.locator("canvas");
  await expect(play).toHaveAttribute("aria-modal", "true");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const right = page.getByRole("button", { name: "right in game" });
  const jump = page.getByRole("button", { name: "jump in game" });
  const cdp = await context.newCDPSession(page);
  const center = async (control: Locator, id: number) => {
    const box = (await control.boundingBox())!;
    return { id, x: box.x + box.width / 2, y: box.y + box.height / 2 };
  };
  const movement = await center(right, 1);
  const jumping = await center(jump, 2);
  const x = Number(await canvas.getAttribute("data-player-x"));
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [movement],
  });
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(x + 50);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [movement, jumping],
  });
  await expect(canvas).toHaveAttribute("data-grounded", "false");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(580);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const position = Number(await canvas.getAttribute("data-player-x"));
  const coins = await page.locator(".coin-count").innerText();
  await page.screenshot({ path: "test-results/play-portrait.png" });
  await page.setViewportSize({ width: 844, height: 390 });
  await expect
    .poll(async () => Number(await canvas.getAttribute("width")))
    .toBeGreaterThan(780);
  await expect
    .poll(
      async () =>
        Number(await canvas.getAttribute("width")) -
        (await page
          .locator(".game-canvas")
          .evaluate((element) => element.clientWidth)),
    )
    .toBe(0);
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-y")))
    .toBeLessThan(470);
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await expect
    .poll(async () =>
      Math.abs(Number(await canvas.getAttribute("data-player-x")) - position),
    )
    .toBeLessThan(20);
  await expect(page.locator(".coin-count")).toHaveText(coins);
  for (const control of [
    right,
    jump,
    page.getByRole("button", { name: "Exit", exact: true }),
  ]) {
    const box = (await control.boundingBox())!;
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.y + box.height).toBeLessThanOrEqual(390);
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: "test-results/play-landscape.png" });
  await page.getByRole("button", { name: "Pause adventure" }).tap();
  await expect(right).toBeDisabled();
  await page
    .getByRole("button", { name: "Resume adventure", exact: true })
    .last()
    .tap();
  await page.getByRole("button", { name: "Checkpoints", exact: true }).tap();
  await page.getByRole("button", { name: "Clinzo360", exact: true }).tap();
  await page.getByRole("button", { name: "Explore", exact: true }).tap();
  const dialog = page.locator(".quest-dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toContainText("Solo project");
  await page.screenshot({ path: "test-results/play-dialog-landscape.png" });
  await dialog.getByRole("button", { name: "Close panel" }).tap();
  expect(await page.evaluate(() => document.body.style.overflow)).toBe(
    "hidden",
  );
  await page.getByRole("button", { name: "Exit", exact: true }).tap();
  await expect(canvas).toHaveCount(0);
  await expect(start).toBeFocused();
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  expect(
    await page.evaluate(
      () => document.querySelector<HTMLElement>("#quick-portfolio")!.inert,
    ),
  ).toBe(false);
  // Rotation changes page geometry; scroll restoration is checked separately below.
  await page.setViewportSize({ width: 390, height: 844 });
  await start.scrollIntoViewIfNeeded();
  const restartScroll = await page.evaluate(() => scrollY);
  await start.tap();
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await page.getByRole("button", { name: "Exit", exact: true }).tap();
  expect(
    Math.abs((await page.evaluate(() => scrollY)) - restartScroll),
  ).toBeLessThan(3);
  expect(scroll).toBeGreaterThanOrEqual(0);
  await context.close();
});

test("mobile failure exits play view and preserves static access without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.route("**/assets/world-background.webp", (route) => route.abort());
  await page.goto("/");
  await page.getByRole("button", { name: "Play mini game" }).click();
  await expect(page.locator(".game-error")).toBeVisible();
  await expect(page.locator(".mobile-play")).toHaveCount(0);
  expect(await page.evaluate(() => document.body.style.overflow)).not.toBe(
    "hidden",
  );
  await context.close();
  const staticContext = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 640 },
    javaScriptEnabled: false,
  });
  const staticPage = await staticContext.newPage();
  await staticPage.goto("/");
  await staticPage.locator(".mobile-menu summary").click();
  await staticPage
    .locator(".mobile-menu")
    .getByRole("link", { name: "Projects" })
    .click();
  await staticPage.locator(".project-card.clinzo360").click();
  await expect(staticPage.getByRole("heading", { level: 1 })).toHaveText(
    "Clinzo360",
  );
  await staticContext.close();
});

test("thumb pad slides between directions, cancels cleanly, and fits small phones", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    baseURL,
    viewport: { width: 320, height: 640 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  await page.getByRole("button", { name: "Play mini game" }).tap();
  const canvas = page.locator("canvas");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  const left = page.getByRole("button", { name: "left in game" });
  const right = page.getByRole("button", { name: "right in game" });
  const jump = page.getByRole("button", { name: "jump in game" });
  for (const control of [left, right, jump]) {
    const bounds = (await control.boundingBox())!;
    expect(bounds.width).toBeGreaterThanOrEqual(64);
    expect(bounds.height).toBeGreaterThanOrEqual(64);
    expect(bounds.x).toBeGreaterThanOrEqual(0);
    expect(bounds.x + bounds.width).toBeLessThanOrEqual(320);
    expect(bounds.y + bounds.height).toBeLessThanOrEqual(640);
  }
  const cdp = await context.newCDPSession(page);
  const point = async (control: Locator) => {
    const bounds = (await control.boundingBox())!;
    return {
      id: 1,
      x: bounds.x + bounds.width / 2,
      y: bounds.y + bounds.height / 2,
    };
  };
  const startX = Number(await canvas.getAttribute("data-player-x"));
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [await point(right)],
  });
  await expect(right).toHaveAttribute("data-active", "true");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeGreaterThan(startX + 65);
  const turnX = Number(await canvas.getAttribute("data-player-x"));
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchMove",
    touchPoints: [await point(left)],
  });
  await expect(left).toHaveAttribute("data-active", "true");
  await expect(right).toHaveAttribute("data-active", "false");
  await expect
    .poll(async () => Number(await canvas.getAttribute("data-player-x")))
    .toBeLessThan(turnX - 35);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchCancel",
    touchPoints: [],
  });
  await expect(left).toHaveAttribute("data-active", "false");
  const stoppedX = Number(await canvas.getAttribute("data-player-x"));
  await page.evaluate(async () => {
    for (let i = 0; i < 12; i++) await new Promise(requestAnimationFrame);
  });
  expect(
    Math.abs(Number(await canvas.getAttribute("data-player-x")) - stoppedX),
  ).toBeLessThan(10);
  await jump.tap();
  await expect(canvas).toHaveAttribute("data-grounded", "false");
  await expect(canvas).toHaveAttribute("data-grounded", "true");
  await page.screenshot({ path: "test-results/play-small-phone.png" });
  await context.close();
});
