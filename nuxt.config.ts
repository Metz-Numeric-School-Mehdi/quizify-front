// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "shadcn-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
    "@nuxt/fonts",
    "@nuxt/image",
  ],
  fonts: {
    defaults: {
      weights: ["400", "500", "600", "700"],
    },
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: "",
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: "./components/ui",
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
  app: {
    head: {
      htmlAttrs: {
        lang: "fr",
      },
      title: "Quizify - Créez et jouez à des quiz interactifs",
      meta: [
        {
          name: "description",
          content:
            "Plateforme de création et de jeu de quiz interactifs. Créez vos propres quiz, défiez vos amis et suivez vos performances.",
        },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        { charset: "utf-8" },
        { name: "theme-color", content: "#ec4899" },
        { name: "format-detection", content: "telephone=no" },
      ],
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        { rel: "dns-prefetch", href: "https://api.quizify.com" },
      ],
    },
  },
  build: {
    analyze: false,
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    prerender: {
      routes: ["/"],
    },
  },
  experimental: {
    payloadExtraction: false,
    treeshakeClientOnly: true,
  },
});
