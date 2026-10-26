<p align="center">
  <img src="docs/assets/rona3d_principal_color.svg" alt="Rona 3D" width="220">
</p>

<h1 align="center">Rona 3D</h1>

<p align="center">
  Impresión 3D desde Mendoza, Argentina. Piezas, lo que vamos aprendiendo y <strong>apps para makers</strong>.<br>
  <a href="https://www.instagram.com/rona3darg/">@rona3darg</a> · rona3d.mdz@gmail.com
</p>

---

## Qué hay acá

Este es el monorepo de la plataforma web de Rona 3D, la línea de impresión 3D de [RONA GAMES](https://ronagames.com.ar).

- **Calculadora de costos y presupuestos**: cargás lo que te da el laminador (gramos, tiempo), tu filamento, luz e impresora, y te dice cuánto cuesta la pieza y cuánto cobrarla. Genera un presupuesto en PDF para tu cliente. Gratis, funciona sin cuenta y sin conexión.
- **Cuenta Rona** (en desarrollo): perfiles de cálculo guardados, tu impresora y tu tarifa de luz en la nube, presupuestos con tu propia marca e historial. 30 días de prueba, después una suscripción chica.
- **Blog y novedades** (próximamente).

## Stack

|                    |                                                                     |
| ------------------ | ------------------------------------------------------------------- |
| Web                | Vite 8 · React 19 · TypeScript · Tailwind 4 · PWA                   |
| API                | NestJS 12 · Mongoose 9 · MongoDB Atlas                              |
| Identidad          | Auth0 (JWT)                                                         |
| Dominio compartido | `@rona3d/shared`: motor de cálculo puro con tests (Vitest)          |
| Tooling            | pnpm 12 · Turborepo · ESLint 10 · Prettier · Husky · GitHub Actions |
| Hosting            | Vercel (web) · Render (api)                                         |

## Levantarlo en local

Necesitás **Node 24** y **pnpm 12** (`corepack enable` los activa solo).

```bash
git clone https://github.com/Nachomorales99/rona-3d.git
cd rona-3d
pnpm install
pnpm dev
```

`pnpm check` corre lint, typecheck, tests y build de todo el monorepo (es lo mismo que corre el CI).

## Estructura

```
apps/web          la web y las apps (Vite + React)
apps/api          la API (NestJS)
packages/shared   motor de cálculo, monedas, esquemas: funciones puras compartidas
packages/config   ESLint, Prettier y tsconfig compartidos
docs/             arquitectura, dominio, convenciones, deploy y decisiones (ADRs)
```

Si vas a contribuir o a meter un agente de IA a trabajar en el repo, empezá por [`AGENTS.md`](AGENTS.md): tiene las reglas del proyecto y el mapa de qué leer después.

## Licencia

Código y marca © Rona 3D / RONA GAMES. Todos los derechos reservados por ahora; si querés usar algo, escribinos.
