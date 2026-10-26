# Sistema de diseño Rona 3D

> Borrador de fase 0. Se completa en la fase 1 después de elegir entre los tres bocetos de dirección.

## Punto de partida

Rona 3D es un dialecto del sistema RONA GAMES (ver `RONA_GAMES_manual_de_marca` y el `LEEME.txt` del pack Rona 3D):

- Una sola tinta de marca. Logotipo en Alfa Slab One con la **ficha extruida** (ficha de cuatro pips calados, despegada del plano, con sombra desplazada 10 % del radio hacia abajo-derecha).
- Rona 3D usa **siempre** la ficha extruida; nunca la plana de RONA GAMES. Nunca las dos en la misma pieza.
- Los pips son huecos reales: dejan ver el fondo.

## Tokens

| Token     | Claro     | Oscuro    | Uso                                    |
| --------- | --------- | --------- | -------------------------------------- |
| `paper`   | `#F5EFE4` | `#16161A` | fondo de página                        |
| `surface` | `#FFFFFF` | `#202026` | paneles, tarjetas                      |
| `ink`     | `#16161A` | `#F5EFE4` | texto                                  |
| `muted`   | `#5E5A55` | `#ABA498` | texto secundario                       |
| `line`    | `#E2D9CA` | `#34343C` | bordes                                 |
| `accent`  | `#E14424` | `#E14424` | acciones primarias, ficha, total       |
| `plate`   | `#16161A` | `#0E0E11` | el panel de resultado (siempre oscuro) |

Tipografía: **Alfa Slab One** (títulos, números grandes, multiplicadores) y **Archivo** (texto, formularios, tablas con `tabular-nums`). Ambas locales (`@fontsource`), nunca desde Google Fonts en producción.

## Lenguaje visual: extrusión

- **Sombra dura desplazada** (`box-shadow: 4px 4px 0 var(--ink)`) en botones y tarjetas interactivas. Hover: el elemento se levanta (`translate(-1px,-1px)` + sombra 5px). Active: se hunde (sombra 2px). Sin blur, nunca.
- **Líneas de capa**: `repeating-linear-gradient` horizontal de 1px cada 4px, muy sutil, en el panel de resultado y en bandas de sección. Evoca las capas de impresión.
- **Radios** chicos y consistentes (10–14px). Nada de píldoras gigantes salvo los chips de multiplicador.
- **Un solo acento**: el rojo aparece poco y siempre con significado (acción principal, total, estado activo).

## Lo que no se hace

Degradados borrosos de fondo, glassmorphism, violeta/azul SaaS, sombras difusas, emojis como iconos, iconos de tres librerías distintas, hero centrado con dos botones, animaciones largas o que no aportan información.

## Referencia de producto: Linear

Tomamos de Linear la **sensación**, no la estética: todo responde al instante (optimistic UI), atajos de teclado documentados, paleta de comandos (`⌘K`) para moverse entre apps y acciones, densidad justa, estados vacíos útiles, modo oscuro tan cuidado como el claro, transiciones de 120–200 ms con propósito.

## Accesibilidad

Labels visibles siempre (los placeholders no son labels), foco visible con `outline` del acento, contraste AA (4.5:1 texto, 3:1 UI), targets ≥ 44px en mobile, `aria-live` en el panel de resultado, `prefers-reduced-motion` desactiva los reveals.

## Pendiente para la fase 1

- Elegir dirección entre tres bocetos.
- Definir la escala tipográfica y de espaciado en `theme.css`.
- Inventario de componentes: Button, Input (con prefijo/sufijo), Select, Checkbox, Chip, Panel, Plate (resultado), Paper (vista previa del presupuesto), Toast, Dialog, CommandPalette.
- Iconos: un solo set (Lucide), tamaño 20px, `aria-hidden` cuando acompañan texto.
