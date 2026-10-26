# Deploy y servicios externos

> Las cuentas (Vercel, Render, Auth0, MongoDB Atlas) ya existen y están conectadas al GitHub de Nacho. Este documento se completa con los IDs y URLs reales a medida que se configuran (fase 1 y 2). **Nunca** se escriben secretos acá.

## Vercel — `apps/web`

- Proyecto apuntando al repo, **Root Directory: `apps/web`**, Framework: Vite.
- Build: `pnpm turbo build --filter=web`. Install: `pnpm install --frozen-lockfile`. Output: `apps/web/dist`.
- Preview automático por PR; producción desde `main`.
- Variables: `VITE_API_URL`, `VITE_AUTH0_DOMAIN`, `VITE_AUTH0_CLIENT_ID`, `VITE_AUTH0_AUDIENCE`.
- SPA: `vercel.json` con rewrite de todo a `/index.html` (salvo assets).

## Render — `apps/api`

- Web Service desde Docker (`apps/api/Dockerfile`, build multi-stage: instala con pnpm, compila, imagen final solo con `dist` + deps de producción).
- Healthcheck: `GET /health`. Región: la más cercana a Argentina disponible.
- Deploy automático desde `main`. Plan gratuito al principio (se duerme con inactividad; aceptable hasta que haya usuarios pagos).
- Variables: `NODE_ENV`, `PORT`, `MONGODB_URI`, `AUTH0_DOMAIN`, `AUTH0_AUDIENCE`, `WEB_ORIGIN`, `RESEND_API_KEY`, `CLOUDINARY_URL`, `ANTHROPIC_API_KEY`, `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`.

## MongoDB Atlas

- Cluster M0. Bases: `rona3d` (producción) y `rona3d-dev`.
- Usuario de aplicación con `readWrite` solo sobre esas bases.
- Network access: IPs salientes de Render + la IP de desarrollo de Nacho. Nada de `0.0.0.0/0` en producción.

## Auth0

- Tenant `rona3d` (región US o la que ofrezca el plan).
- Aplicación **SPA** "Rona 3D Web": callbacks `http://localhost:5173/callback`, `https://<vercel>/callback`; logout URLs idem sin `/callback`; refresh token rotation activado.
- **API** "Rona 3D API": identifier (audience) `https://api.rona3d` (valor lógico, no una URL real); RS256.
- Database connection con verificación de email obligatoria. Universal Login con logo y colores de Rona.
- Cuando haya dominio propio: custom domain para que el login viva en `auth.rona.ar` (o similar).

## Resend, Cloudinary, Anthropic, Mercado Pago

Se dan de alta en la fase que los necesita (2, 3, 3 y 5). Cada uno tiene su variable en `.env.example` y su adapter en la API.

## Rotación de secretos

Si un secreto se filtra: se rota en el proveedor, se actualiza en Render/Vercel, se redeploya y se anota en `docs/decisions/` como incidente con fecha. Los commits con secretos se reescriben (`git filter-repo`) y se avisa.

## CI

`.github/workflows/ci.yml` corre `pnpm check` (lint + typecheck + test + build) en cada push y PR. Sin CI verde no se mergea.
