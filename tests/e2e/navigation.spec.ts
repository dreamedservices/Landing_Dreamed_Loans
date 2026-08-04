import { test, expect } from "@playwright/test";

test.describe("navegación de escritorio", () => {
  test("los anclajes del header apuntan a las secciones reales", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const header = page.locator("header");
    await expect(header.getByRole("link", { name: "Producto" })).toHaveAttribute(
      "href",
      "#producto",
    );
    await expect(header.getByRole("link", { name: "Funciones" })).toHaveAttribute(
      "href",
      "#funciones",
    );
    await expect(header.getByRole("link", { name: "Cómo funciona" })).toHaveAttribute(
      "href",
      "#como-funciona",
    );
    await expect(header.getByRole("link", { name: "Preguntas" })).toHaveAttribute(
      "href",
      "#preguntas",
    );

    await expect(page.locator("#producto")).toBeAttached();
    await expect(page.locator("#funciones")).toBeAttached();
    await expect(page.locator("#como-funciona")).toBeAttached();
    await expect(page.locator("#preguntas")).toBeAttached();
    await expect(page.locator("#prueba-gratis")).toBeAttached();
  });

  test("el CTA primario del header lleva al formulario de prueba gratis", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const headerCta = page.locator("header").getByRole("link", { name: "Probar gratis" });
    await expect(headerCta).toHaveAttribute("href", "#prueba-gratis");

    await headerCta.click();
    await expect(page).toHaveURL(/#prueba-gratis$/);
  });

  test("el enlace de iniciar sesión no abre en una pestaña nueva", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/");

    const loginLink = page.locator("header").getByRole("link", { name: "Iniciar sesión" });
    await expect(loginLink).toHaveAttribute("href", /^https:\/\//);
    await expect(loginLink).not.toHaveAttribute("target", "_blank");
  });
});

test.describe("menú móvil", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("abre, expone aria-expanded y cierra devolviendo el foco al botón", async ({ page }) => {
    await page.goto("/");

    const toggle = page.getByRole("button", { name: "Abrir menú" });
    await expect(toggle).toHaveAttribute("aria-expanded", "false");

    await toggle.click();
    const closeToggle = page.getByRole("button", { name: "Cerrar menú" });
    await expect(closeToggle).toHaveAttribute("aria-expanded", "true");

    const panel = page.locator("#menu-movil");
    await expect(panel.getByRole("link", { name: "Probar gratis" })).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByRole("button", { name: "Abrir menú" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByRole("button", { name: "Abrir menú" })).toBeFocused();
  });
});
