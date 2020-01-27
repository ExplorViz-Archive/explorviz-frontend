module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module'
  },
  plugins: [
    'ember',
    '@typescript-eslint'
  ],
  extends: [
    'airbnb-typescript/base',
    'plugin:ember/recommended',
  ],
  env: {
    browser: true
  },
  rules: {
    'linebreak-style': 'off',
    'import/no-unresolved': 'off'
  },
  overrides: [
    // node files
    {
      files: [
        'ember-cli-build.js',
        'testem.js',
        'config/**/*.js',
        'lib/*/index.js'
      ],
      parserOptions: {
        sourceType: 'script',
        ecmaVersion: 2015
      },
      env: {
        browser: false,
        node: true
      }
    }
  ]
};
