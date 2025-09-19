// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  nitro: {
    preset: 'firebase'
  },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    '@pinia/nuxt',
    'unplugin-icons/nuxt',
    'dayjs-nuxt',
    '@nuxtjs/cloudinary'
  ],
  runtimeConfig: {
    public: {
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID
    },
    cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME
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
    plugins: []
  }
})
