import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import Vue from "@vitejs/plugin-vue";
import Windi from "vite-plugin-windicss";

const _dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
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
    Windi(),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
      registerType: "autoUpdate",
      manifest: {
        name: "enis2",
        short_name: "enis2",
        description:
          "Удобный, быстрый, адаптивный клиент для школьного журнала",
        theme_color: "#4885fb",
        background_color: "#ffffff",
        display: "standalone",
        icons: [
          {
            src: "icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
});
