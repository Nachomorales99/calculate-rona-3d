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

La suscripción vive en su propia tabla (`subscriptions`, 1:1 con `users`) para que el historial de pagos (`payments`, fase 5) tenga a qué referenciar.

La suscripción vive en su propia tabla (`subscriptions`, 1:1 con `users`) para que el historial de cambios de estado y de pagos (`payments`, fase 5) tenga a qué referenciar.

## Modelo de datos (PostgreSQL, ADR 0007)

Tablas en `snake_case`, PK `uuid`, `created_at` / `updated_at` en todas. Dinero en `numeric(14,2)`. Lo semiestructurado va en `jsonb` validado con Zod. Las FK apuntan siempre a `users.id`, nunca al `auth0_id`.

| Tabla              | Columnas principales                                                                                                                                                                                                                               |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `users`            | `auth0_id` (unique), `email` (unique), `first_name`, `last_name`, `avatar_url`, `role` (enum user/admin), `country`, `subdivision`, `city`, `favorite_printer_id` (FK), `currency_code`, `last_seen_at`                                            |
| `subscriptions`    | `user_id` (FK, unique), `status` (enum), `trial_ends_at`, `current_period_end`, `provider`, `external_id`, `local_currency`, `local_amount`                                                                                                        |
| `printers`         | `brand`, `model`, `avg_watts`, `default_life_hours`, `price`, `is_catalog`, `owner_id` (FK nullable)                                                                                                                                               |
| `energy_settings`  | `user_id` (FK, unique), `currency_code`, `current_kwh_price`, `params` (jsonb: factor, impuestos, flat)                                                                                                                                            |
| `energy_history`   | `user_id` (FK), `period`, `provider`, `unit_price`, `kwh_price`, `source` (enum manual/ai) — unique `(user_id, period)`                                                                                                                            |
| `calc_profiles`    | `user_id` (FK), `name`, `printer_id` (FK), `filament_type`, `price_per_kg`, `extras` (jsonb), `multiplier`, `multiply_extras`, `failures_pct`, `repairs_pct` — unique `(user_id, name)`                                                            |
| `quotes`           | `user_id` (FK), `number` (unique `(user_id, number)`, asignado en transacción), `currency_code`, `client`, `description`, `qty`, `unit_price`, `total`, `valid_until`, `notes`, `snapshot` (jsonb, solo para el dueño), `status` (enum), `pdf_url` |
| `brand_settings`   | `user_id` (FK, unique), `business_name`, `logo_url`, `colors` (jsonb), `contact`, `province`                                                                                                                                                       |
| `feedback_tickets` | `user_id` (FK nullable), `email`, `subject`, `message`, `status` (enum), `emailed_at`                                                                                                                                                              |
| `plan_settings`    | fila única: `price_usd`, `rate_buffer`, `ars_rate_type`, `updated_by`                                                                                                                                                                              |
| `plan_prices`      | `currency_code` (PK), `amount`, `computed_at`, `override_amount`, `override_by`, `override_at`                                                                                                                                                     |
| `exchange_rates`   | `code` (PK), `base`, `rate`, `source`, `fetched_at` (ADR 0006)                                                                                                                                                                                     |
| `ai_usage`         | `user_id` (FK), `feature`, `input_tokens`, `output_tokens`, `estimated_cost_usd`                                                                                                                                                                   |
| `audit_log`        | `actor_id` (FK), `action`, `target_type`, `target_id`, `payload` (jsonb)                                                                                                                                                                           |

Cada app nueva que necesite tablas propias usa su propio `schema` de Postgres (`blog.posts`, etc.) dentro de la misma base.

## Moneda

Cada usuario (o navegador) tiene una moneda de trabajo: código ISO, locale y paso de redondeo. Los precios de la calculadora se cargan en esa moneda; **no hay conversión automática**. Catálogo en `packages/shared/src/currency/currencies.ts`.

La **única** conversión del sistema es la del precio de la suscripción (USD 5 de referencia → moneda local), con tasas cacheadas a diario y control del admin (ADR 0006).

## Geografía

País (ISO 3166-1) y subdivisión (ISO 3166-2) salen de un dataset propio servido por `GET /geo/*` (ADR 0005). Al elegir país se sugiere su moneda. `users.country` guarda el código (`AR`) y `users.subdivision` el código ISO (`AR-M`); la ciudad es texto libre.
