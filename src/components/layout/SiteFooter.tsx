import Image from "next/image";
import Link from "next/link";
import logoFull from "@/assets/brand/logo-full.png";
import { navItems, trialAnchor } from "@/config/navigation";
import { site } from "@/config/site";
import { TrackedLink } from "@/components/analytics/TrackedLink";
import { CookiePreferencesButton } from "@/components/analytics/CookiePreferencesButton";

type SiteFooterProps = {
  loginUrl?: string;
};

const contactEmail = "dreamedservice@gmail.com";

export function SiteFooter({ loginUrl }: SiteFooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-dark bg-brand-ink text-brand-white">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-8 lg:px-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <Image src={logoFull} alt={site.name} height={40} className="h-9 w-auto" />
            <p className="mt-4 max-w-sm text-body text-brand-white/70">{site.shortDescription}</p>
          </div>

          <nav aria-label="Navegación secundaria">
            <p className="text-label uppercase tracking-[0.08em] text-brand-white/50">Navegación</p>
            <ul className="mt-4 flex flex-col gap-3">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-body text-brand-white/80 hover:text-brand-white">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <TrackedLink
                  event="cta_trial_click"
                  href={trialAnchor}
                  className="text-body text-brand-white/80 hover:text-brand-white"
                >
                  Probar gratis
                </TrackedLink>
              </li>
              {loginUrl ? (
                <li>
                  <a href={loginUrl} className="text-body text-brand-white/80 hover:text-brand-white">
                    Iniciar sesión
                  </a>
                </li>
              ) : null}
            </ul>
          </nav>

          <div>
            <p className="text-label uppercase tracking-[0.08em] text-brand-white/50">Legal</p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <Link href="/privacidad" className="text-body text-brand-white/80 hover:text-brand-white">
                  Privacidad
                </Link>
              </li>
              <li>
                <Link href="/terminos" className="text-body text-brand-white/80 hover:text-brand-white">
                  Términos
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-body text-brand-white/80 hover:text-brand-white">
                  Cookies
                </Link>
              </li>
              <li>
                <CookiePreferencesButton />
              </li>
              <li>
                <a
                  href={`mailto:${contactEmail}`}
                  className="text-body text-brand-white/80 hover:text-brand-white"
                >
                  {contactEmail}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="mt-12 text-small text-brand-white/50">
          © {year} {site.name}. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
