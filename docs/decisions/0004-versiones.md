# 0004 · Política de versiones: la última mayor asentada

2026-10-26 · aceptada

## Contexto

Nacho quiere mantenerse al día con la tecnología, pero sin pagar el costo de ser el primero en pisar cada bug.

## Decisión

Se usa la última versión **mayor** de cada dependencia que ya esté asentada (meses de patches, ecosistema compatible), no la que salió ayer. Se fija en `engines` / `packageManager` y se revisa al inicio de cada fase.

Al 2026-10-26: Node **24 LTS** (26 entra en LTS este mes, se evalúa en 2027), pnpm 12, Turbo 2, TypeScript **6.0** (7.0 es estable desde julio pero typescript-eslint todavía acepta `<6.1`; se migra cuando lo soporte), React 19.3, Vite 8, React Router 8, Tailwind 4, Zod 4, NestJS 12, Mongoose 9, Vitest 5, ESLint 10, `vite-plugin-pwa` 1.x (2.0 tiene tres semanas).

## Consecuencias

- Cada subida de mayor es un PR propio con su nota acá.
- Dependabot abre PRs de patches/minors; los majors se evalúan a mano.
