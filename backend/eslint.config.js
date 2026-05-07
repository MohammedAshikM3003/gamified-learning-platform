const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    files: ["**/*.js"],
    ignores: ["node_modules", "dist", "coverage"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: globals.node,
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    },
  },
  js.configs.recommended,
];
