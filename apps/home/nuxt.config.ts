// https://nuxt.com/docs/api/configuration/nuxt-config
import { fileURLToPath } from 'url'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'static'
  },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'unplugin-icons/nuxt',
    'dayjs-nuxt',
    '~/modules/tsconfig-fix'
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
  },
  alias: {
    '@cruzar/shared': fileURLToPath(new URL('../../packages/shared', import.meta.url))
  }
})
