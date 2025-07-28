import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  base: "./",
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      // "^/rest.*": {
      //   target: "http://127.0.0.1:5000",
      //   changeOrigin: true,
      // },
      // "/rest/*": {
      //   target: "http://localhost:5000",
      //   changeOrigin: true,
      // },
    },
  },
});
