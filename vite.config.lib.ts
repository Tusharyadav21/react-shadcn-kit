import path, { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"));

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),

    // Safe: does not break Tailwind build behavior
    tailwindcss(),

    dts({
      include: [
        "src/components/primitives",
        "src/components/composites",
        "src/components/marketing",
        "src/hooks",
        "src/lib",
        "src/index.ts",
        "src/global.css",
      ],
      exclude: ["src/test", "**/*.test.tsx", "src/vite-env.d.ts"],
      rollupTypes: false, // enhances types output stability
    }),
  ],

  build: {
    copyPublicDir: false,

    // ⚡ Safe, fast, zero Tailwind risk
    minify: "esbuild",
    sourcemap: true,

    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },

    rollupOptions: {
      external: [
        ...Object.keys(pkg.dependencies || {}),
        ...Object.keys(pkg.peerDependencies || {}),
        "react/jsx-runtime",
        "tailwindcss",
        "@tailwindcss/vite",
        "react-dom/client",
        "react-dom",
      ],

      input: {
        index: resolve(__dirname, "src/index.ts"),
        "primitives/index": resolve(__dirname, "src/components/primitives/index.ts"),
        "composites/index": resolve(__dirname, "src/components/composites/index.ts"),
        "marketing/index": resolve(__dirname, "src/components/marketing/index.ts"),
        "hooks/index": resolve(__dirname, "src/hooks/index.ts"),
        "lib/index": resolve(__dirname, "src/lib/index.ts"),
      },

      output: {
        preserveModules: true,
        preserveModulesRoot: "src",

        // Clean + stable file names
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",

        // Ensures classnames & code splitting stay readable
        compact: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
