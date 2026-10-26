# Arquitectura

## Vista general

```
┌──────────────┐  HTTPS + JWT   ┌──────────────┐   Mongoose   ┌──────────────┐
│  apps/web    │ ─────────────▶ │  apps/api    │ ───────────▶ │ MongoDB Atlas│
│ Vite + React │                │   NestJS     │              └──────────────┘
│  (Vercel)    │                │  (Render)    │ ──▶ Resend (email)
└──────┬───────┘                └──────┬───────┘ ──▶ Cloudinary (logos, fotos)
       │ PKCE                          │ JWKS    ──▶ Anthropic (lectura de facturas)
       ▼                               ▼         ──▶ Mercado Pago (suscripción)
   ┌─────────────────────────────────────┐
   │               Auth0                 │  registro, login, verificación, refresh
   └─────────────────────────────────────┘

            ┌───────────────────────────────┐
            │       packages/shared         │  motor de cálculo, monedas, esquemas
            │   (lo importan web y api)     │
            └───────────────────────────────┘
```

## Principios

1. **Un solo dominio, dos consumidores.** Las reglas de negocio (fórmulas, validaciones, formato de dinero) viven en `@rona3d/shared` y se compilan a ESM + CJS. La web las usa para calcular en vivo; la API para validar y guardar. Nunca se duplican.
2. **La web funciona sola.** Sin cuenta y sin red, la calculadora calcula y guarda en el navegador (`LocalStorageAdapter`). Con cuenta, el mismo código persiste contra la API (`ApiStorageAdapter`). La UI no sabe cuál está activo.
3. **La API es la autoridad.** Decide quién es el usuario (valida el JWT de Auth0), qué rol tiene y qué puede hacer (`entitlements`). El front nunca manda "soy premium".
4. **Servicios externos detrás de interfaces.** Email, archivos, IA y pagos se usan a través de un puerto (`EmailSender`, `FileStorage`, `InvoiceReader`, `BillingProvider`) con una implementación concreta. Cambiar de proveedor es cambiar una clase.

## Flujo de identidad

1. La web redirige a Auth0 (Universal Login, PKCE). Auth0 verifica email, maneja contraseña, MFA y refresh tokens con rotación.
2. Vuelve a `/callback` con un access token RS256 (audience = la API). Se guarda en memoria; el refresh token lo gestiona el SDK.
3. Cada request a la API lleva `Authorization: Bearer <jwt>`. Un guard lo valida contra el JWKS de Auth0 (cacheado).
4. En el primer request de un `sub` nuevo, la API hace `upsert` en `users` con email y nombre del token, rol `user`, trial de 30 días. El rol `admin` se asigna por seed o desde el panel.

## Flujo de la calculadora

```
inputs (Zod) ──▶ calcPrintCost ──▶ calcSalePrice ──▶ buildQuote ──▶ PDF (jsPDF, import dinámico)
     │                                                   │
     └── CalculatorStorage (local | api) ◀───────────────┘ (perfiles, presupuestos emitidos)
```

## Flujo de lectura de factura (premium, fase 3)

1. El front reduce la imagen (≤ 1500 px, JPEG) y la manda a `POST /energy/invoice/read`.
2. La API verifica entitlement y cuota diaria, llama al modelo (Haiku) con un esquema de salida Zod, registra tokens y costo en `ai_usage` y **descarta la imagen**.
3. Devuelve la propuesta (distribuidora, período, precio unitario, impuestos, moneda, confianza). El usuario revisa y confirma; recién ahí se guarda en `energy_settings`.

## Entornos

|            | web              | api                                                                      | datos                                 |
| ---------- | ---------------- | ------------------------------------------------------------------------ | ------------------------------------- |
| local      | `localhost:5173` | `localhost:3000`                                                         | Atlas (DB `rona3d-dev`) o Mongo local |
| preview    | Vercel por PR    | — (apunta a la API de producción en modo lectura, o a staging si existe) |                                       |
| producción | Vercel `main`    | Render `main`                                                            | Atlas `rona3d`                        |
