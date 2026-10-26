# @rona3d/shared

El dominio de Rona 3D en un solo lugar: **funciones puras**, tipos y esquemas Zod que usan tanto la web como la API. No importa React, Nest, ni nada del DOM.

| Módulo        | Qué hay                                                                               |
| ------------- | ------------------------------------------------------------------------------------- |
| `calculator/` | `calcPrintCost`, `calcSalePrice`, `buildQuote`, defaults y esquemas de la calculadora |
| `currency/`   | catálogo de monedas (`ARS` por defecto), `formatMoney`, `roundUpTo`                   |
| `energy/`     | `calcMarginalKwh`: kWh marginal a partir del precio unitario de la factura            |
| `format/`     | utilidades de texto y fecha sin dependencias                                          |

## Reglas

- Toda función es pura y total: recibe números, devuelve números; nunca lee estado global ni lanza por entradas raras (las sanea).
- Cada archivo tiene su `*.test.ts` al lado. Cobertura mínima 95 %.
- El dinero se calcula como `number` y se redondea **solo al final** (`calcSalePrice` / `buildQuote`), nunca en los pasos intermedios.
- Nada acá asume pesos argentinos: la moneda siempre entra como parámetro.

```bash
pnpm --filter @rona3d/shared test
pnpm --filter @rona3d/shared build
```
