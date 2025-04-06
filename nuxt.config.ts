// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  modules: [
    "@nuxtjs/tailwindcss",
    '@nuxtjs/color-mode',
    "shadcn-nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
  ],
  colorMode: {
      classSuffix: '',
      preference: 'light',
      fallback: 'light',
  },
  tailwindcss: {
    config: {
      darkMode: 'class'
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
});