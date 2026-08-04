import { test, expect } from "@playwright/test";

const viewports = [
  { name: "320px", width: 320, height: 720 },
  { name: "768px", width: 768, height: 1024 },
  { name: "1440px", width: 1440, height: 900 },
];

for (const viewport of viewports) {
  test(`catálogo sin scroll horizontal a ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/dev/catalogo");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });

  test(`home sin scroll horizontal a ${viewport.name}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");

    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));

    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
}

test("el foco es visible al tabular por los controles del catálogo", async ({ page }) => {
  await page.goto("/dev/catalogo");

  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");

  const outline = await page.evaluate(() => {
    const el = document.activeElement;
    if (!el) return null;
    const style = getComputedStyle(el);
    return { outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth };
  });

  expect(outline).not.toBeNull();
  expect(outline?.outlineStyle).not.toBe("none");
  expect(outline?.outlineWidth).not.toBe("0px");
});
