import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import legacy from "@vitejs/plugin-legacy";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    basicSsl(),
    react(),
    legacy({
      renderLegacyChunks: true,
      renderModernChunks: false,
      // polyfills: ["es.global-this"],
    }),
  ],
  server: {
    port: 7999,
  },
  build: {
    target: "es2015",
  },
});
