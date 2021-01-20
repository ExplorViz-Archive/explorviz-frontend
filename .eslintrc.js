module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    project: './tsconfig.json'
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
  globals: {
    'auth0': false
  },
  rules: {
    'linebreak-style': 'off',
    'import/no-unresolved': 'off',
    'require-yield': 'off',
    'no-plusplus': 'off',
    'import/no-cycle': 'off',
    'prefer-rest-params': 'off',
    'ember/no-mixins': 'off',
    'ember/require-computed-property-dependencies': 'off',
    "@typescript-eslint/type-annotation-spacing": ["error"],
    "no-param-reassign": ["error", { "props": false }],
    'func-names': ["error", "always", { "generators": "never" }]
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
