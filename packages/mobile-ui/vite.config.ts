import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import basicSsl from "@vitejs/plugin-basic-ssl";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [basicSsl(), react()],
  server: {
    port: 8881,
  },
  resolve: {
    // 配置路径别名
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  build: {
    target: "es2015"
  }
});
