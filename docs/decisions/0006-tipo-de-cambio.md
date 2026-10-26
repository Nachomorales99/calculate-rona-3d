# 0006 · Conversión de moneda solo para la suscripción, con tasas cacheadas y control del admin

2026-10-26 · aceptada

## Contexto

La calculadora es multimoneda **sin conversión** (cada maker carga sus costos en su moneda). Lo único que hay que convertir es el precio de la suscripción: referencia **USD 5/mes**, cobrado en la moneda local del usuario. En Argentina conviven varios tipos de cambio (oficial, MEP, blue, tarjeta) y el precio tiene que ser estable y "redondo" para no asustar.

## Decisión

1. Una colección `exchange_rates` con la última tasa por moneda (`{ base: "USD", code, rate, source, fetchedAt }`), refrescada **una vez por día** por un job de `@nestjs/schedule`, más un endpoint admin para forzar el refresh.
2. Fuentes, detrás de una interfaz `RateProvider`:
   - General (todas las monedas del catálogo): **open.er-api.com** (ExchangeRate-API, endpoint abierto sin clave, actualización diaria, requiere atribución).
   - Argentina: **dolarapi.com** (sin clave) con el tipo que elija el admin (`oficial` por defecto; `mep` o `blue` si hace falta). Si falla, cae a la tasa general.
3. El precio local se calcula como `roundUpTo(priceUsd × rate × (1 + buffer), step)` con `buffer` configurable (default 5 %, para absorber variaciones entre cobros) y `step` el paso de redondeo de la moneda (ARS → 100). Se guarda en `plan_settings.localPrices[code]` y el admin puede **pisarlo a mano** (override con fecha); el override gana siempre.
4. Las suscripciones ya creadas no cambian de precio solas: el precio se fija al crearlas en Mercado Pago. Si el precio local cambia más de un umbral (10 %), el admin ve un aviso y decide si actualiza las suscripciones vigentes.
5. Mercado Pago cobra en la moneda del país de la cuenta vendedora (Argentina → ARS). Para cobrar en otras monedas hará falta otra cuenta MP por país o un proveedor global (Stripe / Lemon Squeezy). Fase 5 arranca con ARS; el resto de monedas muestra el precio de referencia y "próximamente".

## Consecuencias

- Si las APIs de tasas se caen, la plataforma sigue: se usa la última tasa guardada y se avisa al admin.
- El precio que ve el usuario es siempre el guardado, nunca uno calculado al vuelo.
- Hay que mostrar la atribución de ExchangeRate-API en la pantalla de planes.
