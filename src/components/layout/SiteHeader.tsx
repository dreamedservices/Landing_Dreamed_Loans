import Image from "next/image";
import Link from "next/link";
import logoSmall from "@/assets/brand/logoLether.png";
import { navItems, pricingAnchor, trialAnchor } from "@/config/navigation";
import { site } from "@/config/site";
import { Button } from "@/components/ui/Button";
import { TrackedCtaButton } from "@/components/analytics/TrackedCtaButton";
import { MobileNav } from "./MobileNav";

type SiteHeaderProps = {
  loginUrl?: string;
};

/**
 * Server Component. La única isla cliente es MobileNav (ARQUITECTURA.md §3).
 * Altura fija (h-16) para evitar CLS al fijar la posición (NAVEGACION.md §3).
 */
export function SiteHeader({ loginUrl }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-line-dark bg-brand-ink/95 backdrop-blur">
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logoSmall} alt={site.name} height={42} className="h-10 w-25" priority />
          <span className="sr-only">{site.name}</span>
        </Link>

        <nav aria-label="Navegación principal" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-body font-medium text-brand-white/80 transition-colors duration-150 hover:text-brand-white"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden items-center gap-4 md:flex">
          {loginUrl ? (
            <a
              href={loginUrl}
              className="text-body font-medium text-brand-white/80 transition-colors duration-150 hover:text-brand-white"
            >
              Iniciar sesión
            </a>
          ) : null}
          <Button href={pricingAnchor} variant="secondary" size="sm" tone="dark">
            Ver planes
          </Button>
          <TrackedCtaButton event="cta_trial_click" href={trialAnchor} variant="primary" size="sm">
            Probar gratis
          </TrackedCtaButton>
        </div>

        <MobileNav loginUrl={loginUrl} />
      </div>
    </header>
  );
}
