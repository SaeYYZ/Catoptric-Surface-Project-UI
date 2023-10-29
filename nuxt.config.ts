import UnpluginComponentsVite from "unplugin-vue-components/vite";
import IconsResolver from "unplugin-icons/resolver";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  // server side rendering mode
  ssr: true,

  // typescripts
  typescript: {
    strict: true,
    typeCheck: true,
  },

  // css
  css: [
    "~/assets/sass/vendor.scss",
    "~/assets/sass/app.scss",
    "primevue/resources/themes/lara-dark-teal/theme.css",
    "primevue/resources/primevue.css",
    "primeicons/primeicons.css",
  ],

  // build
  build: {
    transpile: ["@headlessui/vue", "primevue"],
    // @ts-ignore`
    extend(config: any, ctx: any) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient ? "source-map" : "inline-source-map";
      }
    },
  },

  // modules
  modules: [
    "unplugin-icons/nuxt",
    "@pinia/nuxt",
    "@nuxt/content",
    "@vueuse/nuxt",
    "nuxt-windicss",
    "@nuxtjs/supabase",
  ],

  // experimental features
  experimental: {
    reactivityTransform: false,
  },

  // auto import components
  components: true,

  // vite plugins
  vite: {
    plugins: [
      UnpluginComponentsVite({
        dts: true,
        resolvers: [
          IconsResolver({
            prefix: "Icon",
          }),
        ],
      }),
    ],
  },

  // app config
  app: {
    // global transition
    pageTransition: { name: "page", mode: "out-in" },
    layoutTransition: { name: "layout", mode: "out-in" },
    baseURL: process.env.BASE_URL,
  },

  // vueuse
  vueuse: {
    ssrHandlers: true,
  },

  // windicss
  windicss: {
    analyze: {
      analysis: {
        interpretUtilities: false,
      },
      server: {
        port: 4000,
        open: false,
      },
    },
    scan: true,
  },

  // content
  content: {
    highlight: {
      theme: "github-dark",
    },
  },

  // supabase
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceKey: process.env.SUPABASE_SERVICE_KEY,
    redirect: true,
  },

  plugins: [{ src: "~/plugins/vercel.ts", mode: "client" }],
});
