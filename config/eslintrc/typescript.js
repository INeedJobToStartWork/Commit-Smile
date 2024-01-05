import stylisticPlus from "@stylistic/eslint-plugin-plus";
import stylisticTs from "@stylistic/eslint-plugin-ts";
import tslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "path";
import { fileURLToPath } from "url";

// 👇️ "/home/borislav/Desktop/javascript/index.js"
const __filename = fileURLToPath(import.meta.url);
console.log(__filename);

// 👇️ "/home/borislav/Desktop/javascript"
const __dirname = path.resolve();

export default [
  {
    ignores: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: true,
        tsconfigRootDir: __dirname
      }
    },
    name: "TypeScript - Strong Typing",
    plugins: {
      "@stylistic/plus": stylisticPlus,
      "@stylistic/ts": stylisticTs,
      "@typescript-eslint": tslint
    },
    rules: {
      "@stylistic/plus/type-generic-spacing": ["error"],
      "@stylistic/plus/type-named-tuple-spacing": ["error"],
      "@stylistic/ts/block-spacing": ["error", "always"],
      "@stylistic/ts/brace-style": ["error", "stroustrup", { allowSingleLine: true }],
      // "@stylistic/ts/brace-style": ["error", "allman", { allowSingleLine: true }],
      "@stylistic/ts/comma-dangle": "error",
      "@stylistic/ts/comma-spacing": ["error", { after: true, before: false }],

      "@stylistic/ts/function-call-spacing": ["error", "never"],

      "@stylistic/ts/key-spacing": ["error", { beforeColon: false }],
      // "@stylistic/ts/lines-between-class-members:": ["error", "always"],
      "@stylistic/ts/space-before-function-paren": "error",
      "@stylistic/ts/type-annotation-spacing": [
        "error",
        { after: true, before: false, overrides: { arrow: { after: true, before: true } } }
      ],
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": ["error", { default: "array-simple" }],
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/ban-tslint-comment": "error",
      "@typescript-eslint/ban-types": "warn",
      "@typescript-eslint/consistent-generic-constructors": ["error", "constructor"],
      "@typescript-eslint/consistent-indexed-object-style": ["warn", "record"],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/consistent-type-imports": "error",
      "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "separate-type-imports" }],
      "@typescript-eslint/default-param-last:": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": ["error", { allowArgumentsExplicitlyTypedAsAny: true }],
      "@typescript-eslint/explicit-module-boundary-types": ["error", { allowArgumentsExplicitlyTypedAsAny: false }],
      "@typescript-eslint/init-declarations": "off",
      "@typescript-eslint/max-params": "off",
      "@typescript-eslint/member-ordering": "error",
      "@typescript-eslint/method-signature-style": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "@typescript-eslint/no-base-to-string": "off",
      "@typescript-eslint/no-confusing-non-null-assertion": "off",
      "@typescript-eslint/no-confusing-void-expression": "error",
      "@typescript-eslint/no-duplicate-enum-values": "error",
      "@typescript-eslint/no-duplicate-type-constituents": "error",
      "@typescript-eslint/no-dynamic-delete": "off",
      "@typescript-eslint/no-empty-function": "error",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "error",
      "no-array-constructor": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "@typescript-eslint/no-extra-semi": "error",
      "@typescript-eslint/no-floating-promises": "warn",
      "@typescript-eslint/no-for-in-array": "error",
      "@typescript-eslint/no-implied-eval": "error",
      "@typescript-eslint/no-import-type-side-effects": "error",
      "@typescript-eslint/no-inferrable-types": "error",
      "no-empty-function": "off",
      "@typescript-eslint/no-invalid-void-type": "error",
      "@typescript-eslint/no-loop-func": "warn",
      "@typescript-eslint/no-loss-of-precision": "error",
      "@typescript-eslint/no-magic-numbers": "off",
      "no-extra-semi": "off",
      "@typescript-eslint/no-misused-new": "error",
      "no-extraneous-class": "off",
      "@typescript-eslint/no-misused-promises": "error",
      "@typescript-eslint/no-namespace": ["error", { allowDeclarations: true }],
      "no-implied-eval": "off",
      "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-non-null-assertion": "error",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "no-loop-func": "off",
      "@typescript-eslint/no-restricted-imports": "off",
      "no-loss-of-precision": "off",
      "@typescript-eslint/no-shadow": "off",
      "no-magic-numbers": "off",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unnecessary-boolean-literal-compare": "error",
      "@typescript-eslint/no-unnecessary-condition": "error",
      "@typescript-eslint/no-unnecessary-type-constraint": "error",
      "@typescript-eslint/no-unsafe-argument": "error",
      "@typescript-eslint/no-unsafe-assignment": "error",
      "@typescript-eslint/no-unsafe-call": "error",
      "@typescript-eslint/no-unsafe-declaration-merging": "error",
      "no-restricted-imports": "off",
      "@typescript-eslint/no-unsafe-member-access": "error",
      "no-shadow": "off",
      "@typescript-eslint/no-unsafe-return": "error",
      "@typescript-eslint/no-unsafe-unary-minus": "error",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-unused-vars": "warn",
      "no-unnecessary-type-arguments": "off",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-useless-constructor": "error",
      "@typescript-eslint/no-useless-empty-export": "error",
      "@typescript-eslint/no-var-requires": "error",
      "@typescript-eslint/non-nullable-type-assertion-style": "error",
      "@typescript-eslint/parameter-properties": "off",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-destructuring": "off",
      "no-unused-expressions": "off",
      "@typescript-eslint/prefer-enum-initializers": "error",
      "no-unused-vars": "off",
      "@typescript-eslint/prefer-for-of": "error",
      "no-use-before-define": "off",
      "@typescript-eslint/prefer-includes": "error",
      "no-useless-constructor": "off",
      "@typescript-eslint/prefer-namespace-keyword": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/prefer-reduce-type-parameter": "error",
      "@typescript-eslint/prefer-regexp-exec": "error",
      "@typescript-eslint/prefer-string-starts-ends-with": "error",
      "prefer-destructuring": "off",
      "@typescript-eslint/prefer-ts-expect-error": "error",
      "@typescript-eslint/promise-function-async": "error",
      "@typescript-eslint/require-array-sort-compare": "error",
      "@typescript-eslint/require-await": "warn",
      "@typescript-eslint/return-await": "error",
      "@typescript-eslint/sort-type-constituents": "error",
      "@typescript-eslint/switch-exhaustiveness-check": "error",
      "@typescript-eslint/triple-slash-reference": "error",
      "@typescript-eslint/unified-signatures": "error",
      "no-return-await": "off",
      "require-await": "off"
    }
  }
];
