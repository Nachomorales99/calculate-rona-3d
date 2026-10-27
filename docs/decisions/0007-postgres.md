# 0007 · PostgreSQL (Neon) con Drizzle en lugar de MongoDB

2026-10-26 · aceptada · reemplaza la elección de MongoDB Atlas de 0003 (solo en lo que respecta a la base de datos)

## Contexto

El dominio de Rona 3D es relacional: usuarios con suscripción, presupuestos numerados por usuario, pagos, tickets, catálogo de impresoras, estadísticas para el admin. Con cobros de por medio hacen falta transacciones, integridad referencial y dinero sin errores de punto flotante. Nacho quiere además que la plataforma escale a nuevas apps con el tiempo. MongoDB funcionaba a esta escala, pero exigía reconstruir a mano (índices únicos, enteros en centavos, transacciones explícitas) lo que PostgreSQL trae de fábrica.

## Decisión

- **PostgreSQL** como única base de datos, hosteada en **Neon** (serverless, plan gratuito con branching por entorno).
- **Drizzle ORM** (`drizzle-orm` 0.45 + `drizzle-kit` 0.31) con el driver `postgres` (postgres.js). Esquema en TypeScript (`apps/api/src/db/schema/*.ts`), migraciones SQL versionadas en `apps/api/drizzle/`, generadas con `drizzle-kit generate` y aplicadas con `drizzle-kit migrate` en el deploy.
- Convenciones: `snake_case` en la base, `camelCase` en el código (Drizzle lo mapea); claves primarias `uuid` generadas en la base; `created_at` / `updated_at` con `timestamptz` en todas las tablas; dinero en `numeric(14,2)` **nunca** `float`; borrado lógico solo donde haga falta auditoría (`deleted_at`).
- Datos semiestructurados (snapshot del presupuesto, parámetros de impuestos de la luz, overrides de precios) van en columnas `jsonb` validadas con Zod al entrar y al salir.
- El acceso a datos sigue el patrón Repository: cada módulo de Nest expone una interfaz y una implementación con Drizzle. Los tests unitarios mockean la interfaz; los e2e corren contra un Postgres real (contenedor `postgres:17` local o un branch de Neon en CI).
- Cuando una app futura necesite su propio dominio, va en su propio `schema` de Postgres dentro de la misma base (`calculator`, `blog`, …), no en otra base.

## Consecuencias

- Mongo y Mongoose salen del stack. La cuenta de Atlas se puede cerrar.
- Local: `docker compose up db` levanta `postgres:17`; `DATABASE_URL` apunta ahí. Sin Docker, un branch `dev` de Neon sirve igual.
- La numeración de presupuestos por usuario, los estados de suscripción y el registro de pagos usan transacciones y restricciones `unique` / `check` de la base, no lógica de aplicación.
- Las métricas del admin se escriben en SQL (vistas o consultas con Drizzle), sin pipelines de agregación.
