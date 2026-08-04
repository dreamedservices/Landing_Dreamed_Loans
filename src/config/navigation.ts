export type NavItem = {
  label: string;
  href: string;
};

/** Anclas canónicas — STACK-TECNOLOGICO.md §11, NAVEGACION.md §2. */
export const navItems: NavItem[] = [
  { label: "Producto", href: "#producto" },
  { label: "Funciones", href: "#funciones" },
  { label: "Cómo funciona", href: "#como-funciona" },
  { label: "Preguntas", href: "#preguntas" },
];

export const trialAnchor = "#prueba-gratis";
