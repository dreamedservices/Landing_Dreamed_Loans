import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { TrackedCtaButton } from "@/components/analytics/TrackedCtaButton";
import { trialAnchor } from "@/config/navigation";
import { HeroIntro } from "@/components/motion/HeroIntro";
import { HeroLogoCanvasLoader } from "@/components/three/HeroLogoCanvasLoader";
import { HeroParticlesBackground } from "@/components/three/HeroParticlesBackground";

/**
 * Copy provisional de Fase 00, pendiente de aprobación literal.
 *
 * Composición centrada (revisión post-restyle Alegra): isotipo 3D estático
 * arriba, centrado, único punto interactivo del logo en toda la landing — ya
 * no hay panel flotante ligado al scroll (ver historial en
 * FASE-04-ANIMACION-Y-3D.md). El póster 2D siempre está en el HTML; el
 * Canvas 3D (mismo tamaño, `absolute inset-0`) se monta encima cuando WebGL y
 * `prefers-reduced-motion` lo permiten, sin reemplazar el contenido — solo lo
 * enriquece. Por separado, `HeroParticlesBackground` cubre la sección
 * completa detrás de todo (título, subtítulo, CTAs): fondo de partículas
 * ambiental, no confinado al recuadro del logo.
 *
 * El H1 usa un tamaño propio (no el `size="display"` de <Heading>, que a
 * 1440–1920px con 4 líneas empujaba el CTA fuera del viewport — THEME.md §5
 * prohíbe explícitamente que un título "oculte el CTA"). Es un <h1> directo,
 * no <Heading>, para no arrastrar ese conflicto de tamaño a las otras
 * secciones que sí usan <Heading> con sus tamaños estándar. Verificado con
 * captura en 1440/1920/tablet/mobile tras el ajuste.
 */
export function HeroSection() {
  return (
    <Section id="inicio" tone="deep" className="relative overflow-hidden pb-16 pt-24 sm:pt-28">
      <HeroParticlesBackground className="pointer-events-none absolute inset-0 h-full w-full" />

      <Container as="div" className="relative z-10 flex flex-col items-center text-center">
        <div className="relative h-28 w-28 sm:h-36 sm:w-36">
          {/* <HeroPoster className="h-full w-full object-contain" /> */}
          <HeroLogoCanvasLoader className="absolute inset-0 h-full w-full" />
        </div>

        <HeroIntro className="mt-10 flex flex-col items-center">
          <h1 className="max-w-3xl font-display text-[clamp(2.75rem,5.5vw,5.5rem)] font-semibold leading-[1.05] text-brand-white">
            Convierte cada cobro en claridad.
          </h1>
          <p className="mt-6 max-w-md text-lead text-brand-white/80">
            Dream Préstamos reúne clientes, préstamos, cobradores, rutas en un solo sistema para que tu negocio crezca con control.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <TrackedCtaButton event="cta_trial_click" href={trialAnchor} variant="primary" size="lg">
              Probar gratis
            </TrackedCtaButton>
            <TrackedCtaButton
              event="cta_demo_click"
              href="#como-funciona"
              variant="secondary"
              tone="dark"
              size="lg"
            >
              Ver cómo funciona
            </TrackedCtaButton>
          </div>
        </HeroIntro>
      </Container>
    </Section>
  );
}
