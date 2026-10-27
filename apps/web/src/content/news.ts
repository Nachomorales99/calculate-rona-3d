export type NewsTag = "Plataforma" | "Taller" | "Blog";

export interface NewsItem {
  date: string; // ISO
  title: string;
  tag: NewsTag;
  /** Texto largo solo para la destacada. */
  body?: string;
  href?: string;
  cta?: string;
}

/** La primera es la destacada. Ordenadas de más nueva a más vieja. */
export const NEWS: readonly NewsItem[] = [
  {
    date: "2026-10-27",
    title: "La calculadora de costos ya está online.",
    tag: "Plataforma",
    body: "La primera app de Rona 3D. Cargás lo que te da el laminador, tu filamento, tu luz y tu impresora, y te dice cuánto cuesta cada pieza y cuánto cobrarla. Gratis, sin cuenta.",
    href: "/calculadora",
    cta: "Probarla",
  },
  {
    date: "2026-10-20",
    title: "Nueva web de Rona 3D, con las fórmulas de la calculadora abiertas y testeadas",
    tag: "Plataforma",
    href: "/blog/por-que-rehicimos-la-web",
  },
  {
    date: "2026-10-12",
    title: "Nueva tanda de llaveros con nombre para la feria de Godoy Cruz",
    tag: "Taller",
    href: "/piezas",
  },
  {
    date: "2026-10-03",
    title: "Probamos PLA-CF: qué cambia en costo y en acabado",
    tag: "Blog",
    href: "/blog/pla-cf-vale-la-pena",
  },
];
