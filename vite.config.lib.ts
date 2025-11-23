import path, { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { glob } from "glob";
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
        "src/atoms",
        "src/hooks",
        "src/lib",
        "src/molecules",
        "src/organisms",
        "src/layouts",
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
        "default-layout": resolve(__dirname, "src/default-layout.tsx"),
        "atoms/index": resolve(__dirname, "src/atoms/index.ts"),
        "molecules/index": resolve(__dirname, "src/molecules/index.ts"),
        "organisms/index": resolve(__dirname, "src/organisms/index.ts"),
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
