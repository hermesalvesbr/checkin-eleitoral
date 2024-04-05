module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxtjs',
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['vue'],
  rules: {
    'max-lines': [
      'error',
      { max: 500, skipBlankLines: true, skipComments: true },
    ],
  },
}
