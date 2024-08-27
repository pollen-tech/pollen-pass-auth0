// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
export default defineNuxtConfig({
  app: {
    head: {
      title: "Pollen Pass",
      htmlAttrs: {
        lang: "en",
      },
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      link: [
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap",
        },
      ],
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: false },
  ssr: false,
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    "@nuxt/eslint",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        // @ts-expect-error: Adding Vuetify plugin to Vite config despite TypeScript type issues
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: [
    "@/assets/scss/style.scss",
    "vuetify/lib/styles/main.sass",
    "@mdi/font/css/materialdesignicons.min.css",
  ],
  runtimeConfig: {
    public: {
      adminApiUrl: "https://admin-api-dev.pollen.tech",
      ppBackendUrl: "https://pp-api-dev.pollen.tech",
      internalKey: "c3RhZ2luZy1wb2xsZW4udGVjaA==",
      appName: "Pollen Pass",
      appVersion: "2.0.0",
      API_URL: process.env.NUXT_USER_ONBOARD_API, // "https://47ekwsnw5d.execute-api.ap-southeast-1.amazonaws.com/dev",
      pollenLmsUrl: process.env.NUXT_POLLEN_LMS_URL,
      pollenDirectUrl: process.env.NUXT_POLLEN_DIRECT_URL,
    },
  },
});
