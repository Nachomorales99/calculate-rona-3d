# @rona3d/config

Configuración compartida del monorepo. No tiene código de negocio.

- `eslint/base` — reglas TypeScript para todo el repo (type-checked).
- `eslint/react` — base + hooks y fast-refresh para apps Vite/React.
- `prettier` — formato único (100 columnas, comillas dobles, coma final).
- `tsconfig/base|library|vite|nest` — presets de TypeScript por tipo de proyecto.

Cada app o paquete extiende desde acá. Si una regla tiene que cambiar para todos, se cambia acá y en un solo PR.
