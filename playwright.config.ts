import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      // Solo aquí: activa el adaptador de correo falso (FakeLeadNotifier)
      // para poder probar /api/leads de forma determinista sin credenciales
      // reales. Nunca se define en .env.local ni en producción.
      LEADS_TEST_MODE: "true",
      // El test "credenciales ausentes (camino real)" usa x-lead-test-force-real
      // para saltarse el adaptador falso a propósito. Next.js carga .env.local
      // igual que en dev, así que sin este override el servidor de pruebas
      // vería las credenciales SMTP reales y ese test enviaría un correo de
      // verdad en cada corrida. Se vacían solo en el proceso del servidor de
      // pruebas — nunca toca el .env.local real.
      SMTP_HOST: "",
      SMTP_USERNAME: "",
      SMTP_PASSWORD: "",
    },
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
