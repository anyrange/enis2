import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import Windi from "vite-plugin-windicss";
import Components from "unplugin-vue-components/vite";

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
    vue(),
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
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
