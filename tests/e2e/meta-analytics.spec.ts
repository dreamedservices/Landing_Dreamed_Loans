import { test, expect } from "@playwright/test";

test("Meta Pixel no carga antes del consentimiento y registra PageView al aceptar", async ({ page }) => {
  let scriptRequests = 0;
  await page.route("https://connect.facebook.net/**", async (route) => {
    scriptRequests += 1;
    await route.fulfill({ status: 200, contentType: "application/javascript", body: "" });
  });

  await page.goto("/");
  expect(scriptRequests).toBe(0);
  expect(await page.evaluate(() => typeof window.fbq)).toBe("undefined");

  await page.getByRole("button", { name: "Aceptar" }).click();
  await expect.poll(() => scriptRequests).toBe(1);

  const queuedEvents = await page.evaluate(() => {
    const pixel = window.fbq as typeof window.fbq & { queue?: unknown[] };
    return pixel?.queue ?? [];
  });
  expect(JSON.stringify(queuedEvents)).toContain("1312615597393703");
  expect(JSON.stringify(queuedEvents)).toContain("PageView");
});

test("rechazar consentimiento no carga Meta Pixel", async ({ page }) => {
  let scriptRequests = 0;
  page.on("request", (request) => {
    if (request.url().includes("connect.facebook.net")) scriptRequests += 1;
  });

  await page.goto("/");
  await page.getByRole("button", { name: "Rechazar" }).click();
  await page.waitForTimeout(250);
  expect(scriptRequests).toBe(0);
  expect(await page.evaluate(() => typeof window.fbq)).toBe("undefined");
});
