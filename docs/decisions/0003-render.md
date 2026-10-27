# 0003 · API en Render (no Railway), web en Vercel, datos en Atlas

> La parte de datos fue reemplazada por 0007 (PostgreSQL en Neon).

2026-10-26 · aceptada

## Contexto

Hosting gratuito para arrancar, con deploy desde GitHub. Nacho descartó Railway por preocupaciones de seguridad recientes.

## Decisión

Web en Vercel (preview por PR), API en Render como Web Service Docker con healthcheck, MongoDB Atlas M0.

## Consecuencias

- El plan gratuito de Render duerme la API tras inactividad: la primera request puede tardar. Aceptable hasta que haya usuarios pagos; después, plan pago o keep-alive.
- La API se construye con Docker, lo que también sirve para correrla local.
