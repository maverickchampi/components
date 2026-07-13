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
    ".css": "local-css"
  },
  outExtension() {
    return {
      js: ".js",
      css: ".css"
    };
  }
});
