"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { navItems, trialAnchor } from "@/config/navigation";
import { Button } from "@/components/ui/Button";
import { trackEvent } from "@/lib/analytics/track";

type MobileNavProps = {
  loginUrl?: string;
};

/**
 * Único cliente del header (ARQUITECTURA.md §3): abre/cierra el panel,
 * bloquea el scroll de fondo, cierra con Escape y devuelve el foco al botón
 * que lo abrió (NAVEGACION.md §6).
 */
export function MobileNav({ loginUrl }: MobileNavProps) {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        aria-controls="menu-movil"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-md text-brand-white transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-blue"
      >
        {open ? <X size={20} aria-hidden="true" /> : <Menu size={20} aria-hidden="true" />}
      </button>

      {open ? (
        <div
          id="menu-movil"
          className="fixed inset-0 top-16 z-40 flex flex-col gap-6 bg-brand-ink px-6 py-8"
        >
          <nav aria-label="Navegación principal">
            <ul className="flex flex-col gap-5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-h3 font-display text-brand-white"
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul> 
          </nav>

          <div className="mt-auto flex flex-col gap-3">
            {loginUrl ? (
              <a
                href={loginUrl}
                className="text-body font-medium text-brand-white"
                onClick={() => setOpen(false)}
              >
                Iniciar sesión
              </a>
            ) : null}
            <Button
              href={trialAnchor}
              variant="primary"
              onClick={() => {
                trackEvent("cta_trial_click");
                setOpen(false);
              }}
            >
              Probar gratis
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
