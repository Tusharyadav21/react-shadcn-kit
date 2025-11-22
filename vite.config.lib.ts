import path, { extname, relative, resolve } from "path";
import { defineConfig } from "vite";
import fs from "fs";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import { glob } from "glob";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import { libInjectCss } from "vite-plugin-lib-inject-css";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    libInjectCss(),
    tailwindcss(),
    dts({
      include: [
        "src/atoms",
        "src/hooks",
        "src/lib",
        "src/template",
        "src/molecules",
        "src/organisms",
        "src/index.ts",
        "src/global.css",
      ],
      exclude: ["src/test", "**/*.test.tsx", "src/vite-env.d.ts"],
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      // Externalize dependencies and peerDependencies so we don't bundle node_modules
      external: [
        ...Object.keys(
          JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8")).dependencies ||
            {},
        ),
        ...Object.keys(
          JSON.parse(fs.readFileSync(resolve(__dirname, "package.json"), "utf-8"))
            .peerDependencies || {},
        ),
        "react/jsx-runtime",
        "tailwindcss",
        "@tailwindcss/vite",
        "react-dom/client",
        "react-dom",
      ],
      input: Object.fromEntries(
        // https://rollupjs.org/configuration-options/#input
        glob
          .sync("src/{atoms,hooks,lib,template,molecules,organisms}/**/*.{ts,tsx}", {
            ignore: ["src/**/*.d.ts", "src/**/*.test.tsx", "src/test/**/*", "src/vite-env.d.ts"],
          })
          .concat(["src/index.ts"])
          .map((file) => [
            // 1. The name of the entry point
            // src/nested/foo.js becomes nested/foo
            relative("src", file.slice(0, file.length - extname(file).length)),
            // 2. The absolute path to the entry file
            // src/nested/foo.ts becomes /project/src/nested/foo.ts
            fileURLToPath(new URL(file, import.meta.url)),
          ]),
      ),
      output: {
        // Keep asset names stable
        assetFileNames: "assets/[name][extname]",
        // Produce predictable file names without content hashes
        entryFileNames: "[name].js",
        chunkFileNames: "[name].js",
        // Preserve module layout so consumers can tree-shake/import specific modules if needed
        preserveModules: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
