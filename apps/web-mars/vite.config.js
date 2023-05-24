import { defineConfig } from "vite"
import { VitePWA } from "vite-plugin-pwa"
import vue from "@vitejs/plugin-vue"
import windi from "vite-plugin-windicss"

export default defineConfig({
  server: {
    port: 3000,
  },
  preview: {
    port: 8080,
  },
  plugins: [
    vue(),
    windi(),
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
})
