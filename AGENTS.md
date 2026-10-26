# Rona 3D — guía para agentes y personas nuevas

Este archivo es el **punto de entrada** del repositorio y la **fuente de verdad de las reglas**. Si estás por tocar código, leelo entero (son cinco minutos). `CLAUDE.md` es un enlace a este archivo: son el mismo documento.

## 1. Qué es esto

Rona 3D es la línea de impresión 3D de RONA GAMES (Mendoza, Argentina). Este monorepo contiene su plataforma web: una vidriera pública, una sección de **apps para makers** (la primera es la calculadora de costos y presupuestos), y más adelante blog, cuentas de usuario con suscripción y un panel de administración.

- Contacto del proyecto: `rona3d.mdz@gmail.com` · Instagram `@rona3darg`.
- Dueño y único desarrollador humano por ahora: Nacho Morales. Los agentes de IA trabajan a su lado.
- Idioma del producto, de la documentación y de los commits: **castellano rioplatense** (voseo). El código (identificadores, comentarios técnicos cortos) va en inglés.

## 2. Mapa del repositorio

```
apps/web        Vite + React + TypeScript · SPA + PWA · se deploya en Vercel
apps/api        NestJS + Mongoose · se deploya en Render (Docker)
packages/shared @rona3d/shared · dominio compartido: motor de cálculo, monedas, esquemas Zod, formatters
packages/config @rona3d/config · ESLint, Prettier y tsconfig compartidos
docs/           documentación interna (arquitectura, dominio, convenciones, deploy, ADRs)
```

Qué leer después de este archivo, según lo que vayas a hacer:

| Vas a…                                             | Leé                     |
| -------------------------------------------------- | ----------------------- |
| Entender cómo encajan las piezas                   | `docs/architecture.md`  |
| Tocar el modelo de datos, permisos o suscripciones | `docs/domain.md`        |
| Escribir código nuevo                              | `docs/conventions.md`   |
| Tocar la interfaz                                  | `docs/design-system.md` |
| Deployar o configurar servicios externos           | `docs/deploy.md`        |
| Saber por qué se decidió algo                      | `docs/decisions/`       |
| Ver el estado del proyecto y qué sigue             | `docs/roadmap.md`       |

## 3. Comandos

```bash
pnpm install          # instalar todo (requiere Node 24 y pnpm 12; `corepack enable` lo trae)
pnpm dev              # todas las apps en modo desarrollo
pnpm check            # lint + typecheck + test + build de todo (lo que corre el CI)
pnpm --filter @rona3d/shared test      # un solo paquete
pnpm --filter web dev                  # una sola app
pnpm format           # prettier --write
```

## 4. Reglas que no se discuten

Estas reglas nacieron de decisiones explícitas de Nacho. Si una no te cierra, abrí la conversación; **no la esquives en silencio**. Cuando se acuerda una regla nueva en una charla, se agrega acá en el mismo PR.

### Producto

1. **La calculadora siempre es gratis y siempre funciona**, incluso sin cuenta y sin conexión. Lo premium es guardar, personalizar, automatizar y llevar historial; nunca el cálculo en sí.
2. **ARS es la moneda por defecto**, pero nada en el código asume pesos: la moneda es siempre un parámetro (`Currency` de `@rona3d/shared`). La calculadora **no convierte** monedas; lo único que se convierte es el precio de la suscripción (ADR 0006).
3. País y provincia salen de **nuestro dataset** (`GET /geo/*`, ADR 0005), nunca de una API externa en runtime ni de paquetes GPL.
4. **El presupuesto que ve el cliente nunca muestra costos, multiplicador ni ganancia.**
5. Los permisos premium se calculan en el servidor (`entitlements`). El front los refleja, no los decide.
6. Toda función de IA (lectura de facturas, etc.) usa **el modelo más barato que resuelva la tarea**, procesa y descarta la entrada, registra su costo y **nunca guarda nada sin que el usuario lo confirme**.

### Técnica

7. **Última versión mayor asentada** de cada dependencia, no la que salió ayer. Hoy: Node 24 LTS, pnpm 12, TypeScript 6.0 (7 cuando typescript-eslint lo soporte, ver ADR 0004), React 19, Vite 8, Nest 12, Mongoose 9, Tailwind 4, Zod 4. Se revisa al inicio de cada fase y se anota en `docs/decisions/`.
8. **Las fórmulas viven solo en `packages/shared`**, como funciones puras con tests al lado. Ni la web ni la API recalculan nada por su cuenta.
9. **TypeScript estricto**: nada de `any`, nada de `as` para callar al compilador, `noUncheckedIndexedAccess` y `exactOptionalPropertyTypes` activos.
10. **Toda entrada se valida con Zod**, en el front (formularios) y en la API (DTOs), usando los mismos esquemas de `shared`.
11. La API **nunca confía en el cliente** para rol, suscripción ni identidad: Auth0 firma el token, Mongo dice quién es y qué puede.
12. **Secretos solo por variables de entorno.** `.env.example` versionado, `.env` jamás. Si ves un secreto en el código o en un commit, es un incidente.
13. Organización **por features**, no por tipo de archivo (ver `docs/conventions.md`).
14. **Tests acompañan al código** en el mismo PR. `shared` exige ≥ 95 % de cobertura; en web y api se testea lo que tiene lógica, no el JSX decorativo.
15. **Conventional Commits** en castellano, con scope (`feat(web): …`, `fix(shared): …`). Husky corre lint-staged y commitlint; no se saltean con `--no-verify`.
16. Ramas `feat/*`, `fix/*`, `docs/*` → PR → `main`. `main` siempre deployable. El CI (`pnpm check`) tiene que estar verde para mergear.

### Diseño

17. Rona 3D vive dentro del sistema de marca RONA GAMES (una tinta, Alfa Slab One, ficha con cuatro pips calados) y usa **siempre la ficha extruida**, nunca la plana. Colores: Papel `#F5EFE4`, Tinta `#16161A`, Rojo Rona `#E14424` solo como acento.
18. **Prohibido lo genérico**: degradados borrosos, glassmorphism, violeta/azul "SaaS", sombras difusas, emojis como iconos, hero centrado con dos botones. La extrusión (sombras duras desplazadas, líneas de capa) es el lenguaje.
19. Referencia de **producto** (no de estética): Linear. Velocidad percibida, atajos, paleta de comandos, densidad justa, modo oscuro de primera clase, nada decorativo sin función.
20. Accesibilidad no negociable: labels visibles, foco visible, contraste AA, `prefers-reduced-motion` respetado, nada que dependa solo del hover.
21. Voz: voseo directo y cálido ("Cargá los datos que te da el laminador").

### Documentación

22. **Se documenta en la misma fase que se codea.** Cada app y paquete tiene su `README.md`; cada decisión de arquitectura, su ADR en `docs/decisions/`.
23. Este archivo se mantiene corto y vigente. Lo que es detalle va a `docs/`.

## 5. Cómo trabajar con agentes de IA en este repo

- Antes de proponer algo, leé este archivo y el `docs/` que corresponda. No reinventes decisiones ya tomadas.
- Trabajá en una rama, corré `pnpm check` antes de dar por terminado, y escribí el commit en Conventional Commits.
- Si cambiás una regla, cambiá este archivo. Si tomás una decisión de arquitectura, escribí el ADR.
- Si encontrás algo que no cierra con estas reglas, decilo en el PR en lugar de "arreglarlo" por tu cuenta.
