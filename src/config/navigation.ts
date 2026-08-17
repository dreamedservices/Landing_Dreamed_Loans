export type NavItem = {
  label: string;
  href: string;
};

/** Anclas canónicas — STACK-TECNOLOGICO.md §11, NAVEGACION.md §2. */
export const navItems: NavItem[] = [
  { label: "Producto", href: "#producto" },
  { label: "Funciones", href: "#funciones" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Planes", href: "#planes" },
  { label: "Preguntas", href: "#preguntas" },
];

export const pricingAnchor = "#planes";

export const trialAnchor = "#prueba-gratis";
