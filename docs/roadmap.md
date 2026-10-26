# Roadmap

Estado al **2026-10-26**. El plan completo con el "por qué" de cada decisión está en el proyecto de Claude de Nacho; acá va el resumen operativo.

| Fase | Qué                                                                                                                                                                  | Estado       |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------ |
| 0    | Fundaciones: monorepo, tooling, CI, docs, `@rona3d/shared` con motor y tests                                                                                         | ✅ hecha     |
| 1    | Web pública + calculadora (sin cuenta): sistema de diseño, Home, Apps, calculadora completa, moneda, luz desde la factura (manual), PDF, PWA, `⌘K`. Deploy en Vercel | ⏳ siguiente |
| 2    | Identidad y backend: Auth0, API Nest, usuarios, entitlements, trial 30 días, seed admin. Render + Atlas                                                              |              |
| 3    | Premium de la calculadora: perfiles, impresoras, luz por usuario con historial, **lectura de factura con IA**, marca propia, historial de presupuestos               |              |
| 4    | Admin y feedback: panel, métricas (incluido gasto en IA), roles, tickets → email                                                                                     |              |
| 5    | Pagos: Mercado Pago, USD 5/mes cobrado en pesos, webhooks, estados                                                                                                   |              |
| 6    | Contenido: blog, novedades, galería de piezas                                                                                                                        |              |

## Decisiones abiertas

- Dominio definitivo (`rona.ar` como paraguas es la idea).
- Login social (Google) además de email + contraseña.
- Plan anual.
