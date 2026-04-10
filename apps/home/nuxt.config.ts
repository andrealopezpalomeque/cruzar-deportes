// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-01-30',
  app: {
    head: {
      htmlAttrs: {
        lang: 'es',
      },
      title: 'Cruzar Deportes — Camisetas Deportivas de Todo el Mundo',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
        { name: 'description', content: 'Camisetas deportivas de equipos de todo el mundo. Calidad premium, envío a todo el país.' },
        { name: 'theme-color', content: '#1e3a8a' },
        // Open Graph
        { property: 'og:title', content: 'Cruzar Deportes — Camisetas Deportivas de Todo el Mundo' },
        { property: 'og:description', content: 'Camisetas deportivas de equipos de todo el mundo. Calidad premium, envío a todo el país.' },
        { property: 'og:type', content: 'website' },
        { property: 'og:url', content: 'https://cruzardeportes.com' },
        { property: 'og:image', content: 'https://cruzardeportes.com/images/og-image.png' },
        { property: 'og:image:width', content: '1080' },
        { property: 'og:image:height', content: '1080' },
        { property: 'og:locale', content: 'es_AR' },
        { property: 'og:site_name', content: 'Cruzar Deportes' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Cruzar Deportes — Camisetas Deportivas de Todo el Mundo' },
        { name: 'twitter:description', content: 'Camisetas deportivas de equipos de todo el mundo. Calidad premium, envío a todo el país.' },
        { name: 'twitter:image', content: 'https://cruzardeportes.com/images/og-image.png' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
    },
  },
  devtools: { enabled: true },
  nitro: {
    preset: 'static',
    hooks: {
      'prerender:generate'(route: any) {
        if (route.contents) {
          route.contents = route.contents.replace(
            '<head>',
            '<head><script>if(location.hostname!=="cruzardeportes.com"){location.replace("https://cruzardeportes.com"+location.pathname);}<\/script>'
          )
        }
      }
    }
  },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss',
    '@vueuse/nuxt',
    'unplugin-icons/nuxt',
    'dayjs-nuxt',
    '@nuxt/image'
  ],
  image: {
    provider: 'ipxStatic',
    format: ['webp', 'jpeg'],
    quality: 80,
    densities: [1, 2],
    screens: {
      xs: 360,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
    },
  },
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
