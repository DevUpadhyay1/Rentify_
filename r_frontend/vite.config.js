import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: "dist",
    assetsDir: "assets",
  },
  base: "/", // for production builds
  server: {
    port: 5173,
    open: true,
    proxy: {
      "/api": "http://127.0.0.1:8000", // forward API requests to Django
    },
  },
});
