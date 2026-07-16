import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
  loader: {
    ".scss": "local-css",
    ".css": "css"
  },
  outExtension(ctx) {
    return {
      js: ctx.format === "esm" ? ".mjs" : ".js",
      css: ".css"
    };
  }
});
