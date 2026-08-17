import { Section } from "@/components/ui/Section";
import { SystemScreenshotsCarousel } from "./SystemScreenshotsCarousel";
import { systemScreenshots } from "@/config/systemScreenshots";

/**
 * Server Component: solo sección, contenedor y carga de datos. Toda la
 * interacción (GSAP, ScrollTrigger, selección, teclado) vive en la isla
 * cliente `SystemScreenshotsCarousel` (ARQUITECTURA.md §3).
 *
 * Sin `SectionReveal` aquí a propósito: su animación de salida aplica
 * `scale`/`y` continuos (scrub) a un div que envolvería a esta sección. Ese
 * transform en un ancestro rompe el pin de ScrollTrigger — `position: fixed`
 * pasa a calcularse respecto al ancestro transformado en vez del viewport,
 * lo que provoca saltos y una rueda mal posicionada. El resto de secciones
 * conserva `SectionReveal` sin cambios; el seguimiento `section_view` para
 * esta sección se reimplementa dentro del propio carrusel.
 */
export function SystemScreenshotsSection() {
  return (
    <Section id="capturas" tone="light" className="!py-0 md:motion-safe:overflow-hidden">
      <SystemScreenshotsCarousel items={systemScreenshots} />
    </Section>
  );
}
