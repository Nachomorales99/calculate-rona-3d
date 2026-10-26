# Dominio

## Glosario

- **Impresión**: una corrida de la impresora. Puede producir varias **piezas**.
- **Extra**: insumo que lleva cada pieza (argolla, cadena, imán). Tiene precio unitario y cantidad por pieza.
- **Costo base**: filamento + luz + desgaste + fallas. **Costo total** = base + extras.
- **Multiplicador**: factor sobre el costo para llegar al precio (×3 por defecto). Puede o no aplicarse a los extras.
- **Precio redondeado**: precio de venta redondeado hacia arriba al paso de la moneda (100 en ARS).
- **Presupuesto**: documento para el cliente. Nunca muestra costos ni ganancia.
- **kWh marginal**: lo que cuesta de verdad un kWh más, con impuestos, a partir del precio unitario de la factura.
- **Perfil de cálculo**: configuración guardada ("Llaveros con PLA") que precarga filamento, extras y multiplicador.
- **Entitlement**: permiso concreto derivado del estado de suscripción (`profiles`, `cloudSync`, `branding`, `quoteHistory`, `aiInvoice`).

## Fórmulas (implementadas en `packages/shared`)

```
filamento   = gramos / 1000 × precioKg
luz         = watts / 1000 × horas × kwhPrice
desgaste/h  = precioImpresora × (1 + reparaciones%) / vidaÚtilHoras
desgaste    = desgaste/h × horas
fallas      = (filamento + luz) × fallas%
base        = filamento + luz + desgaste + fallas
extras      = Σ(precioUnit × cantPorPieza) × piezas
total       = base + extras
porPieza    = total / piezas

precio      = multExtras ? porPieza × m : (base / piezas) × m + extrasPorPieza
redondeado  = ceil(precio / paso) × paso
ganancia    = precio − porPieza

kWh marginal = P × factor × (1 + Σ impuestos) + P × flat      (Edemsa: 1,0309 · 21 % + 1,5 % + 9 % · 1 %)
```

## Usuarios y suscripción

```
registro ──▶ trial (30 días) ──▶ active (pago OK) ──▶ past_due (pago falló) ──▶ canceled / expired
                 │                                                                     ▲
                 └────────────────────── sin pagar al vencer ──────────────────────────┘
```

| Estado             | Puede crear premium | Puede ver lo guardado | Marca propia en PDF |
| ------------------ | ------------------- | --------------------- | ------------------- |
| anónimo            | no                  | solo lo local         | no                  |
| trial / active     | sí                  | sí                    | sí                  |
| past_due           | sí (gracia 7 días)  | sí                    | sí                  |
| expired / canceled | no                  | sí (solo lectura)     | no (vuelve a Rona)  |

Roles: `user` (default), `admin` (gestiona usuarios, ve métricas, nombra admins). El primer admin es `rona3d.mdz@gmail.com` por seed.

## Modelo de datos (MongoDB)

| Colección          | Campos                                                                                                                                                                                                                                                                     |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`            | `auth0Id` (único), `email` (único), `firstName`, `lastName`, `avatarUrl`, `role`, `country`, `city`, `favoritePrinterId`, `currency {code, locale, roundingStep}`, `subscription {status, trialEndsAt, currentPeriodEnd, provider, externalId}`, `createdAt`, `lastSeenAt` |
| `printers`         | `brand`, `model`, `avgWatts`, `defaultLifeHours`, `price`, `isCatalog`, `ownerId`                                                                                                                                                                                          |
| `energy_settings`  | `userId`, `currency`, `currentKwhPrice`, `params {adjustmentFactor, taxes[], flatPct}`, `history [{period, provider, unitPrice, kwhPrice, source: manual                                                                                                                   | ai, createdAt}]` |
| `calc_profiles`    | `userId`, `name`, `printerId`, `filamentType`, `pricePerKg`, `extras[]`, `multiplier`, `multiplyExtras`, `failuresPct`, `repairsPct` — único por `{userId, name}`                                                                                                          |
| `quotes`           | `userId`, `number` (único por usuario), `currency`, `client`, `description`, `qty`, `unitPrice`, `total`, `validUntil`, `notes`, `snapshot` (inputs + costos, solo para el dueño), `status`, `pdfUrl?`                                                                     |
| `brand_settings`   | `userId`, `businessName`, `logoUrl`, `colors {accent, ink, paper}`, `contact`, `province`                                                                                                                                                                                  |
| `feedback_tickets` | `userId?`, `email`, `subject`, `message`, `status`, `emailedAt`                                                                                                                                                                                                            |
| `plan_settings`    | `priceUsd`, `priceArs`, `updatedAt`, `updatedBy`                                                                                                                                                                                                                           |
| `ai_usage`         | `userId`, `feature`, `inputTokens`, `outputTokens`, `estimatedCostUsd`, `at`                                                                                                                                                                                               |
| `audit_log`        | `actorId`, `action`, `target`, `at`                                                                                                                                                                                                                                        |

## Moneda

Cada usuario (o navegador) tiene una moneda de trabajo: código ISO, locale y paso de redondeo. Los precios de la calculadora se cargan en esa moneda; **no hay conversión automática**. Catálogo en `packages/shared/src/currency/currencies.ts`.

La **única** conversión del sistema es la del precio de la suscripción (USD 5 de referencia → moneda local), con tasas cacheadas a diario y control del admin (ADR 0006).

## Geografía

País (ISO 3166-1) y subdivisión (ISO 3166-2) salen de un dataset propio servido por `GET /geo/*` (ADR 0005). Al elegir país se sugiere su moneda. `users.country` guarda el código (`AR`) y `users.subdivision` el código ISO (`AR-M`); la ciudad es texto libre.
