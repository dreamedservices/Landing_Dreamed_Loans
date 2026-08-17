"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import Image from "next/image";
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
/** Fracción de alto de viewport que recorre el scroll por cada transición entre capturas. */
const SCROLL_HEIGHT_PER_STEP = 0.85;

function isReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Isla cliente: refs de DOM, GSAP/ScrollTrigger, estado de selección, clic,
 * teclado, texto dinámico, responsive y limpieza (ARQUITECTURA.md §3 y §7).
 * `SystemScreenshotsSection` (Server Component) solo compone el encabezado
 * y delega aquí toda la interacción.
 */
export function SystemScreenshotsCarousel({ items }: SystemScreenshotsCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);

  const rootRef = useRef<HTMLDivElement>(null);
  const flowTrackRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const spokeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const flowButtonRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const scrollTriggerRef = useRef<InstanceType<typeof ScrollTrigger> | null>(null);

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

  /** Única fuente de verdad para la selección manual (clic o teclado). */
  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(items.length - 1, index));

      if (activeIndexRef.current !== clamped) {
        activeIndexRef.current = clamped;
        setActiveIndex(clamped);
      }
      trackEvent("system_screenshot_select", { screenshot: items[clamped].id });

      const st = scrollTriggerRef.current;
      if (st) {
        const target = st.start + (clamped / (items.length - 1)) * (st.end - st.start);
        window.scrollTo({ top: target, behavior: "smooth" });
        return;
      }

      flowButtonRefs.current[clamped]?.scrollIntoView({
        behavior: isReducedMotion() ? "auto" : "smooth",
        inline: "center",
        block: "nearest",
      });
    },
    [items],
  );

  function handleArrowKeys(event: KeyboardEvent<HTMLDivElement>, focusTargets: Array<HTMLButtonElement | null>) {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowRight" ? 1 : -1;
    const next = gsap.utils.clamp(0, items.length - 1, activeIndexRef.current + delta);
    goTo(next);
    focusTargets[next]?.focus();
  }

  // Rueda de escritorio/tablet: pin + scrub. Móvil o "reducir movimiento":
  // ninguna rama se ejecuta (la arc queda oculta por CSS) y no se crea pin.
  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top 85%",
        once: true,
        onEnter: () => trackEvent("section_view", { section: "capturas_sistema" }),
      });

      const mm = gsap.matchMedia();

      mm.add({ isArc: "(min-width: 768px) and (prefers-reduced-motion: no-preference)" }, (context) => {
        const { isArc } = context.conditions as { isArc: boolean };
        if (!isArc) return;

        applyArc(0);

        const proxy = { t: 0 };
        const tween = gsap.to(proxy, {
          t: items.length - 1,
          ease: "none",
          onUpdate: () => applyArc(proxy.t),
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: () => `+=${(items.length - 1) * window.innerHeight * SCROLL_HEIGHT_PER_STEP}`,
            pin: true,
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        scrollTriggerRef.current = tween.scrollTrigger ?? null;
        requestAnimationFrame(() => ScrollTrigger.refresh());

        return () => {
          scrollTriggerRef.current = null;
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef, dependencies: [applyArc, items.length] },
  );

  // Texto inferior izquierdo: crossfade rápido cada vez que cambia la selección.
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
        correcto — el límite del lienzo lo garantiza.
      */}
      <div
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
              onClick={() => goTo(index)}
              aria-current={activeIndex === index ? "true" : undefined}
              aria-label={`Mostrar captura ${index + 1} de ${items.length}: ${item.title}`}
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
      */}
      <Container as="div">
        <div className="md:motion-safe:absolute md:motion-safe:inset-y-0 md:motion-safe:left-1/2 md:motion-safe:z-20 md:motion-safe:flex md:motion-safe:w-full md:motion-safe:max-w-[1440px] md:motion-safe:-translate-x-1/2 md:motion-safe:flex-col md:motion-safe:justify-center md:motion-safe:gap-10 md:motion-safe:px-8 lg:motion-safe:px-12">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Eyebrow tone="light">El sistema por dentro</Eyebrow>
              <Badge tone="info">Capturas reales</Badge>
            </div>
            <Heading level={2} tone="light" className="mt-3 max-w-2xl">
              Mira Dream Préstamos en acción.
            </Heading>
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
                onClick={() => goTo(index)}
                aria-current={activeIndex === index ? "true" : undefined}
                aria-label={`Mostrar captura ${index + 1} de ${items.length}: ${item.title}`}
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

          {/* Texto dinámico + progreso: forma un solo bloque con el encabezado de arriba (ver comentario del envoltorio); en el flujo móvil, va debajo del carrusel. */}
          <div ref={textRef} aria-live="polite" aria-atomic="true" className="mt-6 max-w-md md:motion-safe:mt-0">
            <p className="text-label font-semibold uppercase tracking-[0.12em] text-brand-blue">{active.eyebrow}</p>
            <Heading level={3} tone="light" className="mt-2">
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
    </div>
  );
}
