# 0001 · Monorepo con pnpm workspaces y Turborepo

2026-10-26 · aceptada

## Contexto

Rona 3D tiene una web, una API y lógica de negocio (fórmulas, validaciones) que ambas necesitan. Con repos separados habría que publicar un paquete o duplicar código.

## Decisión

Un solo repositorio con `apps/web`, `apps/api`, `packages/shared` y `packages/config`. pnpm 12 para workspaces (rápido, estricto con las dependencias) y Turborepo 2 para orquestar `lint/typecheck/test/build` con caché.

## Consecuencias

- Las fórmulas viven una sola vez, con un solo juego de tests.
- Un PR puede tocar front y back de forma atómica.
- Vercel y Render tienen que configurarse con el subdirectorio correcto (ver `docs/deploy.md`).
