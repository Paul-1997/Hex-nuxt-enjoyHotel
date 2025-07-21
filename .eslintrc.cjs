/* eslint-env node */
module.exports = {
  root: true,
  extends: [
    'plugin:nuxt/recommended',
    'plugin:vue/vue3-recommended',
    'eslint:recommended'
    // 'plugin:prettier/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  settings: {
    'prettier/prettier': [
      'error',
      {
        semi: true,
        tabWidth: 2,
        bracketSpacing: true,
        singleQuote: true,
        printWidth: 120,
        trailingComma: 'all'
      }
    ]
  },
  rules: {
    'no-undef': 'off',
    "vue/multi-word-component-names": "off",
    
  }
}
