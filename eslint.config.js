import antfu from '@antfu/eslint-config'

export default antfu({
  stylistic: {
    indent: 2,
    quotes: 'single',
  },

  typescript: true,
  vue: true,
  rules: {
    'new-cap': 'off', // Desativa a regra `new-cap`
  },
})
