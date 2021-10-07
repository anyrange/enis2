import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import WindiCSS from "vite-plugin-windicss";

export default defineConfig({
  root: "./client",
  plugins: [
    vue(),
    WindiCSS(),
    VitePWA({
      includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
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