import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Vue from "@vitejs/plugin-vue";
import Windi from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";
import manifest from "./client/manifest.js";

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./client",
  resolve: {
    alias: {
      "@": resolve(_dirname, "./client/src"),
      "#shared": resolve(_dirname, "./shared"),
    },
  },
  plugins: [
    Vue(),
    Windi({
      config: resolve(_dirname, "windi.config.js"),
    }),
    Components({
      dirs: ["src/components"],
      extensions: ["vue"],
      deep: true,
    }),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      manifest,
    }),
  ],
});
