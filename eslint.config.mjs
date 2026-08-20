import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import jsxA11y from "eslint-plugin-jsx-a11y";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Apply jsx-a11y's full recommended *rules* on top of Next's defaults. The
  // plugin itself is already registered by eslint-config-next, so we add only
  // the rules to avoid a "cannot redefine plugin" conflict.
  {
    name: "jsx-a11y/recommended-rules",
    rules: jsxA11y.flatConfigs.recommended.rules,
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
    ".yarn/**",
  ]),
]);

export default eslintConfig;
