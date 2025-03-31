// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    '@nuxt/ui-pro',
    '@nuxt/content',
    '@vueuse/nuxt',
    '@vueuse/motion/nuxt'
  ],
  devtools: {
    enabled: true
  },

  app: {
    baseURL: '/'
  },

  css: ['~/assets/css/main.css'],

  runtimeConfig: {
    apiSecret: process.env.API_SECRET,
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL,
      apiLoginUrl: process.env.NUXT_PUBLIC_API_LOGIN_URL,
      apiRegisterUrl: process.env.NUXT_PUBLIC_API_REGISTER_URL,
      apiGithubOauthUrl: process.env.NUXT_PUBLIC_API_GITHUB_OAUTH_URL,
      apiGithubClientId: process.env.NUXT_PUBLIC_API_GITHUB_CLIENT_ID
    }
  },

  future: {
    compatibilityVersion: 4
  },

  compatibilityDate: '2024-07-11',

  nitro: {
    prerender: {
      routes: [
        '/'
      ],
      crawlLinks: true
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})
