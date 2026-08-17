import { test, expect } from "@playwright/test";

test("la home responde y muestra el H1 real de Fase 03", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Convierte cada cobro en claridad.");
});

test("la calculadora muestra todos los montos con separadores y dos decimales", async ({ page }) => {
  await page.goto("/#calculadora");

  const capital = page.getByLabel("Capital solicitado (RD$)");
  await capital.fill("264123");
  await expect(capital).toHaveValue("264,123");
  await capital.blur();
  await expect(capital).toHaveValue("264,123.00");

  await page.getByLabel("Cant. de cuotas").fill("12");
  await page.getByLabel("Interés mensual (%)").fill("2.5");
  await page.getByRole("button", { name: "Calcular préstamo" }).click();

  await expect(page.getByText("RD$ 28,613.33")).toBeVisible();
  await expect(page.getByText("+RD$ 79,236.90")).toBeVisible();
  await expect(page.getByText("RD$ 343,359.90")).toBeVisible();
});

test("las preguntas frecuentes incluyen instalaciones separadas", async ({ page }) => {
  await page.goto("/#preguntas");
  await expect(
    page.getByText("¿Ofrecen una instalación separada para empresas?"),
  ).toBeVisible();
});

test("el carrusel de capturas es la segunda sección y permite recorrer el sistema", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Rechazar" }).click();

  const carousel = page.locator("#capturas");
  await expect(carousel).toBeVisible();
  await expect(page.locator("main > #capturas")).toBeAttached();

  await expect(page.getByRole("heading", { name: "Todo tu negocio, conectado." })).toBeVisible();

  // Selección manual por clic (punto de progreso del texto dinámico).
  await page.getByRole("button", { name: "Ir a la captura 2: Tu operación completa, en una sola vista." }).click();
  await expect(
    page.getByRole("heading", { name: "Tu operación completa, en una sola vista." }),
  ).toBeVisible();

  // Selección manual por teclado, con el foco dentro del carrusel.
  await page
    .locator('[aria-roledescription="carrusel"] button[aria-current="true"]')
    .first()
    .focus();
  await page.keyboard.press("ArrowRight");
  await expect(
    page.getByRole("heading", { name: "Cada cliente con su historial organizado." }),
  ).toBeVisible();
});
