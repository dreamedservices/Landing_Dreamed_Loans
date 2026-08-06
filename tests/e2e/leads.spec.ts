import { test, expect, type APIRequestContext } from "@playwright/test";

/**
 * LEADS_TEST_MODE=true (solo en playwright.config.ts) activa FakeLeadNotifier,
 * controlable con marcadores en businessName (ver lib/email/fake-notifier.ts).
 * Cada test usa un X-Forwarded-For distinto: el rate limiter usa la IP como
 * clave, y sin este header todas las peticiones locales comparten la misma
 * clave "unknown" y se interferirían entre tests.
 *
 * Serie, no paralelo: Turbopack compila /api/leads bajo demanda en el primer
 * request. Dos primeros requests en paralelo (uno por worker) competían por
 * esa compilación en frío y expiraban. Un `beforeAll` "calienta" la ruta
 * antes de medir nada.
 */
test.describe.configure({ mode: "serial" });

test.beforeAll(async ({ request }) => {
  await request
    .post("/api/leads", { data: { warmup: true }, timeout: 60_000 })
    .catch(() => undefined);
});

function validPayload(overrides: Record<string, unknown> = {}) {
  return {
    fullName: "Ana Pérez",
    businessName: "Financiera Ejemplo",
    email: "ana@example.com",
    phone: "+1 809 555 0100",
    country: "República Dominicana",
    teamSize: "1-5 personas",
    portfolioRange: "Menos de RD$ 1M",
    message: "",
    processingConsent: true,
    marketingConsent: false,
    website: "",
    startedAt: Date.now() - 2000,
    ...overrides,
  };
}

async function post(
  request: APIRequestContext,
  ip: string,
  data: Record<string, unknown>,
  extraHeaders: Record<string, string> = {},
) {
  return request.post("/api/leads", {
    data,
    headers: { "x-forwarded-for": ip, ...extraHeaders },
  });
}

test("payload válido: envío confirmado y redirección correcta", async ({ request }) => {
  const response = await post(request, "10.0.0.1", validPayload());
  expect(response.status()).toBe(200);

  const body = await response.json();
  expect(body.ok).toBe(true);
  expect(body.requestId).toBeTruthy();
  expect(body.redirectUrl).toBe("https://dreamprestamos.com/auth/register");
});

test("correo inválido → VALIDATION 400", async ({ request }) => {
  const response = await post(request, "10.0.0.2", validPayload({ email: "no-es-un-correo" }));
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body).toMatchObject({ ok: false, code: "VALIDATION" });
});

test("campo demasiado largo → VALIDATION 400", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.3",
    validPayload({ fullName: "A".repeat(200) }),
  );
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.code).toBe("VALIDATION");
});

test("consentimiento ausente → VALIDATION 400", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.4",
    validPayload({ processingConsent: false }),
  );
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.code).toBe("VALIDATION");
});

test("honeypot lleno → VALIDATION 400 (rechazo genérico, no delata el motivo)", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.5",
    validPayload({ website: "https://bot.example.com" }),
  );
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.code).toBe("VALIDATION");
});

test("envío demasiado rápido (tiempo mínimo) → VALIDATION 400", async ({ request }) => {
  const response = await post(request, "10.0.0.6", validPayload({ startedAt: Date.now() }));
  expect(response.status()).toBe(400);
  const body = await response.json();
  expect(body.code).toBe("VALIDATION");
});

test("rate limit: la 6ª petición en la ventana es rechazada", async ({ request }) => {
  const ip = "10.0.0.7";
  for (let i = 0; i < 5; i++) {
    const response = await post(request, ip, validPayload());
    expect(response.status(), `intento ${i + 1}`).toBe(200);
  }

  const sixth = await post(request, ip, validPayload());
  expect(sixth.status()).toBe(429);
  const body = await sixth.json();
  expect(body.code).toBe("RATE_LIMITED");
});

test("timeout del proveedor → EMAIL_FAILED reintentable (503)", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.8",
    validPayload({ businessName: "Empresa __TEST_TIMEOUT__" }),
  );
  expect(response.status()).toBe(503);
  const body = await response.json();
  expect(body).toMatchObject({ ok: false, code: "EMAIL_FAILED" });
});

test("proveedor rechaza el mensaje → EMAIL_FAILED no reintentable (502)", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.9",
    validPayload({ businessName: "Empresa __TEST_REJECT__" }),
  );
  expect(response.status()).toBe(502);
  const body = await response.json();
  expect(body).toMatchObject({ ok: false, code: "EMAIL_FAILED" });
});

test("fallo genérico del proveedor → EMAIL_FAILED reintentable (503)", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.10",
    validPayload({ businessName: "Empresa __TEST_FAIL__" }),
  );
  expect(response.status()).toBe(503);
  const body = await response.json();
  expect(body.code).toBe("EMAIL_FAILED");
});

test("credenciales SMTP ausentes (camino real) → SERVER_ERROR 500, sin exponer secretos", async ({
  request,
}) => {
  const response = await post(request, "10.0.0.11", validPayload(), {
    "x-lead-test-force-real": "true",
  });
  expect(response.status()).toBe(500);
  const body = await response.json();
  expect(body.ok).toBe(false);
  // El mensaje al cliente nunca debe incluir la contraseña SMTP ni detalles de conexión.
  expect(JSON.stringify(body)).not.toMatch(/smtp_password|smtp_host|smtp_username/i);
});

test("el cliente no puede imponer una URL de redirección propia", async ({ request }) => {
  const response = await post(
    request,
    "10.0.0.12",
    validPayload({ redirectUrl: "https://evil.example.com/phish" }),
  );
  expect(response.status()).toBe(200);
  const body = await response.json();
  expect(body.redirectUrl).toBe("https://dreamprestamos.com/auth/register");
});

test("la respuesta y el requestId no contienen PII del lead", async ({ request }) => {
  const response = await post(request, "10.0.0.13", validPayload());
  const body = await response.json();
  expect(body.requestId).not.toContain("ana@example.com");
  expect(body.requestId).not.toContain("Ana");
  // requestId es un UUID opaco.
  expect(body.requestId).toMatch(/^[0-9a-f-]{36}$/);
});

test.describe("formulario en el navegador", () => {
  test.use({ viewport: { width: 1440, height: 900 } });

  test("envío exitoso redirige a la URL de registro real, sin PII en la URL final", async ({ page }) => {
    // Evita que el test navegue de verdad a un dominio externo real.
    await page.route("https://dreamprestamos.com/**", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<html>stub registro</html>" }),
    );

    await page.goto("/#prueba-gratis");
    await page.getByLabel("Nombre", { exact: true }).fill("Ana");
    await page.getByLabel("Apellido", { exact: true }).fill("Pérez");
    await page.getByLabel("Empresa o financiera").fill("Financiera Ejemplo");
    await page.getByLabel("Correo").fill("ana@example.com");
    await page.getByLabel("Teléfono/WhatsApp").fill("+1 809 555 0100");
    await page.getByLabel("País").selectOption("República Dominicana");
    await page.getByLabel(/Autorizo el uso de mis datos/).check();

    // Asegura que se supera el tiempo mínimo de llenado.
    await page.waitForTimeout(1600);

    await page.getByRole("button", { name: "Probar gratis" }).click();
    await page.waitForURL("https://dreamprestamos.com/auth/register");

    expect(page.url()).not.toContain("ana@example.com");
    expect(page.url()).not.toContain("Ana");
  });

  test("doble clic no duplica el envío", async ({ page }) => {
    await page.route("https://dreamprestamos.com/**", (route) =>
      route.fulfill({ status: 200, contentType: "text/html", body: "<html>stub</html>" }),
    );

    let requestCount = 0;
    page.on("request", (req) => {
      if (req.url().includes("/api/leads") && req.method() === "POST") requestCount += 1;
    });

    await page.goto("/#prueba-gratis");
    await page.getByLabel("Nombre", { exact: true }).fill("Ana");
    await page.getByLabel("Apellido", { exact: true }).fill("Pérez");
    await page.getByLabel("Empresa o financiera").fill("Financiera Ejemplo");
    await page.getByLabel("Correo").fill("ana@example.com");
    await page.getByLabel("Teléfono/WhatsApp").fill("+1 809 555 0100");
    await page.getByLabel("País").selectOption("República Dominicana");
    await page.getByLabel(/Autorizo el uso de mis datos/).check();
    await page.waitForTimeout(1600);

    const submit = page.getByRole("button", { name: "Probar gratis" });
    // Dos clics reales y rápidos: el botón deshabilitado en cuanto empieza a
    // enviar (isSubmitting) debe absorber el segundo antes de que dispare
    // un segundo submit del navegador.
    await Promise.all([submit.click(), submit.click().catch(() => undefined)]);

    await page.waitForURL("https://dreamprestamos.com/auth/register", { timeout: 10_000 });
    expect(requestCount).toBe(1);
  });

  test("un error del servidor conserva los datos escritos", async ({ page }) => {
    await page.route("**/api/leads", (route) =>
      route.fulfill({
        status: 503,
        contentType: "application/json",
        body: JSON.stringify({
          ok: false,
          code: "EMAIL_FAILED",
          message: "No pudimos enviar tu solicitud. Tus datos siguen aquí; inténtalo nuevamente.",
        }),
      }),
    );

    await page.goto("/#prueba-gratis");
    await page.getByLabel("Nombre", { exact: true }).fill("Ana");
    await page.getByLabel("Apellido", { exact: true }).fill("Pérez");
    await page.getByLabel("Empresa o financiera").fill("Financiera Ejemplo");
    await page.getByLabel("Correo").fill("ana@example.com");
    await page.getByLabel("Teléfono/WhatsApp").fill("+1 809 555 0100");
    await page.getByLabel("País").selectOption("República Dominicana");
    await page.getByLabel(/Autorizo el uso de mis datos/).check();
    await page.waitForTimeout(1600);

    await page.getByRole("button", { name: "Probar gratis" }).click();

    await expect(page.getByText("No pudimos enviar tu solicitud")).toBeVisible();
    await expect(page.getByLabel("Nombre", { exact: true })).toHaveValue("Ana");
    await expect(page.getByLabel("Apellido", { exact: true })).toHaveValue("Pérez");
    await expect(page.getByLabel("Correo")).toHaveValue("ana@example.com");
  });
});
