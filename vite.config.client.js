import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Vue from "@vitejs/plugin-vue";
import Windi from "vite-plugin-windicss";
import manifest from "./client/manifest.js";

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: "./client",
  server: {
    port: 3000,
  },
  preview: {
    port: 8080,
  },
  resolve: {
    alias: {
      "#shared": resolve(_dirname, "./shared"),
    },
  },
  plugins: [
    Vue(),
    Windi({
      config: resolve(_dirname, "windi.config.js"),
    }),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      manifest,
    }),
  ],
});
