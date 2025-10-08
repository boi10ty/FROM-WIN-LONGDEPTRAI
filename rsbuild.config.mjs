import { defineConfig } from "@rsbuild/core";
import { pluginReact } from "@rsbuild/plugin-react";

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    title: "Meta for Business - Page Appeal",
    favicon: "./src/assets/img/icon-fb.png",
  },
  tools: {
    lightningcssLoader: true,
  },
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
});
