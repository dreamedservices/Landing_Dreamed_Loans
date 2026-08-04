import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { TextReveal } from "@/components/motion/TextReveal";
import { Parallax } from "@/components/motion/Parallax";
import cobradorEnRuta from "@/assets/product/cobrador-en-ruta.png";
import avatarLab from "@/assets/product/avatar-lab.png";

const capabilities = [
  "Rastreo GPS en vivo: llegada estimada, distancia y progreso de la ruta.",
  "Agenda de cobro por pestañas — Hoy, Próximas y Hechas.",
  "Optimiza el orden de las visitas con un toque, vía Google Maps.",
  "Meta diaria del cobrador con avance en tiempo real.",
];

/** Cobranza: cobradores, rutas y geolocalización (README.md §Capacidades verificadas). */
export function CollectionSection() {
  return (
    <Section tone="deep">
      <Container as="div">
        <Reveal className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow tone="dark">Cobranza</Eyebrow>
            <TextReveal>
              <Heading level={2} tone="dark" className="mt-2">
                Organiza rutas y cobros sin perder de vista al equipo.
              </Heading>
            </TextReveal>
            <p className="mt-4 max-w-prose text-lead text-brand-white/80">
              Cada cobrador tiene su experiencia en ruta, con mapas y
              geolocalización, mientras el negocio sigue el avance de la
              jornada de cobro completa.
            </p>

            <ul className="mt-8 flex flex-col gap-4">
              {capabilities.map((item) => (
                <li key={item} className="flex items-start gap-3 text-body text-brand-white/80">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[image:var(--gradient-brand)]"
                  />
                  {item}
                </li>
              ))}
            </ul>

            <div className="mt-8 flex items-center gap-4 border-t border-line-dark pt-6">
              <Image
                src={avatarLab}
                alt="Laboratorio de avatares del cobrador, con un personaje ilustrado personalizable"
                className="h-16 w-16 rounded-xl object-cover"
              />
              <p className="text-small text-brand-white/70">
                Cada cobrador puede personalizar su avatar desde el laboratorio
                de personajes de la app.
              </p>
            </div>
          </div>

          <Parallax offset={20} className="flex justify-center">
            <div className="relative">
              <Badge tone="warning" className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
                Captura real de la app
              </Badge>
              <Image
                src={cobradorEnRuta}
                alt="Pantalla del cobrador en ruta: mapa en vivo con llegada, distancia y progreso"
                className="h-auto w-full max-w-[280px] rounded-[2rem] shadow-soft-dark"
                priority={false}
              />
            </div>
          </Parallax>
        </Reveal>
      </Container>
    </Section>
  );
}
