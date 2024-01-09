import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import prettier from "eslint-config-prettier";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import solid from "eslint-plugin-solid/configs/typescript.js";
import globals from "globals";

const compat = new FlatCompat();

/** @type { import("eslint").Linter.FlatConfig } */
const baseConfig = {
  files: ["**/*.{js,jsx,ts,tsx}"],
  plugins: {
    "simple-import-sort": simpleImportSort,
  },
  rules: {
    "simple-import-sort/imports": "error",
    "simple-import-sort/exports": "error",
    "no-irregular-whitespace": [
      "error",
      {
        skipTemplates: true,
      },
    ],
  },
};

/** @type { import("eslint").Linter.FlatConfig[] } */
const tsConfigs = compat.config({
  overrides: [
    {
      files: ["**/*.{ts,tsx}"],
      extends: ["plugin:@typescript-eslint/recommended"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
    },
  ],
});

/** @type { import("eslint").Linter.FlatConfig[] } */
const srcTsConfigs = compat.config({
  overrides: [
    {
      files: ["src/**/*.{ts,tsx}"],
      extends: ["plugin:@typescript-eslint/recommended-type-checked"],
      parser: "@typescript-eslint/parser",
      plugins: ["@typescript-eslint"],
      parserOptions: {
        sourceType: "module",
        project: "tsconfig.json",
      },
    },
  ],
});

/** @type { import("eslint").Linter.FlatConfig } */
const srcConfig = {
  files: ["src/**/*.{ts,tsx}"],
  languageOptions: {
    globals: { ...globals.browser, ...globals.es2021 },
  },
  rules: {
    "no-console": "warn",
    "@typescript-eslint/no-explicit-any": "off",
  },
};

/** @type { import("eslint").Linter.FlatConfig } */
const solidConfig = {
  files: ["src/**/*.{ts,tsx}"],
  ...solid,
  languageOptions: {
    parser: tsParser,
    parserOptions: {
      project: "tsconfig.json",
    },
  },
};

/** @type { import("eslint").Linter.FlatConfig } */
const configConfig = {
  files: ["*.config.*"],
  languageOptions: {
    globals: { ...globals.node },
  },
};

/** @type { import("eslint").Linter.FlatConfig[] } */
export default [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
  },
  {
    ignores: [".output/*", ".wxt/*", "playwright-report/*"],
  },
  js.configs.recommended,
  baseConfig,
  ...tsConfigs,
  ...srcTsConfigs,
  srcConfig,
  solidConfig,
  configConfig,
  prettier,
];
