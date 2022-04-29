import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePluginNode } from "vite-plugin-node";

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      "@": resolve(_dirname, "./server"),
      "#shared": resolve(_dirname, "./shared"),
    },
  },
  plugins: [
    ...VitePluginNode({
      adapter: "fastify",
      appPath: "./server/index.js",
      exportName: "viteNodeApp",
    }),
  ],
});
