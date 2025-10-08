export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    rules: {
      "react/prop-types": "off",
    },
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  {
    ...pluginReact.configs.flat.recommended,
    rules: {
      "react/prop-types": "off",
    },
  },
]);
