import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { compression } from "vite-plugin-compression2";
import type { Connect } from "vite";

// PORT is required for the dev/preview server but is irrelevant during
// `vite build` (production builds don't start a server). Default to the
// artifact-assigned port so the deployment build doesn't fail when the
// deployment container doesn't forward [services.env] to the build step.
const rawPort = process.env.PORT ?? "25970";
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

// BASE_PATH is used as the Vite `base` option (URL prefix for all assets).
// Default to "/" so the deployment build doesn't fail when PORT/BASE_PATH
// are not injected into the build container environment.
const basePath = process.env.BASE_PATH ?? "/";

function devCompressionPlugin() {
  return {
    name: "dev-compression",
    configureServer(server: { middlewares: { use: (fn: Connect.NextHandleFunction) => void } }) {
      import("compression").then(({ default: compress }) => {
        server.middlewares.use(compress() as unknown as Connect.NextHandleFunction);
      });
    },
  };
}

export default defineConfig({
  base: basePath,
  plugins: [
    react(),
    tailwindcss(),
    runtimeErrorOverlay(),
    devCompressionPlugin(),
    compression({ algorithm: "gzip", exclude: [/\.(br)$/, /\.(gz)$/] }),
    compression({ algorithm: "brotliCompress", exclude: [/\.(br)$/, /\.(gz)$/] }),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer({
              root: path.resolve(import.meta.dirname, ".."),
            }),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "src"),
      "@assets": path.resolve(import.meta.dirname, "..", "..", "attached_assets"),
    },
    dedupe: ["react", "react-dom"],
  },
  root: path.resolve(import.meta.dirname),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/react/") || id.includes("node_modules/react-dom/") || id.includes("node_modules/react-is/") || id.includes("node_modules/scheduler/")) {
            return "react-vendor";
          }
          if (id.includes("node_modules/@radix-ui/")) {
            return "radix-vendor";
          }
          if (id.includes("node_modules/lucide-react/")) {
            return "lucide-vendor";
          }
          if (id.includes("node_modules/@tanstack/")) {
            return "query-vendor";
          }
          if (id.includes("node_modules/wouter/")) {
            return "router-vendor";
          }
        },
      },
    },
  },
  server: {
    port,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
    fs: {
      strict: true,
    },
  },
  preview: {
    port,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
