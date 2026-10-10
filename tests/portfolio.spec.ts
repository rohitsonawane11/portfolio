import { test, expect } from "@playwright/test";

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
    ["/resume", "Résumé coming soon."],
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
