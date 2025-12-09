module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    '@nuxt/eslint-config',
  ],
  rules: {
    // Prevent TypeScript in Vue files
    'vue/block-lang': ['error', {
      'script': {
        'lang': ['js'],
        'allowNoLang': true
      }
    }],
  },
  overrides: [
    {
      // Enforce no TypeScript in pages and components
      files: ['pages/**/*.vue', 'components/**/*.vue', 'layouts/**/*.vue'],
      rules: {
        '@typescript-eslint/no-unused-vars': 'off',
        'vue/block-lang': ['error', {
          'script': {
            'lang': ['js'],
            'allowNoLang': true
          }
        }],
      },
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 2020,
        sourceType: 'module',
        requireConfigFile: false,
      },
    },
  ],
}
