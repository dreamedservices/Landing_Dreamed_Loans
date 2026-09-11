import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // El servidor redirige rutas sin barra final a la versión con barra
  // (ej. /privacidad -> /privacidad/); sin esto, el export genera
  // privacidad.html en vez de privacidad/index.html y esa redirección cae en 404.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
