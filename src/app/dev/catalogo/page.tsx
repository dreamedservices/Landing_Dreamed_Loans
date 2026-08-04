import { notFound } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Heading } from "@/components/ui/Heading";
import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  robots: { index: false, follow: false },
};

/**
 * Catálogo interno de Fase 02. No es parte del sitio público: solo existe
 * fuera de producción para revisar tokens/primitivas en 320/768/1440px.
 */
export default function CatalogoPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <main>
      <Section tone="dark">
        <Container as="div" className="flex flex-col gap-10">
          <div>
            <Eyebrow tone="dark">Catálogo interno · Fase 02</Eyebrow>
            <Heading level={1} size="h2" tone="dark">
              Fondo oscuro
            </Heading>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<ArrowUpRight aria-hidden="true" size={18} />}>
              Probar gratis
            </Button>
            <Button variant="secondary" tone="dark">
              Ver cómo funciona
            </Button>
            <Button variant="ghost" tone="dark">
              Fantasma
            </Button>
            <Button variant="primary" isLoading>
              Enviando…
            </Button>
            <Button variant="primary" disabled>
              Deshabilitado
            </Button>
            <IconButton ariaLabel="Abrir menú" icon={<Menu size={18} />} tone="dark" />
            <IconButton ariaLabel="Cerrar" icon={<X size={18} />} tone="dark" />
          </div>

          <div className="flex flex-wrap gap-3">
            <Badge tone="success">Al día</Badge>
            <Badge tone="info">Pendiente</Badge>
            <Badge tone="warning">En ruta</Badge>
            <Badge tone="danger">Atrasado</Badge>
            <Badge tone="neutral">Pagado</Badge>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Card tone="dark" interactive>
              <Eyebrow tone="dark">Cobranza</Eyebrow>
              <Heading level={3} tone="dark" className="mt-2">
                Card interactiva
              </Heading>
              <p className="mt-2 text-body text-brand-white/80">
                Texto de apoyo de ejemplo dentro de una card oscura.
              </p>
            </Card>
            <Card tone="light">
              <Eyebrow tone="light">Control financiero</Eyebrow>
              <Heading level={3} tone="light" className="mt-2">
                Card clara
              </Heading>
              <p className="mt-2 text-body text-brand-ink/80">
                Texto de apoyo de ejemplo dentro de una card clara.
              </p>
            </Card>
          </div>
        </Container>
      </Section>

      <Section tone="light">
        <Container as="div" className="flex flex-col gap-10">
          <div>
            <Eyebrow tone="light">Catálogo interno · Fase 02</Eyebrow>
            <Heading level={2} tone="light">
              Fondo claro
            </Heading>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" icon={<ArrowUpRight aria-hidden="true" size={18} />}>
              Probar gratis
            </Button>
            <Button variant="secondary" tone="light">
              Ver cómo funciona
            </Button>
            <Button variant="ghost" tone="light">
              Fantasma
            </Button>
          </div>

          <form className="grid max-w-xl gap-5" aria-label="Formulario de ejemplo, no funcional">
            <Input id="demo-nombre" label="Nombre y apellido" name="nombre" autoComplete="name" required />
            <Input
              id="demo-correo"
              label="Correo"
              name="correo"
              type="email"
              autoComplete="email"
              required
              error="Revisa el formato del correo."
            />
            <Select
              id="demo-pais"
              label="País"
              name="pais"
              placeholder="Selecciona un país"
              options={[{ value: "do", label: "República Dominicana" }]}
            />
            <Textarea id="demo-mensaje" label="Mensaje" name="mensaje" hint="Opcional." />
            <Checkbox
              id="demo-consentimiento"
              label="Autorizo el uso de mis datos para gestionar esta solicitud."
              required
            />
          </form>

          <table className="w-full border-collapse text-left text-body text-brand-ink">
            <caption className="mb-2 text-left text-small text-brand-ink/60">
              Próximos cobros — datos ilustrativos
            </caption>
            <thead>
              <tr className="border-b border-line-light">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Cliente
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Monto
                </th>
                <th scope="col" className="py-2 font-medium">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-line-light">
                <td className="py-2 pr-4">J. P.</td>
                <td className="py-2 pr-4 tabular-nums">RD$ 2,500</td>
                <td className="py-2">
                  <Badge tone="success">Al día</Badge>
                </td>
              </tr>
              <tr>
                <td className="py-2 pr-4">M. R.</td>
                <td className="py-2 pr-4 tabular-nums">RD$ 1,800</td>
                <td className="py-2">
                  <Badge tone="danger">Atrasado</Badge>
                </td>
              </tr>
            </tbody>
          </table>
        </Container>
      </Section>
    </main>
  );
}
