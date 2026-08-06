"use client";

import {
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import Image, { type StaticImageData } from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/cn";
import showcase from "@/assets/product/movilcaruseldesing.png";
import dashboard from "@/assets/product/dashboard.png";
import routeManagement from "@/assets/product/gestionrutas.png";
import mobileRoute from "@/assets/product/rutasdeclientemovile.png";
import avatars from "@/assets/product/avatares.png";

type Screenshot = {
  eyebrow: string;
  title: string;
  description: string;
  image: StaticImageData;
  alt: string;
  presentation: "cover" | "portrait";
  objectPosition?: string;
};

const screenshots: Screenshot[] = [
  {
    eyebrow: "Una sola operación",
    title: "Todo tu negocio, conectado.",
    description:
      "Dashboard, clientes, rutas, cobros y personalización trabajando como una sola experiencia.",
    image: showcase,
    alt: "Composición de las principales pantallas reales de Dream Préstamos",
    presentation: "cover",
    objectPosition: "center",
  },
  {
    eyebrow: "Visión ejecutiva",
    title: "Decisiones claras desde el dashboard.",
    description:
      "Capital, ganancias, deuda, cobros y movimientos importantes visibles desde una pantalla central.",
    image: dashboard,
    alt: "Dashboard real de Dream Préstamos con indicadores financieros, calculadora y movimientos",
    presentation: "cover",
    objectPosition: "center top",
  },
  {
    eyebrow: "Control territorial",
    title: "Rutas y cobros sobre el mapa.",
    description:
      "Organiza visitas, revisa rutas asignadas y consulta el calendario sin perder de vista la operación.",
    image: routeManagement,
    alt: "Gestión real de rutas y cobros de Dream Préstamos sobre un mapa",
    presentation: "cover",
    objectPosition: "center top",
  },
  {
    eyebrow: "Cobranza móvil",
    title: "El cobrador sabe exactamente qué sigue.",
    description:
      "Ruta, llegada estimada, distancia, progreso y contacto con el cliente desde una experiencia móvil guiada.",
    image: mobileRoute,
    alt: "Aplicación móvil real de Dream Préstamos mostrando una ruta de cobro",
    presentation: "portrait",
  },
  {
    eyebrow: "Identidad del equipo",
    title: "Una experiencia que también crea identidad.",
    description:
      "Cada integrante puede personalizar su avatar y hacer que la herramienta se sienta verdaderamente propia.",
    image: avatars,
    alt: "Laboratorio de avatares real de Dream Préstamos con opciones de personalización",
    presentation: "cover",
    objectPosition: "center",
  },
];

const SWIPE_THRESHOLD = 56;

export function SystemScreenshotsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const pointerStartX = useRef<number | null>(null);
  const activeScreenshot = screenshots[activeIndex];

  function showPrevious() {
    setActiveIndex((current) => (current - 1 + screenshots.length) % screenshots.length);
  }

  function showNext() {
    setActiveIndex((current) => (current + 1) % screenshots.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if ((event.target as HTMLElement).closest("button")) return;

    pointerStartX.current = event.clientX;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (pointerStartX.current === null) return;

    const distance = event.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance > 0) showPrevious();
    else showNext();
  }

  return (
    <Section id="capturas" tone="deep" className="relative overflow-hidden !py-0">
      <div
        className="relative h-[100svh] min-h-[680px] max-h-[1080px] touch-pan-y overflow-hidden border-y border-line-dark focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-brand-blue"
        role="region"
        aria-roledescription="carrusel"
        aria-label="Capturas reales de Dream Préstamos"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={() => {
          pointerStartX.current = null;
        }}
      >
        <div
          className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
          style={{ transform: `translate3d(-${activeIndex * 100}%, 0, 0)` }}
        >
          {screenshots.map((screenshot, index) => (
            <div
              key={screenshot.title}
              className="relative h-full min-w-full overflow-hidden bg-surface-deep"
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${screenshots.length}`}
              aria-hidden={index !== activeIndex}
            >
              {screenshot.presentation === "portrait" ? (
                <>
                  <Image
                    src={screenshot.image}
                    alt=""
                    fill
                    aria-hidden="true"
                    className="scale-110 object-cover opacity-35 blur-3xl"
                    sizes="100vw"
                  />
                  <div className="absolute inset-x-6 inset-y-10 sm:inset-x-16 sm:inset-y-8 lg:inset-x-28">
                    <Image
                      src={screenshot.image}
                      alt={screenshot.alt}
                      fill
                      className="object-contain drop-shadow-[0_32px_60px_rgba(0,0,0,0.55)]"
                      sizes="(max-width: 640px) 90vw, 70vw"
                    />
                  </div>
                </>
              ) : (
                <Image
                  src={screenshot.image}
                  alt={screenshot.alt}
                  fill
                  className="object-cover transition-transform duration-[1400ms] ease-out motion-reduce:transition-none"
                  style={{
                    objectPosition: screenshot.objectPosition,
                    transform: index === activeIndex ? "scale(1.015)" : "scale(1.06)",
                  }}
                  sizes="100vw"
                  priority={index === 0}
                />
              )}

              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,21,33,0.86)_0%,rgba(7,21,33,0.12)_32%,rgba(7,21,33,0.08)_52%,rgba(7,21,33,0.92)_100%)]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_22%,rgba(7,21,33,0.22)_72%)]"
              />
            </div>
          ))}
        </div>

        <Container as="div" className="pointer-events-none absolute inset-x-0 top-0 z-20 pt-10 sm:pt-14 lg:pt-16">
          <div className="max-w-4xl">
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow tone="dark" className="text-brand-green">
                El sistema por dentro
              </Eyebrow>
              <Badge tone="success" className="shadow-sm">
                Capturas reales
              </Badge>
            </div>
            <Heading
              level={2}
              tone="dark"
              className="mt-3 max-w-3xl text-[clamp(2.25rem,5vw,5rem)] drop-shadow-[0_3px_24px_rgba(0,0,0,0.55)]"
            >
              Mira Dream Préstamos en acción.
            </Heading>
          </div>
        </Container>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 pb-6 sm:pb-8 lg:pb-10">
          <Container as="div">
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
              <div key={activeScreenshot.title} aria-live="polite" aria-atomic="true" className="max-w-2xl">
                <p className="text-label font-semibold uppercase tracking-[0.12em] text-brand-green">
                  {activeScreenshot.eyebrow}
                </p>
                <Heading level={3} tone="dark" className="mt-2 drop-shadow-lg">
                  {activeScreenshot.title}
                </Heading>
                <p className="mt-2 max-w-xl text-body text-brand-white/80 drop-shadow-md">
                  {activeScreenshot.description}
                </p>
              </div>

              <div className="pointer-events-auto flex items-center justify-between gap-4 lg:justify-end">
                <p className="hidden text-small text-brand-white/60 sm:block">
                  Desliza o usa las flechas
                </p>
                <span className="min-w-12 text-right text-small font-semibold tabular-nums text-brand-white">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(screenshots.length).padStart(2, "0")}
                </span>
                <div className="flex gap-2">
                  <IconButton
                    icon={<ChevronLeft aria-hidden="true" className="h-5 w-5" />}
                    ariaLabel="Ver captura anterior"
                    tone="dark"
                    size="md"
                    onClick={showPrevious}
                    className="border border-white/25 bg-surface-deep/60 shadow-lg backdrop-blur-md"
                  />
                  <IconButton
                    icon={<ChevronRight aria-hidden="true" className="h-5 w-5" />}
                    ariaLabel="Ver captura siguiente"
                    tone="dark"
                    size="md"
                    onClick={showNext}
                    className="border border-white/25 bg-surface-deep/60 shadow-lg backdrop-blur-md"
                  />
                </div>
              </div>
            </div>

            <div className="pointer-events-auto mt-5 flex gap-2" aria-label="Seleccionar captura">
              {screenshots.map((screenshot, index) => (
                <button
                  key={screenshot.title}
                  type="button"
                  className={cn(
                    "h-1.5 rounded-full transition-[width,background-color] duration-300",
                    "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-green",
                    "motion-reduce:transition-none",
                    index === activeIndex ? "w-12 bg-brand-green" : "w-6 bg-white/35 hover:bg-white/65",
                  )}
                  aria-label={`Mostrar captura ${index + 1}: ${screenshot.title}`}
                  aria-current={index === activeIndex ? "true" : undefined}
                  onClick={() => setActiveIndex(index)}
                />
              ))}
            </div>
          </Container>
        </div>
      </div>
    </Section>
  );
}
