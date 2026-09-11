import { Section } from "@/components/ui/Section";
import { SystemScreenshotsCarousel } from "./SystemScreenshotsCarousel";
import { systemScreenshots } from "@/config/systemScreenshots";

/**
 * Server Component: solo sección, contenedor y carga de datos. Toda la
 * interacción (GSAP, ScrollTrigger, selección, teclado) vive en la isla
 * cliente `SystemScreenshotsCarousel` (ARQUITECTURA.md §3).
 *
 * Sin `SectionReveal` aquí: el carrusel ya no fija (pin) ni secuestra el
 * scroll de la página (ver `SystemScreenshotsCarousel`), pero mantiene su
 * propia vista a pantalla completa mientras gira. El resto de secciones
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
