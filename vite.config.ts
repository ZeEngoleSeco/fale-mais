import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(async ({ mode }) => {
  let componentTagger: any = null;
  if (mode === "development") {
    try {
      const taggerModule = await import("lovable-tagger");
      componentTagger = taggerModule.componentTagger;
    } catch {
      // lovable-tagger optional fallback
    }
  }

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "react/jsx-dev-runtime",
        "react-dom/client",
        "react-router-dom",
      ],
    },
    plugins: [react(), componentTagger && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(import.meta.dirname, "./src"),
      },
    },
  };
});


