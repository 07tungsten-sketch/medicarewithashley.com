import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  base: "/",
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    ssr: true,
    outDir: path.resolve(import.meta.dirname, "dist/server"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(import.meta.dirname, "src/entry-server.tsx"),
      output: {
        format: "esm",
      },
    },
  },
  ssr: {
    noExternal: ["react-helmet-async", "wouter"],
  },
});
