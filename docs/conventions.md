# Convenciones de código

## Estructura por features

Cada app se organiza por **lo que hace**, no por tipo de archivo. Un feature es una carpeta autocontenida con todo lo suyo:

```
apps/web/src/features/calculator/
├── components/       UI propia del feature
├── hooks/            lógica de React (useCalculator, useQuotePdf)
├── storage/          CalculatorStorage + adapters
├── pdf/              generación del PDF (import dinámico de jsPDF)
├── calculator.store.ts
└── index.ts          lo que el feature expone al resto de la app
```

Lo que comparten varios features va a `components/ui` (sistema de diseño) o `lib/` (utilidades). Si dos features se importan entre sí, probablemente falta un tercer módulo.

En la API, cada módulo de Nest sigue `controller → service → repository`:

```
apps/api/src/modules/quotes/
├── quotes.controller.ts   rutas, DTOs (Zod de shared), guards
├── quotes.service.ts      reglas de negocio, orquestación
├── quotes.repository.ts   acceso a Mongo detrás de una interfaz
├── quotes.schema.ts       esquema de Mongoose
├── quotes.module.ts
└── quotes.service.spec.ts
```

## Nombres

- Archivos: `kebab-case.ts`; componentes React: `PascalCase.tsx`; hooks: `useAlgo.ts`.
- Tipos e interfaces: `PascalCase`, sin prefijo `I`.
- Constantes: `UPPER_SNAKE` solo para valores realmente constantes (`DEFAULT_CURRENCY`).
- Funciones puras del dominio: verbo + sustantivo (`calcPrintCost`, `buildQuote`, `formatMoney`).
- Booleanos: `is`, `has`, `can`, `should`.
- Identificadores en inglés; textos de UI, docs y commits en castellano.

## TypeScript

- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`.
- `import type` para tipos. Nada de `any`; si un tipo externo es malo, se envuelve con un tipo propio.
- No se usa `as` para forzar tipos, salvo `as const`. Si hace falta narrowing, se escribe un type guard.
- Los errores de dominio son clases (`class QuotaExceededError extends Error`), no strings.

## Validación

- Toda entrada externa pasa por un esquema Zod de `@rona3d/shared`. En el front, con `react-hook-form` + `zodResolver`. En la API, con `nestjs-zod` (`createZodDto`).
- Las funciones del motor **además** sanean sus entradas (`nonNegative`, `atLeastOne`) para ser totales.

## Estado en la web

- Estado de servidor: TanStack Query (nunca se copia a un store).
- Estado de la calculadora: Zustand, un store por feature, persistido a través de `CalculatorStorage`.
- Estado de UI local: `useState`.

## Estilos

- Tailwind 4 con los tokens de marca en `@theme` (`apps/web/src/app/theme.css`). No se escriben hex sueltos en los componentes.
- Componentes del sistema de diseño en `components/ui`, con variantes explícitas (`<Button variant="primary">`), no con clases condicionales sueltas.

## Tests

- `shared`: Vitest, un `*.test.ts` por archivo, cobertura ≥ 95 %. Los tests nombran el comportamiento en castellano.
- `web`: Vitest + Testing Library para hooks y componentes con lógica. Nada de snapshots.
- `api`: Jest. Services con repositorios mockeados; e2e con `mongodb-memory-server` para los flujos críticos (auth, entitlements, quotes).
- Playwright: un smoke que calcula, descarga un PDF y hace login.

## Commits y ramas

- Conventional Commits en castellano, con scope: `feat(web): selector de moneda`, `fix(shared): redondeo con punto flotante`, `docs(repo): ADR de Auth0`.
- Scopes válidos: `web`, `api`, `shared`, `config`, `docs`, `ci`, `deps`, `repo` (en `commitlint.config.js`).
- Ramas: `feat/…`, `fix/…`, `docs/…`, `chore/…`. PR a `main` con CI verde. Squash merge con el título del PR como commit.

## Agregar cosas

- **Un paquete nuevo**: carpeta en `packages/`, `package.json` con nombre `@rona3d/<nombre>`, extiende `@rona3d/config`, README propio, scope nuevo en commitlint.
- **Una app nueva**: carpeta en `apps/`, mismo criterio, más su entrada en `docs/deploy.md`.
- **Un módulo de Nest**: carpeta en `apps/api/src/modules/`, registrado en `app.module.ts`, con su `*.spec.ts`.
- **Un feature de web**: carpeta en `features/`, expone solo lo necesario por `index.ts`, ruta registrada en `app/router.tsx` con `lazy`.
