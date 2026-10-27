# Sistema de diseño Rona 3D

Dirección elegida en la fase 1: **"D · Refinada"**. Estructura tomada de Chopero (apps como boxes con ruta propia, app-shell con barra lateral, marcador Pro, agrupación Herramientas / Mi negocio), terminación tomada de Pxsol (nav flotante, aire, bordes de 1 px, sombras cortas), marca Rona intacta. La home es **el taller**, no la calculadora: hero del taller, novedades, apps, piezas, blog.

## Punto de partida de marca

- Rona 3D es un dialecto del sistema RONA GAMES: una sola tinta de marca, Alfa Slab One, ficha con cuatro pips calados.
- Rona 3D usa **siempre la ficha extruida** (sombra desplazada 10 % del radio hacia abajo-derecha). Nunca la plana. Nunca las dos juntas.
- Los pips son huecos reales: dejan ver el fondo.

## Tokens (`apps/web/src/app/theme.css`, Tailwind 4 `@theme`)

| Token                                      | Claro                                           | Oscuro    | Uso                                                      |
| ------------------------------------------ | ----------------------------------------------- | --------- | -------------------------------------------------------- |
| `paper`                                    | `#F5EFE4`                                       | `#16161A` | fondo de página                                          |
| `surface`                                  | `#FFFFFF`                                       | `#1F1F24` | tarjetas, nav, paneles                                   |
| `field`                                    | `#FFFFFF`                                       | `#18181D` | fondo de inputs                                          |
| `ink`                                      | `#16161A`                                       | `#F5EFE4` | texto principal, bordes fuertes, sombra dura             |
| `muted`                                    | `#5E5A55`                                       | `#ABA498` | texto secundario                                         |
| `line`                                     | `#DDD3C2`                                       | `#34343C` | bordes de 1 px, sombras suaves                           |
| `accent`                                   | `#E14424`                                       | `#E14424` | acción principal, ficha, Pro, énfasis                    |
| `accent-ink`                               | `#FFFFFF`                                       | `#FFFFFF` | texto sobre acento                                       |
| `plate`                                    | `#16161A`                                       | `#0E0E11` | panel de resultado y tarjeta de novedad (siempre oscuro) |
| `plate-ink` / `plate-muted` / `plate-edge` | `#F5EFE4` / `#B9B2A6` / `rgba(245,239,228,.18)` | igual     | texto y borde dentro del plate                           |

Reglas: ningún hex suelto en componentes; el rojo aparece poco y siempre con significado; el modo oscuro es la versión "sobre oscuro" del logo, no una inversión.

## Tipografía

- **Alfa Slab One** (local, `@fontsource/alfa-slab-one`): h1–h3, números grandes, multiplicadores, total del presupuesto. Siempre peso 400.
- **Archivo** (local, `@fontsource-variable/archivo`): todo lo demás. Números en tablas y resultados con `tabular-nums`.
- Escala: h1 `clamp(2.5rem, 5.6vw, 4.4rem)`, h2 `1.9rem`, h3 `1.15rem`, cuerpo `1rem`/1.5, lead `1.12rem`, small `.9rem`, eyebrow `.78rem` mayúsculas con tracking `.08em`.
- `text-wrap: balance` en títulos.

## Forma

- Radios: 999px en nav flotante, pills y chips; 18px en tarjetas grandes (hero, feature); 14px en boxes y tarjetas; 12px en botones; 10px en inputs e iconos.
- Bordes: 1 px `line` por defecto; 1.5 px `ink` en botones y en estado hover/activo.
- **Sombra dura** (extrusión): `3px 3px 0 <color>`; `line` en reposo para superficies, `ink` en hover de tarjetas y en botones. Nunca blur. Hover levanta 2 px (`translate(-2px,-2px)`) y la sombra crece a 4 px.
- **Líneas de capa**: `repeating-linear-gradient(0deg, plate-line 0 1px, transparent 1px 4px)` solo dentro del plate.
- Nav flotante: pill de `surface` con borde `line`, sombra `0 1px 0 line, 3px 3px 0 line`, sticky.

## Componentes (`apps/web/src/components/ui`)

| Componente                                                           | Variantes / notas                                                                                                                                           |
| -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                                                             | `primary` (accent), `secondary` (surface + borde ink + sombra), `ghost` (sin fondo, borde line). Tamaños `md`, `sm`. Siempre con sombra dura salvo `ghost`. |
| `Input`                                                              | prefijo/sufijo (`$`, `g`, `h`), label visible obligatorio, `inputmode` según el dato.                                                                       |
| `Select`, `Checkbox`, `Textarea`                                     | mismos bordes que Input.                                                                                                                                    |
| `Chip`                                                               | acciones rápidas ("+ Argolla"), borde dashed.                                                                                                               |
| `Pill`                                                               | eyebrow y etiquetas; `Pro` (accent), `Pronto` (muted, dashed).                                                                                              |
| `Panel`                                                              | tarjeta `surface` + `line` + radio 14.                                                                                                                      |
| `Plate`                                                              | panel oscuro con líneas de capa para resultados.                                                                                                            |
| `AppBox`                                                             | icono (ficha) + nombre + resumen + ruta en mono + flecha. Link completo.                                                                                    |
| `SectionHeader`                                                      | h2 + párrafo + link a la derecha.                                                                                                                           |
| `GroupLabel`                                                         | eyebrow con regla a la derecha ("Herramientas", "Mi negocio").                                                                                              |
| `FloatNav`, `Footer`, `AppShell` (barra lateral para rutas de apps). |

## Movimiento (`apps/web/src/lib/motion`)

GSAP 3 + ScrollTrigger con `@gsap/react` (`useGSAP` limpia al desmontar). Cinco presets, tomados de la skill ui-ux-pro-max:

| Preset               | Dónde                        | Parámetros                                                                   |
| -------------------- | ---------------------------- | ---------------------------------------------------------------------------- |
| Titular por palabras | h1 del hero                  | `opacity 0→1, y 18, 0.55s, stagger 0.045, expo.out`                          |
| Reveal al scroll     | cada `<section data-reveal>` | hijos: `opacity 0→1, y 24, 0.5s, stagger 0.08, power2.out`, `start: top 85%` |
| Stagger de grilla    | mosaico, boxes, posts        | `y 16, scale .96, 0.45s, stagger 0.06 grid auto, back.out(1.4)`              |
| Hover lift           | boxes, posts, piezas         | `y -2, 0.15s, power1.out`, con tween inverso en mouseleave                   |
| Transición de ruta   | `<main>`                     | salida `opacity 0.2s`, entrada `opacity 0.2s`; nunca bloquea la navegación   |

`prefers-reduced-motion: reduce` apaga todo: la página se renderiza en su estado final. Ninguna animación cambia layout (solo transform y opacity).

## Estructura de la home

1. Nav flotante: Novedades · Apps · Piezas · Blog · Ingresar · Crear cuenta.
2. Hero del taller: eyebrow con ficha, h1, lead, dos CTAs (Ver las piezas / Explorar las apps), fila de datos; a la derecha mosaico de piezas con la ficha extruida.
3. Novedades: tarjeta destacada (plate) con la novedad más reciente + lista con fecha y etiqueta.
4. Apps: encabezado, grupo Herramientas, grupo Mi negocio, boxes.
5. Del taller: grilla de piezas (fotos reales vía Cloudinary más adelante).
6. Lo que aprendemos: tres posts.
7. Footer.

## Rutas

`/` · `/novedades` · `/apps` · `/calculadora` · `/llaveros` (pronto) · `/factura` (pronto) · `/presupuestos` (pronto) · `/perfiles` (pronto) · `/piezas` · `/blog` · `/blog/:slug` · `/cuenta/*` (fase 2). Las apps renderizan dentro de `AppShell` (barra lateral + breadcrumb + `⌘K`).

## Accesibilidad

Labels visibles, foco visible con `outline` accent, contraste AA, targets ≥ 44 px en mobile, `aria-live="polite"` en el panel de resultado, `aria-pressed` en los multiplicadores, iconos decorativos con `aria-hidden`.

## Iconos

Lucide (`lucide-react`), 20 px, trazo 1.75. La ficha extruida (SVG propio, `currentColor` + accent) es el icono de las apps.
