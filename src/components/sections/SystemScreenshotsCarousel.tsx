"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
import { Maximize2, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { trackEvent } from "@/lib/analytics/track";
import { cn } from "@/lib/cn";
import type { ScreenshotItem } from "@/config/systemScreenshots";

type SystemScreenshotsCarouselProps = {
  items: ScreenshotItem[];
};

/** Separación angular entre capturas contiguas sobre el arco (grados). */
const ANGLE_STEP = 21;
/** Ángulo donde "mira" la captura activa: recto hacia arriba desde el pivote. */
const FOCUS_ANGLE = 0;
/** Más allá de esta distancia angular al foco, una captura se desvanece del todo. */
const FADE_ANGLE = 98;
/** Media query que decide si el arco (giro) está activo, en vez del flujo móvil con scroll-snap. */
const ARC_MEDIA_QUERY = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

function isReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function isArcMode() {
  return typeof window !== "undefined" && window.matchMedia(ARC_MEDIA_QUERY).matches;
}

/**
 * Isla cliente: refs de DOM, GSAP, estado de selección, clic, teclado, rueda
 * local del carrusel, texto dinámico, vista ampliada, responsive y limpieza
 * (ARQUITECTURA.md §3 y §7). `SystemScreenshotsSection` (Server Component)
 * solo compone el encabezado y delega aquí toda la interacción.
 */
export function SystemScreenshotsCarousel({ items }: SystemScreenshotsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [zoomIndex, setZoomIndex] = useState<number | null>(null);

  const rootRef = useRef<HTMLDivElement>(null);
  const arcRegionRef = useRef<HTMLDivElement>(null);
  const flowTrackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const zoomPanelRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const spokeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flowButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const arcProxyRef = useRef({ t: 0 });

  const active = items[activeIndex];

  /** Coloca cada captura sobre el arco según el progreso continuo `t` (0..N-1). Sin setState por frame: solo actualiza React cuando el índice más cercano cambia. */
  const applyArc = useCallback(
    (t: number) => {
      let nearest = 0;
      let nearestDist = Infinity;

      for (let i = 0; i < items.length; i += 1) {
        const offset = (i - t) * ANGLE_STEP;
        const dist = Math.abs(offset);
        const angle = FOCUS_ANGLE + offset;
        const scale = gsap.utils.clamp(0.52, 1, 1 - dist / 160);
        const opacity = gsap.utils.clamp(0, 1, 1 - dist / FADE_ANGLE);
        const isActive = dist < ANGLE_STEP / 2;

        const spoke = spokeRefs.current[i];
        const card = cardRefs.current[i];
        if (spoke) gsap.set(spoke, { rotate: angle });
        if (card) {
          gsap.set(card, {
            rotate: -angle,
            scale,
            opacity,
            zIndex: Math.round(300 - dist),
            pointerEvents: opacity > 0.15 ? "auto" : "none",
          });
          card.dataset.active = isActive ? "true" : "false";
        }

        if (dist < nearestDist) {
          nearestDist = dist;
          nearest = i;
        }
      }

      if (activeIndexRef.current !== nearest) {
        activeIndexRef.current = nearest;
        setActiveIndex(nearest);
      }
    },
    [items],
  );

  /** Anima el arco desde su progreso actual hasta `index` (clic, teclado o rueda sobre el carrusel). */
  const animateArcTo = useCallback(
    (index: number) => {
      gsap.killTweensOf(arcProxyRef.current);

      if (isReducedMotion()) {
        arcProxyRef.current.t = index;
        applyArc(index);
        return;
      }

      gsap.to(arcProxyRef.current, {
        t: index,
        duration: 0.6,
        ease: "power2.out",
        onUpdate: () => applyArc(arcProxyRef.current.t),
      });
    },
    [applyArc],
  );

  /** Única fuente de verdad para la selección manual (clic, teclado o rueda). */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, index));

      if (activeIndexRef.current !== clamped) {
        activeIndexRef.current = clamped;
        setActiveIndex(clamped);
      }
      trackEvent("system_screenshot_select", { screenshot: items[clamped].id });

      if (isArcMode()) {
        animateArcTo(clamped);
        return;
      }

      flowButtonRefs.current[clamped]?.scrollIntoView({
        behavior: isReducedMotion() ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [items, animateArcTo],
  );

  function handleArrowKeys(event: KeyboardEvent<HTMLDivElement>, focusTargets: Array<HTMLButtonElement | null>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = gsap.utils.clamp(0, items.length - 1, activeIndexRef.current + delta);
    goTo(next);
    focusTargets[next]?.focus();
  }

  function handleCardClick(index: number) {
    if (activeIndexRef.current === index) {
      setZoomIndex(index);
      trackEvent("system_screenshot_zoom", { screenshot: items[index].id });
      return;
    }
    goTo(index);
  }

  // Arco de escritorio/tablet: posición inicial de las capturas y registro
  // del seguimiento de vista de sección. Ya no fija (pin) ni secuestra el
  // scroll de la página: el scroll normal siempre mueve la página, y la
  // rotación del arco se controla aparte (ver el listener de rueda sobre el
  // carrusel, más abajo, y los manejadores de clic/teclado).
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => trackEvent("section_view", { section: "capturas_sistema" }),
      });

      const mm = gsap.matchMedia();

      mm.add({ isArc: ARC_MEDIA_QUERY }, (context) => {
        const { isArc } = context.conditions as { isArc: boolean };
        if (!isArc) return;

        arcProxyRef.current.t = activeIndexRef.current;
        applyArc(activeIndexRef.current);
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [applyArc] },
  );

  // Rueda sobre el carrusel: mueve la selección en vez de la página. En los
  // extremos (primera/última captura) deja de interceptar el evento para
  // que el scroll de la página continúe con normalidad hacia la sección
  // vecina. Se usa un listener nativo (no `onWheel` de React) porque solo
  // así `preventDefault` funciona de forma fiable en un evento de rueda.
  useEffect(() => {
    const el = arcRegionRef.current;
    if (!el) return;

    let locked = false;
    let unlockTimeout: number | undefined;

    const onWheel = (event: WheelEvent) => {
      if (isReducedMotion() || !isArcMode()) return;
      if (Math.abs(event.deltaY) < 4) return;

      const dir = event.deltaY > 0 ? 1 : -1;
      const next = activeIndexRef.current + dir;
      if (next < 0 || next > items.length - 1) return;

      event.preventDefault();
      if (locked) return;

      locked = true;
      goTo(next);
      unlockTimeout = window.setTimeout(() => {
        locked = false;
      }, 550);
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      window.clearTimeout(unlockTimeout);
    };
  }, [goTo, items.length]);

  // Texto dinámico (eyebrow + título grande + descripción): crossfade rápido
  // cada vez que cambia la selección.
  useGSAP(
    () => {
      if (!textRef.current) return;

      if (isReducedMotion()) {
        gsap.set(textRef.current, { autoAlpha: 1, y: 0 });
        return;
      }

      gsap.fromTo(
        textRef.current,
        { autoAlpha: 0, y: 10 },
        { autoAlpha: 1, y: 0, duration: 0.25, ease: "power2.out", overwrite: true },
      );
    },
    { scope: rootRef, dependencies: [activeIndex] },
  );

  // Vista ampliada: entra con una animación de escala y bloquea el scroll de
  // fondo mientras está abierta; Escape o clic fuera la cierran.
  useGSAP(
    () => {
      if (zoomIndex === null || !zoomPanelRef.current) return;

      if (isReducedMotion()) {
        gsap.set(zoomPanelRef.current, { autoAlpha: 1, scale: 1 });
        return;
      }

      gsap.fromTo(
        zoomPanelRef.current,
        { autoAlpha: 0, scale: 0.85 },
        { autoAlpha: 1, scale: 1, duration: 0.35, ease: "power3.out" },
      );
    },
    { dependencies: [zoomIndex] },
  );

  useEffect(() => {
    if (zoomIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") setZoomIndex(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [zoomIndex]);

  // Móvil / "reducir movimiento": carrusel deslizable nativo con scroll-snap.
  // Un IntersectionObserver detecta qué captura queda centrada y sincroniza
  // el texto, sin listeners de scroll ni setState por frame.
  useEffect(() => {
    const track = flowTrackRef.current;
    if (!track) return;

    const buttons = flowButtonRefs.current.filter((el): el is HTMLButtonElement => el !== null);
    if (buttons.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best: { index: number; ratio: number } | null = null;
        for (const entry of entries) {
          const index = Number((entry.target as HTMLElement).dataset.flowIndex);
          if (!best || entry.intersectionRatio > best.ratio) best = { index, ratio: entry.intersectionRatio };
        }
        if (best && best.ratio > 0.6 && activeIndexRef.current !== best.index) {
          activeIndexRef.current = best.index;
          setActiveIndex(best.index);
        }
      },
      { root: track, threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] },
    );

    buttons.forEach((button) => observer.observe(button));
    return () => observer.disconnect();
  }, [items.length]);

  const zoomItem = zoomIndex !== null ? items[zoomIndex] : null;

  return (
    <div
      ref={rootRef}
      className="relative py-16 sm:py-20 md:motion-safe:h-[100svh] md:motion-safe:min-h-[720px] md:motion-safe:py-0"
    >
      {/*
        Arco: escritorio/tablet con movimiento permitido. Cada captura cuelga
        de un radio (spoke) que gira alrededor de un pivote inferior. El lienzo
        se recorta al ~65% derecho de la sección a propósito (`overflow-hidden`
        + `right-0`): así ninguna captura puede invadir geométricamente la
        columna izquierda donde viven el encabezado y el texto dinámico, sin
        depender de que la trigonometría del ángulo caiga siempre del lado
        correcto — el límite del lienzo lo garantiza. `arcRegionRef` es el
        alcance del listener de rueda: solo aquí la rueda mueve el carrusel en
        vez de la página.
      */}
      <div
        ref={arcRegionRef}
        className="absolute inset-y-0 right-0 z-10 hidden w-[66%] overflow-hidden md:motion-safe:block lg:w-[68%]"
        style={{ "--wheel-radius": "clamp(360px,38vw,760px)" } as CSSProperties}
        role="region"
        aria-roledescription="carrusel"
        aria-label="Capturas reales de Dream Préstamos"
        onKeyDown={(event) => handleArrowKeys(event, cardRefs.current)}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full border border-brand-blue/15"
          style={{
            width: "calc(var(--wheel-radius) * 2)",
            height: "calc(var(--wheel-radius) * 2)",
            left: "38%",
            bottom: "-8%",
            transform: "translate(-50%, 50%)",
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full bg-[radial-gradient(closest-side,rgba(79,150,240,0.18),transparent)]"
          style={{
            width: "calc(var(--wheel-radius) * 1.05)",
            height: "calc(var(--wheel-radius) * 1.05)",
            right: "-10%",
            top: "-8%",
          }}
        />

        {items.map((item, index) => (
          <div
            key={item.id}
            ref={(el) => {
              spokeRefs.current[index] = el;
            }}
            className="absolute bottom-[-8%] left-[38%] h-[var(--wheel-radius)] w-px origin-bottom"
          >
            <button
              type="button"
              ref={(el) => {
                cardRefs.current[index] = el;
              }}
              onClick={() => handleCardClick(index)}
              aria-current={activeIndex === index ? "true" : undefined}
              aria-label={
                activeIndex === index
                  ? `Ampliar captura ${index + 1} de ${items.length}: ${item.title}`
                  : `Mostrar captura ${index + 1} de ${items.length}: ${item.title}`
              }
              className={cn(
                "group absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-line-light bg-brand-white shadow-soft-light will-change-transform",
                "transition-[box-shadow] duration-300 ease-out",
                "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
                "data-[active=true]:ring-3 data-[active=true]:ring-brand-blue data-[active=true]:ring-offset-2 data-[active=true]:ring-offset-surface-soft",
                "data-[active=true]:shadow-[0_35px_70px_-18px_rgba(79,150,240,0.55)]",
                item.orientation === "portrait"
                  ? "h-[clamp(270px,23vw,420px)] w-[clamp(155px,13vw,225px)]"
                  : "h-[clamp(150px,13vw,250px)] w-[clamp(220px,20vw,380px)]",
              )}
            >
              <Image
                src={item.image}
                alt={item.alt}
                fill
                className="object-contain p-3 transition-[filter] duration-300 group-data-[active=false]:saturate-[0.8] group-data-[active=false]:brightness-[0.92]"
                sizes={
                  item.orientation === "portrait" ? "(min-width: 768px) 18vw, 40vw" : "(min-width: 768px) 26vw, 50vw"
                }
                priority={index === 0}
              />
              {activeIndex === index && (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-brand-ink/70 text-brand-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </span>
              )}
            </button>
          </div>
        ))}
      </div>

      {/*
        Encabezado, carrusel móvil y texto dinámico comparten el ancho de
        lectura de `Container`. En modo arco, el envoltorio interno pasa a
        `absolute` + `flex flex-col justify-center`: encabezado y texto
        dinámico se centran verticalmente como UN solo bloque (igual que el
        resto de secciones del sitio), no como dos piezas sueltas en extremos
        opuestos del viewport fijado. El carrusel móvil, oculto en ese modo,
        no participa del centrado. Ese `inset`/posición se calcula contra
        `rootRef`, no contra `Container` (que no está posicionado). Por eso
        el eje horizontal del bloque de abajo se centra a mano con
        `left-1/2` + `-translate-x-1/2` y el mismo `max-w-[1440px]` de
        `Container`, en vez de `inset-x-0` (que lo estiraría al viewport
        completo, pegando el texto al borde izquierdo). El eje vertical sí
        sigue anclado a `rootRef` vía `inset-y-0`: si en su lugar hiciéramos
        `Container` `relative`, el bloque colapsaría a alto 0 (Container no
        tiene alto propio) y el título quedaría centrado fuera de pantalla.
        Esta caja, al medir `w-full max-w-[1440px]`, se extiende también por
        encima del arco aunque ahí no tenga contenido visible; con `z-20` por
        delante del arco (`z-10`) y sin `pointer-events-none`, bloqueaba
        clics, hover y rueda sobre las tarjetas. Por eso lleva
        `pointer-events-none` y cada hijo con contenido real recupera
        `pointer-events-auto`.
      */}
      <Container as="div">
        <div className="md:motion-safe:pointer-events-none md:motion-safe:absolute md:motion-safe:inset-y-0 md:motion-safe:left-1/2 md:motion-safe:z-20 md:motion-safe:flex md:motion-safe:w-full md:motion-safe:max-w-[1440px] md:motion-safe:-translate-x-1/2 md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:gap-10 md:motion-safe:px-8 lg:motion-safe:px-12">
          <div className="flex flex-wrap items-center gap-3 md:motion-safe:pointer-events-auto">
            <Eyebrow tone="light">El sistema por dentro</Eyebrow>
            <Badge tone="info">Capturas reales</Badge>
          </div>

          {/* Móvil o "reducir movimiento": carrusel horizontal con scroll-snap, sin pin ni rotación. */}
          <div
            ref={flowTrackRef}
            className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] md:motion-safe:hidden [&::-webkit-scrollbar]:hidden"
            role="region"
            aria-roledescription="carrusel"
            aria-label="Capturas reales de Dream Préstamos"
            onKeyDown={(event) => handleArrowKeys(event, flowButtonRefs.current)}
          >
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                ref={(el) => {
                  flowButtonRefs.current[index] = el;
                }}
                data-flow-item
                data-flow-index={index}
                onClick={() => handleCardClick(index)}
                aria-current={activeIndex === index ? "true" : undefined}
                aria-label={
                  activeIndex === index
                    ? `Ampliar captura ${index + 1} de ${items.length}: ${item.title}`
                    : `Mostrar captura ${index + 1} de ${items.length}: ${item.title}`
                }
                className="relative h-72 w-[82%] shrink-0 snap-center overflow-hidden rounded-2xl border border-line-light bg-brand-white shadow-soft-light focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue sm:h-80 sm:w-[58%]"
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  className="object-contain p-4"
                  sizes="(min-width: 640px) 58vw, 82vw"
                  priority={index === 0}
                />
              </button>
            ))}
          </div>

          {/*
            Texto dinámico: el título grande (antes fijo, "Mira Dream
            Préstamos en acción.") ahora es el título de la captura activa y
            cambia con ella, igual que el resto del bloque. Forma un solo
            grupo con el encabezado de arriba (ver comentario del
            envoltorio); en el flujo móvil, va debajo del carrusel.
          */}
          <div
            ref={textRef}
            aria-live="polite"
            aria-atomic="true"
            className="mt-6 max-w-md md:motion-safe:mt-0 md:motion-safe:pointer-events-auto"
          >
            <p className="text-label font-semibold uppercase tracking-[0.12em] text-brand-blue">{active.eyebrow}</p>
            <Heading level={2} tone="light" className="mt-2 max-w-2xl">
              {active.title}
            </Heading>
            <p className="mt-3 max-w-sm text-body text-brand-ink/75">{active.description}</p>

            <div className="mt-6 flex items-center gap-4">
              <span className="text-small font-semibold tabular-nums text-brand-ink/60">
                {String(activeIndex + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
              </span>
              <div className="flex gap-2" role="group" aria-label="Progreso de capturas">
                {items.map((item, index) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => goTo(index)}
                    aria-current={activeIndex === index ? "true" : undefined}
                    aria-label={`Ir a la captura ${index + 1}: ${item.title}`}
                    className={cn(
                      "h-1.5 rounded-full transition-[width,background-color] duration-300",
                      "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue",
                      activeIndex === index ? "w-8 bg-brand-blue" : "w-4 bg-brand-ink/20 hover:bg-brand-ink/40",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/*
        Vista ampliada: se renderiza como hermana del arco (no dentro de una
        `spoke`/`card` con `rotate`/`scale` propios) para que `fixed` se
        posicione contra el viewport y no contra un ancestro transformado.
      */}
      {zoomItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-brand-ink/80 p-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Captura ampliada: ${zoomItem.title}`}
          onClick={() => setZoomIndex(null)}
        >
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              setZoomIndex(null);
            }}
            className="absolute right-6 top-6 flex h-10 w-10 items-center justify-center rounded-full bg-brand-white/10 text-brand-white transition hover:bg-brand-white/20 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-blue"
            aria-label="Cerrar vista ampliada"
          >
            <X aria-hidden="true" className="h-5 w-5" />
          </button>

          <div
            ref={zoomPanelRef}
            className="relative max-h-[85vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-brand-white shadow-soft-light"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={zoomItem.image}
              alt={zoomItem.alt}
              className="h-auto max-h-[85vh] w-full object-contain"
              sizes="(min-width: 1024px) 60vw, 90vw"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
