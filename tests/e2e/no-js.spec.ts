import { test, expect } from "@playwright/test";

test.use({ javaScriptEnabled: false });

test("la propuesta de valor se entiende sin JavaScript", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "Convierte cada cobro en claridad.",
  );

  // CTA presentes como enlaces reales, sin depender de JS.
  await expect(page.getByRole("link", { name: "Probar gratis" }).first()).toHaveAttribute(
    "href",
    "#prueba-gratis",
  );

  // Las respuestas de las preguntas frecuentes son <details> nativos: existen en el HTML
  // aunque estén colapsados, sin depender de un acordeón por JavaScript.
  const faqSection = page.locator("#preguntas");
  await expect(faqSection.getByText("¿Cuánto dura la prueba gratis?")).toBeAttached();
  await expect(faqSection.getByText("15 días.", { exact: false })).toBeAttached();

  // El formulario de prueba gratis está presente y es enviable sin JS.
  await expect(page.getByLabel("Correo")).toBeAttached();
  await expect(page.getByRole("button", { name: "Probar gratis" })).toBeAttached();
});

test("las páginas legales cargan sin JavaScript", async ({ page }) => {
  const privacidad = await page.goto("/privacidad");
  expect(privacidad?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Privacidad");

  const terminos = await page.goto("/terminos");
  expect(terminos?.ok()).toBeTruthy();
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Términos");
});
