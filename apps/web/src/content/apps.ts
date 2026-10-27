/** Catálogo de apps. Cada una vive en su propia ruta. Se muestra en la home, en /apps y en la barra lateral. */
export type AppStatus = "available" | "soon";
export type AppGroup = "tools" | "business";

export interface AppEntry {
  slug: string;
  name: string;
  summary: string;
  route: `/${string}`;
  group: AppGroup;
  status: AppStatus;
  /** Necesita cuenta Rona (trial 30 días, después suscripción). */
  pro: boolean;
}

export const APP_GROUPS: Record<AppGroup, string> = {
  tools: "Herramientas",
  business: "Mi negocio",
};

export const APPS: readonly AppEntry[] = [
  {
    slug: "calculadora",
    name: "Calculadora de costos",
    summary:
      "Filamento, luz, desgaste, fallas y extras. Multiplicás, redondeás y bajás el presupuesto en PDF.",
    route: "/calculadora",
    group: "tools",
    status: "available",
    pro: false,
  },
  {
    slug: "llaveros",
    name: "Llaveros",
    summary:
      "Nombre, fuente y forma. Generá el STL listo para la cama y calculá el costo en el mismo paso.",
    route: "/llaveros",
    group: "tools",
    status: "soon",
    pro: false,
  },
  {
    slug: "factura",
    name: "Lector de factura",
    summary:
      "Una foto de la factura de luz y te completamos el kWh marginal con los impuestos de tu distribuidora.",
    route: "/factura",
    group: "tools",
    status: "soon",
    pro: true,
  },
  {
    slug: "presupuestos",
    name: "Presupuestos",
    summary: "Con tu logo, tus colores y tus datos. Numerados, con historial y estado de cada uno.",
    route: "/presupuestos",
    group: "business",
    status: "soon",
    pro: true,
  },
  {
    slug: "perfiles",
    name: "Perfiles de cálculo",
    summary:
      "“Llaveros con PLA”, “Macetas con PETG”: guardá la configuración y cotizá en dos clics.",
    route: "/perfiles",
    group: "business",
    status: "soon",
    pro: true,
  },
  {
    slug: "taller",
    name: "Mi taller",
    summary: "Tu impresora, tu ciudad y tu tarifa de luz guardadas, con historial bimestral.",
    route: "/mi-taller",
    group: "business",
    status: "soon",
    pro: true,
  },
];

export function findApp(slug: string): AppEntry | undefined {
  return APPS.find((a) => a.slug === slug);
}
