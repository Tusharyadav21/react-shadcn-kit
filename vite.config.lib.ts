import path, { resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import preserveDirectives from "rollup-plugin-preserve-directives";
import { globSync } from "glob";

const pkg = JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"));

const entry = globSync("src/**/index.ts").reduce(
  (acc, file) => {
    const name = path.relative("src", file).replace(/\.(ts|tsx)$/, "");
    acc[name] = resolve(__dirname, file);
    return acc;
  },
  {} as Record<string, string>,
);

export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    tailwindcss(),
    preserveDirectives(),
    dts({
      include: [
        "src/components/primitives",
        "src/components/composites",
        "src/components/marketing",
        "src/components/data-table",
        "src/components/kanban",
        "src/hooks",
        "src/lib",
        "src/index.ts",
      ],
      exclude: ["src/test/**", "src/dev/**", "**/*.test.tsx", "src/vite-env.d.ts"],
      rollupTypes: false, // Don't bundle types into one file when using multiple entries
      copyDtsFiles: true, // ✅ Copy all .d.ts files
    }),
  ],

  build: {
    copyPublicDir: false,
    minify: "esbuild",
    sourcemap: true,

    lib: {
      entry,
      name: "ReactShadcnKit", // ✅ FIXED: Required for types
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

      // ✅ Simplified: let preserveModules handle submodules
      output: {
        preserveModules: true,
        preserveModulesRoot: "src",
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        assetFileNames: "assets/[name][extname]",
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
