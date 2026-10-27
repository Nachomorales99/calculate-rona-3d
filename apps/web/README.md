# web

La web pública de Rona 3D y sus apps. Vite 8 + React 19 + TypeScript, Tailwind 4, React Router 8, Zustand, GSAP, PWA.

```bash
pnpm --filter web dev        # http://localhost:5173
pnpm --filter web build      # dist/
pnpm --filter web preview    # sirve dist/ en :4173
pnpm --filter web test
```

## Mapa

```
src/
├── app/            theme.css (tokens Tailwind), router, RootLayout (web) y AppShell (apps)
├── pages/          Home, Novedades, Apps, Piezas, Blog, Post, ComingSoon, NotFound
├── features/
│   └── calculator/ store (Zustand + persist), selectors, storage/ (Strategy), pdf/, components/
├── components/     FloatNav, Sidebar, Footer, AppBox, PieceTile, Logo, ui/ (Button, Input, Plate…)
├── content/        apps, news, posts, pieces, contact (datos en código hasta que exista la API)
└── lib/            motion/ (GSAP: presets y hooks), dates, cn, useDocumentTitle
```

## Cómo se agrega una app

1. Entrada en `src/content/apps.ts` (slug, nombre, resumen, ruta, grupo, `status`, `pro`).
2. Mientras esté en `soon`, la ruta la resuelve `ComingSoonPage` sola.
3. Cuando esté lista: carpeta en `src/features/<slug>/` con su `Page.tsx` y ruta explícita en `app/router.tsx` dentro de `AppShell`.

## Reglas propias de esta app

- Las fórmulas vienen de `@rona3d/shared`; acá no se calcula nada.
- El estado de la calculadora se persiste a través de `CalculatorStorage` (hoy `LocalStorageAdapter`; en fase 2, `ApiStorageAdapter`). La UI no sabe cuál está activo.
- jsPDF, la fuente del PDF (`public/pdf/AlfaSlabOne.ttf`) y el logo (`public/pdf/rona3d-logo.png`) se cargan solo al descargar.
- Toda animación pasa por `lib/motion` y respeta `prefers-reduced-motion`.
- Nada de hex sueltos: colores por tokens de `theme.css`.
