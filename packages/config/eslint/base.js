// Reglas base para todo el monorepo (TypeScript, sin framework).
// Cada app o paquete las extiende desde su propio eslint.config.js.
import js from "@eslint/js";
import prettier from "eslint-config-prettier";
import globals from "globals";
import tseslint from "typescript-eslint";

export const base = tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
      globals: { ...globals.node, ...globals.es2024 },
    },
    rules: {
      // Preferimos tipos explícitos en los bordes públicos y nada de `any` silencioso.
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { prefer: "type-imports" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_", caughtErrorsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      eqeqeq: ["error", "always"],
      "prefer-const": "error",
    },
  },
  {
    // Archivos de configuración y scripts: sin type-check.
    files: ["**/*.js", "**/*.mjs", "**/*.cjs", "**/*.config.ts"],
    ...tseslint.configs.disableTypeChecked,
  },
  prettier,
);

export default base;
