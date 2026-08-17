import type { StaticImageData } from "next/image";
import showcase from "@/assets/product/movilcaruseldesing.png";
import dashboard from "@/assets/product/dashboard.png";
import client from "@/assets/product/client.png";
import routeManagement from "@/assets/product/gestionrutas.png";
import collectorOnRoute from "@/assets/product/cobrador-en-ruta.png";
import avatarLab from "@/assets/product/avatar-lab.png";

export type ScreenshotItem = {
  id: string;
  image: StaticImageData;
  alt: string;
  eyebrow: string;
  title: string;
  description: string;
  /** Orientación real de la captura — decide la proporción de su tarjeta en el arco. */
  orientation: "landscape" | "portrait";
};

/**
 * Capturas reales de Dream Préstamos (src/assets/product). Los textos
 * describen únicamente lo que cada captura muestra — sin inventar módulos
 * que el sistema no tenga (THEME.md §1: veracidad del producto primero).
 */
export const systemScreenshots: ScreenshotItem[] = [
  {
    id: "resumen",
    image: showcase,
    alt: "Composición de las principales pantallas reales de Dream Préstamos",
    eyebrow: "Una sola operación",
    title: "Todo tu negocio, conectado.",
    description:
      "Dashboard, clientes, rutas, cobros y personalización trabajando como una sola experiencia.",
    orientation: "landscape",
  },
  {
    id: "dashboard",
    image: dashboard,
    alt: "Dashboard real de Dream Préstamos con indicadores financieros y calculadora de préstamos",
    eyebrow: "Panel principal",
    title: "Tu operación completa, en una sola vista.",
    description:
      "Consulta capital prestado, ganancias esperadas, cobros del período y la calculadora de préstamos desde un panel central.",
    orientation: "landscape",
  },
  {
    id: "clientes",
    image: client,
    alt: "Listado real de clientes de Dream Préstamos con pagos y deuda de cada uno",
    eyebrow: "Gestión de clientes",
    title: "Cada cliente con su historial organizado.",
    description: "Revisa pagos, deuda y datos de contacto de cada cliente sin salir del listado.",
    orientation: "landscape",
  },
  {
    id: "rutas",
    image: routeManagement,
    alt: "Gestión real de rutas y cobros de Dream Préstamos sobre un mapa",
    eyebrow: "Cobranza y rutas",
    title: "Rutas y cobros, siempre bajo control.",
    description: "Asigna rutas, da seguimiento en el mapa y consulta el calendario de cobros del equipo.",
    orientation: "landscape",
  },
  {
    id: "cobranza-movil",
    image: collectorOnRoute,
    alt: "Aplicación móvil real de Dream Préstamos mostrando a un cobrador en ruta",
    eyebrow: "Cobranza móvil",
    title: "El cobrador sabe exactamente qué sigue.",
    description:
      "Llegada estimada, distancia y progreso de la visita, con navegación y contacto directo al cliente.",
    orientation: "portrait",
  },
  {
    id: "equipo",
    image: avatarLab,
    alt: "Laboratorio de avatares real de Dream Préstamos con opciones de personalización",
    eyebrow: "Identidad del equipo",
    title: "Una experiencia que también crea identidad.",
    description: "Cada integrante del equipo personaliza su avatar y hace la herramienta propia.",
    orientation: "landscape",
  },
];
