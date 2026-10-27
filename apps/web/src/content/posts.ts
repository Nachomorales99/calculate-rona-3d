export interface Post {
  slug: string;
  title: string;
  category: string;
  minutes: number;
  date: string;
  excerpt: string;
  /** Párrafos. Markdown simple más adelante; hoy texto plano. */
  body: readonly string[];
}

export const POSTS: readonly Post[] = [
  {
    slug: "pla-cf-vale-la-pena",
    title: "PLA-CF: ¿vale la pena el precio por kilo?",
    category: "Materiales",
    minutes: 6,
    date: "2026-10-03",
    excerpt:
      "Lo probamos en piezas chicas y en una caja grande. Qué cambia en costo, acabado y desgaste de la boquilla.",
    body: [
      "El PLA con fibra de carbono sale casi un 60 % más caro que el PLA común. En una pieza de 150 g eso son unos dos mil pesos de diferencia; en un llavero de 12 g, casi nada.",
      "Lo que sí cambia es el acabado: mate, sin líneas de capa visibles a un metro, y una rigidez que el PLA no tiene. Para cajas y soportes vale. Para llaveros, no se nota y encima gasta la boquilla de latón en pocas semanas.",
      "Conclusión del taller: PLA-CF solo para piezas estructurales o de exhibición, con boquilla de acero endurecido. Y en la calculadora, cargarlo como tipo aparte para no mezclar precios.",
    ],
  },
  {
    slug: "cuanto-cuesta-una-hora-de-impresion",
    title: "Cuánto cuesta de verdad una hora de impresión",
    category: "Precios",
    minutes: 4,
    date: "2026-09-21",
    excerpt:
      "Luz, desgaste y fallas: los tres costos que casi nadie suma y que terminan comiéndose la ganancia.",
    body: [
      "La mayoría cotiza por gramos de filamento y listo. Pero una impresión de nueve horas también gasta luz, desgasta la impresora y, cada tanto, falla.",
      "Con una impresora de 1.100.000 pesos, 5.000 horas de vida útil y un 20 % de repuestos, el desgaste solo son 264 pesos por hora. Nueve horas: 2.376 pesos, casi lo mismo que el filamento de una pieza mediana.",
      "La calculadora suma los tres por defecto. Si no los querés cobrar, bajalos a cero, pero al menos sabé cuánto estás regalando.",
    ],
  },
  {
    slug: "diez-llaveros-en-una-cama",
    title: "Diez llaveros en una cama: cómo repartir el costo",
    category: "Taller",
    minutes: 3,
    date: "2026-09-10",
    excerpt:
      "Por qué conviene cotizar por tanda y cómo lo resuelve la calculadora con el campo “piezas”.",
    body: [
      "Un llavero solo tarda 40 minutos. Diez en la misma cama tardan cinco horas, pero el desgaste y la luz se reparten entre los diez.",
      "En la calculadora cargás la impresión completa (gramos y tiempo de toda la cama) y en “piezas” ponés 10. El costo total se divide y el precio de venta sale por unidad.",
      "Los extras (argolla, cadena) van por pieza, así que se multiplican solos.",
    ],
  },
  {
    slug: "por-que-rehicimos-la-web",
    title: "Por qué rehicimos la web (y abrimos las fórmulas)",
    category: "Plataforma",
    minutes: 3,
    date: "2026-10-20",
    excerpt:
      "La calculadora era un HTML suelto. Ahora es una app dentro de una plataforma que va a crecer.",
    body: [
      "La primera calculadora de Rona 3D fue un archivo HTML que funcionaba bien pero no podía crecer. La nueva web es un monorepo con la web, una API y un paquete compartido donde viven las fórmulas, con tests.",
      "Eso significa que el número que ves en pantalla y el que va al PDF salen del mismo lugar, y que cada app nueva arranca con la misma base.",
    ],
  },
];

export function findPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
