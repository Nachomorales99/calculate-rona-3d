import { base } from "@rona3d/config/eslint/base";

export default [
  ...base,
  {
    ignores: ["**/dist/**", "**/coverage/**", "**/.turbo/**", "**/node_modules/**"],
  },
];
