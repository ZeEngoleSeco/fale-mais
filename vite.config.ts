import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [mode === "development" && componentTagger()].filter(Boolean),
}));
