module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2024,
    sourceType: 'module',
  },
  globals: {
    Phaser: 'readonly',
  },
  rules: {
    // Custom rules for game development
    'no-console': 'warn',
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'import/prefer-default-export': 'off',
    'class-methods-use-this': 'off',
    'no-param-reassign': ['error', { props: false }],
    // Prettier integration
    'prettier/prettier': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['@packages', './packages'],
          ['@core', './packages/core'],
          ['@scenes', './packages/scenes'],
          ['@gameobjects', './packages/gameobjects'],
          ['@utils', './packages/utils'],
          ['@shared', './packages/shared'],
        ],
        extensions: ['.js', '.jsx', '.json'],
      },
    },
  },
  ignorePatterns: [
    'node_modules/',
    'dist/',
    'coverage/',
    '*.min.js',
    'public/',
  ],
};
