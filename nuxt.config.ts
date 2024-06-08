import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
export default defineNuxtConfig({
  modules: [
    '@nuxtseo/module',
    '@nuxt/image',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],
  image: {
    format: ['webp'],
  },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      apiToken: process.env.NUXT_PUBLIC_API_TOKEN || '',
      siteUrl: 'https://campanha.softagon.app',
      siteName: 'Construção Chapa Eleitoral - Softagon Sistemas',
    },
  },
  site: {
    url: 'https://campanha.softagon.app',
    name: 'Construção Chapa Eleitoral',
    description: 'Softagon Sistemas',
    defaultLocale: 'pt-br', // not needed if you have @nuxtjs/i18n installed
  },
  imports: {
    dirs: ['types/*.ts', 'store/*.ts', 'types/**/*.ts'],
  },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
})
