// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-30',
  devtools: { enabled: true },
  nitro: {
    preset: 'static'
  },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'unplugin-icons/nuxt',
    'dayjs-nuxt'
  ],
  runtimeConfig: {
    public: {
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3002',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME
    },
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
  },
  css: [
    'vue3-toastify/dist/index.css'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    configPath: '~/tailwind.config.js'
  },
  components: {
    global: true,
    dirs: ['~/components']
  },
  vite: {
    plugins: [],
    build: {
      rollupOptions: {
        onwarn(warning, warn) {
          // Suppress tsconfig warnings
          if (warning.code === 'UNRESOLVED_IMPORT') return
          warn(warning)
        }
      }
    }
  },
  typescript: {
    typeCheck: false,
    shim: false
  }
})
