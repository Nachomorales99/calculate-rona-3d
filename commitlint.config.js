export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    // Alcances del monorepo. Se amplía cuando aparecen apps o paquetes nuevos.
    "scope-enum": [2, "always", ["web", "api", "shared", "config", "docs", "ci", "deps", "repo"]],
    "subject-case": [0],
  },
};
