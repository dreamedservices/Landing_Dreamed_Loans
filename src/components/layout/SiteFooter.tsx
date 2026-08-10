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

const dreamedServices = {
  name: "Dreamed Services S.R.L.",
  description: "Agencia de Publicidad y Desarrollo de Software.",
  website: "https://dreamedservices.com",
  founded: 2020,
  social: [
    {
      label: "Facebook",
      href: "https://www.facebook.com/dreamedservices?mibextid=ZbWKwL",
      icon: FacebookIcon,
    },
    {
      label: "Instagram",
      href: "https://instagram.com/dreamedservices?igsh=MXFjbnRxdTQ1NGtyag==",
      icon: InstagramIcon,
    },
    {
      label: "LinkedIn",
      href: "https://do.linkedin.com/company/dreamedservices",
      icon: LinkedInIcon,
    },
    {
      label: "WhatsApp",
      href: "https://api.whatsapp.com/send/?phone=18092304923",
      icon: WhatsAppIcon,
    },
  ],
} as const;

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M13.5 21v-7.5h2.5l.5-3h-3V8.5c0-.87.24-1.5 1.5-1.5H16.5V4.3c-.28-.04-1.2-.12-2.28-.12-2.26 0-3.8 1.38-3.8 3.9V10.5H8v3h2.42V21h3.08Z"
        fill="currentColor"
      />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="4.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="3.6" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16.4" cy="7.6" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <rect x="4" y="4" width="16" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 10.5v6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="7.7" r="1" fill="currentColor" />
      <path
        d="M11.3 16.5v-3.2c0-1.1.7-1.9 1.8-1.9 1.1 0 1.6.8 1.6 1.9v3.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4" aria-hidden="true">
      <path
        d="M12 4a8 8 0 0 0-6.9 12.03L4 20l4.1-1.07A8 8 0 1 0 12 4Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M9.2 9.6c.1-.5.5-.5.9-.5.2 0 .4 0 .5.3l.6 1.3c.1.2 0 .4-.1.5l-.4.4c-.1.2-.1.3 0 .5.4.7 1.1 1.4 1.8 1.8.2.1.3.1.5 0l.4-.4c.1-.1.3-.2.5-.1l1.3.6c.3.1.3.3.3.5 0 .4 0 .8-.5.9-.7.2-1.6.2-3-.6-1.2-.7-2.2-1.7-2.9-2.9-.8-1.4-.8-2.3-.6-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

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

        <div className="mt-12 flex flex-col gap-6 border-t border-line-dark pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-label uppercase tracking-[0.08em] text-brand-white/50">
              Desarrollado por
            </p>
            <a
              href={dreamedServices.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-body font-semibold text-brand-white hover:text-brand-blue"
            >
              {dreamedServices.name}
            </a>
            <p className="mt-1 max-w-sm text-small text-brand-white/60">
              {dreamedServices.description}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {dreamedServices.social.map(({ label, href, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-white/30 text-brand-white/80 transition-colors hover:border-brand-blue hover:text-brand-blue"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <p className="mt-8 text-small text-brand-white/50">
          © {year} {site.name}. Todos los derechos reservados.
        </p>
        <p className="mt-1 text-small text-brand-white/40">
          Copyright {dreamedServices.founded} - {year} © - {dreamedServices.name} | Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
