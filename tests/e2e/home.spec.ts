import { test, expect } from "@playwright/test";

test("la home responde y muestra el H1 real de Fase 03", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.ok()).toBeTruthy();

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();
  await expect(heading).toHaveText("Convierte cada cobro en claridad.");
});
