// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-09-25',
  devtools: { enabled: true },

  // Static SPA mode (no server-side rendering)
  ssr: false,

  // Modules
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'unplugin-icons/nuxt',
    'dayjs-nuxt'
  ],

  // CSS
  css: [
    '~/assets/css/main.css'
  ],

  // Runtime config
  runtimeConfig: {
    // Private keys (only available on the server-side)
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
    backofficeUsername: process.env.BACKOFFICE_USERNAME || 'admin',
    backofficePassword: process.env.BACKOFFICE_PASSWORD || 'cruzar2024',

    // Public keys (exposed to the client-side code)
    public: {
      cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
      appName: 'Cruzar Deportes - Back Office',
      apiUrl: process.env.NUXT_PUBLIC_API_URL || 'http://localhost:3002',
      apiKey: process.env.NUXT_PUBLIC_API_KEY || ''
    }
  },

  // App configuration
  app: {
    head: {
      title: 'Cruzar Deportes - Back Office',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Administrative panel for Cruzar Deportes sports jersey e-commerce' },
        { name: 'robots', content: 'noindex, nofollow' }
      ]
    }
  },

  // Tailwind CSS configuration
  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: 'tailwind.config.js'
  },


  // Development configuration
  devServer: {
    port: 3001 // Different port from main app
  },

  // Build configuration - static preset for Firebase Hosting (no Functions)
  nitro: {
    preset: 'static'
  },

  // TypeScript configuration
  typescript: {
    strict: false,
    typeCheck: false
  },

  // Auto-imports configuration
  imports: {
    dirs: [
      'composables/**',
      'stores/**'
    ]
  },

  // Auto-imports for components and composables
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ]
})
