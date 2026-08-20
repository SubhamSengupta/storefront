import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],
    // Unit/component tests live next to source under src/. Playwright E2E lives
    // in e2e/ and is run separately, so it is excluded here.
    include: ["src/**/*.test.{ts,tsx}"],
    css: false,
  },
});
