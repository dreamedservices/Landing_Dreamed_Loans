import { test, expect } from "@playwright/test";

test.describe("prefers-reduced-motion", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("el hero es visible de inmediato, sin animación pendiente", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const heading = page.getByRole("heading", { level: 1 });
    await expect(heading).toBeVisible();
    await expect(heading).toHaveCSS("opacity", "1");

    // Ningún elemento revelado por Reveal/DashboardCounters/FichaTimelineReveal
    // debe quedar con opacity 0 esperando una animación que con reduced motion no corre.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(300);
    const hiddenCount = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll<HTMLElement>("main *"));
      return all.filter((el) => getComputedStyle(el).opacity === "0").length;
    });
    expect(hiddenCount).toBe(0);
  });

  test("cambiar reduced motion en caliente no rompe la página", async ({ page }) => {
    await page.goto("/");
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.waitForTimeout(200);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  });
});

test.describe("WebGL no disponible", () => {
  test("la página funciona igual sin WebGL, sin errores de consola", async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (error) => consoleErrors.push(error.message));

    await page.addInitScript(() => {
      const original = HTMLCanvasElement.prototype.getContext;
      // @ts-expect-error -- simula un navegador sin soporte WebGL
      HTMLCanvasElement.prototype.getContext = function (type: string, ...args: unknown[]) {
        if (type === "webgl2" || type === "webgl") return null;
        return original.call(this, type, ...args);
      };
    });

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.getByRole("link", { name: "Probar gratis" }).first()).toBeVisible();

    // El Canvas 3D (WebGL) no debe montarse (detectQuality() vuelve "poster").
    // Scoped a su wrapper: HeroParticlesBackground es un <canvas> 2D aparte,
    // ajeno a WebGL, que sigue presente como fondo decorativo del Hero.
    await expect(page.locator('[data-testid="hero-3d-canvas"] canvas')).toHaveCount(0);

    const relevantErrors = consoleErrors.filter(
      (text) => !text.includes("Download the React DevTools"),
    );
    expect(relevantErrors).toEqual([]);
  });
});

test.describe("resize y scroll", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("resize durante el scroll no lanza errores", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(200);
    await page.setViewportSize({ width: 900, height: 700 });
    await page.waitForTimeout(200);
    await page.mouse.wheel(0, 1500);
    await page.waitForTimeout(200);

    expect(errors).toEqual([]);
  });
});

test.describe("pestaña en segundo plano", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("ocultar la pestaña no lanza errores", async ({ page, context }) => {
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));

    await page.goto("/");
    const other = await context.newPage();
    await other.goto("about:blank");
    await page.waitForTimeout(300);
    await other.close();

    expect(errors).toEqual([]);
  });
});
